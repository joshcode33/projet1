/* ============================================================================
   pages/mode-predication.js — Plein écran, grande typo, défilement auto
   ============================================================================ */

const TAILLE_MIN = 32;
const TAILLE_MAX = 112;
let _modeTaille = 56;
let _modeDefilement = false;
let _modeVitesse = 30;
let _modeAnim = null;
let _modeEcouteurClavier = null;

async function pageModePredication(id) {
    MS.masquerEnTete();
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

    dessinerMode(p);
}

function dessinerMode(p) {
    const contenu = document.getElementById("contenu");
    contenu.innerHTML = `
        <div class="mode-predication" data-testid="mode-predication">
            <div class="mode-barre-sup">
                <a href="#/predication/${encodeURIComponent(p.id)}" class="mode-bouton-quitter-haut" data-testid="bouton-quitter-mode">
                    ${MS.icone("fleche_gauche", "icone-petit")} Quitter le mode prédication
                </a>
                <div class="mode-aide-clavier">Espace = lecture/pause · + / − = taille · Échap = quitter</div>
            </div>

            <div id="mode-contenu" class="mode-contenu" data-testid="conteneur-texte-predication">
                <div class="mode-contenu-inner" id="mode-contenu-inner"></div>
            </div>

            <div class="mode-controles" data-testid="barre-controles-mode">
                <button type="button" class="mode-ctrl" data-ctrl="rembobiner" data-testid="ctrl-rembobiner" aria-label="Rembobiner">
                    ${MS.icone("rembobiner", "icone-petit")}
                </button>
                <button type="button" class="mode-ctrl mode-ctrl-accent" data-ctrl="lecture" data-testid="ctrl-lecture" aria-label="Lecture / Pause">
                    <span id="mode-icone-lecture">${MS.icone("lecture", "icone-petit")}</span>
                </button>
                <div class="mode-vitesse-slider">
                    <span>Vitesse</span>
                    <input type="range" min="10" max="80" step="5" value="${_modeVitesse}" data-ctrl="vitesse" data-testid="ctrl-vitesse" />
                </div>
                <div class="mode-separateur"></div>
                <button type="button" class="mode-ctrl" data-ctrl="taille-moins" data-testid="ctrl-taille-moins" aria-label="Diminuer">
                    ${MS.icone("moins", "icone-petit")}
                </button>
                <span class="mode-taille-info" id="mode-taille-info">${_modeTaille}px</span>
                <button type="button" class="mode-ctrl" data-ctrl="taille-plus" data-testid="ctrl-taille-plus" aria-label="Augmenter">
                    ${MS.icone("plus", "icone-petit")}
                </button>
                <div class="mode-separateur"></div>
                <a href="#/predication/${encodeURIComponent(p.id)}" class="mode-ctrl" data-testid="ctrl-quitter" aria-label="Quitter">
                    ${MS.icone("quitter", "icone-petit")}
                </a>
            </div>
        </div>
    `;

    dessinerContenuMode(p);
    attacherEvenementsMode(p);
}

function dessinerContenuMode(p) {
    const inner = document.getElementById("mode-contenu-inner");
    const taille = _modeTaille;
    inner.innerHTML = `
        ${p.theme ? `<p class="mode-theme" style="font-size:${Math.max(18, taille * 0.28)}px;">${MS.echapperHTML(p.theme)}</p>` : ""}
        <h1 class="mode-titre" style="font-size:${taille * 1.35}px;">${MS.echapperHTML(p.titre || "Prédication")}</h1>
        ${p.verset_principal ? `<p class="mode-verset" style="font-size:${taille * 0.7}px;">« ${MS.echapperHTML(p.verset_principal)} »</p>` : ""}
        ${p.introduction ? blocMode("Introduction", p.introduction, taille) : ""}
        ${(p.points || []).map((pt, i) => blocMode(`${i + 1}. ${pt.titre || ""}`, pt.explication || "", taille)).join("")}
        ${p.conclusion ? blocMode("Conclusion", p.conclusion, taille) : ""}
        <div class="mode-espace-bas"></div>
    `;
    document.getElementById("mode-taille-info").textContent = `${taille}px`;
}

function blocMode(titre, contenu, taille) {
    return `
        <section class="mode-bloc">
            <h2 class="mode-bloc-titre" style="font-size:${taille * 0.55}px;">${MS.echapperHTML(titre)}</h2>
            <p class="mode-bloc-contenu" style="font-size:${taille}px;line-height:1.35;">${MS.echapperHTML(contenu)}</p>
        </section>
    `;
}

function attacherEvenementsMode(p) {
    document.querySelector("[data-ctrl='rembobiner']").addEventListener("click", () => {
        document.getElementById("mode-contenu").scrollTop = 0;
    });
    document.querySelector("[data-ctrl='lecture']").addEventListener("click", () => {
        _modeDefilement = !_modeDefilement;
        mettreAJourIconeLecture();
        if (_modeDefilement) lancerDefilement(); else arreterDefilement();
    });
    document.querySelector("[data-ctrl='vitesse']").addEventListener("input", (e) => {
        _modeVitesse = Number(e.target.value);
    });
    document.querySelector("[data-ctrl='taille-moins']").addEventListener("click", () => {
        _modeTaille = Math.max(TAILLE_MIN, _modeTaille - 4);
        dessinerContenuMode(p);
    });
    document.querySelector("[data-ctrl='taille-plus']").addEventListener("click", () => {
        _modeTaille = Math.min(TAILLE_MAX, _modeTaille + 4);
        dessinerContenuMode(p);
    });

    // Raccourcis clavier
    if (_modeEcouteurClavier) window.removeEventListener("keydown", _modeEcouteurClavier);
    _modeEcouteurClavier = (e) => {
        if (e.key === "Escape") window.location.hash = `#/predication/${encodeURIComponent(p.id)}`;
        if (e.key === " ") {
            e.preventDefault();
            _modeDefilement = !_modeDefilement;
            mettreAJourIconeLecture();
            if (_modeDefilement) lancerDefilement(); else arreterDefilement();
        }
        if (e.key === "+" || e.key === "=") {
            _modeTaille = Math.min(TAILLE_MAX, _modeTaille + 4);
            dessinerContenuMode(p);
        }
        if (e.key === "-") {
            _modeTaille = Math.max(TAILLE_MIN, _modeTaille - 4);
            dessinerContenuMode(p);
        }
    };
    window.addEventListener("keydown", _modeEcouteurClavier);
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

// Nettoyage à la sortie du mode
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
