/* ============================================================================
   export.js — Exportation PDF / Word + Partage WhatsApp / Email
   ============================================================================ */

function nettoyerNomFichier(nom) {
    return (nom || "predication")
        .replace(/[^a-zA-Z0-9À-ÿ_ -]/g, "")
        .trim()
        .slice(0, 60) || "predication";
}

function construireTexteBrut(p) {
    const lignes = [];
    lignes.push(p.titre || "Prédication");
    if (p.theme) lignes.push(`Thème : ${p.theme}`);
    if (p.verset_principal) lignes.push(`Verset principal : ${p.verset_principal}`);
    if (p.objectif) lignes.push(`Objectif : ${p.objectif}`);
    lignes.push("");
    if (p.introduction) { lignes.push("INTRODUCTION"); lignes.push(p.introduction); lignes.push(""); }
    (p.points || []).forEach((pt, i) => {
        lignes.push(`${i + 1}. ${pt.titre || ""}`);
        lignes.push(pt.explication || "");
        lignes.push("");
    });
    if (p.conclusion) { lignes.push("CONCLUSION"); lignes.push(p.conclusion); }
    return lignes.join("\n");
}

/* -------------------------- PDF (jsPDF) -------------------------- */

function exporterPDF(p) {
    // jsPDF est exposé via window.jspdf.jsPDF (UMD)
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const largeur = doc.internal.pageSize.getWidth();
    const hauteur = doc.internal.pageSize.getHeight();
    const margeX = 56;
    const margeY = 64;
    let y = margeY;

    const sautSiNecessaire = () => {
        if (y > hauteur - margeY) { doc.addPage(); y = margeY; }
    };
    const ecrireTitre = (texte, taille = 22) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(taille);
        const lignes = doc.splitTextToSize(texte, largeur - margeX * 2);
        lignes.forEach((l) => { sautSiNecessaire(); doc.text(l, margeX, y); y += taille * 1.2; });
    };
    const ecrireParagraphe = (texte, taille = 12) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(taille);
        const lignes = doc.splitTextToSize(texte || "", largeur - margeX * 2);
        lignes.forEach((l) => { sautSiNecessaire(); doc.text(l, margeX, y); y += taille * 1.45; });
        y += 6;
    };

    ecrireTitre(p.titre || "Prédication", 24);
    y += 6;
    if (p.theme) ecrireParagraphe(`Thème : ${p.theme}`, 11);
    if (p.verset_principal) ecrireParagraphe(`Verset principal : ${p.verset_principal}`, 11);
    if (p.objectif) ecrireParagraphe(`Objectif : ${p.objectif}`, 11);
    y += 8;
    if (p.introduction) { ecrireTitre("Introduction", 16); ecrireParagraphe(p.introduction); }
    (p.points || []).forEach((pt, i) => {
        ecrireTitre(`${i + 1}. ${pt.titre || ""}`, 15);
        ecrireParagraphe(pt.explication || "");
    });
    if (p.conclusion) { ecrireTitre("Conclusion", 16); ecrireParagraphe(p.conclusion); }

    doc.save(`${nettoyerNomFichier(p.titre)}.pdf`);
}

/* -------------------------- Word (docx) --------------------------- */

async function exporterWord(p) {
    const { Document, Packer, Paragraph, HeadingLevel, TextRun } = window.docx;
    const enfants = [];

    enfants.push(new Paragraph({
        heading: HeadingLevel.TITLE,
        children: [new TextRun(p.titre || "Prédication")],
    }));
    if (p.theme) enfants.push(new Paragraph({ children: [new TextRun({ text: `Thème : ${p.theme}`, italics: true })] }));
    if (p.verset_principal) enfants.push(new Paragraph({ children: [new TextRun({ text: `Verset principal : ${p.verset_principal}`, italics: true })] }));
    if (p.objectif) enfants.push(new Paragraph({ children: [new TextRun({ text: `Objectif : ${p.objectif}`, italics: true })] }));
    enfants.push(new Paragraph({ text: "" }));

    if (p.introduction) {
        enfants.push(new Paragraph({ heading: HeadingLevel.HEADING_1, text: "Introduction" }));
        enfants.push(new Paragraph({ text: p.introduction }));
    }
    (p.points || []).forEach((pt, i) => {
        enfants.push(new Paragraph({ heading: HeadingLevel.HEADING_1, text: `${i + 1}. ${pt.titre || ""}` }));
        enfants.push(new Paragraph({ text: pt.explication || "" }));
    });
    if (p.conclusion) {
        enfants.push(new Paragraph({ heading: HeadingLevel.HEADING_1, text: "Conclusion" }));
        enfants.push(new Paragraph({ text: p.conclusion }));
    }

    const doc = new Document({ sections: [{ children: enfants }] });
    const blob = await Packer.toBlob(doc);
    window.saveAs(blob, `${nettoyerNomFichier(p.titre)}.docx`);
}

/* -------------------------- Partage ------------------------------ */

function partagerWhatsApp(p) {
    const url = `https://wa.me/?text=${encodeURIComponent(construireTexteBrut(p))}`;
    window.open(url, "_blank", "noopener");
}

function partagerEmail(p) {
    const sujet = `Prédication : ${p.titre || ""}`;
    const corps = construireTexteBrut(p);
    window.location.href = `mailto:?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;
}

async function copierTexte(p) {
    await navigator.clipboard.writeText(construireTexteBrut(p));
}

window.MS = window.MS || {};
window.MS.export = {
    exporterPDF, exporterWord, partagerWhatsApp, partagerEmail, copierTexte,
};
