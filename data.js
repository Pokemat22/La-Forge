/* ============================================================
   DATA.JS — BASE DE DONNÉES LAFORGE
   ============================================================
   Ce fichier contient TOUTES les données modifiables :
   - Fichiers 3D avec leurs catégories
   - Fichiers laser avec leurs catégories
   - Filaments disponibles
   - Matériaux laser
   - Prix au kg / prix au km / marges

   ⚠️ TU MODIFIES UNIQUEMENT CE FICHIER pour ajouter/modifier
       des produits ou changer les tarifs.
   ============================================================ */


/* ------------------------------------------------------------
   PRIX & MARGES GLOBAUX (modifie ces valeurs selon tes tarifs)
   ------------------------------------------------------------ */
const CONFIG = {
  // --- IMPRESSION 3D ---
  prix_pla_par_kg: 20,        // € par kg de filament PLA (coût matière)
  marge_impression: 3.0,      // multiplicateur marge sur l'impression (ex: 3 = 300%)
  marge_stl: 1.5,             // multiplicateur marge si vente du fichier STL uniquement

  // --- DÉCOUPE LASER ---
  prix_laser_par_kg: 15,      // € par kg de matériau (ajuster selon matériau)
  marge_laser: 2.5,           // multiplicateur marge sur la découpe

  // --- TRANSPORT ---
  prix_par_km: 0.001,          // € par km depuis Brest (aller simple)
  // Distances approximatives (km) depuis Brest vers grandes villes
  // Tu peux compléter cette liste
  distances_villes: {
    "brest": 0,
    "rennes": 244,
    "nantes": 295,
    "paris": 590,
    "lyon": 870,
    "bordeaux": 530,
    "marseille": 1110,
    "toulouse": 760,
    "lille": 780,
    "strasbourg": 1050,
    "nice": 1200,
    "montpellier": 990,
    "grenoble": 930,
    "dijon": 750,
    "angers": 315,
    "le mans": 380,
    "tours": 430,
    "orleans": 510,
    "reims": 720,
    "rouen": 570,
    "caen": 360,
    "saint-malo": 220,
    "lorient": 100,
    "vannes": 130,
    "quimper": 70,
    "morlaix": 55,
    "landerneau": 20,
  },

  // Dimensions maximales autorisées
  max_3d: { h: 25, w: 25, l: 25 },   // cm
  max_laser: { h: 55, w: 85 },        // cm (laser = 2D, pas de hauteur)

  // Adresse mail de réception des commandes et demandes
  // ⚠️ Remplace par ton adresse mail
  email_contact: "tonmail@exemple.fr",
};


/* ------------------------------------------------------------
   FILAMENTS DISPONIBLES (Impression 3D)
   Ajouter / modifier les filaments ici
   ------------------------------------------------------------ */
const FILAMENTS = [
  { id: "pla-noir",   nom: "PLA Noir",      couleur: "#1a1a1a", prix_kg: 20 },
  { id: "pla-blanc",  nom: "PLA Blanc",     couleur: "#f5f5f5", prix_kg: 20 },
  { id: "pla-rouge",  nom: "PLA Rouge",     couleur: "#e02020", prix_kg: 22 },
  { id: "pla-bleu",   nom: "PLA Bleu",      couleur: "#1565c0", prix_kg: 22 },
  { id: "pla-vert",   nom: "PLA Vert",      couleur: "#2e7d32", prix_kg: 22 },
  { id: "pla-jaune",  nom: "PLA Jaune",     couleur: "#f9a825", prix_kg: 22 },
  { id: "pla-orange", nom: "PLA Orange",    couleur: "#e65100", prix_kg: 22 },
  { id: "pla-gris",   nom: "PLA Gris",      couleur: "#757575", prix_kg: 20 },
  // Ajouter de nouveaux filaments en copiant une ligne ci-dessus
];


/* ------------------------------------------------------------
   MATÉRIAUX LASER (Découpe Laser)
   Ajouter / modifier les matériaux ici
   ------------------------------------------------------------ */
const MATERIAUX_LASER = [
  { id: "bois-3mm",     nom: "Contreplaqué 3mm",   prix_kg: 8  },
  { id: "bois-5mm",     nom: "Contreplaqué 5mm",   prix_kg: 10 },
  { id: "bois-10mm",    nom: "Contreplaqué 10mm",  prix_kg: 12 },
  { id: "mdf-3mm",      nom: "MDF 3mm",            prix_kg: 7  },
  { id: "mdf-5mm",      nom: "MDF 5mm",            prix_kg: 9  },
  { id: "mdf-10mm",     nom: "MDF 10mm",           prix_kg: 11 },
  { id: "acrylique-3mm",nom: "Acrylique 3mm",      prix_kg: 25 },
  // Ajouter de nouveaux matériaux en copiant une ligne ci-dessus
];


/* ============================================================
   CATALOGUE IMPRESSION 3D
   ============================================================
   Structure par catégorie. Chaque catégorie a un tableau "fichiers".

   Pour CHAQUE FICHIER, remplis :
   - id          : identifiant unique (sans espaces)
   - nom         : nom affiché
   - image       : chemin vers l'image principale (ex: "assets/3d/vase-main.jpg")
   - stl         : chemin vers le fichier STL (ex: "assets/3d/vase.stl")
   - images_sup  : tableau de 4 images supplémentaires (laisser "" si pas d'image)
   - dim_base    : dimensions de BASE { h, w, l, poids } en cm et grammes
   - prix_modelisation : prix en € du temps de conception du fichier
   ============================================================ */
