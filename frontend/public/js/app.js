/* ============================================================================
   app.js — Point d'entrée de MySermon AI
   ============================================================================ */

(async function initialiser() {
    // Suivre les changements d'authentification Supabase
    MS.auth.ecouterAuth(async (utilisateur) => {
        MS.utilisateurActuel = utilisateur;
        // Re-rendre l'en-tête si visible
        if (document.getElementById("en-tete").innerHTML) {
            MS.rendreEnTete();
        }
    });

    // Gérer le routage par changement de hash
    window.addEventListener("hashchange", MS.gererRoute);

    // Premier rendu
    await MS.gererRoute();

    console.log("✨ MySermon AI — Application initialisée");
})();
