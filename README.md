# ontrack

ontrack importe dans un dépôt des ADR hérités et des schémas OpenSpec fournis
par des **sources**. Une source est une dépendance npm dont le `package.json`
porte une clé `ontrack`, et son alias npm sert de namespace.

## Installation

Node 24 LTS ou plus récent.

```bash
npm i -D ontrack@git+https://github.com/trivoallan/ontrack.git
```

Une source s'ajoute avec npm, sous l'alias de votre choix :

```bash
npm i -D <alias>@git+<url-du-depot-de-la-source>
```

## Usage

```bash
npx ontrack --help      # liste les commandes
npx ontrack --version
npx ontrack plan        # ce que l'import des sources changerait (pas encore disponible)
```

### Codes de sortie

Toutes les commandes partagent les mêmes codes de sortie :

| Code | Sens |
|------|------|
| `0` | Rien à faire |
| `2` | Des changements sont en attente |
| `1` | Erreur (commande inconnue, source illisible…) |

Une CI peut donc détecter un dépôt en retard sur `2`, sans analyser la sortie.

## Contrat de sortie de `ontrack plan`

`plan` ne modifie aucun fichier. Sa sortie suit ce format :

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

Toute modification de ce format passe d'abord par ce README.

## Développement

```bash
npm install
npm test     # tests et couverture ; échoue sous 95 % de lignes, branches ou fonctions
```
