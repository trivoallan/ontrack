---
artifact: foundation-sprint-brief
version: "1.0"
created: 2026-11-21
status: draft
evidence: hypothesis
source: .nanopm/wiki/research/foundation-sprint-readiness-adoption.md
---

# Foundation Sprint Brief: a first adopter outside our own repositories

## Initiative Statement and Stakes

ontrack has two public tracks and no adopter outside its maintainer's own
repositories and organizations. The sprint chooses who to win first. A wrong
choice costs months of convention-writing for repositories that never
install a track. The readiness diagnostic said Wait; the Decider overrode it,
so every input below is an assumption.

## Decision the Sprint Must Unlock

Which kind of repository should ontrack win as its first external adopter,
and through which entry point?

## Sprint Logistics

| Element | Value |
|---|---|
| Dates | 2026-11-21, one session |
| Hours | about two hours, compressed from two days |
| Location | Remote: a Claude Code session |
| Format | Solo: the agent facilitates and proposes, the Decider decides each vote |
| Tools | This conversation; artifacts written under `.nanopm/wiki/research/` |
| Daily rhythm | One step after another, a Decider checkpoint at the end of each |

## Team Roster

| Attendee | Role | Day 1 AM | Day 1 PM | Day 2 AM | Day 2 PM |
|---|---|---|---|---|---|
| Tristan Rivoallan | Decider | required | required | required | required |
| Coding agent | Facilitator | required | required | required | required |

No cameo expert: none has been interviewed yet.

## Existing Inputs to Bring

1. **Readiness diagnostic and baseline** (`.nanopm/wiki/research/foundation-sprint-readiness-adoption.md`). Zero external adopters; downloads mostly CI.
2. **Journey map of the repository adopter** (`.nanopm/wiki/research/journey-map-repo-adopter-onboarding.md`). The only picture of an adopter, built without interviews.
3. **Problem statement, the backlog reveal** (`.nanopm/wiki/research/problem-statement-backlog-reveal.md`). The import ends on a wall of unanswered questions.
4. **Desk test results** (`.nanopm/wiki/research/desk-test-first-proposal/results.md`). H1 invalidated: the agent found the practice for 45% of values.
5. **The two tracks** (`docs/ontrack-engineering.mdx`, `docs/ontrack-product.mdx`). What a repository can install today.

## Success Criteria

The sprint is **successful** if:

1. A target customer, an important problem and the alternatives they use are named, each marked as an assumption.
2. One approach is the top bet and another is the backup; the rest are dropped.
3. A Founding Hypothesis sentence is ratified, with an assumption scorecard.
4. The next test is named, and it can run before 2027-01-31.

The sprint is **unsuccessful** if it ends with every approach kept, with a
hypothesis no interview could disprove, or with a Founding Hypothesis
recorded above `evidence: hypothesis`.

## Readiness Reaffirmation

The Wait verdict of `tool-foundation-sprint-readiness` was issued on
2026-11-21 and overridden by the Decider the same day.

- [x] Decider availability still confirmed for both days.
- [ ] Preconditions from the readiness assessment (if any) are closed. Not closed: overridden, see above.
- [x] No new risk factors have surfaced (e.g., key team member out, scope creep).
- [ ] If Conditional Go: the named yellow flags have been addressed. Not applicable: the verdict was Wait.

## Decider Checkpoint

**Decider sign-off required before Day 1 begins.**

- [ ] Decider confirms scope: the named Decision the sprint must unlock is the deliverable.
- [ ] Decider confirms team roster and attendance windows.
- [ ] Decider confirms success criteria.
- [ ] Decider acknowledges that the sprint will NOT preserve all directions at the end of Day 2; one becomes the top bet, the other becomes the backup or is dropped.
- [ ] Decider commits to attending the Day 2 closing session where the Founding Hypothesis is ratified.

**Signed:** [Decider name, role], [ISO date and local time]

## Inversion

<!-- incongru-voix: debord — « le sprint fait parler l'équipe » devient « le Decider vote seul et l'agent applaudit » — il sépare les dépôts dont on parle des dépôts à qui personne n'a parlé -->

Le brief emprunte le vocabulaire d'un atelier à plusieurs voix pour une
séance où une seule personne décide, face à un agent qui propose. Chaque
terme, retourné :

| Le brief dit | Ce que le terme nomme ici | Qui en paie le coût |
| --- | --- | --- |
| « Team Roster » | une ligne humaine et une ligne d'agent : aucun second regard | le Decider, qui prend ses propres hypothèses pour un consensus |
| « Note-and-Vote » | un vote à une voix : un choix enregistré, pas confronté | les pistes écartées, sans personne pour les défendre |
| « two days, compressed » | deux heures portant le nom de deux jours | la crédibilité de l'hypothèse fondatrice, qui aura l'air d'avoir été mûrie |
| « Target customer » (jour 1) | un adoptant imaginé, à 0 entretien | les mainteneurs réels, que la séance remplace par leur portrait |
| « Success criteria » | des cases que la séance coche elle-même | personne de l'extérieur ne peut les contredire |
| « Existing inputs » | cinq artefacts, tous écrits ici, dont quatre à `hypothesis` | le seul résultat validé (H1 invalidé) se retrouve noyé parmi les suppositions |

Décompte : 6 termes empruntés, 1 seul qui porte une chose réelle (le test
suivant, critère 4, peut sortir de la pièce).

Règles proposées au Decider pour la suite du sprint :

1. Ne garder que ce qui produit une trace vérifiable de l'extérieur :
   nommer les suppositions, choisir un pari et un secours, écrire le test.
2. Ne plus appeler « vote » un choix du Decider : l'écrire comme décision,
   avec sa raison.
3. Le test suivant est un entretien avec des mainteneurs réels, avant tout
   autre livrable : c'est la seule étape qui fasse entrer quelqu'un d'autre
   dans la pièce.
