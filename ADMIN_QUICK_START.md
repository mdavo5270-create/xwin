# 🚀 Guide Rapide - Admin XWIN

**Table des Matières**
1. [Connexion](#-connexion)
2. [Dashboard](#-dashboard)
3. [Pronostics](#-pronostics)
4. [Offres](#-offres)
5. [Abonnements](#-abonnements)
6. [Profil](#-profil)
7. [Paramètres](#-paramètres)

---

## 🔐 Connexion

Aller à `/admin` → Entrez le mot de passe admin → Accès au dashboard

---

## 📊 Dashboard

**Première page après connexion**

Vous voyez:
- 🎯 Statistiques en temps réel (9 métriques)
- 🌍 Top 5 des pays
- 💨 Quick actions pour aller aux sections principales

**Ce que vous pouvez faire:**
- Surveiller les inscriptions du jour
- Voir les conversions (clics → ventes)
- Consulter le temps moyen des utilisateurs
- Analyser les ventes par pays

---

## 🎯 Pronostics

### Ajouter un pronostic

1. Allez à **Pronostics** dans la navigation
2. Cliquez sur **+ Nouveau**
3. Remplissez les champs **par ordre:**

```
SPORT & COMPÉTITION
├─ Sport: Sélectionnez le type (Football, Tennis, etc)
├─ Ligue: Ex: "Ligue 1", "Wimbledon"
├─ Événement: Ex: "PSG vs Marseille"
└─ Coup d'envoi: Date/Heure

ADVERSAIRES
├─ Joueur/Équipe 1: Ex: "PSG"
└─ Joueur/Équipe 2: Ex: "Marseille"

PRONOSTIC
├─ Pronostic: Ex: "1" (victoire équipe 1)
├─ Cote: Ex: "1.85"
├─ Confiance: /10
├─ Unités de mise: Combien parier
└─ Score attendu: Ex: "2-1"

PARAMÈTRES AVANCÉS (optionnel)
├─ Handicap: Ex: "-1" ou "+1.5"
├─ Politique: Push/Parlay/Hedge
└─ Total: Ex: "2.5", "3.5"

ANALYSE
└─ Rationale: Expliquez WHY (stats, form, etc)

OPTIONS
└─ Premium: Cocher pour restricter l'accès
```

4. Cliquez **Publier** → Validé immédiatement ✓

---

## 💰 Offres

### Créer une nouvelle stratégie

1. Allez à **Offres** dans la navigation
2. Cliquez sur **+ Nouvelle Stratégie**
3. Remplissez le formulaire:

```
Nom: "Accès 3 jours" (descriptif)
Description: "Accès complet pour 72 heures" (court)
Type: Sélectionnez Journalier/Hebdo/Mensuel
Prix: 9.99 EUR
Limite d'utilisateurs: 100 (ou laisser vide = illimité)
Règles de paiement: "Paiement unique. Accès révoqué après 72h."
URL des conditions: https://votre-site.com/terms/3days
Actif: ✓ (coché par défaut)
```

4. Cliquez **Sauvegarder**

### Voir les stratégies

Vous voyez une **carte pour chaque stratégie** avec:
- Nom + Description
- Prix et Type
- Règles de paiement
- Badges (Actif, Max users)
- Bouton Modifier

---

## 📋 Abonnements

### Gérer les abonnés

1. Allez à **Abonnements**
2. Sélectionnez l'onglet: **Mensuel** ou **Hebdomadaire**
3. Vous voyez le **tableau** avec tous les abonnés

### Changer le status d'un abonné

1. Trouvez l'abonné dans le tableau
2. Dropdown à droite → Actif/Pause/Annulé
3. Le status change immédiatement

### Voir les stats

En haut du tableau:
- 📊 Abonnés Actifs
- 💰 Revenus Totaux
- 📈 Réservés (non-annulés)
- 🔄 En Pause
- ❌ Annulés

---

## 👤 Profil

### Éditer votre profil

1. Allez à **Mon Profil** dans la navigation
2. Cliquez **Modifier Profil**
3. Changez: Nom, Email, Type d'Admin
4. Cliquez **Sauvegarder**

### Changer le mot de passe

1. Allez à **Mon Profil**
2. Scroll vers "Sécurité"
3. Cliquez **Changer le Mot de Passe**
4. Entrez:
   - Mot de passe actuel
   - Nouveau mot de passe (min 8 caractères)
   - Confirmation du nouveau
5. Cliquez **Changer**

---

## ⚙️ Paramètres

### Configuration générale

1. Allez à **Paramètres**
2. Cliquez **Modifier**
3. Changez:
   - Nom du site: "XWIN" ou autre
   - URL: "https://xwin.app"
   - Devise: EUR/USD/GBP/XOF
   - Langue: FR/EN
4. Cliquez **Sauvegarder**

### Configuration du contenu

Section indépendante:
```
Max pronostics gratuits: 3
Taille max d'upload: 10 MB
```

Changez et cliquez **Appliquer**

### Système (toggles)

```
☑️ Mode Maintenance: Désactive l'accès public
☑️ Autoriser Inscriptions: Active/désactive les nouvelles inscriptions
☑️ Notifications Email: Active/désactive les emails automatiques
```

### Base de données

- Vérifiez "Dernier Backup"
- Boutons:
  - **🔄 Créer un Backup** → Backup immédiat
  - **⬇️ Télécharger le Dernier** → Download du dernier backup

---

## 🎯 Cas d'Usage Courants

### "Je veux ajouter un prono pour demain"
1. Pronostics → + Nouveau
2. Remplissez rapidement
3. Publiez → Visible aux utilisateurs

### "Je veux changer le prix de mon abonnement"
1. Offres → Trouvez la stratégie
2. Cliquez Modifier
3. Changez le prix
4. Sauvegardez

### "Un client demande une pause d'abonnement"
1. Abonnements → Trouvez le client
2. Changez status à "En Pause"
3. Status change immédiatement

### "Je veux voir les stats du jour"
1. Aller à Dashboard (accueil)
2. Vous voyez tous les chiffres
3. Les stats se mettent à jour automatiquement

### "Je veux changer mes infos personnelles"
1. Mon Profil
2. Cliquez Modifier
3. Changez
4. Sauvegardez

---

## 💡 Tips & Tricks

**Dashboard**
- 🔄 Refresh pour mettre à jour les stats (F5)
- 📊 Les stats sont en temps réel (si DB connectée)

**Pronostics**
- 💾 Tous les champs marqués * sont obligatoires
- 📝 L'analyse est TRÈS importante pour les utilisateurs
- 💰 Cocher "Premium" = payant

**Abonnements**
- 📅 Les dates renouvellement sont calculées auto
- ⏸️ "En Pause" = facturé mais pas accès
- ❌ "Annulé" = pas d'accès + pas de facturation

**Profil**
- 🔐 Nouveau mot de passe: min 8 caractères
- 👨‍💼 Type d'admin: affecte les permissions (à implémenter)

**Paramètres**
- ⚠️ Mode Maintenance: désactive le site public!
- 💾 Backup: faire régulièrement
- 🌍 Devise affecte tous les prix affichés

---

## 📞 Support

**Problème?**
- Dashboard ne charge pas → F5 (refresh)
- Formulaire ne sauve pas → Vérifiez les champs requis (*)
- Status d'abonné ne change pas → Vous êtes admin?

---

*Dernière mise à jour: 14/09/2026*
