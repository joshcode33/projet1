/* ============================================================================
   server.js — Serveur statique Node.js pour MySermon AI
   ----------------------------------------------------------------------------
   Aucune dépendance externe (uniquement les modules natifs de Node).
   Sert le dossier public/ sur le port 3000.
   ============================================================================ */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";
const DOSSIER_PUBLIC = path.join(__dirname, "public");

// Types MIME supportés
const TYPES_MIME = {
    ".html": "text/html; charset=utf-8",
    ".css":  "text/css; charset=utf-8",
    ".js":   "application/javascript; charset=utf-8",
    ".mjs":  "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg":  "image/svg+xml",
    ".png":  "image/png",
    ".jpg":  "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".ico":  "image/x-icon",
    ".woff": "font/woff",
    ".woff2":"font/woff2",
    ".ttf":  "font/ttf",
    ".txt":  "text/plain; charset=utf-8",
};

function envoyerFichier(res, cheminFichier) {
    fs.readFile(cheminFichier, (erreur, contenu) => {
        if (erreur) {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("404 — Fichier introuvable");
            return;
        }
        const extension = path.extname(cheminFichier).toLowerCase();
        const typeMime = TYPES_MIME[extension] || "application/octet-stream";
        res.writeHead(200, { "Content-Type": typeMime });
        res.end(contenu);
    });
}

const serveur = http.createServer((req, res) => {
    // Extrait le chemin de l'URL (sans la chaîne de requête ni le hash)
    let url;
    try { url = decodeURIComponent((req.url || "/").split("?")[0].split("#")[0]); }
    catch { url = "/"; }

    // Redirige la racine vers index.html
    if (url === "/" || url === "") url = "/index.html";

    // Construction du chemin complet du fichier demandé
    const cheminComplet = path.join(DOSSIER_PUBLIC, url);

    // Sécurité : empêche l'accès en dehors du dossier public
    if (!cheminComplet.startsWith(DOSSIER_PUBLIC)) {
        res.writeHead(403, { "Content-Type": "text/plain" });
        res.end("403 — Accès refusé");
        return;
    }

    // Vérifie l'existence du fichier
    fs.stat(cheminComplet, (erreur, stats) => {
        if (erreur || !stats.isFile()) {
            // Toutes les routes inconnues renvoient index.html (pour le routeur SPA)
            envoyerFichier(res, path.join(DOSSIER_PUBLIC, "index.html"));
            return;
        }
        envoyerFichier(res, cheminComplet);
    });
});

serveur.listen(PORT, HOST, () => {
    console.log(`✨ MySermon AI — Serveur statique prêt sur http://${HOST}:${PORT}`);
});
