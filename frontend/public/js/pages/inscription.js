/* ============================================================================
   pages/inscription.js — Page de création de compte
   ============================================================================ */

function pageInscription() {
    MS.masquerEnTete();
    const theme = MS.themeActuel();
    const iconeTheme = theme === "sombre" ? MS.icone("soleil") : MS.icone("lune");

    const contenu = document.getElementById("contenu");
    contenu.innerHTML = `
        <div class="page-auth inversee">
            <div class="auth-cote-formulaire">
                <button type="button" class="btn-icone" style="position:absolute;top:20px;left:20px;" data-action="basculer-theme" aria-label="Basculer le thème" data-testid="bouton-basculer-theme-auth">
                    <span data-role="icone-theme">${iconeTheme}</span>
                </button>

                <div class="auth-formulaire-conteneur">
                    <div class="auth-logo-mobile">
                        <span class="logo-icone">${MS.icone("livre")}</span>
                        <span class="logo-texte">MySermon <span class="logo-ai">AI</span></span>
                    </div>

                    <h2 class="auth-titre">Créez votre compte</h2>
                    <p class="auth-description">Commencez à préparer vos prédications avec l'aide de l'IA.</p>

                    <form id="formulaire-inscription" class="auth-formulaire" data-testid="formulaire-inscription">
                        <div>
                            <label class="etiquette" for="nom">Nom complet</label>
                            <input id="nom" type="text" autocomplete="name" class="champ"
                                   placeholder="Pasteur Jean Dupont" data-testid="champ-nom-inscription" />
                        </div>
                        <div>
                            <label class="etiquette" for="email">Adresse e-mail</label>
                            <input id="email" type="email" autocomplete="email" required class="champ"
                                   placeholder="vous@votre-eglise.fr" data-testid="champ-email-inscription" />
                        </div>
                        <div>
                            <label class="etiquette" for="mdp">Mot de passe</label>
                            <input id="mdp" type="password" autocomplete="new-password" required minlength="6"
                                   class="champ" placeholder="Au moins 6 caractères"
                                   data-testid="champ-motdepasse-inscription" />
                        </div>
                        <button type="submit" class="btn btn-primaire" id="btn-inscription"
                                data-testid="bouton-soumettre-inscription" style="width:100%;margin-top:8px;">
                            Créer mon compte
                        </button>
                    </form>

                    <p class="auth-pied">
                        Déjà un compte ?
                        <a href="#/connexion" data-testid="lien-connexion">Se connecter</a>
                    </p>
                </div>
            </div>

            <div class="auth-cote-image grain" style="background-image:url('${window.CONFIG.IMAGE_FOND_INSCRIPTION}');"></div>
        </div>
    `;

    contenu.querySelector("[data-action='basculer-theme']").addEventListener("click", () => {
        MS.basculerTheme();
    });

    contenu.querySelector("#formulaire-inscription").addEventListener("submit", async (e) => {
        e.preventDefault();
        const bouton = contenu.querySelector("#btn-inscription");
        const nom = contenu.querySelector("#nom").value;
        const email = contenu.querySelector("#email").value;
        const motDePasse = contenu.querySelector("#mdp").value;
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
                afficherConfirmationEmail(email);
            }
        } catch (err) {
            MS.afficherToast(err.message || "Création du compte impossible.", "erreur");
            bouton.disabled = false;
            bouton.textContent = "Créer mon compte";
        }
    });
}

function afficherConfirmationEmail(email) {
    const contenu = document.getElementById("contenu");
    contenu.innerHTML = `
        <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;">
            <div style="max-width:440px;text-align:center;" class="auth-formulaire-conteneur">
                <div style="width:56px;height:56px;border-radius:50%;background:rgba(74,93,35,0.12);color:var(--primaire);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">
                    ${MS.icone("coche", "icone-gros")}
                </div>
                <h2 style="font-family:Fraunces,serif;font-size:32px;">Vérifiez votre boîte mail</h2>
                <p style="margin-top:12px;font-size:14px;color:var(--texte-secondaire);">
                    Nous avons envoyé un lien de confirmation à <strong>${MS.echapperHTML(email)}</strong>.
                    Cliquez dessus pour activer votre compte, puis connectez-vous.
                </p>
                <a href="#/connexion" class="btn btn-primaire" style="margin-top:24px;" data-testid="lien-retour-connexion">
                    Retour à la connexion
                </a>
            </div>
        </div>
    `;
}

window.MS = window.MS || {};
window.MS.pageInscription = pageInscription;
