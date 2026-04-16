// ============================================================================
// Contexte du thème (clair / sombre) — persistance dans localStorage
// ============================================================================

import { createContext, useContext, useEffect, useState } from "react";

const ContexteTheme = createContext(null);
const CLE_STOCKAGE = "mysermon-theme";

export function FournisseurTheme({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    const enregistre = localStorage.getItem(CLE_STOCKAGE);
    if (enregistre === "dark" || enregistre === "light") return enregistre;
    // Préférence système par défaut
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const racine = document.documentElement;
    racine.classList.toggle("dark", theme === "dark");
    localStorage.setItem(CLE_STOCKAGE, theme);
  }, [theme]);

  const basculer = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ContexteTheme.Provider value={{ theme, basculer }}>
      {children}
    </ContexteTheme.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ContexteTheme);
  if (!ctx) throw new Error("useTheme doit être utilisé dans <FournisseurTheme>");
  return ctx;
}
