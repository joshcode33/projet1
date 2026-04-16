// ============================================================================
// Mode Prédication — plein écran, grande typo, défilement auto
// ============================================================================

import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { obtenirPredication } from "@/lib/supabase";
import {
  X,
  Play,
  Pause,
  Rewind,
  Plus,
  Minus,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

const TAILLE_MIN = 32;
const TAILLE_MAX = 112;

export default function ModePredication() {
  const { id } = useParams();
  const naviguer = useNavigate();
  const [predication, setPredication] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [tailleTexte, setTailleTexte] = useState(56);
  const [defilementActif, setDefilementActif] = useState(false);
  const [vitesse, setVitesse] = useState(30); // pixels par seconde
  const conteneurRef = useRef(null);
  const animationRef = useRef(null);

  // Chargement
  useEffect(() => {
    (async () => {
      try {
        const donnees = await obtenirPredication(id);
        setPredication(donnees);
      } catch {
        toast.error("Prédication introuvable.");
        naviguer("/tableau-de-bord", { replace: true });
      } finally {
        setChargement(false);
      }
    })();
  }, [id, naviguer]);

  // Raccourcis clavier
  useEffect(() => {
    const gestion = (e) => {
      if (e.key === "Escape") quitter();
      if (e.key === " ") { e.preventDefault(); setDefilementActif((a) => !a); }
      if (e.key === "+" || e.key === "=") augmenterTaille();
      if (e.key === "-") diminuerTaille();
    };
    window.addEventListener("keydown", gestion);
    return () => window.removeEventListener("keydown", gestion);
    // eslint-disable-next-line
  }, []);

  // Défilement automatique
  useEffect(() => {
    if (!defilementActif) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }
    let dernier = performance.now();
    const pas = (maintenant) => {
      const conteneur = conteneurRef.current;
      if (!conteneur) return;
      const delta = (maintenant - dernier) / 1000;
      dernier = maintenant;
      conteneur.scrollTop += vitesse * delta;
      const max = conteneur.scrollHeight - conteneur.clientHeight;
      if (conteneur.scrollTop >= max - 1) {
        setDefilementActif(false);
        return;
      }
      animationRef.current = requestAnimationFrame(pas);
    };
    animationRef.current = requestAnimationFrame(pas);
    return () => animationRef.current && cancelAnimationFrame(animationRef.current);
  }, [defilementActif, vitesse]);

  const quitter = () => naviguer(`/predication/${id}`);
  const augmenterTaille = () => setTailleTexte((t) => Math.min(TAILLE_MAX, t + 4));
  const diminuerTaille = () => setTailleTexte((t) => Math.max(TAILLE_MIN, t - 4));
  const rembobiner = () => {
    if (conteneurRef.current) conteneurRef.current.scrollTop = 0;
  };

  if (chargement || !predication) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#141312] text-white">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div
      data-testid="mode-predication"
      className="fixed inset-0 flex flex-col overflow-hidden bg-[#141312] text-white"
    >
      {/* Barre supérieure */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 md:px-8">
        <button
          onClick={quitter}
          data-testid="bouton-quitter-mode"
          className="inline-flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"
        >
          <ArrowLeft size={14} /> Quitter le mode prédication
        </button>
        <div className="hidden text-xs text-white/40 md:block">
          Espace = lecture/pause · + / − = taille · Échap = quitter
        </div>
      </div>

      {/* Texte principal */}
      <div
        ref={conteneurRef}
        data-testid="conteneur-texte-predication"
        className="flex-1 overflow-y-auto scroll-smooth"
      >
        <div className="mx-auto max-w-5xl px-6 py-16 md:px-12 md:py-24">
          {predication.theme && (
            <p
              style={{ fontSize: `${Math.max(18, tailleTexte * 0.28)}px` }}
              className="font-body uppercase tracking-[0.3em] text-[#D99B4B]"
            >
              {predication.theme}
            </p>
          )}
          <h1
            style={{ fontSize: `${tailleTexte * 1.35}px`, lineHeight: 1.1 }}
            className="mt-3 font-heading font-semibold tracking-tight"
          >
            {predication.titre}
          </h1>
          {predication.verset_principal && (
            <p
              style={{ fontSize: `${tailleTexte * 0.7}px` }}
              className="mt-6 font-heading italic text-white/60"
            >
              « {predication.verset_principal} »
            </p>
          )}

          {predication.introduction && (
            <BlocPrediction
              titre="Introduction"
              contenu={predication.introduction}
              taille={tailleTexte}
            />
          )}
          {(predication.points || []).map((p, idx) => (
            <BlocPrediction
              key={idx}
              titre={`${idx + 1}. ${p.titre || ""}`}
              contenu={p.explication || ""}
              taille={tailleTexte}
            />
          ))}
          {predication.conclusion && (
            <BlocPrediction
              titre="Conclusion"
              contenu={predication.conclusion}
              taille={tailleTexte}
            />
          )}

          <div style={{ height: "40vh" }} />
        </div>
      </div>

      {/* Barre flottante */}
      <div
        data-testid="barre-controles-mode"
        className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/15 bg-black/60 px-2 py-1.5 backdrop-blur-md">
          <BoutonCercle onClick={rembobiner} testid="ctrl-rembobiner" label="Rembobiner">
            <Rewind size={16} />
          </BoutonCercle>
          <BoutonCercle
            onClick={() => setDefilementActif((a) => !a)}
            testid="ctrl-lecture"
            label={defilementActif ? "Pause" : "Lecture"}
            accent
          >
            {defilementActif ? <Pause size={18} /> : <Play size={18} />}
          </BoutonCercle>
          <div className="mx-1 hidden items-center gap-1.5 sm:flex">
            <span className="text-[11px] text-white/50">Vitesse</span>
            <input
              type="range"
              min={10}
              max={80}
              step={5}
              value={vitesse}
              onChange={(e) => setVitesse(Number(e.target.value))}
              data-testid="ctrl-vitesse"
              className="h-1 w-24 accent-[#D99B4B]"
            />
          </div>
          <div className="mx-1 h-5 w-px bg-white/15" />
          <BoutonCercle onClick={diminuerTaille} testid="ctrl-taille-moins" label="Diminuer">
            <Minus size={16} />
          </BoutonCercle>
          <span className="px-1 text-xs tabular-nums text-white/70">{tailleTexte}px</span>
          <BoutonCercle onClick={augmenterTaille} testid="ctrl-taille-plus" label="Augmenter">
            <Plus size={16} />
          </BoutonCercle>
          <div className="mx-1 h-5 w-px bg-white/15" />
          <BoutonCercle onClick={quitter} testid="ctrl-quitter" label="Quitter">
            <X size={16} />
          </BoutonCercle>
        </div>
      </div>
    </div>
  );
}

function BlocPrediction({ titre, contenu, taille }) {
  return (
    <section className="mt-16">
      <h2
        style={{ fontSize: `${taille * 0.55}px` }}
        className="font-heading font-semibold tracking-tight text-[#D99B4B]"
      >
        {titre}
      </h2>
      <p
        style={{ fontSize: `${taille}px`, lineHeight: 1.35 }}
        className="texte-predication mt-6 whitespace-pre-wrap"
      >
        {contenu}
      </p>
    </section>
  );
}

function BoutonCercle({ children, onClick, testid, label, accent }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      data-testid={testid}
      className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
        accent
          ? "bg-[#D99B4B] text-black hover:bg-[#C5832B]"
          : "text-white/80 hover:bg-white/10 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
