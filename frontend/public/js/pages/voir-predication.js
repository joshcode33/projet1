/* ============================================================================
   pages/voir-predication.js — Consultation + actions export/partage
   ============================================================================ */

async function pageVoirPredication(id) {
    await MS.rendreEnTete();
    const contenu = document.getElementById("contenu");
    MS.afficherChargement(contenu);

    let p;
    try {
        p = await MS.db.obtenirPredication(id);
    } catch (err) {
        MS.afficherToast("Prédication introuvable.", "erreur");
        window.location.hash = "#/tableau-de-bord";
        return;
    }

    contenu.innerHTML = `
        <article class="vue-predication" data-testid="contenu-predication">
            <a href="#/tableau-de-bord" class="lien-retour" data-testid="bouton-retour-tableau">
                ${MS.icone("fleche_gauche", "icone-petit")} Retour au tableau de bord
            </a>
            ${p.theme ? `<p class="vue-theme" style="margin-top:16px;">${MS.echapperHTML(p.theme)}</p>` : ""}
            <h1 class="vue-titre">${MS.echapperHTML(p.titre || "Sans titre")}</h1>
            ${p.verset_principal ? `<p class="vue-verset">« ${MS.echapperHTML(p.verset_principal)} »</p>` : ""}
            ${p.objectif ? `<p class="vue-objectif"><strong>Objectif :</strong> ${MS.echapperHTML(p.objectif)}</p>` : ""}

            <div class="vue-barre-actions">
                <a href="#/mode-predication/${encodeURIComponent(p.id)}" class="btn btn-ambre btn-petit" data-testid="action-presenter">
                    ${MS.icone("lecture", "icone-petit")} Mode prédication
                </a>
                <a href="#/creer-predication/${encodeURIComponent(p.id)}" class="btn btn-secondaire btn-petit" data-testid="action-editer">
                    ${MS.icone("crayon", "icone-petit")} Modifier
                </a>
                <div class="vue-barre-droite">
                    <button type="button" class="btn btn-secondaire btn-petit" data-action="pdf" data-testid="action-pdf">
                        ${MS.icone("fichier", "icone-petit")} PDF
                    </button>
                    <button type="button" class="btn btn-secondaire btn-petit" data-action="word" data-testid="action-word">
                        ${MS.icone("fichier_texte", "icone-petit")} Word
                    </button>
                    <button type="button" class="btn btn-secondaire btn-petit" data-action="whatsapp" data-testid="action-whatsapp">
                        ${MS.icone("message", "icone-petit")} WhatsApp
                    </button>
                    <button type="button" class="btn btn-secondaire btn-petit" data-action="email" data-testid="action-email">
                        ${MS.icone("email", "icone-petit")} E-mail
                    </button>
                    <button type="button" class="btn btn-secondaire btn-petit" data-action="copier" data-testid="action-copier">
                        ${MS.icone("copier", "icone-petit")} Copier
                    </button>
                </div>
            </div>

            ${p.introduction ? section("Introduction", p.introduction) : ""}
            ${(p.points || []).map((pt, i) => section(`${i + 1}. ${pt.titre || ""}`, pt.explication || "", `section-point-${i}`)).join("")}
            ${p.conclusion ? section("Conclusion", p.conclusion) : ""}

            ${p.notes ? `
                <div class="vue-notes">
                    <h3 class="vue-notes-titre">Notes personnelles</h3>
                    <p class="vue-notes-contenu">${MS.echapperHTML(p.notes)}</p>
                </div>
            ` : ""}
        </article>
    `;

    document.querySelector("[data-action='pdf']").addEventListener("click", () => MS.export.exporterPDF(p));
    document.querySelector("[data-action='word']").addEventListener("click", async () => {
        try { await MS.export.exporterWord(p); } catch (e) { MS.afficherToast("Export Word indisponible.", "erreur"); }
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

function section(titre, contenu, testid = "") {
    return `
        <section class="vue-section" ${testid ? `data-testid="${testid}"` : ""}>
            <h2 class="vue-section-titre">${MS.echapperHTML(titre)}</h2>
            <p class="vue-section-contenu">${MS.echapperHTML(contenu)}</p>
        </section>
    `;
}

window.MS = window.MS || {};
window.MS.pageVoirPredication = pageVoirPredication;
