/* ============================================================
   APP.JS — LOGIQUE PRINCIPALE LAFORGE
   ============================================================ */

/* ============================================================
   NAVIGATION PAR ONGLETS
   ============================================================ */
document.querySelectorAll('.nav-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    // Désactiver tous les onglets
    document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
    // Activer le bon
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});


/* ============================================================
   GÉNÉRATION DES CATALOGUES
   ============================================================ */

/** Génère le catalogue complet (3D ou laser) dans un conteneur */
function genererCatalogue(data, conteneurId, type) {
  const conteneur = document.getElementById(conteneurId);
  conteneur.innerHTML = '';

  data.forEach(cat => {
    // Titre de catégorie
    const titreEl = document.createElement('h2');
    titreEl.className = 'categorie-titre';
    titreEl.textContent = cat.categorie;
    conteneur.appendChild(titreEl);

    // Grille de fichiers
    const grille = document.createElement('div');
    grille.className = 'fichiers-grille';

    cat.fichiers.forEach(fichier => {
      const card = document.createElement('div');
      card.className = 'fichier-card';
      card.onclick = () => ouvrirDetail(fichier, type);

      // Image
      const img = document.createElement('img');
      img.src = fichier.image || 'assets/placeholder.jpg';
      img.alt = fichier.nom;
      img.className = 'fichier-card-img';
      img.onerror = function() {
        this.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="160"><rect fill="%23e8f4f8" width="200" height="160"/><text x="50%" y="50%" text-anchor="middle" fill="%2390caf9" font-size="14" dy=".3em">Image à venir</text></svg>';
      };

      // Nom
      const nom = document.createElement('p');
      nom.className = 'fichier-card-nom';
      nom.textContent = fichier.nom;

      card.appendChild(img);
      card.appendChild(nom);
      grille.appendChild(card);
    });

    conteneur.appendChild(grille);
  });
}

// Génération au chargement
genererCatalogue(DATA_3D, 'catalogue-3d', '3d');
genererCatalogue(DATA_LASER, 'catalogue-laser', 'laser');


/* ============================================================
   PAGE DÉTAIL D'UN FICHIER
   ============================================================ */

// Fichier courant (utile pour la commande)
let fichierCourant = null;
let typeCourant = null;
let dimCourante = {};

