/* ============================================================================
   en-tete.js — Rend le bandeau supérieur (logo + actions + thème)
   ============================================================================ */

async function rendreEnTete() {
    const conteneur = document.getElementById("en-tete");
    const utilisateur = await MS.auth.utilisateurCourant();
    const theme = MS.themeActuel();
    const iconeTheme = theme === "sombre" ? MS.icone("soleil") : MS.icone("lune");

    conteneur.className = "en-tete";
    conteneur.innerHTML = `
        <div class="en-tete-conteneur">
            <a href="#${utilisateur ? '/tableau-de-bord' : '/'}" class="logo" data-testid="lien-logo">
                <span class="logo-icone">${MS.icone("livre", "icone")}</span>
                <span class="logo-texte">MySermon <span class="logo-ai">AI</span></span>
            </a>
            <div class="en-tete-actions">
                ${utilisateur ? `
                    <a href="#/creer-predication" class="btn btn-ambre cache-mobile" data-testid="bouton-nouvelle-predication">
                        ${MS.icone("plus", "icone-petit")}
                        <span>Nouvelle prédication</span>
                    </a>
                ` : ""}
                <button type="button" class="btn-icone" data-action="basculer-theme" aria-label="Basculer le thème" data-testid="bouton-basculer-theme">
                    <span data-role="icone-theme">${iconeTheme}</span>
                </button>
                ${utilisateur ? `
                    <button type="button" class="btn-icone btn-icone-danger" data-action="deconnexion" aria-label="Se déconnecter" data-testid="bouton-deconnexion">
                        ${MS.icone("deconnexion", "icone")}
                    </button>
                ` : ""}
            </div>
        </div>
    `;

    // Attacher les gestionnaires d'événements
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
