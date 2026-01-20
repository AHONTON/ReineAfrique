# Reine d'Afrique 🌍

Site web moderne et interactif pour la promotion et la vente de tissus africains authentiques.

## 🚀 Technologies utilisées

- **React 19** - Bibliothèque UI moderne
- **Vite** - Build tool rapide
- **React Router DOM** - Navigation SPA
- **Framer Motion** - Animations fluides
- **Tailwind CSS** - Framework CSS utilitaire
- **Lucide React** - Icônes modernes
- **Axios** - Client HTTP

## ✨ Fonctionnalités

### 🎨 Interface utilisateur
- Design moderne et responsive
- Animations fluides avec Framer Motion
- Typographie optimisée (Inter, Playfair Display, Poppins)
- Thème cohérent avec couleurs africaines (amber, orange, red)

### 📱 Responsive Design
- Adapté mobile, tablette et desktop
- Navigation mobile optimisée
- Images et contenus adaptatifs

### ⚡ Performance
- Chargement dynamique avec écran de chargement (5s minimum)
- Détection de l'état de connexion (en ligne/hors ligne)
- Lazy loading des images
- Transitions de page fluides

### 🎯 Pages disponibles
- **Accueil** (`/`) - Page d'accueil avec hero banner, valeurs, mission, vision
- **À propos** (`/about`) - Histoire, impact, choix, FAQ
- **Blog** (`/blog`) - Collections de tissus africains
- **Contact** (`/contact`) - Formulaire de contact et coordonnées

## 📦 Installation

```bash
# Installer les dépendances
pnpm install

# Lancer le serveur de développement
pnpm dev

# Build pour la production
pnpm build

# Prévisualiser le build
pnpm preview
```

## 🏗️ Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── Layout/         # Header, Footer, LoadingScreen, etc.
│   ├── Accueil/        # Composants de la page d'accueil
│   ├── About/          # Composants de la page À propos
│   ├── Blog/           # Composants de la page Blog
│   └── Contact/        # Composants de la page Contact
├── contexts/           # Contextes React (LoadingContext)
├── pages/              # Pages principales
└── styles/             # Styles globaux
```

## 🎨 Personnalisation

### Couleurs principales
- Amber/Orange : `#F59E0B`, `#F97316`
- Red : `#EF4444`, `#DC2626`
- Gray : `#1F2937`, `#374151`

### Polices
- **Sans-serif** : Inter (corps de texte)
- **Serif** : Playfair Display (titres)
- **Display** : Poppins (éléments spéciaux)

## 📞 Contact

- **Téléphone** : +229 01 50 03 57 19
- **WhatsApp** : [https://wa.me/+2290150035719](https://wa.me/+2290150035719)

## 🔧 Configuration

### Variables d'environnement
Créer un fichier `.env` si nécessaire pour les variables d'API.

### Build
Le projet utilise Vite pour le build. Les fichiers de production sont générés dans le dossier `dist/`.

## 📝 Notes

- Le formulaire de contact utilise actuellement une simulation. Remplacer par une vraie API dans `ContactSection.jsx`.
- Les images doivent être placées dans le dossier `public/images/`.
- Le système de chargement s'affiche automatiquement à chaque accès au site.

## 🐛 Résolution de problèmes

### Erreurs de build
```bash
# Nettoyer et réinstaller
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Problèmes de styles
Vérifier que Tailwind CSS est correctement configuré dans `tailwind.config.js`.

## 📄 Licence

Propriétaire - Reine d'Afrique
