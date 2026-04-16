// ============================================================================
// Exportation PDF (jsPDF) et Word (docx) + partage WhatsApp / Email
// ============================================================================

import jsPDF from "jspdf";
import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  TextRun,
} from "docx";
import { saveAs } from "file-saver";

function nettoyerNomFichier(nom) {
  return (nom || "predication")
    .replace(/[^a-zA-Z0-9À-ÿ_ -]/g, "")
    .trim()
    .slice(0, 60) || "predication";
}

function construireTexteComplet(predication) {
  const lignes = [];
  lignes.push(`${predication.titre || "Prédication"}`);
  if (predication.theme) lignes.push(`Thème : ${predication.theme}`);
  if (predication.verset_principal)
    lignes.push(`Verset principal : ${predication.verset_principal}`);
  if (predication.objectif) lignes.push(`Objectif : ${predication.objectif}`);
  lignes.push("");
  if (predication.introduction) {
    lignes.push("INTRODUCTION");
    lignes.push(predication.introduction);
    lignes.push("");
  }
  (predication.points || []).forEach((p, i) => {
    lignes.push(`${i + 1}. ${p.titre || ""}`);
    lignes.push(p.explication || "");
    lignes.push("");
  });
  if (predication.conclusion) {
    lignes.push("CONCLUSION");
    lignes.push(predication.conclusion);
  }
  return lignes.join("\n");
}

// ----------------------------------------------------------------- PDF
export function exporterPDF(predication) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const largeur = doc.internal.pageSize.getWidth();
  const hauteur = doc.internal.pageSize.getHeight();
  const margeX = 56;
  const margeY = 64;
  let y = margeY;

  const ajouterLigneSaut = () => {
    if (y > hauteur - margeY) {
      doc.addPage();
      y = margeY;
    }
  };

  const ecrireTitre = (texte, taille = 22) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(taille);
    const lignes = doc.splitTextToSize(texte, largeur - margeX * 2);
    lignes.forEach((l) => {
      ajouterLigneSaut();
      doc.text(l, margeX, y);
      y += taille * 1.2;
    });
  };

  const ecrireParagraphe = (texte, taille = 12) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(taille);
    const lignes = doc.splitTextToSize(texte || "", largeur - margeX * 2);
    lignes.forEach((l) => {
      ajouterLigneSaut();
      doc.text(l, margeX, y);
      y += taille * 1.45;
    });
    y += 6;
  };

  ecrireTitre(predication.titre || "Prédication", 24);
  y += 6;
  if (predication.theme) ecrireParagraphe(`Thème : ${predication.theme}`, 11);
  if (predication.verset_principal)
    ecrireParagraphe(`Verset principal : ${predication.verset_principal}`, 11);
  if (predication.objectif) ecrireParagraphe(`Objectif : ${predication.objectif}`, 11);
  y += 8;

  if (predication.introduction) {
    ecrireTitre("Introduction", 16);
    ecrireParagraphe(predication.introduction);
  }

  (predication.points || []).forEach((p, i) => {
    ecrireTitre(`${i + 1}. ${p.titre || ""}`, 15);
    ecrireParagraphe(p.explication || "");
  });

  if (predication.conclusion) {
    ecrireTitre("Conclusion", 16);
    ecrireParagraphe(predication.conclusion);
  }

  doc.save(`${nettoyerNomFichier(predication.titre)}.pdf`);
}

// ----------------------------------------------------------------- Word
export async function exporterWord(predication) {
  const enfants = [];
  enfants.push(
    new Paragraph({
      heading: HeadingLevel.TITLE,
      children: [new TextRun(predication.titre || "Prédication")],
    })
  );
  if (predication.theme)
    enfants.push(new Paragraph({ children: [new TextRun({ text: `Thème : ${predication.theme}`, italics: true })] }));
  if (predication.verset_principal)
    enfants.push(new Paragraph({ children: [new TextRun({ text: `Verset principal : ${predication.verset_principal}`, italics: true })] }));
  if (predication.objectif)
    enfants.push(new Paragraph({ children: [new TextRun({ text: `Objectif : ${predication.objectif}`, italics: true })] }));
  enfants.push(new Paragraph({ text: "" }));

  if (predication.introduction) {
    enfants.push(new Paragraph({ heading: HeadingLevel.HEADING_1, text: "Introduction" }));
    enfants.push(new Paragraph({ text: predication.introduction }));
  }

  (predication.points || []).forEach((p, i) => {
    enfants.push(
      new Paragraph({ heading: HeadingLevel.HEADING_1, text: `${i + 1}. ${p.titre || ""}` })
    );
    enfants.push(new Paragraph({ text: p.explication || "" }));
  });

  if (predication.conclusion) {
    enfants.push(new Paragraph({ heading: HeadingLevel.HEADING_1, text: "Conclusion" }));
    enfants.push(new Paragraph({ text: predication.conclusion }));
  }

  const doc = new Document({ sections: [{ children: enfants }] });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${nettoyerNomFichier(predication.titre)}.docx`);
}

// ------------------------------------------------------------- Partage
export function partagerWhatsApp(predication) {
  const texte = construireTexteComplet(predication);
  const url = `https://wa.me/?text=${encodeURIComponent(texte)}`;
  window.open(url, "_blank", "noopener");
}

export function partagerEmail(predication) {
  const sujet = `Prédication : ${predication.titre || ""}`;
  const corps = construireTexteComplet(predication);
  window.location.href = `mailto:?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;
}

export function copierTexte(predication) {
  return navigator.clipboard.writeText(construireTexteComplet(predication));
}
