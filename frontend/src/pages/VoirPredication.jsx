// ============================================================================
// Visualisation d'une prédication — lecture / export / partage
// ============================================================================

import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { obtenirPredication } from "@/lib/supabase";
import {
  exporterPDF,
  exporterWord,
  partagerWhatsApp,
  partagerEmail,
  copierTexte,
} from "@/lib/export";
import EnTete from "@/composants/EnTete";
import {
  ArrowLeft,
  FileText,
  FileType2,
  MessageCircle,
  Mail,
  Play,
  Pencil,
  Copy,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function VoirPredication() {
  const { id } = useParams();
  const naviguer = useNavigate();
  const [predication, setPredication] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const donnees = await obtenirPredication(id);
        setPredication(donnees);
      } catch (err) {
        toast.error("Prédication introuvable.");
        naviguer("/tableau-de-bord", { replace: true });
      } finally {
        setChargement(false);
      }
    })();
  }, [id, naviguer]);

  const onCopier = async () => {
    try {
      await copierTexte(predication);
      toast.success("Prédication copiée dans le presse-papiers.");
    } catch {
      toast.error("Copie impossible.");
    }
  };

  if (chargement || !predication) {
    return (
      <div className="min-h-screen bg-background">
        <EnTete />
        <div className="mx-auto max-w-4xl px-5 py-16 text-center text-muted-foreground">
          <Loader2 className="mx-auto animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <EnTete />
      <main className="mx-auto max-w-3xl px-5 py-8 md:px-8 md:py-12">
        <Link
          to="/tableau-de-bord"
          data-testid="bouton-retour-tableau"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} /> Retour au tableau de bord
        </Link>

        <article className="mt-4" data-testid="contenu-predication">
          {predication.theme && (
            <p className="font-body text-sm uppercase tracking-[0.2em] text-accent">
              {predication.theme}
            </p>
          )}
          <h1 className="mt-2 font-heading text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            {predication.titre}
          </h1>
          {predication.verset_principal && (
            <p className="mt-4 font-heading text-xl italic text-muted-foreground">
              « {predication.verset_principal} »
            </p>
          )}
          {predication.objectif && (
            <p className="mt-3 text-sm text-muted-foreground">
              <strong className="font-medium">Objectif :</strong> {predication.objectif}
            </p>
          )}

          {/* Barre d'actions */}
          <div className="my-8 flex flex-wrap items-center gap-2 border-y border-border py-4">
            <Link
              to={`/mode-predication/${id}`}
              data-testid="action-presenter"
              className="bouton-ambre py-2 text-sm"
            >
              <Play size={14} /> Mode prédication
            </Link>
            <Link
              to={`/creer-predication/${id}`}
              data-testid="action-editer"
              className="bouton-secondaire py-2 text-sm"
            >
              <Pencil size={14} /> Modifier
            </Link>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <button onClick={() => exporterPDF(predication)} data-testid="action-pdf" className="bouton-secondaire py-2 text-sm">
                <FileText size={14} /> PDF
              </button>
              <button onClick={() => exporterWord(predication)} data-testid="action-word" className="bouton-secondaire py-2 text-sm">
                <FileType2 size={14} /> Word
              </button>
              <button onClick={() => partagerWhatsApp(predication)} data-testid="action-whatsapp" className="bouton-secondaire py-2 text-sm">
                <MessageCircle size={14} /> WhatsApp
              </button>
              <button onClick={() => partagerEmail(predication)} data-testid="action-email" className="bouton-secondaire py-2 text-sm">
                <Mail size={14} /> E-mail
              </button>
              <button onClick={onCopier} data-testid="action-copier" className="bouton-secondaire py-2 text-sm">
                <Copy size={14} /> Copier
              </button>
            </div>
          </div>

          {predication.introduction && (
            <Section titre="Introduction" contenu={predication.introduction} />
          )}

          {(predication.points || []).map((p, idx) => (
            <Section
              key={idx}
              titre={`${idx + 1}. ${p.titre || ""}`}
              contenu={p.explication || ""}
              testid={`section-point-${idx}`}
            />
          ))}

          {predication.conclusion && (
            <Section titre="Conclusion" contenu={predication.conclusion} />
          )}

          {predication.notes && (
            <div className="mt-12 rounded-md border border-dashed border-border bg-secondary/30 p-6">
              <h3 className="font-heading text-base font-semibold text-muted-foreground">
                Notes personnelles
              </h3>
              <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                {predication.notes}
              </p>
            </div>
          )}
        </article>
      </main>
    </div>
  );
}

function Section({ titre, contenu, testid }) {
  return (
    <section className="mt-10" data-testid={testid}>
      <h2 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
        {titre}
      </h2>
      <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-foreground/90">
        {contenu}
      </p>
    </section>
  );
}
