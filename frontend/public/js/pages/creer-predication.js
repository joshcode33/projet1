/* ============================================================================
   pages/creer-predication.js — Logique du formulaire de création / édition
   ============================================================================ */

let _predicationCourante = null;
let _enregistrementEnCours = false;
let _templateBoutonAssistant = "";
let _templatePointBloc = "";
let _templateVersetItem = "";

const ACTIONS_IA = [
    { cle: "reformuler", libelle: "Reformuler" },
    { cle: "corriger",   libelle: "Corriger" },
    { cle: "developper", libelle: "Développer" },
    { cle: "illustrer",  libelle: "Illustrer" },
];

async function pageCreerPredication(id = null) {
    await MS.rendreEnTete();
    const contenu = document.getElementById("contenu");

    // Mode édition : charger la prédication
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

    // Précharge des partiels réutilisés
    _templateBoutonAssistant = await MS.chargerHTML("/partiels/bouton-assistant.html");
    _templatePointBloc       = await MS.chargerHTML("/partiels/point-bloc.html");
    _templateVersetItem      = await MS.chargerHTML("/partiels/verset-item.html");

    // Charge la structure HTML de la page
    contenu.innerHTML = await MS.chargerHTML("/pages/creer-predication.html", {
        ICONE_RETOUR:       MS.icone("fleche_gauche", "icone-petit"),
        ICONE_ETINCELLE:    MS.icone("etincelle", "icone-petit"),
        ICONE_SIGNET:       MS.icone("signet", "icone-petit"),
        ICONE_PLUS_PETIT:   MS.icone("plus", "icone-petit"),
        ICONE_ENREGISTRER:  MS.icone("enregistrer", "icone-petit"),
    });

    remplirChamps(Boolean(id));
    attacherAssistants("introduction");
    attacherAssistants("conclusion");
    dessinerPoints();
    attacherEvenementsGeneraux(Boolean(id));
}

function remplirChamps(enEdition) {
    const p = _predicationCourante;
    document.getElementById("titre-page").textContent = enEdition ? "Modifier la prédication" : "Nouvelle prédication";
    document.getElementById("f-titre").value        = p.titre || "";
    document.getElementById("f-theme").value        = p.theme || "";
    document.getElementById("f-verset").value       = p.verset_principal || "";
    document.getElementById("f-objectif").value     = p.objectif || "";
    document.getElementById("f-notes").value        = p.notes || "";
    document.getElementById("f-introduction").value = p.introduction || "";
    document.getElementById("f-conclusion").value   = p.conclusion || "";

    // Bouton secondaire selon mode création/édition
    const zone = document.getElementById("zone-bouton-secondaire");
    if (enEdition) {
        zone.innerHTML = `
            <a href="#/mode-predication/${encodeURIComponent(p.id)}" class="btn btn-secondaire" data-testid="bouton-mode-predication">
                ${MS.icone("lecture", "icone-petit")} Mode prédication
            </a>
        `;
    } else {
        zone.innerHTML = `
            <button type="button" class="btn btn-secondaire" id="bouton-sauvegarder-presenter" data-testid="bouton-sauvegarder-et-presenter">
                ${MS.icone("lecture", "icone-petit")} Enregistrer & prêcher
            </button>
        `;
    }
}

function attacherAssistants(cle) {
    const zone = document.querySelector(`[data-role='assistants'][data-champ='${cle}']`);
    if (!zone) return;
    zone.innerHTML = ACTIONS_IA.map(a => remplirBoutonAssistant(a, cle, "assistant")).join("");
    zone.querySelectorAll("[data-action='assistant']").forEach(btn => {
        btn.addEventListener("click", () => executerAssistantChamp(btn.dataset.cle, btn.dataset.actionIa, btn));
    });
}

function remplirBoutonAssistant(action, cle, typeAction) {
    return _templateBoutonAssistant
        .split("{{ACTION_CLIC}}").join(typeAction)
        .split("{{CLE}}").join(cle)
        .split("{{ACTION_IA}}").join(action.cle)
        .split("{{LIBELLE}}").join(action.libelle)
        .split("{{ICONE_BAGUETTE}}").join(MS.icone("baguette", "icone-petit"));
}

function dessinerPoints() {
    const zone = document.getElementById("zone-points");
    const points = _predicationCourante.points || [];

    if (points.length === 0) {
        zone.innerHTML = `<p style="font-size:14px;color:var(--texte-secondaire);font-style:italic;">Les points apparaîtront ici après la génération, ou ajoutez-en manuellement.</p>`;
        return;
    }

    // Rendu des blocs de points à partir du template
    zone.innerHTML = points.map((_, idx) => remplirPoint(idx)).join("");

    // Remplissage des champs + boutons assistant par point
    points.forEach((pt, idx) => {
        document.querySelector(`[data-role='point-titre'][data-index='${idx}']`).value = pt.titre || "";
        document.querySelector(`[data-role='point-explication'][data-index='${idx}']`).value = pt.explication || "";
        const zoneAssist = document.querySelector(`[data-role='assistants-point'][data-index='${idx}']`);
        zoneAssist.innerHTML = ACTIONS_IA.map(a => remplirBoutonAssistant(a, `point-${idx}`, "assistant-point"))
            .join("")
            // Insère l'index dans l'attribut data-index des boutons de point
            .replace(/data-cle="point-\d+"/g, `data-cle="point-${idx}"`);
    });

    attacherEvenementsPoints();
}

