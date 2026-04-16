/* ============================================================================
   pages/voir-predication.js — Affichage d'une prédication en lecture
   ============================================================================ */

async function pageVoirPredication(id) {
    await MS.rendreEnTete();
    const contenu = document.getElementById("contenu");
    MS.afficherChargement(contenu);

    let p;
    try {
        p = await MS.db.obtenirPredication(id);
    } catch {
        MS.afficherToast("Prédication introuvable.", "erreur");
        window.location.hash = "#/tableau-de-bord";
        return;
    }

    // 1. Charger la structure HTML de la page
    contenu.innerHTML = await MS.chargerHTML("/pages/voir-predication.html", {
        ICONE_RETOUR:        MS.icone("fleche_gauche", "icone-petit"),
        ICONE_LECTURE:       MS.icone("lecture", "icone-petit"),
        ICONE_CRAYON:        MS.icone("crayon", "icone-petit"),
        ICONE_FICHIER:       MS.icone("fichier", "icone-petit"),
        ICONE_FICHIER_TEXTE: MS.icone("fichier_texte", "icone-petit"),
        ICONE_MESSAGE:       MS.icone("message", "icone-petit"),
        ICONE_EMAIL:         MS.icone("email", "icone-petit"),
        ICONE_COPIER:        MS.icone("copier", "icone-petit"),
    });

    // 2. Remplir les parties dynamiques
    document.getElementById("vue-titre").textContent = p.titre || "Sans titre";
    afficherSiPresent("vue-theme", p.theme);
    afficherSiPresent("vue-verset", p.verset_principal, `« ${p.verset_principal} »`);
    afficherSiPresent("vue-objectif", p.objectif, `<strong>Objectif :</strong> ${MS.echapperHTML(p.objectif || "")}`, true);

    document.getElementById("lien-mode-predication").href = `#/mode-predication/${encodeURIComponent(p.id)}`;
    document.getElementById("lien-editer").href = `#/creer-predication/${encodeURIComponent(p.id)}`;

    // 3. Sections dynamiques (intro, points, conclusion)
    const templateSection = await MS.chargerHTML("/partiels/vue-section.html");
    const sections = [];
    if (p.introduction) sections.push(remplirSection(templateSection, "Introduction", p.introduction));
    (p.points || []).forEach((pt, i) => {
        sections.push(remplirSection(templateSection, `${i + 1}. ${pt.titre || ""}`, pt.explication || "", `section-point-${i}`));
    });
    if (p.conclusion) sections.push(remplirSection(templateSection, "Conclusion", p.conclusion));
    document.getElementById("zone-sections").innerHTML = sections.join("");

    // 4. Notes personnelles
    if (p.notes) {
        document.getElementById("zone-notes").style.display = "";
        document.getElementById("vue-notes-contenu").textContent = p.notes;
    }

    // 5. Évènements des boutons
    document.querySelector("[data-action='pdf']").addEventListener("click", () => MS.export.exporterPDF(p));
    document.querySelector("[data-action='word']").addEventListener("click", async () => {
        try { await MS.export.exporterWord(p); }
        catch { MS.afficherToast("Export Word indisponible.", "erreur"); }
    });
    document.querySelector("[data-action='whatsapp']").addEventListener("click", () => MS.export.partagerWhatsApp(p));
    document.querySelector("[data-action='email']").addEventListener("click", () => MS.export.partagerEmail(p));
    document.querySelector("[data-action='copier']").addEventListener("click", async () => {
        try {
            await MS.export.copierTexte(p);
            MS.afficherToast("Prédication copiée dans le presse-papiers.", "succes");
        } catch {
            MS.afficherToast("Copie impossible.", "erreur");
        }
    });
}

function afficherSiPresent(id, valeur, texteFormate = null, estHTML = false) {
    const el = document.getElementById(id);
    if (!el) return;
    if (!valeur) { el.style.display = "none"; return; }
    el.style.display = "";
    if (estHTML) el.innerHTML = texteFormate;
    else el.textContent = texteFormate || valeur;
}

function remplirSection(template, titre, contenu, testid = "") {
    return template
        .split("{{TITRE}}").join(MS.echapperHTML(titre))
        .split("{{CONTENU}}").join(MS.echapperHTML(contenu))
        .split("{{TESTID}}").join(testid);
}

window.MS = window.MS || {};
window.MS.pageVoirPredication = pageVoirPredication;
