# Stratégie de dépôts

## Décision : Option A — Monorepo

Dépôt unique : `mdavo5270-create/xwin`.

### Pourquoi

- Phase actuelle = fondations uniquement, une seule équipe / un seul compte GitHub.
- Un seul pipeline CI, une seule politique de branche, un seul endroit pour la sécurité.
- Évite la duplication de templates, Dependabot et documentation.
- Un split futur (`xwin-web`, `xwin-api`, `xwin-infrastructure`) reste possible sans dette bloquante : les dossiers `apps/` et `docs/` sont déjà séparés conceptuellement.

### Ce qui n'a pas été choisi

Option B (multi-repos) multiplierait les dépôts vides avant le moindre code. Non pertinent à ce stade.
