# LAFORGE — Guide de mise en place

## Structure des fichiers

```
laforge/
├── index.html          ← Page principale (ne pas modifier)
├── style.css           ← Styles visuels (ne pas modifier)
├── app.js              ← Logique de l'application (ne pas modifier)
├── data.js             ← ⭐ TON FICHIER À MODIFIER pour ajouter tes produits
├── assets/
│   ├── logo.svg        ← Remplace par ton vrai logo
│   ├── 3d/             ← Images et fichiers STL pour l'impression 3D
│   └── laser/          ← Images pour la découpe laser
└── LISEZ-MOI.md
```

---

## 1. Ajouter un produit (impression 3D ou laser)

Ouvre `data.js` et trouve la section `DATA_3D` ou `DATA_LASER`.

### Exemple pour ajouter un fichier 3D :

```js
{
  id: "mon-objet-01",              // identifiant unique (sans espaces ni accents)
  nom: "Mon super objet",          // nom affiché sur le site
  image: "assets/3d/mon-objet.jpg",// chemin vers l'image principale
  stl: "assets/3d/mon-objet.stl", // chemin vers le fichier STL
  images_sup: [
    "assets/3d/mon-objet-2.jpg",   // image supplémentaire 2
    "assets/3d/mon-objet-3.jpg",   // image supplémentaire 3
    "",                             // laisser vide si pas d'image
    "",
  ],
  dim_base: { h: 10, w: 8, l: 6, poids: 80 }, // dimensions en cm, poids en grammes
  prix_modelisation: 12,           // prix de conception en €
},
```

### Pour ajouter une nouvelle catégorie :

```js
{
  categorie: "Nom de la catégorie",
  fichiers: [
    // tes fichiers ici
  ]
},
```

---

## 2. Modifier les tarifs

Dans `data.js`, section `CONFIG` :

| Variable | Description | Valeur par défaut |
|---|---|---|
| `prix_pla_par_kg` | Coût du filament PLA (€/kg) | 20 |
| `marge_impression` | Multiplicateur de prix impression | 3.0 (=300%) |
| `marge_stl` | Multiplicateur vente fichier STL | 1.5 |
| `prix_laser_par_kg` | Coût matière laser (€/kg) | 15 |
| `marge_laser` | Multiplicateur prix découpe laser | 2.5 |
| `prix_par_km` | Frais livraison (€/km depuis Brest) | 0.25 |
| `email_contact` | Ton adresse mail | à remplir |

---

## 3. Ajouter des filaments ou matériaux

Dans `data.js` :

```js
// Ajouter un filament
{ id: "pla-violet", nom: "PLA Violet", couleur: "#7b1fa2", prix_kg: 22 },

// Ajouter un matériau laser
{ id: "bois-15mm", nom: "Contreplaqué 15mm", prix_kg: 14 },
```

---

## 4. Carte Google Maps

Pour que la carte interactive et le calcul de distance fonctionnent :

1. Obtiens une clé API sur [console.cloud.google.com](https://console.cloud.google.com)
2. Active l'API **Maps Embed API** et **Distance Matrix API**
3. Dans `index.html`, cherche `VOTRE_CLE_API_GOOGLE_MAPS` et remplace par ta clé

En attendant, les utilisateurs peuvent taper leur ville manuellement et le calcul se fait avec la base de distances prédéfinie dans `CONFIG.distances_villes`.

---

## 5. Ajouter des villes pour le calcul de livraison

Dans `data.js`, section `distances_villes`, ajoute des lignes :

```js
"quimper": 70,    // km depuis Brest
"lorient": 100,
```

---

## 6. Mise en ligne

Le site est en HTML/CSS/JS pur — aucun serveur nécessaire.  
Tu peux l'héberger sur :
- **GitHub Pages** (gratuit)
- **Netlify** (gratuit, glisse le dossier sur netlify.com/drop)
- **OVH / tout hébergeur web** (upload par FTP)

---

## 7. Adresse mail

Remplace `tonmail@exemple.fr` dans `data.js` (variable `email_contact`).  
Les commandes et demandes s'enverront vers cette adresse via le client mail de l'utilisateur.
