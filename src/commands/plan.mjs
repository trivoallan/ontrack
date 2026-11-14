// ponytail: stub — trivoallan/ontrack#4 replaces this handler with the real `plan`.
export const command = 'plan';
export const describe = 'Show what importing the sources would change in the repository';

export function handler({ io }) {
  io.stderr.write('ontrack: `plan` is not available yet.\n');
  return 1;
}
