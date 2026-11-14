# Tasks

## 1. Paquet et point d'entrée

- [x] 1.1 Créer `package.json` (`name: ontrack`, `type: module`, `bin: { "ontrack": "bin/ontrack.mjs" }`, `engines.node >= 24`, script `test: node --test --experimental-test-coverage --test-coverage-lines=95 --test-coverage-branches=95 --test-coverage-functions=95 --test-coverage-exclude='test/**'`, dépendance `yargs ^18`) et un `.nvmrc` à `24` ; vérifier que `npm install` n'installe que yargs
- [x] 1.2 Écrire `src/cli.mjs`, qui exporte `main(argv, { stdout, stderr }) → code`, avec yargs en `.exitProcess(false)` : `.command()` pour chaque module de `src/commands/`, alias `-h` et `-v`, aide et code `0` sans argument, `.strict()` et `.fail()` pour une commande inconnue (message qui renvoie vers `ontrack --help`, code `1`) ; puis `bin/ontrack.mjs` (shebang, appelle `main` et fixe `process.exitCode`) ; vérifier à la main que `node bin/ontrack.mjs --help` liste `plan`
- [x] 1.3 Ajouter `src/commands/plan.mjs`, un module de commande yargs dont le `handler` écrit « `plan` n'est pas encore disponible » sur la sortie d'erreur et renvoie `1` ; vérifier que `node bin/ontrack.mjs plan` sort avec le code 1

## 2. Tests

- [x] 2.1 Écrire `test/cli.test.mjs`, qui appelle `main` dans le processus avec des flux capturés et couvre chaque scénario de `specs/cli/spec.md` (aide explicite, `-h`, aucun argument, `--version`, `-v`, faute de frappe, `plan` pas encore disponible) ; vérifier que `npm test` passe
- [x] 2.2 Ajouter `test/bin.test.mjs`, un seul test qui lance `bin/ontrack.mjs` en sous-processus et vérifie le code de sortie réel pour `--help` (0) et une commande inconnue (1) ; vérifier que `npm test` passe
- [x] 2.3 Vérifier que la couverture atteint au moins 95 % en lignes, branches et fonctions sur `src/` et `bin/` : `npm test` doit passer avec le seuil, et échouer si on retire un test du 2.1

## 3. Contrat de sortie

- [x] 3.1 Compléter le README avec l'installation (`npm i -D ontrack@git+https://github.com/trivoallan/ontrack.git`), l'usage, et une section « Contrat de sortie de `ontrack plan` » qui reprend le format et les codes 0/2/1 de design.md ; vérifier que l'exemple du README correspond mot pour mot à celui de design.md
- [ ] 3.2 Vérifier `openspec validate squelette-cli-et-contrat-plan --strict` et lier le change dans trivoallan/ontrack#1
