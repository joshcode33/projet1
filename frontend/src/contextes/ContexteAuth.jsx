// ============================================================================
// Contexte d'authentification — utilise Supabase Auth
// ============================================================================

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const ContexteAuth = createContext(null);

export function FournisseurAuth({ children }) {
  const [utilisateur, setUtilisateur] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    // Récupération de la session au montage
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUtilisateur(session?.user ?? null);
      setChargement(false);
    });

    // Écoute des changements de session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUtilisateur(session?.user ?? null);
        setChargement(false);
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  const seConnecter = async (email, motDePasse) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: motDePasse,
    });
    if (error) throw error;
    return data;
  };

  const sInscrire = async (email, motDePasse, nomComplet) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: motDePasse,
      options: {
        data: { nom_complet: nomComplet || "" },
        emailRedirectTo: `${window.location.origin}/tableau-de-bord`,
      },
    });
    if (error) throw error;
    return data;
  };

  const seDeconnecter = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const valeur = {
    utilisateur,
    chargement,
    seConnecter,
    sInscrire,
    seDeconnecter,
  };

  return <ContexteAuth.Provider value={valeur}>{children}</ContexteAuth.Provider>;
}

export function useAuth() {
  const ctx = useContext(ContexteAuth);
  if (!ctx) throw new Error("useAuth doit être utilisé dans <FournisseurAuth>");
  return ctx;
}
