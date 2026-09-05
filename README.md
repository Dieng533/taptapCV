# TAP TAP CV

« Créez votre CV. Tapez, personnalisez, téléchargez. »

Plateforme SaaS de création de CV en ligne — Next.js 14 (App Router), TypeScript, Tailwind CSS,
shadcn/ui-style components, Supabase (Auth + PostgreSQL + Storage + RLS), export PDF avec
`@react-pdf/renderer`.

## ⚠️ À lire avant de démarrer

Ce dépôt est un **MVP fonctionnel et complet dans sa structure**, prêt à être connecté à votre
projet Supabase et déployé sur Vercel. Certaines parties avancées du cahier des charges (assistant
IA, import LinkedIn, paiement Stripe, drag & drop des sections, admin dashboard complet,
i18n FR/EN) sont **préparées dans l'architecture** (voir `types/`, `supabase/schema.sql`, la table
`profiles.plan`) mais pas encore branchées à une UI — elles sont indiquées comme prochaines étapes
plus bas. L'objectif de cette livraison est de vous donner une base saine, sécurisée et 100 %
réelle (pas de mock data figée) sur laquelle itérer rapidement, plutôt qu'une façade statique.

## Fonctionnalités déjà implémentées

- Authentification complète (inscription, connexion, déconnexion, mot de passe oublié,
  réinitialisation, connexion Google, confirmation email) via Supabase Auth
- Middleware de protection des routes `/dashboard` et `/admin`
- Dashboard utilisateur : liste des CV, création, duplication, suppression (avec confirmation),
  états vides
- CV Builder en 6 étapes avec barre de progression : informations personnelles, expérience,
  formation, compétences, langues, personnalisation
- Aperçu du CV en temps réel (sans rechargement de page)
- Sauvegarde automatique avec debounce (indicateur "Enregistrement..." / "Sauvegardé ✓")
- 8 modèles de CV définis en base (`classic`, `modern`, `minimal`, `executive`, `creative`,
  `elegant`, `ats`, `professional`) avec 2 familles de mise en page réellement rendues
  (en-tête classique / bande latérale colorée) — étendre `components/templates/cv-preview.tsx`
  pour différencier davantage chaque modèle visuellement
- Personnalisation : couleur principale, typographie, forme de la photo
- Génération et téléchargement PDF fidèle à l'aperçu (`@react-pdf/renderer`)
- Landing page complète (hero, pourquoi nous, comment ça marche, modèles, fonctionnalités, avis,
  tarifs, CTA, footer) + pages `/pricing`, `/features`, `/about`, `/contact`, `/faq`
- Schéma PostgreSQL complet avec Row Level Security : chaque utilisateur ne voit et ne modifie
  que ses propres CV ; policies de Storage pour les photos de profil
- Mode clair / sombre, responsive mobile (bascule Aperçu / Modifier)

## Prochaines étapes suggérées

- Brancher l'upload de photo de profil sur le bucket Storage `avatars` (déjà créé et sécurisé
  par RLS dans `supabase/schema.sql`)
- Ajouter le drag & drop de réorganisation des sections avec `@dnd-kit` (déjà en dépendance) sur
  `resume.section_order`
- Différencier visuellement chacun des 8 modèles dans `cv-preview.tsx` et `resume-document.tsx`
- Ajouter les sections personnalisées, projets, certifications, centres d'intérêt et références
  à l'UI du builder (les types, le service et le rendu PDF les gèrent déjà)
- Espace `/admin` (structure de table `profiles.is_admin` déjà prête)
- Intégration Stripe ou paiement local (colonne `profiles.plan` déjà prête)
- i18n FR/EN avec `next-intl` ou équivalent

## Installation

```bash
npm install
cp .env.local.example .env.local
# renseignez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Base de données Supabase

1. Créez un projet sur [supabase.com](https://supabase.com)
2. Dans l'éditeur SQL du projet, exécutez le contenu de `supabase/schema.sql`
   (tables, RLS, triggers, buckets Storage)
3. Activez le fournisseur Google dans Authentication > Providers si vous voulez la connexion Google
4. Copiez l'URL du projet et la clé `anon` dans `.env.local`

### Lancer en local

```bash
npm run dev
```

L'application est disponible sur http://localhost:3000

### Déploiement Vercel

1. Poussez ce dépôt sur GitHub
2. Importez le projet sur [vercel.com](https://vercel.com)
3. Renseignez les variables d'environnement `NEXT_PUBLIC_SUPABASE_URL` et
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` dans les paramètres du projet Vercel
4. Déployez

## Structure du projet

```
app/                    Routes Next.js (App Router)
  dashboard/resumes/[id] CV Builder
  templates/             Galerie de modèles
  login, register, ...   Authentification
components/
  ui/                    Composants de base (Button, Input, Card...)
  resume/                Formulaires du builder
  templates/             Rendu live du CV
  layout/                ThemeProvider
lib/
  supabase/               Clients Supabase (browser, server)
  pdf/                    Génération du document PDF
  validations/            Schémas Zod
hooks/                    useAutosave, useUser
services/                 CRUD des CV (Supabase)
types/                    Types TypeScript du CV
supabase/schema.sql        Schéma complet + RLS + Storage
```
