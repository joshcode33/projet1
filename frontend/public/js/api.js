/* ============================================================================
   api.js — Appels HTTP vers le backend FastAPI (endpoints IA)
   ============================================================================ */

const API_BASE = `${window.CONFIG.URL_BACKEND}/api`;

async function appelPost(chemin, corps, timeoutMs = 120000) {
    const ctrl = new AbortController();
    const minuteur = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
        const reponse = await fetch(`${API_BASE}${chemin}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(corps),
            signal: ctrl.signal,
        });
        const texte = await reponse.text();
        let donnees;
        try { donnees = texte ? JSON.parse(texte) : {}; } catch { donnees = { detail: texte }; }
        if (!reponse.ok) {
            throw new Error(donnees.detail || `Erreur ${reponse.status}`);
        }
        return donnees;
    } finally {
        clearTimeout(minuteur);
    }
}

/**
 * Génère une prédication complète (intro + 3 points + conclusion)
 */
async function genererPredication(payload) {
    return await appelPost("/ia/generer-predication", payload);
}

/**
 * Suggère des versets bibliques à partir d'un thème
 */
async function suggererVersets(theme, nombre = 5) {
    return await appelPost("/ia/suggerer-versets", { theme, nombre });
}

/**
 * Assistant IA : reformuler / corriger / developper / illustrer
 */
async function assistantIA(action, texte, contexte = "") {
    const res = await appelPost("/ia/assistant", { action, texte, contexte });
    return res.resultat;
}

window.MS = window.MS || {};
window.MS.api = { genererPredication, suggererVersets, assistantIA };
