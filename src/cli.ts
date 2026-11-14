import yargs from 'yargs';
import type { Argv } from 'yargs';
import * as apply from './commands/apply.ts';
import * as check from './commands/check.ts';
import * as instructions from './commands/instructions.ts';
import * as plan from './commands/plan.ts';
import * as review from './commands/review.ts';
// Imported, not read from disk: the build copies it next to the compiled
// code, where a path relative to this file would no longer reach it.
import manifest from '../package.json' with { type: 'json' };

type Out = { write(text: string): unknown };
/** Where a command reads its directory and writes its output. `process` is one. */
export type Io = { cwd(): string; stdout: Out; stderr: Out };
type ExitCode = number;
/**
 * A subcommand module. Each handler states the options its own builder
 * declares; only yargs links the two, so `never` is the one argument type
 * every handler accepts.
 */
export type Command = {
  command: string;
  describe: string;
  builder?: (y: Argv) => Argv<object>;
  handler: (args: never) => ExitCode | Promise<ExitCode>;
};

const defaultCommands: Command[] = [plan, apply, instructions, review, check];

/**
 * Testable entry point: parses `argv`, writes to `io`, returns the contract
 * exit code (0 nothing to do, 2 changes pending, 1 error).
 * `commands` is only overridden by tests.
 */
export async function main(argv: string[], io: Io, commands: Command[] = defaultCommands): Promise<ExitCode> {
  const args = argv.length === 0 ? ['--help'] : argv;
  let usageError: string | undefined;
  // The selected handler, called here once parsing succeeded. yargs calls a
  // command's handler even when strict mode then rejects an unknown option,
  // so the handler must not do its work from inside the parse.
  let run: (() => ExitCode | Promise<ExitCode>) | undefined;

  const cli = yargs()
    .scriptName('ontrack')
    .locale('en')
    .version(manifest.version)
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
        run = () => mod.handler({ ...parsed, io } as never);
      },
    });
  }

  const output = await new Promise<string>((resolve) => {
    cli.parse(args, (_err: Error | undefined, _parsed: unknown, out: string) => resolve(out));
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
    io.stderr.write(`ontrack: ${(err as Error).message}\n`);
    return 1;
  }
}
