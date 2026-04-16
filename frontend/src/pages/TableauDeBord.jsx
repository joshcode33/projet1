// ============================================================================
// Tableau de bord — liste des prédications + filtres + recherche
// ============================================================================

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contextes/ContexteAuth";
import { listerPredications, supprimerPredication } from "@/lib/supabase";
import EnTete from "@/composants/EnTete";
import CartePredication from "@/composants/CartePredication";
import { Search, Filter, Plus, FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function TableauDeBord() {
  const { utilisateur } = useAuth();
  const [predications, setPredications] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [recherche, setRecherche] = useState("");
  const [themeActif, setThemeActif] = useState("tous");
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    if (!utilisateur) return;
    let actif = true;
    (async () => {
      try {
        setChargement(true);
        const donnees = await listerPredications(utilisateur.id);
        if (actif) setPredications(donnees);
      } catch (err) {
        if (actif) setErreur(err.message || "Impossible de charger vos prédications.");
      } finally {
        if (actif) setChargement(false);
      }
    })();
    return () => { actif = false; };
  }, [utilisateur]);

  const themesDisponibles = useMemo(() => {
    const unique = new Set(
      predications.map((p) => (p.theme || "").trim()).filter(Boolean)
    );
    return Array.from(unique);
  }, [predications]);

  const resultats = useMemo(() => {
    return predications.filter((p) => {
      const match = recherche
        ? (p.titre || "").toLowerCase().includes(recherche.toLowerCase()) ||
          (p.theme || "").toLowerCase().includes(recherche.toLowerCase()) ||
          (p.verset_principal || "").toLowerCase().includes(recherche.toLowerCase())
        : true;
      const matchTheme = themeActif === "tous" ? true : p.theme === themeActif;
      return match && matchTheme;
    });
  }, [predications, recherche, themeActif]);

  const onSupprimer = async (id) => {
    if (!window.confirm("Supprimer cette prédication ? Cette action est irréversible.")) return;
    try {
      await supprimerPredication(id);
      setPredications((prev) => prev.filter((p) => p.id !== id));
      toast.success("Prédication supprimée.");
    } catch (err) {
      toast.error(err.message || "Échec de la suppression.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <EnTete />

      <main className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
        {/* Bannière d'accueil */}
        <section className="apparaitre">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-body text-sm uppercase tracking-[0.2em] text-accent">
                Tableau de bord
              </p>
              <h1 className="mt-2 font-heading text-4xl font-semibold tracking-tight md:text-5xl">
                Bonjour, {utilisateur?.user_metadata?.nom_complet || utilisateur?.email?.split("@")[0] || "pasteur"}.
              </h1>
              <p className="mt-2 max-w-xl text-base text-muted-foreground">
                Retrouvez vos prédications, créez-en de nouvelles, et prêchez avec sérénité.
              </p>
            </div>
            <Link
              to="/creer-predication"
              data-testid="bouton-creer-predication-principal"
              className="bouton-principal self-start md:self-auto"
            >
              <Plus size={16} /> Nouvelle prédication
            </Link>
          </div>
        </section>

        {/* Barre de recherche + filtres */}
        <section className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Rechercher par titre, thème ou verset…"
              data-testid="champ-recherche"
              className="champ-texte pl-9"
            />
          </div>
          <div className="relative">
            <Filter size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <select
              value={themeActif}
              onChange={(e) => setThemeActif(e.target.value)}
              data-testid="filtre-theme"
              className="champ-texte pl-9 pr-8"
            >
              <option value="tous">Tous les thèmes</option>
              {themesDisponibles.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </section>

        {/* Contenu principal */}
        <section className="mt-8">
          {chargement ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-48 animate-pulse rounded-lg border border-border bg-secondary/40" />
              ))}
            </div>
          ) : erreur ? (
            <div
              data-testid="message-erreur-tableau"
              className="carte-surface border-destructive/30 bg-destructive/5 text-destructive"
            >
              <p className="font-medium">Erreur de chargement</p>
              <p className="mt-2 text-sm">{erreur}</p>
              <p className="mt-4 text-xs text-muted-foreground">
                Assurez-vous que la table <code>predications</code> est créée dans Supabase avec les règles RLS adéquates.
              </p>
            </div>
          ) : resultats.length === 0 && predications.length === 0 ? (
            <EtatVide />
          ) : resultats.length === 0 ? (
            <p data-testid="message-aucun-resultat" className="text-center text-muted-foreground py-12">
              Aucun résultat pour ces filtres.
            </p>
          ) : (
            <div
              data-testid="liste-predications"
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              {resultats.map((p) => (
                <CartePredication key={p.id} predication={p} onSupprimer={onSupprimer} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function EtatVide() {
  return (
    <div
      data-testid="etat-vide-tableau"
      className="carte-surface flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Sparkles size={26} />
      </div>
      <h3 className="font-heading text-2xl font-semibold">Votre première prédication vous attend</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Démarrez avec un titre, un thème, un verset — et laissez l'IA vous proposer une structure complète que vous pourrez peaufiner.
      </p>
      <Link
        to="/creer-predication"
        data-testid="bouton-creer-premiere-predication"
        className="bouton-principal mt-6"
      >
        <FileText size={16} /> Créer ma première prédication
      </Link>
    </div>
  );
}
