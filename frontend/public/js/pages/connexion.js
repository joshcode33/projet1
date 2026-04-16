/* ============================================================================
   pages/connexion.js — Page de connexion
   ============================================================================ */

function pageConnexion() {
    MS.masquerEnTete();
    const theme = MS.themeActuel();
    const iconeTheme = theme === "sombre" ? MS.icone("soleil") : MS.icone("lune");

    const contenu = document.getElementById("contenu");
    contenu.innerHTML = `
        <div class="page-auth">
            <div class="auth-cote-image grain" style="background-image:url('${window.CONFIG.IMAGE_FOND_CONNEXION}');">
                <div class="auth-cote-image-contenu">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <span style="display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:8px;background:rgba(255,255,255,0.15);backdrop-filter:blur(8px);">
                            ${MS.icone("livre", "icone-gros")}
                        </span>
                        <span style="font-family:Fraunces,serif;font-weight:600;font-size:20px;">MySermon <span style="color:#D99B4B;">AI</span></span>
                    </div>
                    <div>
                        <h1 class="auth-cote-image-titre">Préparez des prédications qui touchent les cœurs — en quelques minutes.</h1>
                        <p class="auth-cote-image-sous-titre">Un assistant pastoral discret, fidèle à l'Écriture, conçu pour les serviteurs qui n'ont jamais assez de temps.</p>
                    </div>
                </div>
            </div>

            <div class="auth-cote-formulaire">
                <button type="button" class="btn-icone auth-bouton-theme" data-action="basculer-theme" aria-label="Basculer le thème" data-testid="bouton-basculer-theme-auth">
                    <span data-role="icone-theme">${iconeTheme}</span>
                </button>

                <div class="auth-formulaire-conteneur">
                    <div class="auth-logo-mobile">
                        <span class="logo-icone">${MS.icone("livre")}</span>
                        <span class="logo-texte">MySermon <span class="logo-ai">AI</span></span>
                    </div>

                    <h2 class="auth-titre">Bon retour, pasteur.</h2>
                    <p class="auth-description">Connectez-vous pour retrouver vos prédications.</p>

                    <form id="formulaire-connexion" class="auth-formulaire" data-testid="formulaire-connexion">
                        <div>
                            <label class="etiquette" for="email">Adresse e-mail</label>
                            <input id="email" name="email" type="email" autocomplete="email" required
                                   class="champ" placeholder="vous@votre-eglise.fr"
                                   data-testid="champ-email-connexion" />
                        </div>
                        <div>
                            <label class="etiquette" for="mdp">Mot de passe</label>
                            <input id="mdp" name="motDePasse" type="password" autocomplete="current-password" required
                                   class="champ" placeholder="Votre mot de passe"
                                   data-testid="champ-motdepasse-connexion" />
                        </div>
                        <button type="submit" class="btn btn-primaire" id="btn-connexion"
                                data-testid="bouton-soumettre-connexion" style="width:100%;margin-top:8px;">
                            Se connecter
                        </button>
                    </form>

                    <p class="auth-pied">
                        Pas encore de compte ?
                        <a href="#/inscription" data-testid="lien-inscription">Créer un compte</a>
                    </p>
                </div>
            </div>
        </div>
    `;

    contenu.querySelector("[data-action='basculer-theme']").addEventListener("click", () => {
        MS.basculerTheme();
    });

    contenu.querySelector("#formulaire-connexion").addEventListener("submit", async (e) => {
        e.preventDefault();
        const bouton = contenu.querySelector("#btn-connexion");
        const email = contenu.querySelector("#email").value;
        const motDePasse = contenu.querySelector("#mdp").value;
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
