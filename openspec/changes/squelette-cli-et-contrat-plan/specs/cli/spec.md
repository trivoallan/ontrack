# Spec Delta

## Purpose

Donne un point d'entrée unique, `ontrack`, qui répartit les sous-commandes et partage des codes de sortie stables, sur lesquels la CI et la méthode peuvent s'appuyer.

## ADDED Requirements

### Requirement: Aide de la commande
La commande `ontrack` SHALL afficher sur la sortie standard une aide qui liste ses sous-commandes, dont `plan`, et terminer avec le code `0`, quand elle est lancée avec `--help`, `-h`, ou sans argument.

#### Scenario: Aide demandée explicitement
- **WHEN** l'utilisateur lance `ontrack --help`
- **THEN** la sortie standard liste la sous-commande `plan`
- **AND** le code de sortie vaut `0`

#### Scenario: Aucun argument
- **WHEN** l'utilisateur lance `ontrack` sans argument
- **THEN** la même aide s'affiche
- **AND** le code de sortie vaut `0`

### Requirement: Version de la commande
La commande `ontrack` SHALL afficher la version déclarée dans son `package.json` et terminer avec le code `0`, quand elle est lancée avec `--version` ou `-v`.

#### Scenario: Version demandée
- **WHEN** l'utilisateur lance `ontrack --version`
- **THEN** la sortie standard contient exactement la version du `package.json`
- **AND** le code de sortie vaut `0`

### Requirement: Commande inconnue
La commande `ontrack` MUST refuser une sous-commande qu'elle ne connaît pas. Elle écrit sur la sortie d'erreur un message qui nomme la commande reçue et renvoie vers `--help`, et elle termine avec le code `1`.

#### Scenario: Faute de frappe
- **WHEN** l'utilisateur lance `ontrack plann`
- **THEN** la sortie d'erreur nomme `plann` et mentionne `ontrack --help`
- **AND** le code de sortie vaut `1`

### Requirement: Codes de sortie communs
Toute sous-commande d'`ontrack` SHALL terminer avec l'un de ces trois codes : `0` quand il n'y a rien à faire, `2` quand des changements sont en attente, `1` en cas d'erreur. Aucun autre code n'est émis volontairement.

#### Scenario: Sous-commande déclarée mais pas encore implémentée
- **WHEN** l'utilisateur lance `ontrack plan` avant que la commande soit implémentée
- **THEN** la sortie d'erreur indique que `plan` n'est pas encore disponible
- **AND** le code de sortie vaut `1`
