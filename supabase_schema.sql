-- ============================================================================
-- MySermon AI — Schéma Supabase
-- ----------------------------------------------------------------------------
-- À exécuter une fois dans l'éditeur SQL de Supabase (Dashboard → SQL Editor).
-- Crée la table `predications` et les règles RLS pour que chaque utilisateur
-- ne voie que ses propres prédications.
-- ============================================================================

-- Table principale
create table if not exists public.predications (
  id                uuid primary key default gen_random_uuid(),
  utilisateur_id   uuid not null references auth.users(id) on delete cascade,
  titre            text not null,
  theme            text default '',
  verset_principal text default '',
  objectif         text default '',
  notes            text default '',
  introduction     text default '',
  points           jsonb default '[]'::jsonb,
  conclusion       text default '',
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- Index utiles
create index if not exists idx_predications_user     on public.predications (utilisateur_id);
create index if not exists idx_predications_theme    on public.predications (theme);
create index if not exists idx_predications_created  on public.predications (created_at desc);

-- Row Level Security
alter table public.predications enable row level security;

drop policy if exists predications_select_own on public.predications;
create policy predications_select_own
  on public.predications for select
  using (auth.uid() = utilisateur_id);

drop policy if exists predications_insert_own on public.predications;
create policy predications_insert_own
  on public.predications for insert
  with check (auth.uid() = utilisateur_id);

drop policy if exists predications_update_own on public.predications;
create policy predications_update_own
  on public.predications for update
  using (auth.uid() = utilisateur_id)
  with check (auth.uid() = utilisateur_id);

drop policy if exists predications_delete_own on public.predications;
create policy predications_delete_own
  on public.predications for delete
  using (auth.uid() = utilisateur_id);
