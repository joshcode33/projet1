/* ============================================================================
   pages/tableau-de-bord.js — Liste des prédications + recherche/filtres
   ============================================================================ */

let _predicationsCache = [];
let _filtreRecherche = "";
let _filtreTheme = "tous";

async function pageTableauDeBord() {
    await MS.rendreEnTete();
    const utilisateur = await MS.auth.utilisateurCourant();
    const contenu = document.getElementById("contenu");
    MS.afficherChargement(contenu);

    try {
        _predicationsCache = await MS.db.listerPredications(utilisateur.id);
    } catch (err) {
        afficherErreurChargement(contenu, err);
        return;
    }

    dessinerTableau();
}

function dessinerTableau() {
    const contenu = document.getElementById("contenu");
    const themes = Array.from(new Set(_predicationsCache.map(p => (p.theme || "").trim()).filter(Boolean)));

    const nom = extraireNomUtilisateur();
    const optionsThemes = `<option value="tous">Tous les thèmes</option>` +
        themes.map(t => `<option value="${MS.echapperHTML(t)}" ${_filtreTheme === t ? "selected" : ""}>${MS.echapperHTML(t)}</option>`).join("");

    contenu.innerHTML = `
        <div class="page-conteneur">
            <section class="bandeau-accueil">
                <div>
                    <p class="etiquette-section">Tableau de bord</p>
                    <h1 class="titre-principal">Bonjour, ${MS.echapperHTML(nom)}.</h1>
                    <p class="sous-titre">Retrouvez vos prédications, créez-en de nouvelles, et prêchez avec sérénité.</p>
                </div>
                <a href="#/creer-predication" class="btn btn-primaire" style="align-self:flex-start;" data-testid="bouton-creer-predication-principal">
                    ${MS.icone("plus", "icone-petit")} Nouvelle prédication
                </a>
            </section>

            <section class="barre-outils">
                <div class="champ-recherche-conteneur">
                    ${MS.icone("recherche", "icone-petit")}
                    <input type="search" id="recherche" class="champ" placeholder="Rechercher par titre, thème ou verset…"
                           value="${MS.echapperHTML(_filtreRecherche)}" data-testid="champ-recherche" />
                </div>
                <div class="champ-recherche-conteneur" style="max-width:240px;">
                    ${MS.icone("filtre", "icone-petit")}
                    <select id="filtre-theme" class="champ" style="padding-left:38px;" data-testid="filtre-theme">
                        ${optionsThemes}
                    </select>
                </div>
            </section>

            <div id="zone-liste"></div>
        </div>
    `;

    document.getElementById("recherche").addEventListener("input", (e) => {
        _filtreRecherche = e.target.value;
        dessinerListe();
    });
    document.getElementById("filtre-theme").addEventListener("change", (e) => {
        _filtreTheme = e.target.value;
        dessinerListe();
    });

    dessinerListe();
}

function dessinerListe() {
    const zone = document.getElementById("zone-liste");
    const resultats = _predicationsCache.filter(p => {
        const r = _filtreRecherche.toLowerCase();
        const matchRecherche = !r ||
            (p.titre || "").toLowerCase().includes(r) ||
            (p.theme || "").toLowerCase().includes(r) ||
            (p.verset_principal || "").toLowerCase().includes(r);
        const matchTheme = _filtreTheme === "tous" || p.theme === _filtreTheme;
        return matchRecherche && matchTheme;
    });

    if (_predicationsCache.length === 0) {
        zone.innerHTML = rendreEtatVide();
        return;
    }
    if (resultats.length === 0) {
        zone.innerHTML = `<p data-testid="message-aucun-resultat" style="text-align:center;color:var(--texte-secondaire);padding:48px 0;">Aucun résultat pour ces filtres.</p>`;
        return;
    }

    zone.innerHTML = `
        <div class="grille-predications" data-testid="liste-predications">
            ${resultats.map(rendreCartePrediction).join("")}
        </div>
    `;

    zone.querySelectorAll("[data-action='supprimer']").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = btn.dataset.id;
            if (!confirm("Supprimer cette prédication ? Cette action est irréversible.")) return;
            try {
                await MS.db.supprimerPredication(id);
                _predicationsCache = _predicationsCache.filter(p => p.id !== id);
                MS.afficherToast("Prédication supprimée.", "succes");
                dessinerTableau();
            } catch (err) {
                MS.afficherToast(err.message || "Échec de la suppression.", "erreur");
            }
        });
    });
}

