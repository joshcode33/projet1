// ============================================================================
// Route protégée : redirige vers /connexion si l'utilisateur n'est pas connecté
// ============================================================================

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contextes/ContexteAuth";

export default function RouteProtegee({ children }) {
  const { utilisateur, chargement } = useAuth();
  const emplacement = useLocation();

  if (chargement) {
    return (
      <div
        data-testid="ecran-chargement"
        className="flex min-h-screen items-center justify-center bg-background text-muted-foreground"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm">Chargement…</p>
        </div>
      </div>
    );
  }

  if (!utilisateur) {
    return <Navigate to="/connexion" replace state={{ retour: emplacement.pathname }} />;
  }
  return children;
}
