# Reine d'Afrique 🌍

Site web moderne et interactif pour la promotion et la vente de tissus africains authentiques.

## 🚀 Technologies utilisées

- **React 18.3.1** - Bibliothèque UI moderne
- **Vite 5.4.11** - Build tool ultra-rapide
- **React Router DOM 6.28.0** - Navigation SPA
- **Framer Motion 11.11.17** - Animations fluides et performantes
- **Tailwind CSS 3.4.17** - Framework CSS utilitaire
- **Lucide React 0.446.0** - Icônes modernes et optimisées
- **Axios 1.7.9** - Client HTTP (préparé pour API future)

## ✨ Fonctionnalités principales

### 🎨 Interface utilisateur
- Design moderne et élégant avec animations fluides
- Animations Framer Motion optimisées
- Typographie soignée (Inter, Playfair Display, Poppins)
- Palette de couleurs africaines (amber, orange, red)
- **Horloge en temps réel** dans le Header (tablette et desktop)

### 📱 Responsive Design complet
- **Mobile First** : Optimisé pour smartphones (320px+)
- **Tablette** : Adaptation parfaite (768px+)
- **Desktop** : Expérience complète (1024px+)
- **Large screens** : Support des écrans larges (1280px+)
- Navigation mobile avec menu hamburger animé
- Images et contenus adaptatifs selon la taille d'écran
- Grilles responsives pour toutes les sections

### ⚡ Performance optimisée
- **Lazy loading** des pages avec React.lazy()
- **Code splitting** automatique (React, Framer Motion, Lucide)
- **React.memo** pour éviter les re-renders inutiles
- **useCallback** et **useMemo** pour optimiser les fonctions
- Chargement dynamique avec écran de chargement (5s minimum)
- Détection de l'état de connexion (en ligne/hors ligne)
- Lazy loading des images
- Transitions de page fluides avec PageTransition

### 🎯 Pages disponibles
- **Accueil** (`/`) - Hero banner animé, valeurs, mission, vision, newsletter
- **À propos** (`/about`) - Histoire, impact, choix, FAQ
- **Blog** (`/blog`) - Collections de tissus africains avec catégories
- **Contact** (`/contact`) - Formulaire de contact validé et coordonnées

### 💬 Communication
- **Modal de contact flottant** avec choix WhatsApp/Appel direct
- Boutons WhatsApp avec logo du projet
- Intégration WhatsApp sur tous les points de contact
- Formulaire de contact avec validation en temps réel

## 📦 Installation

### Prérequis
- **Node.js 18.x LTS** (recommandé) ou 20.19+
- **npm >= 9.0.0** ou **pnpm**

### Étapes d'installation

```bash
# 1. Vérifier la version de Node.js
node --version

# 2. Installer les dépendances
npm install
# ou
pnpm install

# 3. Lancer le serveur de développement
npm run dev
# ou
pnpm dev

# 4. Build pour la production
npm run build
# ou
pnpm build

# 5. Prévisualiser le build de production
npm run preview
# ou
pnpm preview
```

Le serveur de développement sera accessible sur `http://localhost:5173` (ou le port indiqué par Vite).

## 🏗️ Structure du projet

```
ReineAfrique/
├── public/
│   └── images/          # Images statiques (logo, tissus, etc.)
├── src/
│   ├── components/      # Composants réutilisables
│   │   ├── Layout/      # Header, Footer, LoadingScreen, PageTransition, Wrapper
│   │   ├── Accueil/     # HeroBanner, FeatureCards, ValeursSection, NotreMission, NotreVision, Newsletter
│   │   ├── About/       # AboutHeroBanner, AboutSection, HistoryImpactSection, Choix, Faq
│   │   ├── Blog/        # BlogBanner, CategoryCard
│   │   ├── Contact/     # ContactBaner, ContactSection
│   │   ├── Clock.jsx    # Composant horloge en temps réel
│   │   ├── ContactModal.jsx  # Modal de contact flottant
│   │   └── WhatsAppIcon.jsx  # Icône WhatsApp réutilisable
│   ├── contexts/        # Contextes React
│   │   └── LoadingContext.jsx  # Gestion du chargement
│   ├── pages/           # Pages principales
│   │   ├── Accueil.jsx
│   │   ├── About.jsx
│   │   ├── Blog.jsx
│   │   └── Contact.jsx
│   ├── App.jsx          # Composant principal avec routing
│   ├── main.jsx         # Point d'entrée
│   └── index.css        # Styles globaux
├── index.html           # Template HTML
├── package.json         # Dépendances et scripts
├── vite.config.js       # Configuration Vite optimisée
├── tailwind.config.js   # Configuration Tailwind CSS
└── README.md           # Ce fichier
```

