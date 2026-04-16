/* ============================================================================
   pages/tableau-de-bord.js — Logique de l'écran principal
   ============================================================================ */

let _predicationsCache = [];
let _filtreRecherche = "";
let _filtreTheme = "tous";

async function pageTableauDeBord() {
    await MS.rendreEnTete();
    const utilisateur = await MS.auth.utilisateurCourant();
    const contenu = document.getElementById("contenu");
    MS.afficherChargement(contenu);

    // 1. Charger les prédications depuis Supabase
    try {
        _predicationsCache = await MS.db.listerPredications(utilisateur.id);
    } catch (err) {
        await afficherErreurChargement(contenu, err);
        return;
    }

    // 2. Charger le template HTML principal
    contenu.innerHTML = await MS.chargerHTML("/pages/tableau-de-bord.html", {
        ICONE_PLUS: MS.icone("plus", "icone-petit"),
        ICONE_RECHERCHE: MS.icone("recherche", "icone-petit"),
        ICONE_FILTRE: MS.icone("filtre", "icone-petit"),
    });

    // 3. Remplir les parties dynamiques
    document.getElementById("nom-utilisateur").textContent = extraireNomUtilisateur();
    document.getElementById("champ-recherche").value = _filtreRecherche;
    remplirOptionsThemes();

    // 4. Évènements
    document.getElementById("champ-recherche").addEventListener("input", (e) => {
        _filtreRecherche = e.target.value;
        dessinerListe();
    });
    document.getElementById("filtre-theme").addEventListener("change", (e) => {
        _filtreTheme = e.target.value;
        dessinerListe();
    });

    // 5. Affichage de la liste
    await dessinerListe();
}

function remplirOptionsThemes() {
    const select = document.getElementById("filtre-theme");
    const themes = Array.from(new Set(_predicationsCache.map(p => (p.theme || "").trim()).filter(Boolean)));
    select.innerHTML = `<option value="tous">Tous les thèmes</option>` +
        themes.map(t => `<option value="${MS.echapperHTML(t)}" ${_filtreTheme === t ? "selected" : ""}>${MS.echapperHTML(t)}</option>`).join("");
}

async function dessinerListe() {
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

    // Aucune prédication
    if (_predicationsCache.length === 0) {
        zone.innerHTML = await MS.chargerHTML("/partiels/etat-vide.html", {
            ICONE_ETINCELLE_GROS: MS.icone("etincelle", "icone-gros"),
            ICONE_FICHIER: MS.icone("fichier", "icone-petit"),
        });
        return;
    }

    // Aucun résultat pour les filtres
    if (resultats.length === 0) {
        zone.innerHTML = `<p data-testid="message-aucun-resultat" style="text-align:center;color:var(--texte-secondaire);padding:48px 0;">Aucun résultat pour ces filtres.</p>`;
        return;
    }

    // Grille de cartes
    const templateCarte = await MS.chargerHTML("/partiels/carte-predication.html");
    const cartes = resultats.map(p => remplirCarte(templateCarte, p)).join("");
    zone.innerHTML = `<div class="grille-predications" data-testid="liste-predications">${cartes}</div>`;

    // Évènements de suppression
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
                remplirOptionsThemes();
                await dessinerListe();
            } catch (err) {
                MS.afficherToast(err.message || "Échec de la suppression.", "erreur");
            }
        });
    });
}

function remplirCarte(template, p) {
    const resume = (p.introduction || p.notes || "").slice(0, 120);
    const themeAffiche = p.theme ? "" : "display:none;";
    const versetAffiche = p.verset_principal ? "" : "display:none;";
    const resumeAffiche = resume ? "" : "display:none;";

    return template
        .split("{{ID}}").join(MS.echapperHTML(p.id))
        .split("{{ID_ENCODE}}").join(encodeURIComponent(p.id))
        .split("{{DATE}}").join(MS.echapperHTML(MS.formaterDate(p.created_at)))
        .split("{{ICONE_CALENDRIER}}").join(MS.icone("calendrier", "icone-petit"))
        .split("{{ICONE_FICHIER}}").join(MS.icone("fichier", "icone-petit"))
        .split("{{ICONE_LECTURE}}").join(MS.icone("lecture", "icone-petit"))
        .split("{{ICONE_POUBELLE}}").join(MS.icone("poubelle", "icone-petit"))
        .split("{{TITRE}}").join(MS.echapperHTML(p.titre || "Sans titre"))
        .split("{{THEME}}").join(MS.echapperHTML(p.theme || ""))
        .split("{{STYLE_THEME}}").join(themeAffiche)
        .split("{{VERSET}}").join(MS.echapperHTML(p.verset_principal || ""))
        .split("{{STYLE_VERSET}}").join(versetAffiche)
        .split("{{RESUME}}").join(MS.echapperHTML(resume + (resume.length >= 120 ? "…" : "")))
        .split("{{STYLE_RESUME}}").join(resumeAffiche);
}

async function afficherErreurChargement(contenu, err) {
    contenu.innerHTML = `
        <div class="page-conteneur">
            <div class="message-erreur" data-testid="message-erreur-tableau">
                <p class="message-erreur-titre">Impossible de charger vos prédications</p>
                <p>${MS.echapperHTML(err.message || "Erreur inconnue.")}</p>
                <p class="message-erreur-detail">
                    Cette erreur survient si la table <code>predications</code> n'a pas encore été créée dans Supabase.
                    Exécutez le script <code>/app/supabase_schema.sql</code> dans votre console Supabase → SQL Editor.
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
