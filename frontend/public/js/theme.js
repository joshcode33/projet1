/* ============================================================================
   theme.js — Gestion du mode sombre / clair (persisté dans localStorage)
   ============================================================================ */

const CLE_THEME = "mysermon-theme";

function themeActuel() {
    const enregistre = localStorage.getItem(CLE_THEME);
    if (enregistre === "sombre" || enregistre === "clair") return enregistre;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "sombre" : "clair";
}

function appliquerTheme(theme) {
    document.body.classList.toggle("theme-sombre", theme === "sombre");
    localStorage.setItem(CLE_THEME, theme);
    // Met à jour toutes les icônes bascule présentes sur la page
    document.querySelectorAll("[data-role='icone-theme']").forEach((el) => {
        el.innerHTML = theme === "sombre" ? MS.icone("soleil") : MS.icone("lune");
    });
}

function basculerTheme() {
    const prochain = themeActuel() === "sombre" ? "clair" : "sombre";
    appliquerTheme(prochain);
}

// Initialisation au chargement
appliquerTheme(themeActuel());

window.MS = window.MS || {};
Object.assign(window.MS, { themeActuel, basculerTheme, appliquerTheme });
