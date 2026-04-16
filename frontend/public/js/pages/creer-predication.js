/* ============================================================================
   pages/creer-predication.js — Formulaire de création/édition + IA
   ============================================================================ */

let _predicationCourante = null;
let _enregistrementEnCours = false;

async function pageCreerPredication(id = null) {
    await MS.rendreEnTete();
    const contenu = document.getElementById("contenu");

    if (id) {
        MS.afficherChargement(contenu);
        try {
            _predicationCourante = await MS.db.obtenirPredication(id);
            if (!Array.isArray(_predicationCourante.points)) _predicationCourante.points = [];
        } catch (err) {
            MS.afficherToast("Impossible de charger cette prédication.", "erreur");
            window.location.hash = "#/tableau-de-bord";
            return;
        }
    } else {
        _predicationCourante = {
            titre: "", theme: "", verset_principal: "", objectif: "", notes: "",
            introduction: "", points: [], conclusion: "",
        };
    }

    dessinerEditeur(Boolean(id));
}

function dessinerEditeur(enEdition) {
    const contenu = document.getElementById("contenu");
    const p = _predicationCourante;

    contenu.innerHTML = `
        <div class="page-editeur">
            <a href="#/tableau-de-bord" class="lien-retour" data-testid="bouton-retour-tableau">
                ${MS.icone("fleche_gauche", "icone-petit")} Retour au tableau de bord
            </a>
            <h1 class="titre-principal" style="margin-top:16px;">${enEdition ? "Modifier la prédication" : "Nouvelle prédication"}</h1>
            <p class="sous-titre">Renseignez l'essentiel puis laissez l'IA structurer le message — vous garderez la plume.</p>

            <section class="carte section-formulaire">
                <h2 class="section-titre">1. Votre brief</h2>
                <div class="groupe-champs-deux">
                    <div>
                        <label class="etiquette" for="f-titre">Titre *</label>
                        <input id="f-titre" type="text" class="champ" placeholder="Ex : La grâce qui relève"
                               value="${MS.echapperHTML(p.titre)}" data-testid="champ-titre" />
                    </div>
                    <div>
                        <label class="etiquette" for="f-theme">Thème</label>
                        <input id="f-theme" type="text" class="champ" placeholder="Ex : Espérance, Grâce, Famille…"
                               value="${MS.echapperHTML(p.theme)}" data-testid="champ-theme" />
                    </div>
                    <div>
                        <label class="etiquette" for="f-verset">Verset biblique principal</label>
                        <input id="f-verset" type="text" class="champ" placeholder="Ex : Romains 8:28"
                               value="${MS.echapperHTML(p.verset_principal)}" data-testid="champ-verset" />
                    </div>
                    <div>
                        <label class="etiquette" for="f-objectif">Objectif pastoral</label>
                        <input id="f-objectif" type="text" class="champ" placeholder="Ce que l'auditoire doit retenir / faire"
                               value="${MS.echapperHTML(p.objectif)}" data-testid="champ-objectif" />
                    </div>
                </div>
                <div style="margin-top:16px;">
                    <label class="etiquette" for="f-notes">Notes, idées, anecdotes</label>
                    <textarea id="f-notes" class="champ" rows="4" placeholder="Tout ce qui traverse votre esprit…"
                              data-testid="champ-notes">${MS.echapperHTML(p.notes)}</textarea>
                </div>

                <div class="barre-actions-ia">
                    <button type="button" class="btn btn-ambre" id="btn-generer" data-testid="bouton-generer-predication">
                        ${MS.icone("etincelle", "icone-petit")} Générer la prédication
                    </button>
                    <button type="button" class="btn btn-secondaire" id="btn-versets" data-testid="bouton-suggerer-versets">
                        ${MS.icone("signet", "icone-petit")} Suggérer des versets
                    </button>
                </div>

                <div id="zone-versets"></div>
            </section>

            <section class="carte section-formulaire">
                <h2 class="section-titre">2. Corps de la prédication</h2>

                ${blocChampAvecAssistant("Introduction", "introduction", p.introduction, 5)}

                <div style="margin-top:24px;display:flex;justify-content:space-between;align-items:center;">
                    <h3 style="font-family:Fraunces,serif;font-size:16px;font-weight:600;">Points principaux</h3>
                    <button type="button" class="btn btn-secondaire btn-petit" id="btn-ajouter-point" data-testid="bouton-ajouter-point">
                        ${MS.icone("plus", "icone-petit")} Ajouter un point
                    </button>
                </div>

                <div id="zone-points" style="margin-top:12px;">${rendrePoints()}</div>

                ${blocChampAvecAssistant("Conclusion", "conclusion", p.conclusion, 4)}
            </section>

            <div class="barre-actions-sauvegarde">
                <button type="button" class="btn btn-primaire" id="btn-sauvegarder" data-testid="bouton-sauvegarder">
                    ${MS.icone("enregistrer", "icone-petit")} Enregistrer
                </button>
                ${enEdition ? `
                    <a href="#/mode-predication/${encodeURIComponent(p.id)}" class="btn btn-secondaire" data-testid="bouton-mode-predication">
                        ${MS.icone("lecture", "icone-petit")} Mode prédication
                    </a>
                ` : `
                    <button type="button" class="btn btn-secondaire" id="btn-sauvegarder-presenter" data-testid="bouton-sauvegarder-et-presenter">
                        ${MS.icone("lecture", "icone-petit")} Enregistrer & prêcher
                    </button>
                `}
            </div>
        </div>
    `;

    attacherEvenementsEditeur(enEdition);
}