/** Ouvre la page détail pour un fichier */
function ouvrirDetail(fichier, type) {
  fichierCourant = fichier;
  typeCourant = type;

  // Titre
  document.getElementById('detail-titre').textContent = fichier.nom;

  // Image principale
  const imgPrincipale = document.getElementById('detail-img-principale');
  imgPrincipale.src = fichier.image || '';
  imgPrincipale.alt = fichier.nom;

  // Images supplémentaires
  for (let i = 1; i <= 4; i++) {
    const imgEl = document.getElementById('img-extra-' + i);
    const emptyEl = imgEl.nextElementSibling;
    const src = fichier.images_sup && fichier.images_sup[i - 1];
    if (src) {
      imgEl.src = src;
      imgEl.style.display = 'block';
      emptyEl.style.display = 'none';
    } else {
      imgEl.style.display = 'none';
      emptyEl.style.display = 'block';
      emptyEl.textContent = 'Photo ' + (i + 1);
    }
  }

  // STL Viewer (seulement pour la 3D)
  const stlCard = document.querySelector('.detail-stl-card');
  if (type === '3d' && fichier.stl) {
    stlCard.style.display = 'flex';
    document.getElementById('stl-filename').textContent = fichier.stl.split('/').pop();
    initSTLViewer(fichier.stl);
  } else if (type === '3d') {
    stlCard.style.display = 'flex';
    document.getElementById('stl-filename').textContent = 'Aucun fichier STL renseigné';
  } else {
    stlCard.style.display = 'none';
  }

  // Afficher / cacher l'option STL
  document.getElementById('option-stl').style.display = type === '3d' ? 'block' : 'none';

  // Dimensions de base
  dimCourante = { ...fichier.dim_base };
  document.getElementById('dim-h').value = dimCourante.h || '';
  document.getElementById('dim-w').value = dimCourante.w || '';
  document.getElementById('dim-l').value = dimCourante.l || (type === 'laser' ? '' : dimCourante.l);
  document.getElementById('dim-poids').value = dimCourante.poids || '';

  // Cache champ longueur si laser (2D)
  const labelL = document.getElementById('dim-l').parentElement;
  labelL.style.display = type === 'laser' ? 'none' : 'flex';

  // Note dimensions max
  const noteMax = document.getElementById('dim-note-max');
  if (type === '3d') {
    noteMax.textContent = `Max : ${CONFIG.max_3d.h}×${CONFIG.max_3d.w}×${CONFIG.max_3d.l} cm`;
  } else {
    noteMax.textContent = `Max : ${CONFIG.max_laser.h}×${CONFIG.max_laser.w} cm`;
  }

  // Filaments ou matériaux
  const labelFilament = document.getElementById('label-filament');
  const optionsDiv = document.getElementById('filament-options');
  const materiaux = type === '3d' ? FILAMENTS : MATERIAUX_LASER;
  labelFilament.textContent = type === '3d' ? '🎨 Type de filament' : '🪵 Matériau';

  optionsDiv.innerHTML = '';
  materiaux.forEach((mat, idx) => {
    const label = document.createElement('label');
    label.className = 'mat-option';
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'materiau';
    input.value = mat.id;
    input.dataset.prixKg = mat.prix_kg;
    if (idx === 0) input.checked = true;
    input.addEventListener('change', recalcPrix);

    if (type === '3d' && mat.couleur) {
      const swatch = document.createElement('span');
      swatch.className = 'couleur-swatch';
      swatch.style.background = mat.couleur;
      label.appendChild(input);
      label.appendChild(swatch);
    } else {
      label.appendChild(input);
    }
    label.appendChild(document.createTextNode(' ' + mat.nom));
    optionsDiv.appendChild(label);
  });

  // Prix modélisation (valeur fixe du fichier)
  document.getElementById('prix-modelisation').textContent =
    fichier.prix_modelisation.toFixed(2) + ' €';

  // Remise à zéro livraison et STL
  document.getElementById('prix-livraison').textContent = '0.00 €';
  document.getElementById('ville-livraison').value = '';
  if (document.getElementById('achat-stl-only')) {
    document.getElementById('achat-stl-only').checked = false;
  }

  recalcPrix();

  // Afficher l'overlay
  document.getElementById('detail-overlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';
  window.scrollTo(0, 0);
}

/** Ferme la page détail */
function fermerDetail() {
  document.getElementById('detail-overlay').style.display = 'none';
  document.body.style.overflow = '';
  fichierCourant = null;
  // Nettoyer le viewer STL
  const viewer = document.getElementById('stl-viewer');
  const canvas = viewer.querySelector('canvas');
  if (canvas) canvas.remove();
}

// Fermer en cliquant en dehors
document.getElementById('detail-overlay').addEventListener('click', function(e) {
  if (e.target === this) fermerDetail();
});


/* ============================================================
   VIEWER STL (Three.js)
   ============================================================ */
let stlScene, stlCamera, stlRenderer, stlAnimId;

function initSTLViewer(stlPath) {
  const viewer = document.getElementById('stl-viewer');
  // Nettoyer l'ancien viewer
  const oldCanvas = viewer.querySelector('canvas');
  if (oldCanvas) oldCanvas.remove();
  if (stlAnimId) cancelAnimationFrame(stlAnimId);

  // Three.js setup
  const W = viewer.clientWidth || 400;
  const H = viewer.clientHeight || 300;

  stlScene = new THREE.Scene();
  stlScene.background = new THREE.Color(0xe8f4f8);

  stlCamera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000);
  stlCamera.position.set(0, 0, 300);

  stlRenderer = new THREE.WebGLRenderer({ antialias: true });
  stlRenderer.setSize(W, H);
  viewer.appendChild(stlRenderer.domElement);

  // Lumières
  const ambiant = new THREE.AmbientLight(0xffffff, 0.6);
  stlScene.add(ambiant);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(1, 2, 3);
  stlScene.add(dirLight);

  // Essayer de charger le fichier STL
  fetch(stlPath)
    .then(r => {
      if (!r.ok) throw new Error('STL non trouvé');
      return r.arrayBuffer();
    })
    .then(buffer => {
      const geometry = parseSTL(buffer);
      geometry.computeBoundingBox();
      geometry.center();

      const bbox = geometry.boundingBox;
      const size = new THREE.Vector3();
      bbox.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      stlCamera.position.z = maxDim * 2;

      const material = new THREE.MeshPhongMaterial({
        color: 0x29b6f6,
        specular: 0x111111,
        shininess: 80,
      });
      const mesh = new THREE.Mesh(geometry, material);
      stlScene.add(mesh);
      animer3D(mesh);
    })
    .catch(() => {
      // STL non chargé : afficher un cube placeholder
      const geo = new THREE.BoxGeometry(80, 80, 80);
      const mat = new THREE.MeshPhongMaterial({ color: 0x90caf9, wireframe: false });
      const cube = new THREE.Mesh(geo, mat);
      stlScene.add(cube);
      animer3D(cube);
    });

  // Rotation par drag souris
  let isDragging = false, lastX = 0, lastY = 0;
  const canvas = stlRenderer.domElement;

  canvas.addEventListener('mousedown', e => { isDragging = true; lastX = e.clientX; lastY = e.clientY; });
  canvas.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    if (stlScene.children[2]) {
      stlScene.children[2].rotation.y += dx * 0.01;
      stlScene.children[2].rotation.x += dy * 0.01;
    }
    lastX = e.clientX; lastY = e.clientY;
  });
  canvas.addEventListener('mouseup', () => { isDragging = false; });

  // Tactile
  canvas.addEventListener('touchstart', e => {
    isDragging = true;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
  });
  canvas.addEventListener('touchmove', e => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - lastX;
    const dy = e.touches[0].clientY - lastY;
    if (stlScene.children[2]) {
      stlScene.children[2].rotation.y += dx * 0.01;
      stlScene.children[2].rotation.x += dy * 0.01;
    }
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
  });
  canvas.addEventListener('touchend', () => { isDragging = false; });
}

