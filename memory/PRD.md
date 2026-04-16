# MySermon AI — PRD

## Problem Statement (original)
Construire une application web moderne appelée "MySermon AI" — outil de préparation de prédications assisté par intelligence artificielle pour pasteurs et prédicateurs. L'app doit aider les pasteurs à créer, organiser et délivrer leurs prédications plus rapidement grâce à l'IA.

## Users
- Pasteurs
- Prédicateurs
- Responsables d'église

## Stack réellement utilisée (contraintes env)
- Backend : **FastAPI (Python)** — le supervisor est en lecture seule, Node.js impossible
- Frontend : **React** (craco + tailwind + shadcn/ui) — code commenté en français, noms de fichiers/variables en français
- Base de données : **Supabase Postgres** (directement depuis le frontend, avec RLS)
- Auth : **Supabase Auth** (Email/Password)
- IA : **OpenAI GPT-4o-mini** — clé utilisateur en priorité + fallback Emergent LLM key
- Export : **jsPDF** (PDF) + **docx** (Word)
- Partage : **wa.me** (WhatsApp) + **mailto** (Email)

## Architecture
- Frontend Supabase client → auth + CRUD prédications (protection RLS par `utilisateur_id`)
- Frontend → Backend FastAPI → OpenAI (génération IA uniquement, sans état)

## Core Requirements (statiques)
1. Authentification (inscription/connexion/déconnexion)
2. Formulaire de création de prédication (titre, thème, verset, objectif, notes)
3. Génération IA : intro + 3 points + conclusion
4. Suggestion de versets selon un thème
5. Assistant IA : reformuler, corriger, développer, illustrer
6. Gestion CRUD + filtre par thème + recherche
7. Export PDF et Word
8. Partage WhatsApp + Email
9. Mode Prédication plein écran (grande typo, défilement auto, fond sombre)
10. Bascule Mode Sombre/Clair persistante
11. UI française, responsive mobile

## Implemented (16 févr. 2026)
- [x] Backend FastAPI avec endpoints : `/api/`, `/api/ia/generer-predication`, `/api/ia/suggerer-versets`, `/api/ia/assistant` — fallback Emergent LLM key si OpenAI échoue
- [x] Frontend React complet (routes, pages, contextes Auth + Theme)
- [x] Pages : Connexion, Inscription, TableauDeBord, CreerPredication (mode création + édition), VoirPredication, ModePredication (plein écran)
- [x] Intégration Supabase Auth (Email/Password) et Firestore-like CRUD via supabase-js
- [x] Export PDF (jsPDF) + Word (docx)
- [x] Partage WhatsApp (wa.me) + Email (mailto) + copier presse-papiers
- [x] Mode Prédication avec contrôles : lecture/pause, vitesse, taille texte, rembobiner, raccourcis clavier
- [x] Design Organic & Earthy (Fraunces + Manrope, palette olive / ambre / ivoire / encre)
- [x] Mode sombre/clair persisté dans localStorage
- [x] Schéma SQL fourni dans `/app/supabase_schema.sql` — À exécuter par l'utilisateur dans Supabase SQL Editor

## Action requise de l'utilisateur
1. Exécuter `/app/supabase_schema.sql` dans Supabase → SQL Editor pour créer la table `predications` et les règles RLS.
2. Vérifier que l'Email/Password est activé dans Supabase → Authentication → Providers.
3. (Optionnel) Désactiver la confirmation e-mail dans Supabase → Authentication → Settings pour une inscription instantanée.

## Backlog (P1/P2)
- P1 : Rappels / notifications (cron côté client ou service notifications)
- P1 : Support hors-ligne (service worker + IndexedDB)
- P2 : Connexion Google via Supabase OAuth
- P2 : Multi-langue (anglais, espagnol)
- P2 : Bibliothèque de versets locale (éviter les appels IA pour les suggestions)
- P2 : Partage par lien public de prédications
- P2 : Tags personnalisés, séries de prédications
- P2 : Mode collaboration (co-édition avec d'autres responsables)

## Next tasks
- Tests E2E après que l'utilisateur aura exécuté le SQL Supabase
- Ajout de notifications/rappels
- Mode hors-ligne (PWA)
