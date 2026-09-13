# XWIN

Plateforme UK de compétitions prize **basées sur le skill** (pas un jeu de hasard) : lots réels, odds publiés, voie d'entrée postale gratuite, et contribution caritative prévue.

## Statut

**Fondations uniquement.** Aucune application métier n'est encore implémentée.

- Dépôt canonique : [mdavo5270-create/xwin](https://github.com/mdavo5270-create/xwin) (**public**)
- Branche principale : `main` (protégée — Pull Request obligatoire)
- Structure : **monorepo** — voir `docs/architecture/repository-strategy.md`

## Objectif

Base GitHub propre, sécurisée et évolutive : CI minimale, templates, séparation des environnements, préparation Vercel (preview / production).

## Architecture prévue

```
apps/web          frontend (Vercel)
apps/api          API (si séparée plus tard)
packages/         code partagé
docs/             architecture, déploiement, sécurité
.github/          CI, templates, Dependabot
```

## Stack (prévue, non figée)

- Frontend : app web déployable sur Vercel (Next.js probable)
- Backend / API : à décider au démarrage du développement
- Paiements : Stripe (clés uniquement dans Vercel / secrets GitHub)
- CI : GitHub Actions (`contents: read`)
- Hosting : Vercel Hobby au démarrage

## Installation (future)

```bash
git clone https://github.com/mdavo5270-create/xwin.git
cd xwin
cp .env.example .env.local
```

## Développement

1. Branche depuis `main`
2. Pull Request
3. CI verte
4. Preview Vercel dès que le projet Vercel est relié

## Déploiement

Voir `docs/deployment/`.

| Événement | Environnement |
| --- | --- |
| local | Development |
| Pull Request | Preview |
| `main` | Production |

## Sécurité

Aucun secret dans Git. Voir `docs/security/` et `SECURITY.md`.

## Contribution

Templates dans `.github/`. Voir `CONTRIBUTING.md`.

## Licence

Propriétaire — tous droits réservés tant qu'une licence n'est pas publiée.
