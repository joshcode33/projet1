// ============================================================================
// Page d'accueil — redirige vers tableau de bord ou connexion selon l'état
// ============================================================================

import { Navigate } from "react-router-dom";
import { useAuth } from "@/contextes/ContexteAuth";

export default function PageAccueil() {
  const { utilisateur, chargement } = useAuth();

  if (chargement) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  return <Navigate to={utilisateur ? "/tableau-de-bord" : "/connexion"} replace />;
}
