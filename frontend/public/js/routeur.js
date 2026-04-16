/* ============================================================================
   routeur.js — Routeur simple basé sur le hash de l'URL (#/chemin)
   ============================================================================ */

async function gererRoute() {
    // Nettoyer le mode prédication si on quitte cette page
    if (window.MS.nettoyerMode) window.MS.nettoyerMode();

    const hash = window.location.hash.replace(/^#/, "") || "/";
    const segments = hash.split("/").filter(Boolean);

    // Mise à jour de l'utilisateur en cache
    MS.utilisateurActuel = await MS.auth.utilisateurCourant();

    const premier = segments[0] || "";

    // Routes publiques
    if (premier === "" || premier === "connexion") {
        if (MS.utilisateurActuel) { window.location.hash = "#/tableau-de-bord"; return; }
        MS.pageConnexion();
        return;
    }
    if (premier === "inscription") {
        if (MS.utilisateurActuel) { window.location.hash = "#/tableau-de-bord"; return; }
        MS.pageInscription();
        return;
    }

    // Routes protégées
    if (!MS.utilisateurActuel) {
        window.location.hash = "#/connexion";
        return;
    }

    if (premier === "tableau-de-bord") {
        await MS.pageTableauDeBord();
        return;
    }
    if (premier === "creer-predication") {
        const id = segments[1] ? decodeURIComponent(segments[1]) : null;
        await MS.pageCreerPredication(id);
        return;
    }
    if (premier === "predication" && segments[1]) {
        await MS.pageVoirPredication(decodeURIComponent(segments[1]));
        return;
    }
    if (premier === "mode-predication" && segments[1]) {
        await MS.pageModePredication(decodeURIComponent(segments[1]));
        return;
    }

    // Route inconnue → tableau de bord
    window.location.hash = "#/tableau-de-bord";
}

window.MS = window.MS || {};
window.MS.gererRoute = gererRoute;