function animer3D(mesh) {
  function loop() {
    stlAnimId = requestAnimationFrame(loop);
    if (!document.getElementById('detail-overlay') ||
        document.getElementById('detail-overlay').style.display === 'none') {
      cancelAnimationFrame(stlAnimId);
      return;
    }
    stlRenderer.render(stlScene, stlCamera);
  }
  loop();
}

/** Parseur STL binaire minimal */
function parseSTL(buffer) {
  const view = new DataView(buffer);
  const numTriangles = view.getUint32(80, true);
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(numTriangles * 9);
  const normals = new Float32Array(numTriangles * 9);

  let offset = 84;
  for (let i = 0; i < numTriangles; i++) {
    const nx = view.getFloat32(offset, true); offset += 4;
    const ny = view.getFloat32(offset, true); offset += 4;
    const nz = view.getFloat32(offset, true); offset += 4;
    for (let v = 0; v < 3; v++) {
      positions[i * 9 + v * 3]     = view.getFloat32(offset, true); offset += 4;
      positions[i * 9 + v * 3 + 1] = view.getFloat32(offset, true); offset += 4;
      positions[i * 9 + v * 3 + 2] = view.getFloat32(offset, true); offset += 4;
      normals[i * 9 + v * 3] = nx;
      normals[i * 9 + v * 3 + 1] = ny;
      normals[i * 9 + v * 3 + 2] = nz;
    }
    offset += 2; // attribut byte count
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('normal',   new THREE.BufferAttribute(normals, 3));
  return geometry;
}


/* ============================================================
   CALCUL DES DIMENSIONS (redimensionnement proportionnel)
   ============================================================ */

/** Appelé quand l'utilisateur change une dimension */
function recalcDimensions(champ) {
  if (!fichierCourant) return;
  const base = fichierCourant.dim_base;

  const hEl     = document.getElementById('dim-h');
  const wEl     = document.getElementById('dim-w');
  const lEl     = document.getElementById('dim-l');
  const poidsEl = document.getElementById('dim-poids');

  const baseH = base.h || 1;
  const baseW = base.w || 1;
  const baseL = base.l || 1;
  const baseP = base.poids || 1;

  let ratio;

  if (champ === 'h') {
    ratio = parseFloat(hEl.value) / baseH;
  } else if (champ === 'w') {
    ratio = parseFloat(wEl.value) / baseW;
  } else if (champ === 'l') {
    ratio = parseFloat(lEl.value) / baseL;
  } else { // poids
    ratio = parseFloat(poidsEl.value) / baseP;
  }

  if (!isFinite(ratio) || ratio <= 0) return;

  // Vérifier limites max
  const maxH = typeCourant === '3d' ? CONFIG.max_3d.h : CONFIG.max_laser.h;
  const maxW = typeCourant === '3d' ? CONFIG.max_3d.w : CONFIG.max_laser.w;

  if (champ !== 'h') hEl.value = clamp(baseH * ratio, 0.1, maxH).toFixed(1);
  if (champ !== 'w') wEl.value = clamp(baseW * ratio, 0.1, maxW).toFixed(1);
  if (typeCourant === '3d') {
    if (champ !== 'l') lEl.value = clamp(baseL * ratio, 0.1, CONFIG.max_3d.l).toFixed(1);
  }
  if (champ !== 'poids') poidsEl.value = (baseP * ratio).toFixed(1);

  recalcPrix();
}

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}