function blocChampAvecAssistant(titre, cle, valeur, rows) {
    return `
        <div style="margin-top:${titre ? 20 : 8}px;">
            ${titre ? `<label class="etiquette">${titre}</label>` : ""}
            <textarea id="f-${cle}" class="champ" rows="${rows}" data-testid="${cle}-textarea">${MS.echapperHTML(valeur || "")}</textarea>
            <div class="actions-assistant">
                ${["reformuler", "corriger", "developper", "illustrer"].map(a => `
                    <button type="button" class="btn-assistant" data-action="assistant" data-cle="${cle}" data-action-ia="${a}" data-testid="${cle}-assistant-${a}">
                        ${MS.icone("baguette", "icone-petit")} ${a.charAt(0).toUpperCase() + a.slice(1)}
                    </button>
                `).join("")}
            </div>
        </div>
    `;
}

function rendrePoints() {
    if (!_predicationCourante.points || _predicationCourante.points.length === 0) {
        return `<p style="font-size:14px;color:var(--texte-secondaire);font-style:italic;">Les points apparaîtront ici après la génération, ou ajoutez-en manuellement.</p>`;
    }
    return _predicationCourante.points.map((pt, idx) => `
        <div class="point-bloc" data-testid="point-${idx}">
            <div class="point-bloc-entete">
                <span class="point-bloc-numero">Point ${idx + 1}</span>
                <button type="button" class="btn-icone" style="width:28px;height:28px;" data-action="supprimer-point" data-index="${idx}" aria-label="Supprimer ce point" data-testid="supprimer-point-${idx}">
                    ${MS.icone("poubelle", "icone-petit")}
                </button>
            </div>
            <input type="text" class="champ" value="${MS.echapperHTML(pt.titre || "")}" placeholder="Titre du point"
                   data-role="point-titre" data-index="${idx}" data-testid="point-titre-${idx}"
                   style="font-family:Fraunces,serif;font-size:16px;font-weight:600;margin-bottom:10px;" />
            <textarea class="champ" rows="5" data-role="point-explication" data-index="${idx}" data-testid="point-explication-${idx}-textarea">${MS.echapperHTML(pt.explication || "")}</textarea>
            <div class="actions-assistant">
                ${["reformuler", "corriger", "developper", "illustrer"].map(a => `
                    <button type="button" class="btn-assistant" data-action="assistant-point" data-index="${idx}" data-action-ia="${a}" data-testid="point-explication-${idx}-assistant-${a}">
                        ${MS.icone("baguette", "icone-petit")} ${a.charAt(0).toUpperCase() + a.slice(1)}
                    </button>
                `).join("")}
            </div>
        </div>
    `).join("");
}

