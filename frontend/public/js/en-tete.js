/* ============================================================================
   en-tete.js — Rend le bandeau supérieur en chargeant un template HTML
   ============================================================================ */

async function rendreEnTete() {
    const conteneur = document.getElementById("en-tete");
    conteneur.className = "en-tete";

    const utilisateur = await MS.auth.utilisateurCourant();
    const theme = MS.themeActuel();
    const iconeTheme = theme === "sombre" ? MS.icone("soleil") : MS.icone("lune");

    const fichier = utilisateur
        ? "/partiels/en-tete-prive.html"
        : "/partiels/en-tete-public.html";

    const html = await MS.chargerHTML(fichier, {
        ICONE_LIVRE: MS.icone("livre"),
        ICONE_THEME: iconeTheme,
        ICONE_PLUS_PETIT: MS.icone("plus", "icone-petit"),
        ICONE_DECONNEXION: MS.icone("deconnexion"),
    });
    conteneur.innerHTML = html;

    // Évènements
    conteneur.querySelector("[data-action='basculer-theme']")?.addEventListener("click", () => {
        MS.basculerTheme();
    });
    conteneur.querySelector("[data-action='deconnexion']")?.addEventListener("click", async () => {
        try {
            await MS.auth.seDeconnecter();
            MS.afficherToast("Vous êtes déconnecté. À bientôt !", "succes");
            window.location.hash = "#/connexion";
        } catch (err) {
            MS.afficherToast("Échec de la déconnexion : " + err.message, "erreur");
        }
    });
}

function masquerEnTete() {
    const conteneur = document.getElementById("en-tete");
    conteneur.innerHTML = "";
    conteneur.className = "";
}

window.MS = window.MS || {};
Object.assign(window.MS, { rendreEnTete, masquerEnTete });
