// ponytail: stub — trivoallan/ontrack#4 remplace ce handler par le vrai `plan`.
export const command = 'plan';
export const describe = "Montre ce que l'import des sources changerait dans le dépôt";

export function handler({ io }) {
  io.stderr.write("ontrack: `plan` n'est pas encore disponible.\n");
  return 1;
}
