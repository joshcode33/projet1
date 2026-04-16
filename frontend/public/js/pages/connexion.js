/* ============================================================================
   pages/connexion.js — Logique de la page de connexion
   ============================================================================ */

async function pageConnexion() {
    MS.masquerEnTete();
    const contenu = document.getElementById("contenu");

    const theme = MS.themeActuel();
    const iconeTheme = theme === "sombre" ? MS.icone("soleil") : MS.icone("lune");

    contenu.innerHTML = await MS.chargerHTML("/pages/connexion.html", {
        IMAGE_FOND: window.CONFIG.IMAGE_FOND_CONNEXION,
        ICONE_THEME: iconeTheme,
        ICONE_LIVRE: MS.icone("livre", "icone-gros"),
        ICONE_LIVRE_PETIT: MS.icone("livre"),
    });

    // Bouton bascule thème
    document.querySelector("[data-action='basculer-theme']").addEventListener("click", () => {
        MS.basculerTheme();
    });

    // Soumission du formulaire
    document.getElementById("formulaire-connexion").addEventListener("submit", async (e) => {
        e.preventDefault();
        const bouton = document.getElementById("bouton-connexion");
        const email = document.getElementById("champ-email").value;
        const motDePasse = document.getElementById("champ-mdp").value;

        bouton.disabled = true;
        bouton.innerHTML = `<span class="spin-petit"></span> Connexion…`;
        try {
            await MS.auth.seConnecter(email, motDePasse);
            MS.afficherToast("Bienvenue !", "succes");
            window.location.hash = "#/tableau-de-bord";
        } catch (err) {
            MS.afficherToast(err.message || "Identifiants invalides.", "erreur");
            bouton.disabled = false;
            bouton.textContent = "Se connecter";
        }
    });
}

window.MS = window.MS || {};
window.MS.pageConnexion = pageConnexion;
