// ============================================================================
// Carte d'aperçu d'une prédication dans le tableau de bord
// ============================================================================

import { Link } from "react-router-dom";
import { FileText, Calendar, Trash2, Play } from "lucide-react";

function formaterDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default function CartePredication({ predication, onSupprimer }) {
  const { id, titre, theme, verset_principal, created_at } = predication;
  const resume = predication.introduction?.slice(0, 120) || predication.notes?.slice(0, 120) || "";

  return (
    <article
      data-testid={`carte-predication-${id}`}
      className="carte-surface group relative flex flex-col gap-3 hover:border-primary/40 hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar size={12} />
          {formaterDate(created_at)}
        </div>
        {theme && (
          <span className="inline-flex items-center rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-foreground">
            {theme}
          </span>
        )}
      </div>

      <Link
        to={`/predication/${id}`}
        data-testid={`lien-predication-${id}`}
        className="block"
      >
        <h3 className="font-heading text-xl font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
          {titre || "Sans titre"}
        </h3>
        {verset_principal && (
          <p className="mt-1 text-sm italic text-accent">{verset_principal}</p>
        )}
        {resume && (
          <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
            {resume}
            {resume.length >= 120 ? "…" : ""}
          </p>
        )}
      </Link>

      <div className="mt-auto flex items-center justify-between pt-3">
        <div className="flex gap-2">
          <Link
            to={`/predication/${id}`}
            data-testid={`action-editer-${id}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:text-primary"
          >
            <FileText size={14} /> Modifier
          </Link>
          <Link
            to={`/mode-predication/${id}`}
            data-testid={`action-presenter-${id}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent/80"
          >
            <Play size={14} /> Prêcher
          </Link>
        </div>
        <button
          type="button"
          data-testid={`action-supprimer-${id}`}
          onClick={() => onSupprimer?.(id)}
          aria-label="Supprimer la prédication"
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </article>
  );
}