function remplirPoint(idx) {
    return _templatePointBloc
        .split("{{INDEX}}").join(idx)
        .split("{{NUMERO}}").join(idx + 1)
        .split("{{ICONE_POUBELLE}}").join(MS.icone("poubelle", "icone-petit"));
}

function attacherEvenementsPoints() {
    document.querySelectorAll("[data-action='supprimer-point']").forEach(btn => {
        btn.addEventListener("click", () => {
            const idx = Number(btn.dataset.index);
            _predicationCourante.points.splice(idx, 1);
            dessinerPoints();
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
        btn.addEventListener("click", () => {
            const idx = Number(btn.closest("[data-role='assistants-point']").dataset.index);
            executerAssistantPoint(idx, btn.dataset.actionIa, btn);
        });
    });
}

function attacherEvenementsGeneraux(enEdition) {
    // Synchronisation champs → objet
    document.getElementById("f-titre").addEventListener("input", e => _predicationCourante.titre = e.target.value);
    document.getElementById("f-theme").addEventListener("input", e => _predicationCourante.theme = e.target.value);
    document.getElementById("f-verset").addEventListener("input", e => _predicationCourante.verset_principal = e.target.value);
    document.getElementById("f-objectif").addEventListener("input", e => _predicationCourante.objectif = e.target.value);
    document.getElementById("f-notes").addEventListener("input", e => _predicationCourante.notes = e.target.value);
    document.getElementById("f-introduction").addEventListener("input", e => _predicationCourante.introduction = e.target.value);
    document.getElementById("f-conclusion").addEventListener("input", e => _predicationCourante.conclusion = e.target.value);

    // Ajouter un point
    document.getElementById("bouton-ajouter-point").addEventListener("click", () => {
        _predicationCourante.points.push({ titre: "", explication: "" });
        dessinerPoints();
    });

    // Générer la prédication (appel IA)
    document.getElementById("bouton-generer").addEventListener("click", () => genererPredicationIA(enEdition));

    // Suggérer des versets
    document.getElementById("bouton-versets").addEventListener("click", suggererVersetsIA);

    // Sauvegarder
    document.getElementById("bouton-sauvegarder").addEventListener("click", () => sauvegarder(enEdition, false));
    const btnPresenter = document.getElementById("bouton-sauvegarder-presenter");
    if (btnPresenter) btnPresenter.addEventListener("click", () => sauvegarder(enEdition, true));
}

async function genererPredicationIA(enEdition) {
    if (!_predicationCourante.titre.trim()) {
        MS.afficherToast("Saisissez au moins un titre pour lancer la génération.", "erreur");
        return;
    }
    const btn = document.getElementById("bouton-generer");
    const original = btn.innerHTML;
    btn.disabled = true;
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
        document.getElementById("f-introduction").value = res.introduction;
        document.getElementById("f-conclusion").value = res.conclusion;
        dessinerPoints();
        MS.afficherToast("Prédication générée !", "succes");
    } catch (err) {
        MS.afficherToast(err.message || "Échec de la génération.", "erreur");
    } finally {
        btn.disabled = false;
        btn.innerHTML = original;
    }
}

async function suggererVersetsIA() {
    if (!_predicationCourante.theme.trim()) {
        MS.afficherToast("Indiquez un thème pour obtenir des suggestions.", "erreur");
        return;
    }
    const btn = document.getElementById("bouton-versets");
    const original = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="spin-petit"></span> Recherche…`;
    try {
        const versets = await MS.api.suggererVersets(_predicationCourante.theme, 6);
        dessinerVersets(versets);
    } catch (err) {
        MS.afficherToast(err.message || "Échec des suggestions.", "erreur");
    } finally {
        btn.disabled = false;
        btn.innerHTML = original;
    }
}

function dessinerVersets(versets) {
    const zone = document.getElementById("zone-versets");
    if (!versets || versets.length === 0) {
        zone.innerHTML = `<p style="margin-top:16px;color:var(--texte-secondaire);font-size:14px;">Aucun verset trouvé.</p>`;
        return;
    }
    const items = versets.map((v, idx) => _templateVersetItem
        .split("{{INDEX}}").join(idx)
        .split("{{REFERENCE}}").join(MS.echapperHTML(v.reference))
        .split("{{TEXTE}}").join(MS.echapperHTML(v.texte))
        .split("{{ICONE_PLUS_PETIT}}").join(MS.icone("plus", "icone-petit"))
    ).join("");

    zone.innerHTML = `
        <div class="liste-versets" data-testid="liste-versets-suggerees">
            <p class="liste-versets-titre">Versets suggérés — cliquez pour ajouter aux notes</p>
            ${items}
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
    const tousBtns = document.querySelectorAll(".btn-assistant");
    tousBtns.forEach(b => b.disabled = true);
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
        tousBtns.forEach(b => b.disabled = false);
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
    const tousBtns = document.querySelectorAll(".btn-assistant");
    tousBtns.forEach(b => b.disabled = true);
    const original = bouton.innerHTML;
    bouton.innerHTML = `<span class="spin-petit"></span>`;
    try {
        const res = await MS.api.assistantIA(action, texte, _predicationCourante.titre);
        _predicationCourante.points[idx].explication = res;
        document.querySelector(`[data-role='point-explication'][data-index='${idx}']`).value = res;
        MS.afficherToast("Point mis à jour par l'assistant.", "succes");
    } catch (err) {
        MS.afficherToast(err.message || "Assistant indisponible.", "erreur");
    } finally {
        tousBtns.forEach(b => b.disabled = false);
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
    const btn = document.getElementById("bouton-sauvegarder");
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
