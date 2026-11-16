# Base de données (Neon)

Projet Neon `xwin` branché sur le site Netlify **xxwin**.

- `DATABASE_URL` : connection pooled (`sslmode=require`)
- Schéma applicatif : `ensureSchema()` au premier hit (users, licenses, payments, orders…)
- Paiements SasPay MTN écrivent dans `orders` / `payments` / `licenses`

Pas de dump Neon historique à migrer pour ce reset volontaire.
