import { readFileSync } from 'node:fs';
import yargs from 'yargs';
import * as apply from './commands/apply.mjs';
import * as instructions from './commands/instructions.mjs';
import * as plan from './commands/plan.mjs';

const { version } = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
);

const defaultCommands = [plan, apply, instructions];

/**
 * Testable entry point: parses `argv`, writes to `io`, returns the contract
 * exit code (0 nothing to do, 2 changes pending, 1 error).
 * `commands` is only overridden by tests.
 */
export async function main(argv, io, commands = defaultCommands) {
  const args = argv.length === 0 ? ['--help'] : argv;
  let usageError;
  // The selected handler, called here once parsing succeeded. yargs calls a
  // command's handler even when strict mode then rejects an unknown option,
  // so the handler must not do its work from inside the parse.
  let run;

  const cli = yargs()
    .scriptName('ontrack')
    .locale('en')
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
        run = () => mod.handler({ ...parsed, io });
      },
    });
  }

  const output = await new Promise((resolve) => {
    cli.parse(args, (_err, _parsed, out) => resolve(out));
  });

  if (usageError !== undefined) {
    io.stderr.write(`ontrack: ${usageError}\nSee ontrack --help.\n`);
    return 1;
  }
  if (output) io.stdout.write(`${output}\n`);
  if (!run) return 0;
  try {
    return await run();
  } catch (err) {
    io.stderr.write(`ontrack: ${err.message}\n`);
    return 1;
  }
}