function rendreCartePrediction(p) {
    const resume = (p.introduction || p.notes || "").slice(0, 120);
    return `
        <article class="carte carte-predication" data-testid="carte-predication-${p.id}">
            <div class="carte-entete">
                <div class="carte-date">${MS.icone("calendrier", "icone-petit")} ${MS.formaterDate(p.created_at)}</div>
                ${p.theme ? `<span class="carte-theme">${MS.echapperHTML(p.theme)}</span>` : ""}
            </div>
            <a href="#/predication/${encodeURIComponent(p.id)}" style="display:block;" data-testid="lien-predication-${p.id}">
                <h3 class="carte-titre">${MS.echapperHTML(p.titre || "Sans titre")}</h3>
                ${p.verset_principal ? `<p class="carte-verset">${MS.echapperHTML(p.verset_principal)}</p>` : ""}
                ${resume ? `<p class="carte-resume">${MS.echapperHTML(resume)}${resume.length >= 120 ? "…" : ""}</p>` : ""}
            </a>
            <div class="carte-actions">
                <div class="carte-actions-gauche">
                    <a href="#/predication/${encodeURIComponent(p.id)}" class="carte-action-lien" data-testid="action-editer-${p.id}">
                        ${MS.icone("fichier", "icone-petit")} Modifier
                    </a>
                    <a href="#/mode-predication/${encodeURIComponent(p.id)}" class="carte-action-lien carte-action-ambre" style="color:var(--accent);" data-testid="action-presenter-${p.id}">
                        ${MS.icone("lecture", "icone-petit")} Prêcher
                    </a>
                </div>
                <button type="button" class="btn-icone" style="width:32px;height:32px;" data-action="supprimer" data-id="${p.id}" aria-label="Supprimer" data-testid="action-supprimer-${p.id}">
                    ${MS.icone("poubelle", "icone-petit")}
                </button>
            </div>
        </article>
    `;
}

function rendreEtatVide() {
    return `
        <div class="carte etat-vide" data-testid="etat-vide-tableau">
            <div class="etat-vide-icone">${MS.icone("etincelle", "icone-gros")}</div>
            <h3 class="etat-vide-titre">Votre première prédication vous attend</h3>
            <p class="etat-vide-texte">Démarrez avec un titre, un thème, un verset — et laissez l'IA vous proposer une structure complète que vous pourrez peaufiner.</p>
            <a href="#/creer-predication" class="btn btn-primaire" style="margin-top:24px;" data-testid="bouton-creer-premiere-predication">
                ${MS.icone("fichier", "icone-petit")} Créer ma première prédication
            </a>
        </div>
    `;
}

function afficherErreurChargement(contenu, err) {
    contenu.innerHTML = `
        <div class="page-conteneur">
            <div class="message-erreur" data-testid="message-erreur-tableau">
                <p class="message-erreur-titre">Impossible de charger vos prédications</p>
                <p>${MS.echapperHTML(err.message || "Erreur inconnue.")}</p>
                <p class="message-erreur-detail">
                    Cette erreur survient si la table <code>predications</code> n'a pas encore été créée dans Supabase.
                    Exécutez le script <code>/app/supabase_schema.sql</code> dans votre console Supabase → SQL Editor pour la créer.
                </p>
            </div>
        </div>
    `;
}

function extraireNomUtilisateur() {
    const u = MS.utilisateurActuel;
    if (!u) return "pasteur";
    return u.user_metadata?.nom_complet?.trim() ||
           (u.email ? u.email.split("@")[0] : null) ||
           "pasteur";
}

window.MS = window.MS || {};
window.MS.pageTableauDeBord = pageTableauDeBord;
