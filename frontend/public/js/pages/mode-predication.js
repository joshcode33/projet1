/* ============================================================================
   pages/mode-predication.js — Mode plein écran pour prêcher
   ============================================================================ */

const TAILLE_MIN = 32;
const TAILLE_MAX = 112;

let _modeTaille = 56;
let _modeDefilement = false;
let _modeVitesse = 30;
let _modeAnim = null;
let _modeEcouteurClavier = null;
let _modePrediction = null;
let _templateBloc = "";

async function pageModePredication(id) {
    MS.masquerEnTete();
    const contenu = document.getElementById("contenu");
    MS.afficherChargement(contenu);

    // 1. Charger la prédication
    try {
        _modePrediction = await MS.db.obtenirPredication(id);
    } catch {
        MS.afficherToast("Prédication introuvable.", "erreur");
        window.location.hash = "#/tableau-de-bord";
        return;
    }

    // 2. Précharger le template d'un bloc
    _templateBloc = await MS.chargerHTML("/partiels/mode-bloc.html");

    // 3. Injecter la structure HTML de la page
    contenu.innerHTML = await MS.chargerHTML("/pages/mode-predication.html", {
        ICONE_RETOUR:     MS.icone("fleche_gauche", "icone-petit"),
        ICONE_REMBOBINER: MS.icone("rembobiner", "icone-petit"),
        ICONE_LECTURE:    MS.icone("lecture", "icone-petit"),
        ICONE_MOINS:      MS.icone("moins", "icone-petit"),
        ICONE_PLUS_PETIT: MS.icone("plus", "icone-petit"),
        ICONE_QUITTER:    MS.icone("quitter", "icone-petit"),
    });

    // 4. Liens de sortie
    const url = `#/predication/${encodeURIComponent(id)}`;
    document.getElementById("mode-bouton-quitter").href = url;
    document.getElementById("mode-bouton-sortie").href = url;

    dessinerContenuMode();
    attacherEvenementsMode(id);
}

function dessinerContenuMode() {
    const inner = document.getElementById("mode-contenu-inner");
    const p = _modePrediction;
    const taille = _modeTaille;

    const blocs = [];
    if (p.introduction) blocs.push(remplirBloc("Introduction", p.introduction, taille));
    (p.points || []).forEach((pt, i) => {
        blocs.push(remplirBloc(`${i + 1}. ${pt.titre || ""}`, pt.explication || "", taille));
    });
    if (p.conclusion) blocs.push(remplirBloc("Conclusion", p.conclusion, taille));

    inner.innerHTML = `
        ${p.theme ? `<p class="mode-theme" style="font-size:${Math.max(18, taille * 0.28)}px;">${MS.echapperHTML(p.theme)}</p>` : ""}
        <h1 class="mode-titre" style="font-size:${taille * 1.35}px;">${MS.echapperHTML(p.titre || "Prédication")}</h1>
        ${p.verset_principal ? `<p class="mode-verset" style="font-size:${taille * 0.7}px;">« ${MS.echapperHTML(p.verset_principal)} »</p>` : ""}
        ${blocs.join("")}
        <div class="mode-espace-bas"></div>
    `;
    document.getElementById("mode-taille-info").textContent = `${taille}px`;
}

function remplirBloc(titre, contenu, taille) {
    return _templateBloc
        .split("{{TITRE}}").join(MS.echapperHTML(titre))
        .split("{{CONTENU}}").join(MS.echapperHTML(contenu))
        .split("{{TAILLE}}").join(taille)
        .split("{{TAILLE_TITRE}}").join(taille * 0.55);
}

function attacherEvenementsMode(id) {
    document.querySelector("[data-ctrl='rembobiner']").addEventListener("click", () => {
        document.getElementById("mode-contenu").scrollTop = 0;
    });
    document.querySelector("[data-ctrl='lecture']").addEventListener("click", basculerLecture);
    document.querySelector("[data-ctrl='vitesse']").addEventListener("input", (e) => {
        _modeVitesse = Number(e.target.value);
    });
    document.querySelector("[data-ctrl='taille-moins']").addEventListener("click", () => {
        _modeTaille = Math.max(TAILLE_MIN, _modeTaille - 4);
        dessinerContenuMode();
    });
    document.querySelector("[data-ctrl='taille-plus']").addEventListener("click", () => {
        _modeTaille = Math.min(TAILLE_MAX, _modeTaille + 4);
        dessinerContenuMode();
    });

    // Raccourcis clavier
    if (_modeEcouteurClavier) window.removeEventListener("keydown", _modeEcouteurClavier);
    _modeEcouteurClavier = (e) => {
        if (e.key === "Escape") window.location.hash = `#/predication/${encodeURIComponent(id)}`;
        if (e.key === " ") { e.preventDefault(); basculerLecture(); }
        if (e.key === "+" || e.key === "=") {
            _modeTaille = Math.min(TAILLE_MAX, _modeTaille + 4);
            dessinerContenuMode();
        }
        if (e.key === "-") {
            _modeTaille = Math.max(TAILLE_MIN, _modeTaille - 4);
            dessinerContenuMode();
        }
    };
    window.addEventListener("keydown", _modeEcouteurClavier);
}

function basculerLecture() {
    _modeDefilement = !_modeDefilement;
    mettreAJourIconeLecture();
    if (_modeDefilement) lancerDefilement();
    else arreterDefilement();
}

function mettreAJourIconeLecture() {
    const el = document.getElementById("mode-icone-lecture");
    if (!el) return;
    el.innerHTML = _modeDefilement ? MS.icone("pause", "icone-petit") : MS.icone("lecture", "icone-petit");
}

function lancerDefilement() {
    const conteneur = document.getElementById("mode-contenu");
    if (!conteneur) return;
    let dernier = performance.now();
    const pas = (maintenant) => {
        if (!_modeDefilement) return;
        const delta = (maintenant - dernier) / 1000;
        dernier = maintenant;
        conteneur.scrollTop += _modeVitesse * delta;
        const max = conteneur.scrollHeight - conteneur.clientHeight;
        if (conteneur.scrollTop >= max - 1) {
            _modeDefilement = false;
            mettreAJourIconeLecture();
            return;
        }
        _modeAnim = requestAnimationFrame(pas);
    };
    _modeAnim = requestAnimationFrame(pas);
}

function arreterDefilement() {
    if (_modeAnim) cancelAnimationFrame(_modeAnim);
    _modeAnim = null;
}

function nettoyerMode() {
    arreterDefilement();
    _modeDefilement = false;
    if (_modeEcouteurClavier) {
        window.removeEventListener("keydown", _modeEcouteurClavier);
        _modeEcouteurClavier = null;
    }
}

window.MS = window.MS || {};
window.MS.pageModePredication = pageModePredication;
window.MS.nettoyerMode = nettoyerMode;
