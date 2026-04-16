// ============================================================================
// Page de connexion — Email + mot de passe via Supabase Auth
// ============================================================================

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contextes/ContexteAuth";
import { useTheme } from "@/contextes/ContexteTheme";
import { toast } from "sonner";
import { BookOpenText, Moon, Sun, Loader2 } from "lucide-react";

export default function Connexion() {
  const { seConnecter } = useAuth();
  const { theme, basculer } = useTheme();
  const naviguer = useNavigate();
  const emplacement = useLocation();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [enCours, setEnCours] = useState(false);

  const retour = emplacement.state?.retour || "/tableau-de-bord";

  const soumettre = async (e) => {
    e.preventDefault();
    setEnCours(true);
    try {
      await seConnecter(email, motDePasse);
      toast.success("Bienvenue !");
      naviguer(retour, { replace: true });
    } catch (err) {
      toast.error(err.message || "Identifiants invalides.");
    } finally {
      setEnCours(false);
    }
  };

  return (
    <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
      {/* Colonne image (cachée en mobile) */}
      <div
        className="relative hidden lg:block grain-subtil"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1760442903566-99f3eae250ad?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHwxfHxzdWJ0bGUlMjBhYnN0cmFjdCUyMHdhcm0lMjB0ZXh0dXJlJTIwbmV1dHJhbHxlbnwwfHx8fDE3NzYzNzUwMDJ8MA&ixlib=rb-4.1.0&q=85")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-mysermon-nuit/60 via-mysermon-nuit/20 to-transparent" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-white/15 backdrop-blur">
              <BookOpenText size={20} />
            </span>
            <span className="font-heading text-xl font-semibold">
              MySermon <span className="text-mysermon-ambre-clair">AI</span>
            </span>
          </div>
          <div className="max-w-md">
            <h1 className="font-heading text-4xl font-semibold leading-tight lg:text-5xl">
              Préparez des prédications qui touchent les cœurs — en quelques minutes.
            </h1>
            <p className="mt-5 text-base text-white/85">
              Un assistant pastoral discret, fidèle à l'Écriture, conçu pour les
              serviteurs qui n'ont jamais assez de temps.
            </p>
          </div>
        </div>
      </div>

      {/* Colonne formulaire */}
      <div className="relative flex items-center justify-center px-6 py-12 md:px-12">
        <button
          onClick={basculer}
          data-testid="bouton-basculer-theme-auth"
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card transition-all hover:bg-secondary"
          aria-label="Basculer le thème"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="w-full max-w-md apparaitre">
          <div className="mb-8 lg:hidden flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <BookOpenText size={18} />
            </span>
            <span className="font-heading text-lg font-semibold">
              MySermon <span className="text-accent">AI</span>
            </span>
          </div>

          <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Bon retour, pasteur.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Connectez-vous pour retrouver vos prédications.
          </p>

          <form onSubmit={soumettre} className="mt-8 space-y-4" data-testid="formulaire-connexion">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Adresse e-mail
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                data-testid="champ-email-connexion"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="champ-texte"
                placeholder="vous@votre-eglise.fr"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="mdp" className="text-sm font-medium">
                Mot de passe
              </label>
              <input
                id="mdp"
                type="password"
                required
                autoComplete="current-password"
                data-testid="champ-motdepasse-connexion"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                className="champ-texte"
                placeholder="Votre mot de passe"
              />
            </div>

            <button
              type="submit"
              disabled={enCours}
              data-testid="bouton-soumettre-connexion"
              className="bouton-principal w-full mt-2"
            >
              {enCours ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Connexion…
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link
              to="/inscription"
              data-testid="lien-inscription"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
