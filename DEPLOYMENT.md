# Guide de Déploiement - Reine d'Afrique

Ce document décrit les étapes pour déployer le site Reine d'Afrique en production.

## 📋 Prérequis

- Node.js >= 20.19.0
- npm >= 9.0.0
- Un compte sur une plateforme de déploiement (Vercel, Netlify, etc.)

## 🚀 Préparation avant déploiement

### 1. Vérifier les dépendances

```bash
npm install
```

### 2. Lancer les tests de linting

```bash
npm run lint
```

### 3. Corriger automatiquement les erreurs de linting

```bash
npm run lint:fix
```

### 4. Nettoyer les anciens builds

```bash
npm run clean
```

### 5. Build de production

```bash
npm run build
```

Le dossier `dist/` contiendra tous les fichiers optimisés pour la production.

### 6. Prévisualiser le build localement

```bash
npm run preview
```

Le site sera accessible sur `http://localhost:4173`

## 📦 Scripts de déploiement

### Script complet de pré-déploiement

```bash
npm run predeploy
```

Ce script exécute automatiquement :
- Linting du code
- Nettoyage des anciens builds
- Build de production

### Vérification avant déploiement

```bash
npm run deploy:check
```

Ce script vérifie que tout est prêt pour le déploiement.

## 🌐 Déploiement sur différentes plateformes

### Vercel (Recommandé)

1. Installer Vercel CLI :
```bash
npm i -g vercel
```

2. Se connecter :
```bash
vercel login
```

3. Déployer :
```bash
vercel --prod
```

**Configuration automatique :**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Netlify

1. Installer Netlify CLI :
```bash
npm i -g netlify-cli
```

2. Se connecter :
```bash
netlify login
```

3. Déployer :
```bash
netlify deploy --prod --dir=dist
```

**Configuration dans Netlify Dashboard :**
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: `20.19.0`

### GitHub Pages

1. Installer `gh-pages` :
```bash
npm install --save-dev gh-pages
```

2. Ajouter dans `package.json` :
```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

3. Configurer le base path dans `vite.config.js` :
```js
export default defineConfig({
  base: '/reine-afrique/', // Remplacez par le nom de votre repo
  // ... reste de la config
})
```

4. Déployer :
```bash
npm run deploy
```

## 🔧 Configuration de production

### Variables d'environnement

Si vous utilisez des variables d'environnement, créez un fichier `.env.production` :

```env
VITE_API_URL=https://api.reinedafrique.com
VITE_WHATSAPP_NUMBER=2290150035719
VITE_SITE_URL=https://www.reinedafrique.com
```

### Optimisations incluses

- ✅ Code splitting automatique
- ✅ Minification des assets
- ✅ Compression gzip
- ✅ Lazy loading des routes
- ✅ Optimisation des images
- ✅ Cache des assets avec hash

## 📊 Vérifications post-déploiement

Après le déploiement, vérifiez :

- [ ] Le site est accessible
- [ ] Toutes les pages fonctionnent
- [ ] Les images se chargent correctement
- [ ] Les animations fonctionnent
- [ ] Le formulaire de contact fonctionne
- [ ] Les liens WhatsApp fonctionnent
- [ ] Le site est responsive sur mobile
- [ ] Les meta tags sont corrects (vérifier avec les outils de prévisualisation)
- [ ] Le site est rapide (vérifier avec PageSpeed Insights)

## 🐛 Résolution de problèmes

### Erreur de build

Si le build échoue :
1. Vérifier les versions de Node.js et npm
2. Nettoyer et réinstaller : `npm run clean && rm -rf node_modules && npm install`
3. Vérifier les erreurs de linting : `npm run lint`

### Problèmes de routing

Si les routes ne fonctionnent pas après déploiement :
- Vercel : Configuration automatique
- Netlify : Créer un fichier `public/_redirects` avec :
```
/*    /index.html   200
```

### Problèmes de CORS

Si vous avez des problèmes de CORS avec une API :
- Configurer les headers CORS sur le serveur API
- Vérifier les variables d'environnement

## 📝 Notes importantes

- Le dossier `dist/` ne doit **jamais** être commité dans Git (déjà dans `.gitignore`)
- Toujours tester le build localement avant de déployer
- Garder les versions de Node.js et npm à jour
- Documenter toute modification de configuration

## 🔄 Mise à jour du site

Pour mettre à jour le site :

1. Faire les modifications dans le code
2. Tester localement : `npm run dev`
3. Lancer le build : `npm run build`
4. Prévisualiser : `npm run preview`
5. Déployer : Suivre les étapes de votre plateforme

---

**Dernière mise à jour** : 2024