function attacherEvenementsEditeur(enEdition) {
    const $ = (s) => document.querySelector(s);

    // Synchronisation des champs → objet en mémoire
    ["titre", "theme", "verset_principal", "objectif", "notes", "introduction", "conclusion"].forEach((cle) => {
        const id = cle.replace("_", "-").replace("verset-principal", "verset");
        const el = document.getElementById("f-" + id) || document.getElementById("f-" + cle);
        if (el) {
            el.addEventListener("input", () => { _predicationCourante[cle] = el.value; });
        }
    });
    // Corrections d'id
    $("#f-verset").addEventListener("input", (e) => _predicationCourante.verset_principal = e.target.value);

    // Points (mises à jour)
    document.querySelectorAll("[data-role='point-titre']").forEach(el => {
        el.addEventListener("input", () => {
            _predicationCourante.points[Number(el.dataset.index)].titre = el.value;
        });
    });
    document.querySelectorAll("[data-role='point-explication']").forEach(el => {
        el.addEventListener("input", () => {
            _predicationCourante.points[Number(el.dataset.index)].explication = el.value;
        });
    });

    // Ajouter / supprimer point
    $("#btn-ajouter-point").addEventListener("click", () => {
        _predicationCourante.points.push({ titre: "", explication: "" });
        document.getElementById("zone-points").innerHTML = rendrePoints();
        attacherEvenementsPoints();
    });
    attacherEvenementsPoints();

    // Générer prédication
    $("#btn-generer").addEventListener("click", async () => {
        if (!_predicationCourante.titre.trim()) {
            MS.afficherToast("Saisissez au moins un titre pour lancer la génération.", "erreur");
            return;
        }
        const btn = $("#btn-generer");
        btn.disabled = true;
        const htmlOrig = btn.innerHTML;
        btn.innerHTML = `<span class="spin-petit"></span> Génération…`;
        try {
            const res = await MS.api.genererPredication({
                titre: _predicationCourante.titre,
                theme: _predicationCourante.theme,
                verset_principal: _predicationCourante.verset_principal,
                objectif: _predicationCourante.objectif,
                notes: _predicationCourante.notes,
            });
            _predicationCourante.introduction = res.introduction;
            _predicationCourante.points = res.points || [];
            _predicationCourante.conclusion = res.conclusion;
            MS.afficherToast("Prédication générée !", "succes");
            dessinerEditeur(enEdition);
        } catch (err) {
            MS.afficherToast(err.message || "Échec de la génération.", "erreur");
            btn.disabled = false;
            btn.innerHTML = htmlOrig;
        }
    });

    // Suggérer versets
    $("#btn-versets").addEventListener("click", async () => {
        if (!_predicationCourante.theme.trim()) {
            MS.afficherToast("Indiquez un thème pour obtenir des suggestions.", "erreur");
            return;
        }
        const btn = $("#btn-versets");
        btn.disabled = true;
        const htmlOrig = btn.innerHTML;
        btn.innerHTML = `<span class="spin-petit"></span> Recherche…`;
        try {
            const versets = await MS.api.suggererVersets(_predicationCourante.theme, 6);
            dessinerVersets(versets);
        } catch (err) {
            MS.afficherToast(err.message || "Échec des suggestions.", "erreur");
        } finally {
            btn.disabled = false;
            btn.innerHTML = htmlOrig;
        }
    });

    // Assistant IA sur les champs simples
    document.querySelectorAll("[data-action='assistant']").forEach(btn => {
        btn.addEventListener("click", () => executerAssistantChamp(btn.dataset.cle, btn.dataset.actionIa, btn));
    });
    document.querySelectorAll("[data-action='assistant-point']").forEach(btn => {
        btn.addEventListener("click", () => executerAssistantPoint(Number(btn.dataset.index), btn.dataset.actionIa, btn));
    });

    // Sauvegarder
    $("#btn-sauvegarder").addEventListener("click", () => sauvegarder(enEdition, false));
    const btnPresenter = $("#btn-sauvegarder-presenter");
    if (btnPresenter) btnPresenter.addEventListener("click", () => sauvegarder(enEdition, true));
}

