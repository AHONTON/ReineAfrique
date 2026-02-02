# Guide de Vérification Visuelle - Dashboard Admin

Ce guide permet de vérifier rapidement l'apparence et le fonctionnement du dashboard sur différents appareils.

## 📱 Points de Vérification par Appareil

### Mobile (< 640px)
- [ ] **Header Dashboard**
  - [ ] Le titre "Dashboard" est lisible (text-xl)
  - [ ] Le sous-titre est visible
  - [ ] Le sélecteur de période prend toute la largeur
  - [ ] Les champs de date (période personnalisée) sont empilés verticalement
  - [ ] Marges et espacements sont cohérents (gap-3)

- [ ] **Cartes Statistiques**
  - [ ] Les 4 cartes sont empilées verticalement (grid-cols-1)
  - [ ] Texte des titres lisible (text-xs sm:text-sm)
  - [ ] Valeurs bien visibles (text-xl sm:text-2xl)
  - [ ] Icônes de taille appropriée (size={20})
  - [ ] Espacement entre cartes (gap-3)

- [ ] **Graphiques**
  - [ ] Les graphiques sont empilés verticalement
  - [ ] Hauteur des graphiques adaptée (200px)
  - [ ] Texte des axes lisible (fontSize: 10)
  - [ ] Tooltips fonctionnels au touch
  - [ ] Pas de débordement horizontal
  - [ ] Padding des cartes adapté (p-4)

### Tablette (640px - 1024px)
- [ ] **Header Dashboard**
  - [ ] Titre plus grand (text-2xl)
  - [ ] Sélecteur de période et dates côte à côte si possible
  - [ ] Espacements augmentés (gap-4)

- [ ] **Cartes Statistiques**
  - [ ] 2 colonnes (grid-cols-2)
  - [ ] Texte plus grand (text-sm)
  - [ ] Icônes plus grandes (w-5 h-5)
  - [ ] Espacement entre cartes (gap-4)

- [ ] **Graphiques**
  - [ ] Hauteur augmentée (250px)
  - [ ] Texte des axes plus grand (fontSize: 12)
  - [ ] Padding des cartes augmenté (p-5 md:p-6)
  - [ ] Graphiques côte à côte si espace disponible

### Desktop (> 1024px)
- [ ] **Header Dashboard**
  - [ ] Titre très grand (text-3xl lg:text-4xl)
  - [ ] Tous les éléments alignés horizontalement
  - [ ] Espacements optimaux (gap-6 lg:gap-8)
  - [ ] Padding latéral (px-6 lg:px-8)

- [ ] **Cartes Statistiques**
  - [ ] 4 colonnes (xl:grid-cols-4)
  - [ ] Texte optimal (text-2xl)
  - [ ] Icônes grandes (w-6 h-6)
  - [ ] Espacement généreux (gap-6)

- [ ] **Graphiques**
  - [ ] Hauteur optimale (300px)
  - [ ] 2 colonnes (lg:grid-cols-2)
  - [ ] Texte des axes optimal (fontSize: 12)
  - [ ] Padding généreux (p-6 lg:p-8)
  - [ ] Rayon du graphique circulaire adapté (70px)

## 🎨 Vérifications Visuelles Générales

### Typographie
- [ ] Polices cohérentes (Inter pour admin)
- [ ] Tailles de texte adaptées à chaque breakpoint
- [ ] Contraste suffisant (dark mode vérifié)
- [ ] Pas de texte tronqué ou débordant

### Espacements
- [ ] Marges cohérentes entre sections (space-y-4 sm:space-y-5 md:space-y-6)
- [ ] Padding des cartes adapté à chaque taille d'écran
- [ ] Espacement entre éléments dans les grilles (gap-3 sm:gap-4 md:gap-5 lg:gap-6)

### Couleurs et Thème
- [ ] Mode clair fonctionne correctement
- [ ] Mode sombre fonctionne correctement
- [ ] Couleurs des graphiques visibles dans les deux modes
- [ ] Bordures et ombres cohérentes

### Interactions
- [ ] Hover effects fonctionnent (desktop)
- [ ] Touch interactions fonctionnent (mobile/tablette)
- [ ] Focus states visibles pour l'accessibilité
- [ ] Transitions fluides

## 🔍 Tests Fonctionnels

### Filtres de Période
- [ ] Sélection "Jour" fonctionne
- [ ] Sélection "Semaine" fonctionne
- [ ] Sélection "Mois" fonctionne
- [ ] Sélection "Période personnalisée" affiche les champs de date
- [ ] Les champs de date sont utilisables sur mobile
- [ ] Les données se rafraîchissent après changement de période

### Graphiques
- [ ] Graphique en barres affiche les données correctement
- [ ] Graphique circulaire affiche les données correctement
- [ ] Tooltips s'affichent au survol/touch
- [ ] Les valeurs sont formatées correctement (devise)
- [ ] Pas d'erreurs dans la console

### Responsive
- [ ] Test sur iPhone (375px)
- [ ] Test sur iPad (768px)
- [ ] Test sur Desktop (1920px)
- [ ] Test en mode portrait et paysage (tablette)
- [ ] Redimensionnement de la fenêtre fonctionne correctement

## 🐛 Bugs à Vérifier

### Problèmes Connus Corrigés
- [x] `showError` non défini dans Dashboard.jsx → Corrigé (utilise toastService)
- [x] Marges et polices non adaptées mobile → Corrigé
- [x] Graphiques non responsive → Corrigé avec useWindowSize hook
- [x] Imports manquants showSuccess/showError → Corrigé dans tous les fichiers

### À Vérifier
- [ ] Pas d'erreurs dans la console du navigateur
- [ ] Pas de warnings React
- [ ] Les toasts s'affichent correctement
- [ ] Les confirmations modales fonctionnent (SweetAlert2)
- [ ] Pas de débordement horizontal sur mobile
- [ ] Les graphiques s'adaptent au redimensionnement

## 📝 Notes de Test

### Navigateurs à Tester
- Chrome (desktop et mobile)
- Firefox (desktop et mobile)
- Safari (desktop et mobile)
- Edge

### Résolutions Recommandées
- Mobile: 375px, 414px
- Tablette: 768px, 1024px
- Desktop: 1280px, 1920px

### Mode Sombre
- Vérifier que tous les éléments sont lisibles
- Vérifier les contrastes
- Vérifier les graphiques (couleurs adaptées)

## ✅ Checklist Rapide

Avant de considérer le dashboard comme terminé, vérifier:

1. [ ] Mobile fonctionne sans bugs visuels
2. [ ] Tablette fonctionne sans bugs visuels
3. [ ] Desktop fonctionne sans bugs visuels
4. [ ] Mode sombre fonctionne partout
5. [ ] Tous les graphiques sont lisibles
6. [ ] Tous les filtres fonctionnent
7. [ ] Pas d'erreurs dans la console
8. [ ] Les toasts s'affichent correctement
9. [ ] Les confirmations modales fonctionnent
10. [ ] Performance acceptable sur tous les appareils
