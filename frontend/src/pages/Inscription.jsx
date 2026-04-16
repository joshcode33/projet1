// ============================================================================
// Page d'inscription — création de compte via Supabase Auth
// ============================================================================

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contextes/ContexteAuth";
import { useTheme } from "@/contextes/ContexteTheme";
import { toast } from "sonner";
import { BookOpenText, Moon, Sun, Loader2, CheckCircle2 } from "lucide-react";

export default function Inscription() {
  const { sInscrire } = useAuth();
  const { theme, basculer } = useTheme();
  const naviguer = useNavigate();
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [emailConfirmation, setEmailConfirmation] = useState(false);

  const soumettre = async (e) => {
    e.preventDefault();
    if (motDePasse.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    setEnCours(true);
    try {
      const resultat = await sInscrire(email, motDePasse, nom);
      // Si Supabase a créé directement une session, on redirige
      if (resultat.session) {
        toast.success("Compte créé ! Bienvenue parmi nous.");
        naviguer("/tableau-de-bord", { replace: true });
      } else {
        // Confirmation par e-mail nécessaire
        setEmailConfirmation(true);
        toast.info("Un e-mail de confirmation vous a été envoyé.");
      }
    } catch (err) {
      toast.error(err.message || "Création du compte impossible.");
    } finally {
      setEnCours(false);
    }
  };

  if (emailConfirmation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="max-w-md text-center apparaitre">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="font-heading text-3xl font-semibold">Vérifiez votre boîte mail</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Nous avons envoyé un lien de confirmation à <strong>{email}</strong>.
            Cliquez dessus pour activer votre compte, puis connectez-vous.
          </p>
          <Link
            to="/connexion"
            data-testid="lien-retour-connexion"
            className="bouton-principal mt-8 inline-flex"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-[1fr_1.1fr]">
      <div className="relative flex items-center justify-center px-6 py-12 md:px-12 order-2 lg:order-1">
        <button
          onClick={basculer}
          data-testid="bouton-basculer-theme-auth"
          className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card transition-all hover:bg-secondary"
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
            Créez votre compte
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Commencez à préparer vos prédications avec l'aide de l'IA.
          </p>

          <form onSubmit={soumettre} className="mt-8 space-y-4" data-testid="formulaire-inscription">
            <div className="space-y-1.5">
              <label htmlFor="nom" className="text-sm font-medium">Nom complet</label>
              <input
                id="nom"
                type="text"
                autoComplete="name"
                data-testid="champ-nom-inscription"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="champ-texte"
                placeholder="Pasteur Jean Dupont"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium">Adresse e-mail</label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                data-testid="champ-email-inscription"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="champ-texte"
                placeholder="vous@votre-eglise.fr"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="mdp" className="text-sm font-medium">Mot de passe</label>
              <input
                id="mdp"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                data-testid="champ-motdepasse-inscription"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                className="champ-texte"
                placeholder="Au moins 6 caractères"
              />
            </div>

            <button
              type="submit"
              disabled={enCours}
              data-testid="bouton-soumettre-inscription"
              className="bouton-principal w-full mt-2"
            >
              {enCours ? (
                <><Loader2 size={16} className="animate-spin" /> Création…</>
              ) : (
                "Créer mon compte"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Déjà un compte ?{" "}
            <Link
              to="/connexion"
              data-testid="lien-connexion"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>

      {/* Image à droite */}
      <div
        className="relative hidden lg:block grain-subtil order-1 lg:order-2"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1765371512707-9e0e96fd9e5b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODF8MHwxfHNlYXJjaHwzfHxtaW5pbWFsaXN0JTIwY2FsbSUyMHdvcmtzcGFjZSUyMHdhcm0lMjBsaWdodGluZ3xlbnwwfHx8fDE3NzYzNzUwMDF8MA&ixlib=rb-4.1.0&q=85")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-bl from-mysermon-nuit/50 via-transparent to-mysermon-nuit/30" />
      </div>
    </div>
  );
}
