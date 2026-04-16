// ============================================================================
// Client Supabase — auth + base de données
// ----------------------------------------------------------------------------
// Toutes les opérations d'authentification et de CRUD sur les prédications
// passent par ce client. Les variables d'environnement proviennent de .env
// du dossier frontend.
// ============================================================================

import { createClient } from "@supabase/supabase-js";

const URL_SUPABASE = process.env.REACT_APP_SUPABASE_URL;
const CLE_PUBLIQUE = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(URL_SUPABASE, CLE_PUBLIQUE, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// --- Helpers haut-niveau pour les prédications -----------------------------

const TABLE = "predications";

export async function listerPredications(utilisateurId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("utilisateur_id", utilisateurId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function obtenirPredication(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function creerPredication(predication) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(predication)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function mettreAJourPredication(id, modifications) {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...modifications, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function supprimerPredication(id) {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}
