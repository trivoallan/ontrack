/**
 * An error ontrack reports to whoever ran it, with its code. The code is a
 * contract (see docs/error-messages.md): the sentence may be reworded, the
 * code names the same failure for as long as ontrack can fail that way. It is
 * kept out of the message, which other lines quote (`AGENTS.md: skipped, …`).
 */
export class OntrackError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

/** The code of a command line yargs refuses: an unknown command or option, a missing value. */
export const USAGE = 'E001';