function attacherEvenementsPoints() {
    document.querySelectorAll("[data-action='supprimer-point']").forEach(btn => {
        btn.addEventListener("click", () => {
            const idx = Number(btn.dataset.index);
            _predicationCourante.points.splice(idx, 1);
            document.getElementById("zone-points").innerHTML = rendrePoints();
            attacherEvenementsPoints();
        });
    });
    document.querySelectorAll("[data-role='point-titre']").forEach(el => {
        el.addEventListener("input", () => {
            _predicationCourante.points[Number(el.dataset.index)].titre = el.value;
        });
    });
    document.querySelectorAll("[data-role='point-explication']").forEach(el => {
        el.addEventListener("input", () => {
            _predicationCourante.points[Number(el.dataset.index)].explication = el.value;
        });
    });
    document.querySelectorAll("[data-action='assistant-point']").forEach(btn => {
        btn.addEventListener("click", () => executerAssistantPoint(Number(btn.dataset.index), btn.dataset.actionIa, btn));
    });
}

function dessinerVersets(versets) {
    const zone = document.getElementById("zone-versets");
    if (!versets || versets.length === 0) {
        zone.innerHTML = `<p style="margin-top:16px;color:var(--texte-secondaire);font-size:14px;">Aucun verset trouvé.</p>`;
        return;
    }
    zone.innerHTML = `
        <div class="liste-versets" data-testid="liste-versets-suggerees">
            <p class="liste-versets-titre">Versets suggérés — cliquez pour ajouter aux notes</p>
            ${versets.map((v, idx) => `
                <div class="verset-item">
                    <div style="min-width:0;">
                        <p class="verset-ref">${MS.echapperHTML(v.reference)}</p>
                        <p class="verset-texte">${MS.echapperHTML(v.texte)}</p>
                    </div>
                    <button type="button" class="btn-icone" style="width:32px;height:32px;" data-action="ajouter-verset" data-idx="${idx}" aria-label="Ajouter ce verset" data-testid="ajouter-verset-${idx}">
                        ${MS.icone("plus", "icone-petit")}
                    </button>
                </div>
            `).join("")}
        </div>
    `;
    zone.querySelectorAll("[data-action='ajouter-verset']").forEach(btn => {
        btn.addEventListener("click", () => {
            const v = versets[Number(btn.dataset.idx)];
            const ajout = `${v.reference} — ${v.texte}`;
            if (!_predicationCourante.verset_principal) {
                _predicationCourante.verset_principal = v.reference;
                document.getElementById("f-verset").value = v.reference;
            }
            const deja = _predicationCourante.notes || "";
            _predicationCourante.notes = deja + (deja ? "\n\n" : "") + ajout;
            document.getElementById("f-notes").value = _predicationCourante.notes;
            MS.afficherToast(`Verset ajouté : ${v.reference}`, "succes");
        });
    });
}

