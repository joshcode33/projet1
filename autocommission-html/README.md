# AutoCommission - Site Statique HTML/CSS/JS

## Description
Plateforme de vente de véhicules entre commissionnaires et acheteurs en RDC.
Ce projet utilise uniquement HTML, CSS et JavaScript vanilla (aucun framework).

## Structure du projet

```
autocommission-html/
├── index.html      # Page d'accueil avec catalogue
├── detail.html     # Page détail véhicule
├── style.css       # Tous les styles CSS
├── script.js       # Logique JavaScript + données véhicules
└── README.md       # Ce fichier
```

## Comment utiliser

### Option 1 : Ouvrir directement dans le navigateur
1. Téléchargez le dossier `autocommission-html`
2. Double-cliquez sur `index.html` pour l'ouvrir dans votre navigateur

### Option 2 : Utiliser Live Server (VS Code)
1. Installez l'extension "Live Server" dans VS Code
2. Ouvrez le dossier dans VS Code
3. Clic droit sur `index.html` → "Open with Live Server"

### Option 3 : Serveur local Python
```bash
cd autocommission-html
python -m http.server 8000
```
Puis ouvrez http://localhost:8000

## Fonctionnalités

- ✅ Page d'accueil avec Hero Section
- ✅ Barre de recherche (marque/modèle)
- ✅ Filtres (prix, localisation, carburant, transmission, statut)
- ✅ Catalogue de 9 véhicules en grille
- ✅ Page détail avec galerie d'images
- ✅ Miniatures cliquables
- ✅ Lightbox pour zoom
- ✅ Téléchargement d'images
- ✅ Boutons WhatsApp avec message pré-rempli
- ✅ Badge Disponible/Vendu
- ✅ Design responsive (mobile/tablet/desktop)

## Personnalisation

### Modifier les véhicules
Éditez le tableau `vehicles` dans `script.js` :

```javascript
const vehicles = [
    {
        id: 1,
        marque: "Toyota",
        modele: "Harrier",
        prix: 15000,
        localisation: "Kinshasa",
        annee: 2019,
        carburant: "Essence",
        transmission: "Automatique",
        statut: "Disponible",
        images: ["url1.jpg", "url2.jpg"],
        contact: "243XXXXXXXXX",
        kilometrage: 45000,
        description: "Description du véhicule..."
    },
    // Ajoutez d'autres véhicules...
];
```

### Modifier le numéro WhatsApp
Remplacez `243975814951` par votre numéro dans :
- `script.js` (champ `contact` de chaque véhicule)
- `index.html` et `detail.html` (liens dans le header et footer)

### Modifier les couleurs
Éditez les variables CSS au début de `style.css` :

```css
:root {
    --orange-500: #f97316;    /* Couleur principale */
    --green-500: #25D366;     /* Couleur WhatsApp */
    /* ... autres couleurs */
}
```

## Technologies utilisées

- HTML5
- CSS3 (Flexbox, Grid, Variables CSS)
- JavaScript ES6+ (vanilla, aucun framework)
- Font Awesome (icônes)
- Google Fonts (Manrope)

## Licence

Ce projet est libre d'utilisation pour votre usage personnel ou commercial.

---
Développé avec ❤️ en RDC
