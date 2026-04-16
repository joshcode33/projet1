/* ============================================================================
   supabase-client.js — Initialisation Supabase + helpers auth/BDD
   ============================================================================ */

// La librairie Supabase est chargée depuis un CDN dans index.html.
// Elle expose l'objet global `supabase` contenant `createClient`.
const clientSupabase = window.supabase.createClient(
    window.CONFIG.SUPABASE_URL,
    window.CONFIG.SUPABASE_ANON_KEY,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
        },
    }
);

/* ----------------------- Authentification ----------------------- */

async function seConnecter(email, motDePasse) {
    const { data, error } = await clientSupabase.auth.signInWithPassword({
        email,
        password: motDePasse,
    });
    if (error) throw error;
    return data;
}

async function sInscrire(email, motDePasse, nomComplet) {
    const { data, error } = await clientSupabase.auth.signUp({
        email,
        password: motDePasse,
        options: {
            data: { nom_complet: nomComplet || "" },
            emailRedirectTo: `${window.location.origin}/#/tableau-de-bord`,
        },
    });
    if (error) throw error;
    return data;
}

async function seDeconnecter() {
    const { error } = await clientSupabase.auth.signOut();
    if (error) throw error;
}

async function sessionCourante() {
    const { data } = await clientSupabase.auth.getSession();
    return data.session;
}

async function utilisateurCourant() {
    const session = await sessionCourante();
    return session?.user || null;
}

function ecouterAuth(rappel) {
    return clientSupabase.auth.onAuthStateChange((_evt, session) => {
        rappel(session?.user || null);
    });
}

/* ----------------------- CRUD Prédications ---------------------- */

const TABLE = window.CONFIG.TABLE_PREDICATIONS;

async function listerPredications(utilisateurId) {
    const { data, error } = await clientSupabase
        .from(TABLE)
        .select("*")
        .eq("utilisateur_id", utilisateurId)
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
}

async function obtenirPredication(id) {
    const { data, error } = await clientSupabase
        .from(TABLE)
        .select("*")
        .eq("id", id)
        .single();
    if (error) throw error;
    return data;
}

async function creerPredication(predication) {
    const { data, error } = await clientSupabase
        .from(TABLE)
        .insert(predication)
        .select()
        .single();
    if (error) throw error;
    return data;
}

async function mettreAJourPredication(id, modifications) {
    const payload = { ...modifications, updated_at: new Date().toISOString() };
    const { data, error } = await clientSupabase
        .from(TABLE)
        .update(payload)
        .eq("id", id)
        .select()
        .single();
    if (error) throw error;
    return data;
}

async function supprimerPredication(id) {
    const { error } = await clientSupabase.from(TABLE).delete().eq("id", id);
    if (error) throw error;
}

/* ------------------ Exposition globale -------------------------- */

window.MS = window.MS || {};
window.MS.auth = {
    seConnecter, sInscrire, seDeconnecter,
    sessionCourante, utilisateurCourant, ecouterAuth,
};
window.MS.db = {
    listerPredications, obtenirPredication, creerPredication,
    mettreAJourPredication, supprimerPredication,
};