async function executerAssistantChamp(cle, action, bouton) {
    const texte = _predicationCourante[cle] || "";
    if (!texte.trim()) {
        MS.afficherToast("Écrivez du texte avant d'utiliser l'assistant.", "erreur");
        return;
    }
    const boutonsAssistant = document.querySelectorAll(".btn-assistant");
    boutonsAssistant.forEach(b => b.disabled = true);
    const original = bouton.innerHTML;
    bouton.innerHTML = `<span class="spin-petit"></span>`;
    try {
        const res = await MS.api.assistantIA(action, texte, _predicationCourante.titre);
        _predicationCourante[cle] = res;
        const id = cle === "verset_principal" ? "f-verset" : `f-${cle}`;
        const champ = document.getElementById(id);
        if (champ) champ.value = res;
        MS.afficherToast("Texte mis à jour par l'assistant.", "succes");
    } catch (err) {
        MS.afficherToast(err.message || "Assistant indisponible.", "erreur");
    } finally {
        boutonsAssistant.forEach(b => b.disabled = false);
        bouton.innerHTML = original;
    }
}

async function executerAssistantPoint(idx, action, bouton) {
    const point = _predicationCourante.points[idx];
    const texte = point?.explication || "";
    if (!texte.trim()) {
        MS.afficherToast("Écrivez du texte avant d'utiliser l'assistant.", "erreur");
        return;
    }
    const boutonsAssistant = document.querySelectorAll(".btn-assistant");
    boutonsAssistant.forEach(b => b.disabled = true);
    const original = bouton.innerHTML;
    bouton.innerHTML = `<span class="spin-petit"></span>`;
    try {
        const res = await MS.api.assistantIA(action, texte, _predicationCourante.titre);
        _predicationCourante.points[idx].explication = res;
        const textarea = document.querySelector(`[data-role='point-explication'][data-index='${idx}']`);
        if (textarea) textarea.value = res;
        MS.afficherToast("Point mis à jour par l'assistant.", "succes");
    } catch (err) {
        MS.afficherToast(err.message || "Assistant indisponible.", "erreur");
    } finally {
        boutonsAssistant.forEach(b => b.disabled = false);
        bouton.innerHTML = original;
    }
}

async function sauvegarder(enEdition, presenterApres) {
    if (_enregistrementEnCours) return;
    if (!_predicationCourante.titre.trim()) {
        MS.afficherToast("Le titre est obligatoire.", "erreur");
        return;
    }
    _enregistrementEnCours = true;
    const btn = document.getElementById("btn-sauvegarder");
    const original = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="spin-petit"></span> Enregistrement…`;

    try {
        const payload = {
            titre: _predicationCourante.titre,
            theme: _predicationCourante.theme || "",
            verset_principal: _predicationCourante.verset_principal || "",
            objectif: _predicationCourante.objectif || "",
            notes: _predicationCourante.notes || "",
            introduction: _predicationCourante.introduction || "",
            points: _predicationCourante.points || [],
            conclusion: _predicationCourante.conclusion || "",
        };
        let sauve;
        if (enEdition) {
            sauve = await MS.db.mettreAJourPredication(_predicationCourante.id, payload);
        } else {
            const utilisateur = await MS.auth.utilisateurCourant();
            sauve = await MS.db.creerPredication({ ...payload, utilisateur_id: utilisateur.id });
        }
        MS.afficherToast(enEdition ? "Prédication mise à jour !" : "Prédication enregistrée !", "succes");
        if (presenterApres) {
            window.location.hash = `#/mode-predication/${encodeURIComponent(sauve.id)}`;
        } else if (!enEdition) {
            window.location.hash = `#/predication/${encodeURIComponent(sauve.id)}`;
        } else {
            btn.disabled = false;
            btn.innerHTML = original;
        }
    } catch (err) {
        MS.afficherToast(err.message || "Échec de l'enregistrement.", "erreur");
        btn.disabled = false;
        btn.innerHTML = original;
    } finally {
        _enregistrementEnCours = false;
    }
}

window.MS = window.MS || {};
window.MS.pageCreerPredication = pageCreerPredication;
