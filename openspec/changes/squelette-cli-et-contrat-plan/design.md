# Design

## Context

Le dépôt ne contient qu'un README. Voir proposal.md (Why) pour la motivation.
Les dépôts aval visés sont en Node, et la récupération des sources passe par
npm (décision du 2026-11-14). ontrack lui-même s'installe par git, sans
publication sur npm.

## Goals / Non-Goals

**Goals:**
- Un point d'entrée assez petit pour que les issues #2, #3 et #4 puissent avancer en parallèle sans toucher le même fichier, à part l'enregistrement d'une sous-commande.
- Un contrat de sortie de `plan` écrit **avant** la commande.

**Non-Goals:**
- Le moindre comportement de `plan` au-delà du message « pas encore disponible ».
- De la couleur, une sortie `--json` (v2).

## Decisions

**Node 24 LTS, modules ES (`.mjs`), yargs pour l'analyse des arguments.**
yargs 18 (ESM, Node ≥ 20.19) fournit l'aide, la version, le refus d'une
commande inconnue (`.strict()`) et la déclaration des sous-commandes
(`.command()`), que l'on aurait réécrits à la main. Les tests restent sur
`node:test`, sans dépendance de développement. *Alternatives :* analyser
`process.argv` à la main, ce qui est moins de dépendances mais réécrit l'aide
et les erreurs ; `commander`, équivalent, mais le choix s'est porté sur yargs.

**Une sous-commande = un module de commande yargs.**
Chaque sous-commande vit dans `src/commands/<nom>.mjs` et exporte un module
yargs (`command`, `describe`, `builder`, `handler`). Son `handler` renvoie
le code du contrat 0/2/1 à `main`, qui le remonte. `src/cli.mjs` les enregistre avec
`.command()`. Ajouter `plan` (#4) ne touche que son propre fichier.
*Alternative :* tout déclarer dans `cli.mjs`. Chaque nouvelle commande
passerait alors par le même fichier, et il y aurait plus de conflits de fusion.

**Comportements yargs à régler explicitement.**
- Sans argument : afficher l'aide et sortir avec `0`. Par défaut, `.demandCommand()` sortirait avec `1`.
- `-v` en alias de `--version`, et `-h` en alias de `--help`.
- Commande inconnue : `.strict()` plus un `.fail()` qui écrit le message sur la sortie d'erreur, renvoie vers `ontrack --help` et sort avec `1`. yargs sort déjà avec `1`, mais son message par défaut ne mentionne pas `--help`.

**Couverture ≥ 95 %, mesurée par Node lui-même.**
`npm test` lance `node --test --experimental-test-coverage` avec
`--test-coverage-lines=95 --test-coverage-branches=95 --test-coverage-functions=95`
et `--test-coverage-exclude='test/**'`. Node fait échouer la commande sous le
seuil, sans dépendance de plus. *Alternative :* `c8`, qui ajoute une
dépendance de développement pour la même mesure.

**La CLI se teste dans le processus, pas en sous-processus.**
Tester dans le processus permet d'injecter les flux de sortie et la liste
des commandes, donc de couvrir aussi le chemin d'erreur d'une sous-commande.
(Constaté à l'implémentation : la couverture de Node suit quand même le
sous-processus du test du `bin`.) `src/cli.mjs` exporte donc `main(argv, { stdout, stderr }) → code`, et
un fichier `bin/ontrack.mjs` (le `bin` du paquet) se contente de l'appeler et
de fixer `process.exitCode`. yargs est configuré avec `.exitProcess(false)`,
pour que `--help`, `--version` et les erreurs rendent la main au lieu de
quitter le processus. Un seul test d'intégration lance le vrai `bin` en
sous-processus, pour vérifier le câblage et le code de sortie réel.
*Alternative :* tout tester en sous-processus. C'est plus fidèle, mais on ne
peut plus injecter de commande de test ni capturer les flux sans passer par
la console.

**Les codes de sortie 0, 2, 1 suivent `terraform plan -detailed-exitcode`.**
Le public connaît déjà ce modèle. Une CI branche « en retard » sur `2` sans
avoir à analyser la sortie. *Alternative :* `0` ou `1` seulement. La CI ne
pourrait alors plus distinguer « en retard » d'une erreur.

**Le contrat de sortie de `plan` vit dans le README.**
C'est le document que lira le dev aval, et celui que la méthode citera quand
elle recopiera la sortie. Contenu :

```
plateforme : 2 révisés, 1 nouveau, 11 inchangés
  révisé   SDR-0006  revision 1 → 2
  révisé   SDR-0010  revision 3 → 4
  nouveau  SDR-0015
migration : 14 fichiers docs/adr/SDR-*.md → docs/adr/plateforme/
```

- Ligne 1, par source : `<alias> : <compte par catégorie>`. Les catégories à zéro sont omises, sauf « inchangés ».
- Ensuite, indentées, seulement les ADR qui ne sont pas inchangés. Les catégories sont : `nouveau`, `révisé`, `indéterminé`, `retiré`.
- La migration à plat est toujours affichée, sur sa propre ligne, quand elle existe.
- Quand il n'y a rien à faire, une seule ligne par source, et le code vaut `0`.

*Alternative :* tout afficher, y compris les inchangés. Écartée : le dev aval
doit voir sa réponse en première ligne (PRD, « The One UX Decision »).

## Risks / Trade-offs

- [Le format de sortie bouge pendant #4] → Toute modification passe par le README d'abord, et par un test de #4 qui compare la sortie à un exemple du README.
- [`plan` existe mais renvoie une erreur jusqu'à #4] → Le message le dit explicitement, et le code `1` reste conforme au contrat. Ce n'est pas un faux succès.