/* ============================================================
   CALCUL DES PRIX
   ============================================================ */

function recalcPrix() {
  if (!fichierCourant) return;

  const poids = parseFloat(document.getElementById('dim-poids').value) || 0;
  const stlOnly = document.getElementById('achat-stl-only') &&
                  document.getElementById('achat-stl-only').checked;

  // Prix matière sélectionnée
  const selected = document.querySelector('input[name="materiau"]:checked');
  const prixKg = selected ? parseFloat(selected.dataset.prixKg) : CONFIG.prix_pla_par_kg;

  let prixImpression = 0;
  let prixModelo = fichierCourant.prix_modelisation || 0;

  if (stlOnly) {
    // Vente uniquement du fichier STL
    prixImpression = 0;
    prixModelo = prixModelo * CONFIG.marge_stl;
  } else {
    const marge = typeCourant === '3d' ? CONFIG.marge_impression : CONFIG.marge_laser;
    prixImpression = (poids / 1000) * prixKg * marge;
  }

  // Livraison
  const prixLivraison = parseFloat(document.getElementById('prix-livraison').textContent) || 0;

  const total = prixImpression + prixModelo + prixLivraison;

  // Mise à jour affichage
  document.getElementById('prix-impression').textContent = prixImpression.toFixed(2) + ' €';
  document.getElementById('prix-modelisation').textContent = prixModelo.toFixed(2) + ' €';
  document.getElementById('total-impression').textContent = prixImpression.toFixed(2) + ' €';
  document.getElementById('total-modelisation').textContent = prixModelo.toFixed(2) + ' €';
  document.getElementById('total-livraison').textContent = prixLivraison.toFixed(2) + ' €';
  document.getElementById('prix-total').textContent = total.toFixed(2) + ' €';
}


/* ============================================================
   CALCUL LIVRAISON
   ============================================================ */

