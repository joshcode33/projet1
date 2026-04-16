/* ============================================================================
   pages/inscription.js — Logique de la page d'inscription
   ============================================================================ */

async function pageInscription() {
    MS.masquerEnTete();
    const contenu = document.getElementById("contenu");

    const theme = MS.themeActuel();
    const iconeTheme = theme === "sombre" ? MS.icone("soleil") : MS.icone("lune");

    contenu.innerHTML = await MS.chargerHTML("/pages/inscription.html", {
        IMAGE_FOND: window.CONFIG.IMAGE_FOND_INSCRIPTION,
        ICONE_THEME: iconeTheme,
        ICONE_LIVRE_PETIT: MS.icone("livre"),
    });

    document.querySelector("[data-action='basculer-theme']").addEventListener("click", () => {
        MS.basculerTheme();
    });

    document.getElementById("formulaire-inscription").addEventListener("submit", async (e) => {
        e.preventDefault();
        const bouton = document.getElementById("bouton-inscription");
        const nom = document.getElementById("champ-nom").value;
        const email = document.getElementById("champ-email").value;
        const motDePasse = document.getElementById("champ-mdp").value;

        if (motDePasse.length < 6) {
            MS.afficherToast("Le mot de passe doit contenir au moins 6 caractères.", "erreur");
            return;
        }

        bouton.disabled = true;
        bouton.innerHTML = `<span class="spin-petit"></span> Création…`;
        try {
            const resultat = await MS.auth.sInscrire(email, motDePasse, nom);
            if (resultat.session) {
                MS.afficherToast("Compte créé ! Bienvenue parmi nous.", "succes");
                window.location.hash = "#/tableau-de-bord";
            } else {
                await afficherConfirmationEmail(email);
            }
        } catch (err) {
            MS.afficherToast(err.message || "Création du compte impossible.", "erreur");
            bouton.disabled = false;
            bouton.textContent = "Créer mon compte";
        }
    });
}

async function afficherConfirmationEmail(email) {
    const contenu = document.getElementById("contenu");
    contenu.innerHTML = await MS.chargerHTML("/pages/inscription-email-envoye.html", {
        EMAIL: MS.echapperHTML(email),
        ICONE_COCHE: MS.icone("coche", "icone-gros"),
    });
}

window.MS = window.MS || {};
window.MS.pageInscription = pageInscription;
