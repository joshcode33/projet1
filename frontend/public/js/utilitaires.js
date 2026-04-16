/* ============================================================================
   utilitaires.js — Petites fonctions utilisées partout dans l'application
   ============================================================================ */

/**
 * Charge un fichier HTML depuis le serveur et remplace les {{placeholders}}
 * par les valeurs fournies.
 * @param {string} chemin  Chemin relatif depuis la racine (ex : "/pages/connexion.html")
 * @param {Object} variables  Dictionnaire {NOM: "valeur"} pour les {{NOM}}
 * @returns {Promise<string>} HTML traité
 */
async function chargerHTML(chemin, variables = {}) {
    const reponse = await fetch(chemin, { cache: "no-store" });
    if (!reponse.ok) throw new Error(`Impossible de charger ${chemin}`);
    let html = await reponse.text();
    Object.entries(variables).forEach(([cle, valeur]) => {
        html = html.split(`{{${cle}}}`).join(valeur ?? "");
    });
    return html;
}

/** Affiche une notification temporaire en haut à droite */
function afficherToast(message, type = "info") {
    const zone = document.getElementById("zone-toasts");
    if (!zone) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.setAttribute("data-testid", `toast-${type}`);

    const icones = {
        succes: icone("coche"),
        erreur: icone("quitter"),
        info: icone("etincelle"),
    };
    toast.innerHTML = `${icones[type] || icones.info}<span></span>`;
    toast.querySelector("span").textContent = message;
    zone.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("toast-sort");
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/** Échappe les caractères HTML pour éviter les injections XSS */
function echapperHTML(texte) {
    if (texte === null || texte === undefined) return "";
    const div = document.createElement("div");
    div.textContent = String(texte);
    return div.innerHTML;
}

/** Formate une date ISO en français ("16 février 2026") */
function formaterDate(iso) {
    if (!iso) return "";
    try {
        return new Date(iso).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    } catch {
        return "";
    }
}

/** Affiche un écran de chargement dans le conteneur donné */
function afficherChargement(conteneur) {
    conteneur.innerHTML = `
        <div class="ecran-chargement" data-testid="ecran-chargement">
            <div style="display:flex;flex-direction:column;gap:12px;align-items:center;">
                <div class="spin"></div>
                <p style="font-size:14px;">Chargement…</p>
            </div>
        </div>
    `;
}

/** Renvoie un SVG sous forme de chaîne selon un nom */
function icone(nom, classe = "icone") {
    const bibliotheque = {
        livre: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
        lune: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
        soleil: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>',
        deconnexion: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
        plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
        moins: '<line x1="5" y1="12" x2="19" y2="12"/>',
        recherche: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
        filtre: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
        calendrier: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
        fichier: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
        poubelle: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
        lecture: '<polygon points="5 3 19 12 5 21 5 3"/>',
        pause: '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>',
        rembobiner: '<polygon points="11 19 2 12 11 5 11 19"/><polygon points="22 19 13 12 22 5 22 19"/>',
        fleche_gauche: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
        etincelle: '<path d="M12 3v3m0 12v3M5.64 5.64l2.12 2.12m8.48 8.48l2.12 2.12M3 12h3m12 0h3M5.64 18.36l2.12-2.12m8.48-8.48l2.12-2.12"/>',
        signet: '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
        baguette: '<path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8L19 13M15 9h0M17.8 6.2L19 5M3 21l9-9M12.2 6.2L11 5"/>',
        enregistrer: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
        message: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
        email: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
        copier: '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
        crayon: '<path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>',
        quitter: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
        fichier_texte: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>',
        coche: '<polyline points="20 6 9 17 4 12"/>',
    };
    return `<svg class="${classe}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${bibliotheque[nom] || ""}</svg>`;
}

/** Raccourcis de sélection */
function $(s, r = document) { return r.querySelector(s); }
function $$(s, r = document) { return Array.from(r.querySelectorAll(s)); }

window.MS = window.MS || {};
Object.assign(window.MS, {
    chargerHTML, afficherToast, echapperHTML, formaterDate,
    afficherChargement, icone, $, $$,
});