function estimerLivraison() {
  const ville = document.getElementById('ville-livraison').value.toLowerCase().trim();
  let distance = 0;
  let trouvé = false;

  // Chercher dans la base
  for (const [nom, km] of Object.entries(CONFIG.distances_villes)) {
    if (ville.includes(nom) || nom.includes(ville)) {
      distance = km;
      trouvé = true;
      break;
    }
  }

  // Si non trouvé, estimation grossière
  if (!trouvé && ville.length > 2) {
    distance = 500; // valeur par défaut si ville inconnue
  }

  const prixLivraison = distance * CONFIG.prix_par_km;
  document.getElementById('prix-livraison').textContent = prixLivraison.toFixed(2) + ' €';

  recalcPrix();
}


/* ============================================================
   COMMANDE (envoi par mailto)
   ============================================================ */

function commander() {
  if (!fichierCourant) return;

  const selected = document.querySelector('input[name="materiau"]:checked');
  const materiau = selected ? selected.parentElement.textContent.trim() : 'Non renseigné';
  const stlOnly = document.getElementById('achat-stl-only') &&
                  document.getElementById('achat-stl-only').checked;

  const h     = document.getElementById('dim-h').value;
  const w     = document.getElementById('dim-w').value;
  const l     = document.getElementById('dim-l').value;
  const poids = document.getElementById('dim-poids').value;
  const ville = document.getElementById('ville-livraison').value || 'Non renseignée';
  const total = document.getElementById('prix-total').textContent;

  const sujet = encodeURIComponent(`[LAFORGE] Commande : ${fichierCourant.nom}`);
  const corps = encodeURIComponent(
    `Bonjour,\n\n` +
    `Nouvelle commande reçue depuis le site LAFORGE :\n\n` +
    `Fichier : ${fichierCourant.nom}\n` +
    `Type : ${typeCourant === '3d' ? 'Impression 3D' : 'Découpe Laser'}\n` +
    (stlOnly ? `Option : Achat du fichier STL uniquement\n` : '') +
    `\nDimensions :\n` +
    `  Hauteur : ${h} cm\n` +
    `  Largeur : ${w} cm\n` +
    (typeCourant === '3d' ? `  Longueur : ${l} cm\n` : '') +
    `  Poids estimé : ${poids} g\n` +
    `\n${typeCourant === '3d' ? 'Filament' : 'Matériau'} : ${materiau}\n` +
    `\nLieu de livraison : ${ville}\n` +
    `\nPrix total estimé : ${total}\n` +
    `\n---\nCe mail a été généré automatiquement via le site LAFORGE.`
  );

  window.location.href = `mailto:${CONFIG.email_contact}?subject=${sujet}&body=${corps}`;
}


/* ============================================================
   DEMANDE PERSONNALISÉE (envoi par mailto)
   ============================================================ */

function envoyerDemande() {
  const nom     = document.getElementById('demande-nom').value.trim();
  const email   = document.getElementById('demande-email').value.trim();
  const type    = document.getElementById('demande-type').value;
  const message = document.getElementById('demande-message').value.trim();

  if (!message) {
    alert('Merci de rédiger votre message avant d\'envoyer.');
    return;
  }

  const typeLabel = { '3d': 'Impression 3D', 'laser': 'Découpe Laser', 'autre': 'Autre / Les deux' }[type];
  const sujet = encodeURIComponent(`[LAFORGE] Demande personnalisée – ${typeLabel}`);
  const corps = encodeURIComponent(
    `Nom : ${nom || 'Non renseigné'}\n` +
    `E-mail : ${email || 'Non renseigné'}\n` +
    `Type de demande : ${typeLabel}\n\n` +
    `Message :\n${message}\n\n` +
    `---\nEnvoyé depuis le formulaire LAFORGE.`
  );

  // Ouvre le client mail avec le message pré-rempli
  // Note : les pièces jointes ne peuvent pas être attachées automatiquement via mailto
  // Le client devra joindre le fichier manuellement après l'ouverture du mail
  window.location.href = `mailto:${CONFIG.email_contact}?subject=${sujet}&body=${corps}`;

  // Message de confirmation
  document.getElementById('demande-confirm').style.display = 'block';
  setTimeout(() => {
    document.getElementById('demande-confirm').style.display = 'none';
  }, 5000);
}
