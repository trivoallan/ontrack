import { readFileSync } from 'node:fs';
import yargs from 'yargs';
import * as plan from './commands/plan.mjs';

const { version } = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
);

const defaultCommands = [plan];

/**
 * Point d'entrée testable : analyse `argv`, écrit sur `io`, renvoie le code
 * de sortie du contrat (0 rien à faire, 2 changements en attente, 1 erreur).
 * `commands` n'est remplacé que par les tests.
 */
export async function main(argv, io, commands = defaultCommands) {
  const args = argv.length === 0 ? ['--help'] : argv;
  let usageError;
  let run; // promesse du handler choisi, attendue ici plutôt que par yargs

  const cli = yargs()
    .scriptName('ontrack')
    .locale('fr')
    .version(version)
    .alias('v', 'version')
    .help()
    .alias('h', 'help')
    .strict()
    .exitProcess(false)
    .fail((msg) => {
      usageError = msg;
    });

  for (const mod of commands) {
    cli.command({
      ...mod,
      handler: (parsed) => {
        run = Promise.resolve().then(() => mod.handler({ ...parsed, io }));
      },
    });
  }

  const output = await new Promise((resolve) => {
    cli.parse(args, (_err, _parsed, out) => resolve(out));
  });

  if (usageError !== undefined) {
    io.stderr.write(`ontrack: ${usageError}\nVoir ontrack --help.\n`);
    return 1;
  }
  if (output) io.stdout.write(`${output}\n`);
  if (!run) return 0;
  try {
    return await run;
  } catch (err) {
    io.stderr.write(`ontrack: ${err.message}\n`);
    return 1;
  }
}
