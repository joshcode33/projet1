# AutoCommission - Product Requirements Document

## Problem Statement
AutoCommission – Plateforme de vente de véhicules entre commissionnaires et acheteurs en RDC. MVP permettant de centraliser les véhicules disponibles, faciliter la recherche pour les acheteurs, et connecter directement acheteur ↔ vendeur via WhatsApp.

## User Personas
1. **Acheteur** - Recherche un véhicule, consulte les détails, contacte le vendeur via WhatsApp
2. **Commissionnaire/Vendeur** - Reçoit les demandes via WhatsApp avec message pré-rempli

## Core Requirements (MVP)
- [x] Page d'accueil avec Hero Section
- [x] Système de recherche (marque/modèle)
- [x] Filtres (prix, localisation, carburant, transmission, statut)
- [x] Catalogue de véhicules en grille
- [x] Page détail véhicule avec galerie d'images
- [x] Boutons WhatsApp avec message pré-rempli
- [x] Badge Disponible/Vendu
- [x] Design responsive (mobile/tablet/desktop)
- [x] Langue française

## What's Been Implemented (Jan 2026)
### Backend (FastAPI)
- `/api/vehicles` - Liste des véhicules avec filtres
- `/api/vehicles/{id}` - Détail d'un véhicule
- `/api/locations` - Liste des localisations
- `/api/stats` - Statistiques du catalogue
- 9 véhicules de démonstration

### Frontend (React + Tailwind + Shadcn UI)
- Header avec navigation
- Hero Section avec recherche
- Catalogue avec cartes véhicules
- Sidebar filtres (desktop) / Sheet (mobile)
- Page détail avec galerie d'images
- Footer avec liens et contact WhatsApp

## Architecture
- **Frontend**: React 19, Tailwind CSS, Shadcn UI, React Router
- **Backend**: FastAPI, données statiques en mémoire
- **Données**: 9 véhicules de démonstration

## Prioritized Backlog
### P0 (MVP Complete)
- [x] Toutes les fonctionnalités MVP livrées

### P1 (Future)
- [ ] Panel administrateur pour CRUD véhicules
- [ ] Base de données MongoDB pour persistance
- [ ] Upload d'images (Object Storage)
- [ ] Système de favoris persistant

### P2 (Enhancement)
- [ ] Comparaison de véhicules
- [ ] Notifications email/SMS
- [ ] Multi-langue (EN/FR)
- [ ] Analytics et statistiques

## Next Action Items
1. Ajouter un panel admin pour gérer les véhicules
2. Migrer vers MongoDB pour la persistance des données
3. Intégrer le téléchargement d'images
