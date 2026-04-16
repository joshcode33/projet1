// ============================================================================
// Point d'entrée de l'application MySermon AI
// ============================================================================

import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { FournisseurAuth } from "@/contextes/ContexteAuth";
import { FournisseurTheme, useTheme } from "@/contextes/ContexteTheme";
import RouteProtegee from "@/composants/RouteProtegee";
import PageAccueil from "@/pages/PageAccueil";
import Connexion from "@/pages/Connexion";
import Inscription from "@/pages/Inscription";
import TableauDeBord from "@/pages/TableauDeBord";
import CreerPredication from "@/pages/CreerPredication";
import VoirPredication from "@/pages/VoirPredication";
import ModePredication from "@/pages/ModePredication";

function NotificationsGlobales() {
  const { theme } = useTheme();
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      theme={theme}
      toastOptions={{
        style: {
          fontFamily: "Manrope, sans-serif",
        },
      }}
    />
  );
}

function App() {
  return (
    <div className="App">
      <FournisseurTheme>
        <BrowserRouter>
          <FournisseurAuth>
            <NotificationsGlobales />
            <Routes>
              <Route path="/" element={<PageAccueil />} />
              <Route path="/connexion" element={<Connexion />} />
              <Route path="/inscription" element={<Inscription />} />
              <Route
                path="/tableau-de-bord"
                element={
                  <RouteProtegee>
                    <TableauDeBord />
                  </RouteProtegee>
                }
              />
              <Route
                path="/creer-predication"
                element={
                  <RouteProtegee>
                    <CreerPredication />
                  </RouteProtegee>
                }
              />
              <Route
                path="/creer-predication/:id"
                element={
                  <RouteProtegee>
                    <CreerPredication />
                  </RouteProtegee>
                }
              />
              <Route
                path="/predication/:id"
                element={
                  <RouteProtegee>
                    <VoirPredication />
                  </RouteProtegee>
                }
              />
              <Route
                path="/mode-predication/:id"
                element={
                  <RouteProtegee>
                    <ModePredication />
                  </RouteProtegee>
                }
              />
              <Route path="*" element={<PageAccueil />} />
            </Routes>
          </FournisseurAuth>
        </BrowserRouter>
      </FournisseurTheme>
    </div>
  );
}

export default App;
