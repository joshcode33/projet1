// ============================================================================
// En-tête global — logo + navigation + bascule thème + bouton déconnexion
// ============================================================================

import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun, LogOut, Plus, BookOpenText } from "lucide-react";
import { useAuth } from "@/contextes/ContexteAuth";
import { useTheme } from "@/contextes/ContexteTheme";
import { toast } from "sonner";

export default function EnTete() {
  const { utilisateur, seDeconnecter } = useAuth();
  const { theme, basculer } = useTheme();
  const naviguer = useNavigate();

  const deconnexion = async () => {
    try {
      await seDeconnecter();
      toast.success("Vous êtes déconnecté. À bientôt !");
      naviguer("/connexion");
    } catch (err) {
      toast.error("Échec de la déconnexion : " + err.message);
    }
  };

  return (
    <header
      data-testid="en-tete-global"
      className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link
          to={utilisateur ? "/tableau-de-bord" : "/"}
          data-testid="lien-logo"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <BookOpenText size={18} strokeWidth={2.2} />
          </span>
          <span className="font-heading text-lg font-semibold tracking-tight">
            MySermon <span className="text-accent">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {utilisateur && (
            <Link
              to="/creer-predication"
              data-testid="bouton-nouvelle-predication"
              className="hidden sm:inline-flex bouton-ambre"
            >
              <Plus size={16} />
              <span>Nouvelle prédication</span>
            </Link>
          )}

          <button
            type="button"
            onClick={basculer}
            data-testid="bouton-basculer-theme"
            aria-label="Basculer le thème"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-foreground transition-all hover:bg-secondary"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {utilisateur && (
            <button
              type="button"
              onClick={deconnexion}
              data-testid="bouton-deconnexion"
              aria-label="Se déconnecter"
              className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-foreground transition-all hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
