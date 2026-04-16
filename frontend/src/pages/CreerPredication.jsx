// ============================================================================
// Création / Édition d'une prédication — formulaire + génération IA + assistant
// ============================================================================

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contextes/ContexteAuth";
import {
  creerPredication,
  mettreAJourPredication,
  obtenirPredication,
} from "@/lib/supabase";
import {
  genererPredication,
  suggererVersets,
  assistantIA,
} from "@/lib/api";
import EnTete from "@/composants/EnTete";
import {
  Sparkles,
  Save,
  Loader2,
  BookMarked,
  Wand2,
  ArrowLeft,
  Play,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

const PREDICATION_VIDE = {
  titre: "",
  theme: "",
  verset_principal: "",
  objectif: "",
  notes: "",
  introduction: "",
  points: [],
  conclusion: "",
};

export default function CreerPredication() {
  const { id } = useParams(); // mode édition si id présent
  const enEdition = Boolean(id);
  const { utilisateur } = useAuth();
  const naviguer = useNavigate();

  const [predication, setPredication] = useState(PREDICATION_VIDE);
  const [chargement, setChargement] = useState(enEdition);
  const [genereEnCours, setGenereEnCours] = useState(false);
  const [enregistrement, setEnregistrement] = useState(false);
  const [versets, setVersets] = useState([]);
  const [versetsEnCours, setVersetsEnCours] = useState(false);
  const [assistantEnCours, setAssistantEnCours] = useState(null);

  useEffect(() => {
    if (!enEdition) return;
    (async () => {
      try {
        const donnees = await obtenirPredication(id);
        setPredication({ ...PREDICATION_VIDE, ...donnees, points: donnees.points || [] });
      } catch (err) {
        toast.error("Impossible de charger cette prédication.");
        naviguer("/tableau-de-bord", { replace: true });
      } finally {
        setChargement(false);
      }
    })();
  }, [id, enEdition, naviguer]);

  const majChamp = (champ, valeur) =>
    setPredication((prev) => ({ ...prev, [champ]: valeur }));

  const majPoint = (index, champ, valeur) => {
    setPredication((prev) => {
      const points = [...(prev.points || [])];
      points[index] = { ...points[index], [champ]: valeur };
      return { ...prev, points };
    });
  };

  const ajouterPoint = () =>
    setPredication((prev) => ({
      ...prev,
      points: [...(prev.points || []), { titre: "", explication: "" }],
    }));

  const supprimerPoint = (index) =>
    setPredication((prev) => ({
      ...prev,
      points: (prev.points || []).filter((_, i) => i !== index),
    }));

  // ------------------------------------------------- Génération IA
  const genererIA = async () => {
    if (!predication.titre.trim()) {
      toast.error("Saisissez au moins un titre pour lancer la génération.");
      return;
    }
    setGenereEnCours(true);
    try {
      const resultat = await genererPredication({
        titre: predication.titre,
        theme: predication.theme,
        verset_principal: predication.verset_principal,
        objectif: predication.objectif,
        notes: predication.notes,
      });
      setPredication((prev) => ({
        ...prev,
        introduction: resultat.introduction,
        points: resultat.points,
        conclusion: resultat.conclusion,
      }));
      toast.success("Prédication générée !");
    } catch (err) {
      toast.error(err?.response?.data?.detail || err.message || "Échec de la génération.");
    } finally {
      setGenereEnCours(false);
    }
  };

  // ------------------------------------------------- Suggestion de versets
  const chargerVersets = async () => {
    if (!predication.theme.trim()) {
      toast.error("Indiquez un thème pour obtenir des suggestions.");
      return;
    }
    setVersetsEnCours(true);
    try {
      const suggestions = await suggererVersets(predication.theme, 6);
      setVersets(suggestions);
    } catch (err) {
      toast.error(err?.response?.data?.detail || err.message || "Échec des suggestions.");
    } finally {
      setVersetsEnCours(false);
    }
  };

  const ajouterVerset = (v) => {
    const texte = `${v.reference} — ${v.texte}`;
    if (!predication.verset_principal) {
      majChamp("verset_principal", v.reference);
    }
    majChamp("notes", (predication.notes || "") + (predication.notes ? "\n\n" : "") + texte);
    toast.success(`Verset ajouté aux notes : ${v.reference}`);
  };

  // ------------------------------------------------- Assistant IA
  const executerAssistant = async (action, champ) => {
    const texte = predication[champ] || "";
    if (!texte.trim()) {
      toast.error("Écrivez du texte dans ce champ avant d'utiliser l'assistant.");
      return;
    }
    setAssistantEnCours(`${action}-${champ}`);
    try {
      const resultat = await assistantIA(action, texte, predication.titre);
      majChamp(champ, resultat);
      toast.success("Texte mis à jour par l'assistant.");
    } catch (err) {
      toast.error(err?.response?.data?.detail || err.message || "Assistant indisponible.");
    } finally {
      setAssistantEnCours(null);
    }
  };

  // ------------------------------------------------- Sauvegarde
  const sauvegarder = async (apresSauvegarde) => {
    if (!predication.titre.trim()) {
      toast.error("Le titre est obligatoire.");
      return;
    }
    setEnregistrement(true);
    try {
      const payload = {
        titre: predication.titre,
        theme: predication.theme,
        verset_principal: predication.verset_principal,
        objectif: predication.objectif,
        notes: predication.notes,
        introduction: predication.introduction,
        points: predication.points,
        conclusion: predication.conclusion,
      };
      let sauve;
      if (enEdition) {
        sauve = await mettreAJourPredication(id, payload);
      } else {
        sauve = await creerPredication({
          ...payload,
          utilisateur_id: utilisateur.id,
        });
      }
      toast.success(enEdition ? "Prédication mise à jour !" : "Prédication enregistrée !");
      if (apresSauvegarde === "presenter") {
        naviguer(`/mode-predication/${sauve.id}`);
      } else if (!enEdition) {
        naviguer(`/predication/${sauve.id}`, { replace: true });
      }
    } catch (err) {
      toast.error(err.message || "Échec de l'enregistrement.");
    } finally {
      setEnregistrement(false);
    }
  };

  if (chargement) {
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
      <main className="mx-auto max-w-4xl px-5 py-8 md:px-8 md:py-12">
        <button
          onClick={() => naviguer("/tableau-de-bord")}
          data-testid="bouton-retour-tableau"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} /> Retour au tableau de bord
        </button>

        <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight md:text-5xl">
          {enEdition ? "Modifier la prédication" : "Nouvelle prédication"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Renseignez l'essentiel puis laissez l'IA structurer le message — vous garderez la plume.
        </p>

        {/* Brief */}
        <section className="mt-8 carte-surface apparaitre">
          <h2 className="font-heading text-xl font-semibold">1. Votre brief</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Champ
              label="Titre *"
              id="titre"
              value={predication.titre}
              onChange={(v) => majChamp("titre", v)}
              placeholder="Ex : La grâce qui relève"
              testid="champ-titre"
            />
            <Champ
              label="Thème"
              id="theme"
              value={predication.theme}
              onChange={(v) => majChamp("theme", v)}
              placeholder="Ex : Espérance, Grâce, Famille…"
              testid="champ-theme"
            />
            <Champ
              label="Verset biblique principal"
              id="verset"
              value={predication.verset_principal}
              onChange={(v) => majChamp("verset_principal", v)}
              placeholder="Ex : Romains 8:28"
              testid="champ-verset"
            />
            <Champ
              label="Objectif pastoral"
              id="objectif"
              value={predication.objectif}
              onChange={(v) => majChamp("objectif", v)}
              placeholder="Ce que l'auditoire doit retenir / faire"
              testid="champ-objectif"
            />
          </div>
          <ZoneTexte
            label="Notes, idées, anecdotes"
            id="notes"
            value={predication.notes}
            onChange={(v) => majChamp("notes", v)}
            placeholder="Tout ce qui traverse votre esprit…"
            rows={4}
            testid="champ-notes"
          />

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={genererIA}
              disabled={genereEnCours}
              data-testid="bouton-generer-predication"
              className="bouton-ambre"
            >
              {genereEnCours ? (
                <><Loader2 size={16} className="animate-spin" /> Génération…</>
              ) : (
                <><Sparkles size={16} /> Générer la prédication</>
              )}
            </button>
            <button
              onClick={chargerVersets}
              disabled={versetsEnCours}
              data-testid="bouton-suggerer-versets"
              className="bouton-secondaire"
            >
              {versetsEnCours ? (
                <><Loader2 size={16} className="animate-spin" /> Recherche…</>
              ) : (
                <><BookMarked size={16} /> Suggérer des versets</>
              )}
            </button>
          </div>

          {versets.length > 0 && (
            <div className="mt-5 rounded-md border border-border bg-secondary/40 p-4" data-testid="liste-versets-suggerees">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Versets suggérés — cliquez pour ajouter aux notes
              </p>
              <ul className="space-y-2">
                {versets.map((v, idx) => (
                  <li key={idx} className="flex items-start justify-between gap-3 rounded-md bg-card p-3 border border-border">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-accent">{v.reference}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{v.texte}</p>
                    </div>
                    <button
                      onClick={() => ajouterVerset(v)}
                      data-testid={`ajouter-verset-${idx}`}
                      className="flex-shrink-0 rounded-md border border-border p-2 text-foreground transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary"
                      aria-label="Ajouter ce verset"
                    >
                      <Plus size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Corps de la prédication */}
        <section className="mt-6 carte-surface">
          <h2 className="font-heading text-xl font-semibold">2. Corps de la prédication</h2>

          <ChampAvecAssistant
            label="Introduction"
            value={predication.introduction}
            onChange={(v) => majChamp("introduction", v)}
            onAssistant={(a) => executerAssistant(a, "introduction")}
            assistantEnCours={assistantEnCours}
            testidPrefix="introduction"
            rows={5}
          />

          <div className="mt-6 flex items-center justify-between">
            <h3 className="font-heading text-base font-semibold">Points principaux</h3>
            <button
              onClick={ajouterPoint}
              data-testid="bouton-ajouter-point"
              className="bouton-secondaire py-1.5 text-xs"
            >
              <Plus size={14} /> Ajouter un point
            </button>
          </div>

          <div className="mt-3 space-y-5">
            {(predication.points || []).length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                Les points apparaîtront ici après la génération, ou ajoutez-en manuellement.
              </p>
            )}
            {(predication.points || []).map((p, idx) => (
              <div
                key={idx}
                data-testid={`point-${idx}`}
                className="rounded-md border border-border bg-secondary/30 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-heading text-sm font-semibold text-accent">
                    Point {idx + 1}
                  </span>
                  <button
                    onClick={() => supprimerPoint(idx)}
                    data-testid={`supprimer-point-${idx}`}
                    className="text-muted-foreground transition-colors hover:text-destructive"
                    aria-label="Supprimer ce point"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <input
                  type="text"
                  value={p.titre || ""}
                  onChange={(e) => majPoint(idx, "titre", e.target.value)}
                  placeholder="Titre du point"
                  data-testid={`point-titre-${idx}`}
                  className="champ-texte mt-3 font-heading text-base font-semibold"
                />
                <ChampAvecAssistant
                  label=""
                  value={p.explication || ""}
                  onChange={(v) => majPoint(idx, "explication", v)}
                  onAssistant={(a) => {
                    (async () => {
                      const texte = p.explication || "";
                      if (!texte.trim()) {
                        toast.error("Écrivez du texte avant d'utiliser l'assistant.");
                        return;
                      }
                      setAssistantEnCours(`${a}-point-${idx}`);
                      try {
                        const r = await assistantIA(a, texte, predication.titre);
                        majPoint(idx, "explication", r);
                        toast.success("Mise à jour par l'assistant.");
                      } catch (err) {
                        toast.error(err.message || "Assistant indisponible.");
                      } finally {
                        setAssistantEnCours(null);
                      }
                    })();
                  }}
                  assistantEnCours={assistantEnCours}
                  testidPrefix={`point-explication-${idx}`}
                  rows={5}
                  sansLabel
                />
              </div>
            ))}
          </div>

          <ChampAvecAssistant
            label="Conclusion"
            value={predication.conclusion}
            onChange={(v) => majChamp("conclusion", v)}
            onAssistant={(a) => executerAssistant(a, "conclusion")}
            assistantEnCours={assistantEnCours}
            testidPrefix="conclusion"
            rows={4}
          />
        </section>

        {/* Barre d'actions flottante */}
        <div className="mt-8 flex flex-wrap items-center gap-3 pb-16">
          <button
            onClick={() => sauvegarder()}
            disabled={enregistrement}
            data-testid="bouton-sauvegarder"
            className="bouton-principal"
          >
            {enregistrement ? (
              <><Loader2 size={16} className="animate-spin" /> Enregistrement…</>
            ) : (
              <><Save size={16} /> Enregistrer</>
            )}
          </button>
          {enEdition && (
            <button
              onClick={() => naviguer(`/mode-predication/${id}`)}
              data-testid="bouton-mode-predication"
              className="bouton-secondaire"
            >
              <Play size={16} /> Mode prédication
            </button>
          )}
          {!enEdition && (
            <button
              onClick={() => sauvegarder("presenter")}
              disabled={enregistrement}
              data-testid="bouton-sauvegarder-et-presenter"
              className="bouton-secondaire"
            >
              <Play size={16} /> Enregistrer & prêcher
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

function Champ({ label, id, value, onChange, placeholder, testid }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <input
        id={id}
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        data-testid={testid}
        className="champ-texte"
      />
    </div>
  );
}

function ZoneTexte({ label, id, value, onChange, placeholder, rows = 3, testid }) {
  return (
    <div className="mt-4 space-y-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium">{label}</label>
      )}
      <textarea
        id={id}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        data-testid={testid}
        className="champ-texte resize-y min-h-[100px]"
      />
    </div>
  );
}

function ChampAvecAssistant({
  label,
  value,
  onChange,
  onAssistant,
  assistantEnCours,
  testidPrefix,
  rows = 4,
  sansLabel = false,
}) {
  const ACTIONS = [
    { cle: "reformuler", libelle: "Reformuler" },
    { cle: "corriger", libelle: "Corriger" },
    { cle: "developper", libelle: "Développer" },
    { cle: "illustrer", libelle: "Illustrer" },
  ];
  return (
    <div className={sansLabel ? "mt-3" : "mt-5"}>
      {!sansLabel && (
        <label className="text-sm font-medium">{label}</label>
      )}
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        data-testid={`${testidPrefix}-textarea`}
        className="champ-texte mt-1.5 resize-y min-h-[110px]"
      />
      <div className="mt-2 flex flex-wrap gap-2">
        {ACTIONS.map((a) => {
          const enCours = assistantEnCours === `${a.cle}-${testidPrefix.replace("point-explication-", "point-")}` ||
                          assistantEnCours?.startsWith(`${a.cle}-`) && assistantEnCours.includes(testidPrefix);
          return (
            <button
              key={a.cle}
              onClick={() => onAssistant(a.cle)}
              disabled={Boolean(assistantEnCours)}
              data-testid={`${testidPrefix}-assistant-${a.cle}`}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
            >
              {enCours ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
              {a.libelle}
            </button>
          );
        })}
      </div>
    </div>
  );
}