## 🎨 Personnalisation

### Couleurs principales
- **Amber/Orange** : `#F59E0B`, `#F97316` (couleurs principales)
- **Red** : `#EF4444`, `#DC2626` (accents)
- **Gray** : `#1F2937`, `#374151` (textes)

### Polices
- **Sans-serif** : Inter (corps de texte, interface)
- **Serif** : Playfair Display (titres, élégance)
- **Display** : Poppins (éléments spéciaux)

### Breakpoints Tailwind
- `sm:` : 640px (petites tablettes)
- `md:` : 768px (tablettes)
- `lg:` : 1024px (desktop)
- `xl:` : 1280px (large desktop)
- `2xl:` : 1536px (très large)

## 📞 Contact et informations

- **Téléphone** : +229 01 50 03 57 19
- **WhatsApp** : [https://wa.me/+2290150035719](https://wa.me/+2290150035719)
- **Email** : contact@reinedafrique.com
- **Adresse** : Cotonou, Bénin

### Horaires d'ouverture
- **Lundi - Vendredi** : 9h - 18h
- **Samedi** : 10h - 14h
- **Dimanche** : Fermé

## 🔧 Configuration avancée

### Variables d'environnement
Créer un fichier `.env` à la racine si nécessaire :
```env
VITE_API_URL=https://api.example.com
VITE_WHATSAPP_NUMBER=+2290150035719
```

### Optimisations de build
Le projet utilise :
- **Code splitting** manuel pour réduire la taille des bundles
- **Tree shaking** automatique
- **Minification** des assets
- **Compression** gzip

### Performance
- **Lazy loading** des routes
- **Memoization** des composants lourds
- **Event listeners** optimisés (passive)
- **Images** avec lazy loading natif

## 🐛 Résolution de problèmes

### Erreurs de build
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Problèmes de styles
Vérifier que Tailwind CSS est correctement configuré dans `tailwind.config.js` et que `index.css` importe Tailwind.

### Erreurs de dépendances
```bash
# Mettre à jour les dépendances
npm update
```

### Port déjà utilisé
Vite utilisera automatiquement le prochain port disponible, ou modifier dans `vite.config.js`.

## 📝 Notes importantes

- Le formulaire de contact utilise actuellement une simulation. Remplacer par une vraie API dans `ContactSection.jsx` (ligne ~62).
- Les images doivent être placées dans le dossier `public/images/`.
- Le système de chargement s'affiche automatiquement à chaque accès au site.
- L'horloge dans le Header est visible sur tablette et desktop (md+).
- Le modal de contact est disponible sur toutes les pages en bas à droite.

## 🚀 Déploiement

### Vérification avant déploiement
```bash
npm run deploy:check
```

### Build de production
```bash
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`.

### Prévisualisation du build
```bash
npm run preview
```

### Scripts de déploiement disponibles
- `npm run predeploy` : Linting + nettoyage + build complet
- `npm run deploy:check` : Vérification avant déploiement
- `npm run build:preview` : Build + prévisualisation

### Recommandations de déploiement
- **Vercel** : Déploiement automatique depuis Git (fichier `vercel.json` inclus)
- **Netlify** : Déploiement avec drag & drop ou Git (fichier `public/_redirects` inclus)
- **GitHub Pages** : Configurer le base path dans `vite.config.js`

**📖 Guides détaillés** :
- `DEPLOY_QUICK_START.md` : Guide rapide de déploiement
- `DEPLOYMENT.md` : Guide complet avec toutes les options
- `PREDEPLOYMENT_CHECKLIST.md` : Checklist de vérification

## 📄 Licence

Propriétaire - Reine d'Afrique © 2024

---

**Développé avec ❤️ pour promouvoir l'authenticité des tissus africains**
