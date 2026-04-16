// ============================================================================
// Client HTTP vers le backend FastAPI (endpoints IA uniquement)
// ============================================================================

import axios from "axios";

const URL_BACKEND = process.env.REACT_APP_BACKEND_URL;
const API = `${URL_BACKEND}/api`;

const client = axios.create({
  baseURL: API,
  timeout: 120000, // 2 minutes — la génération IA peut être longue
  headers: { "Content-Type": "application/json" },
});

/**
 * Génère une prédication complète depuis les éléments fournis.
 * @returns {Promise<{introduction: string, points: Array, conclusion: string}>}
 */
export async function genererPredication(payload) {
  const { data } = await client.post("/ia/generer-predication", payload);
  return data;
}

/**
 * Suggère des versets bibliques selon un thème.
 * @returns {Promise<Array<{reference: string, texte: string}>>}
 */
export async function suggererVersets(theme, nombre = 5) {
  const { data } = await client.post("/ia/suggerer-versets", { theme, nombre });
  return data;
}

/**
 * Assistant IA : reformuler / corriger / developper / illustrer
 */
export async function assistantIA(action, texte, contexte = "") {
  const { data } = await client.post("/ia/assistant", { action, texte, contexte });
  return data.resultat;
}
