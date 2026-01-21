# 🚀 Guide de Déploiement Rapide

## ✅ Vérification Pré-déploiement

Avant de déployer, exécutez cette commande pour tout vérifier :

```bash
npm run deploy:check
```

Cette commande vérifie :
- ✅ Linting du code
- ✅ Build de production

## 📦 Build de Production

```bash
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`.

## 🌐 Déploiement sur Vercel (Recommandé)

### Option 1 : Via l'interface web
1. Allez sur [vercel.com](https://vercel.com)
2. Connectez votre dépôt Git
3. Vercel détectera automatiquement Vite
4. Configuration automatique :
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Option 2 : Via CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

## 🌐 Déploiement sur Netlify

### Option 1 : Via l'interface web
1. Allez sur [netlify.com](https://netlify.com)
2. Drag & drop le dossier `dist/` ou connectez votre dépôt Git
3. Configuration :
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `20.19.0`

### Option 2 : Via CLI
```bash
npm i -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

## 🌐 Déploiement sur GitHub Pages

1. Installer gh-pages :
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
  base: '/nom-de-votre-repo/',
  // ... reste de la config
})
```

4. Déployer :
```bash
npm run deploy
```

## 🔧 Variables d'Environnement (si nécessaire)

Si vous utilisez des variables d'environnement, créez un fichier `.env.production` :

```env
VITE_API_URL=https://api.example.com
VITE_WHATSAPP_NUMBER=2290150035719
VITE_SITE_URL=https://www.reinedafrique.com
```

**Important** : Sur Vercel/Netlify, configurez ces variables dans les paramètres du projet.

## 📊 Vérifications Post-Déploiement

Après le déploiement, vérifiez :

- [ ] Le site est accessible
- [ ] Toutes les pages fonctionnent (`/`, `/about`, `/blog`, `/contact`)
- [ ] Les images se chargent
- [ ] Les animations fonctionnent
- [ ] Le formulaire de contact fonctionne
- [ ] Les liens WhatsApp fonctionnent
- [ ] Le site est responsive (mobile, tablette, desktop)
- [ ] L'horloge et la date s'affichent correctement
- [ ] Performance vérifiée (PageSpeed Insights)

## 🐛 Problèmes Courants

### Erreur 404 sur les routes
**Solution** : Créer un fichier `public/_redirects` (pour Netlify) :
```
/*    /index.html   200
```

Pour Vercel, créer `vercel.json` :
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Images ne se chargent pas
**Solution** : Vérifier que les images sont dans `public/images/` et utilisent des chemins absolus (`/images/...`)

### Build échoue
**Solution** :
```bash
npm run clean
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📝 Notes Importantes

- Le dossier `dist/` ne doit **jamais** être commité dans Git
- Toujours tester le build localement avant de déployer : `npm run preview`
- Garder les versions de Node.js et npm à jour
- Documenter toute modification de configuration

---

**Prêt pour le déploiement ! 🎉**
