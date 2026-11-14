# Proposal

## Why

ontrack n'a pas encore de code. Les trois tâches suivantes du découpage
(trivoallan/ontrack#2, #3, #4) ont besoin d'un point d'entrée commun, et d'un
contrat de sortie de `ontrack plan` fixé avant d'écrire la commande. Sans ce
contrat, la commande et ce qui la consomme (la CI, et le cycle de la méthode
qui recopiera sa sortie) se construiraient sur deux suppositions différentes.
Source : trivoallan/ontrack#1.

## What Changes

- Un paquet Node `ontrack` qui expose une commande `ontrack`, construit sur yargs (seule dépendance d'exécution).
- Un point d'entrée qui répartit les sous-commandes, affiche l'aide, la version, et refuse proprement une commande inconnue.
- La sous-commande `plan` est déclarée, mais pas encore implémentée : elle répond qu'elle ne l'est pas, avec le code d'erreur du contrat. trivoallan/ontrack#4 la remplace.
- Le contrat de sortie de `ontrack plan` est écrit dans le README : une ligne par source d'abord, puis le détail ; la migration d'une disposition à plat toujours affichée ; codes de sortie `0`, `2` et `1`.
- Les tests passent par le lanceur intégré de Node, avec une couverture d'au moins **95 %** (lignes, branches, fonctions) : `npm test` échoue en dessous.

## Capabilities

### New Capabilities
- `cli` : le point d'entrée `ontrack`, avec l'aide, la version, la répartition des sous-commandes et les codes de sortie communs.

### Modified Capabilities
<!-- aucune : premier change du dépôt -->

## Impact

- Nouveaux fichiers : `package.json`, `.nvmrc`, `bin/ontrack.mjs`, `src/cli.mjs`, `src/commands/plan.mjs`, `test/cli.test.mjs`, `test/bin.test.mjs`, et le README complété.
- Une dépendance d'exécution : `yargs` (^18). Node 24 LTS.
- Rien n'est publié sur npm : un dépôt aval installera ontrack par git.
