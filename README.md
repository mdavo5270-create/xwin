# XWIN

Plateforme UK de compétitions prize **basées sur le skill** (pas un jeu de hasard) : lots réels, odds publiés, voie d'entrée postale gratuite, et contribution caritative prévue.

## Statut

**Fondations uniquement.** Le dépôt est configuré pour le développement futur. Aucune application métier n'est encore implémentée dans ce monorepo.

- Dépôt : [mdavo5270-create/xwin](https://github.com/mdavo5270-create/xwin)
- Branche principale : `main`
- Structure : **monorepo** (voir `docs/architecture/repository-strategy.md`)

## Objectif

Fournir une base GitHub propre, sécurisée et évolutive : CI minimale, templates de contribution, séparation des environnements, et préparation du déploiement Vercel (preview / production).

## Architecture prévue

```
apps/web          frontend (Vercel)
apps/api          API (si séparée plus tard)
packages/         code partagé
docs/             architecture, déploiement, sécurité
.github/          CI, templates, Dependabot
```

Détail : `docs/architecture/`.

## Stack (prévue, non figée)

- Frontend : application web déployable sur Vercel (Next.js probable)
- Backend / API : à décider au démarrage du développement
- Paiements : Stripe (clés uniquement dans Vercel / secrets, jamais dans Git)
- CI : GitHub Actions (permissions minimales)
- Hosting preview/prod : Vercel (free tier au démarrage)

## Installation (future)

Le scaffolding applicatif n'est pas encore en place.

```bash
git clone https://github.com/mdavo5270-create/xwin.git
cd xwin
cp .env.example .env.local
# npm install / pnpm install  — après ajout du package.json
```

## Développement

1. Créer une branche depuis `main`
2. Ouvrir une Pull Request
3. La CI (lint / typecheck / test / build placeholders) doit passer
4. Preview Vercel sur la PR lorsque le projet Vercel sera relié

## Tests

Les suites de tests seront ajoutées avec le code. Le workflow CI est prêt à les exécuter dès qu'elles existent.

## Déploiement

Voir `docs/deployment/environments.md`.

| Branche / événement | Environnement |
| --- | --- |
| PR | Preview |
| `main` | Production |
| local | Development |

## Sécurité

- Aucun secret dans Git
- `.env` ignoré ; seul `.env.example` est versionné
- Secret scanning + Dependabot activés au niveau fichiers
- Actions : `permissions` minimales (`contents: read`)

Détail : `docs/security/`.

## Contribution

Utiliser les templates d'issues et de PR dans `.github/`.
Voir `CONTRIBUTING.md`.

## Licence

Propriétaire — tous droits réservés tant qu'une licence n'est pas publiée.