const DATA_3D = [

  /* ---- CATÉGORIE : Décoration ---- */
  {
    categorie: "Support-Casque-Audio",
    fichiers: [
      {
        id: "support-casque-steve-01",
        nom: "Support Casque - Steve MINECRAFT",
        image: "https://raw.githubusercontent.com/Pokemat22/La-Forge/main/assets/3d/steve0.png",       // ← REMPLACE par ton image
        stl: "assets/3d/vase.stl",              // ← REMPLACE par ton fichier STL
        images_sup: [
          "https://raw.githubusercontent.com/Pokemat22/La-Forge/main/assets/3d/steve1.png",               // ← image supplémentaire 2
          "https://raw.githubusercontent.com/Pokemat22/La-Forge/main/assets/3d/steve2.png",               // ← image supplémentaire 3
          "https://raw.githubusercontent.com/Pokemat22/La-Forge/main/assets/3d/steve3.png",                                   // ← laisser vide si pas d'image
          "",
        ],
        dim_base: { h: 15, w: 8, l: 8, poids: 120 },  // ← dimensions & poids de base
        prix_modelisation: 10,                          // ← prix de conception en €
      },
      {
        id: "pot-fleurs-01",
        nom: "Pot de fleurs tressé",
        image: "assets/3d/pot-fleurs-main.jpg",
        stl: "assets/3d/pot-fleurs.stl",
        images_sup: ["", "", "", ""],
        dim_base: { h: 10, w: 10, l: 10, poids: 90 },
        prix_modelisation: 8,
      },
      // ↓↓↓ AJOUTER D'AUTRES FICHIERS ICI (copier le bloc ci-dessus) ↓↓↓
    ]
  },

  /* ---- CATÉGORIE : Utilitaire ---- */
  {
    categorie: "Utilitaire",
    fichiers: [
      {
        id: "support-telephone-01",
        nom: "Support téléphone de bureau",
        image: "assets/3d/support-tel-main.jpg",
        stl: "assets/3d/support-tel.stl",
        images_sup: ["", "", "", ""],
        dim_base: { h: 12, w: 8, l: 10, poids: 80 },
        prix_modelisation: 6,
      },
      {
        id: "boite-rangement-01",
        nom: "Boîte de rangement avec couvercle",
        image: "assets/3d/boite-main.jpg",
        stl: "assets/3d/boite.stl",
        images_sup: ["", "", "", ""],
        dim_base: { h: 8, w: 15, l: 10, poids: 150 },
        prix_modelisation: 12,
      },
      // ↓↓↓ AJOUTER D'AUTRES FICHIERS ICI ↓↓↓
    ]
  },

  /* ---- CATÉGORIE : Jeux & Loisirs ---- */
  {
    categorie: "Jeux & Loisirs",
    fichiers: [
      {
        id: "figurine-01",
        nom: "Figurine robot",
        image: "assets/3d/figurine-main.jpg",
        stl: "assets/3d/figurine.stl",
        images_sup: ["", "", "", ""],
        dim_base: { h: 15, w: 8, l: 6, poids: 100 },
        prix_modelisation: 20,
      },
      // ↓↓↓ AJOUTER D'AUTRES FICHIERS ICI ↓↓↓
    ]
  },

  // ↓↓↓ AJOUTER D'AUTRES CATÉGORIES ICI (copier le bloc "categorie" ci-dessus) ↓↓↓
];


/* ============================================================
   CATALOGUE DÉCOUPE LASER
   ============================================================
   Même structure que DATA_3D mais :
   - pas de champ "stl"
   - dim_base n'a que { w, l, poids } (pas de hauteur pour la découpe 2D)
   ============================================================ */
const DATA_LASER = [

  /* ---- CATÉGORIE : Décoration ---- */
  {
    categorie: "Décoration",
    fichiers: [
      {
        id: "mandala-01",
        nom: "Mandala décoratif",
        image: "assets/laser/mandala-main.jpg",   // ← REMPLACE par ton image
        images_sup: [
          "assets/laser/mandala-2.jpg",
          "",
          "",
          "",
        ],
        dim_base: { h: 40, w: 40, poids: 200 },   // h=hauteur, w=largeur (2D)
        prix_modelisation: 15,
      },
      // ↓↓↓ AJOUTER D'AUTRES FICHIERS ICI ↓↓↓
    ]
  },

  /* ---- CATÉGORIE : Mobilier ---- */
  {
    categorie: "Mobilier & Rangement",
    fichiers: [
      {
        id: "etagere-01",
        nom: "Étagère modulaire",
        image: "assets/laser/etagere-main.jpg",
        images_sup: ["", "", "", ""],
        dim_base: { h: 50, w: 30, poids: 800 },
        prix_modelisation: 25,
      },
      // ↓↓↓ AJOUTER D'AUTRES FICHIERS ICI ↓↓↓
    ]
  },

  // ↓↓↓ AJOUTER D'AUTRES CATÉGORIES ICI ↓↓↓
];
