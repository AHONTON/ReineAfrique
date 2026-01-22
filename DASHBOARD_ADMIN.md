# Dashboard Admin - Reine d'Afrique

## 📋 Vue d'ensemble

Dashboard Admin complet et professionnel pour la gestion d'un commerce de tissus africains. Développé en React JSX avec authentification JWT, intégration API REST, et interface moderne.

## 🚀 Fonctionnalités

### 🔐 Authentification
- Page de connexion sécurisée (`/admin/login`)
- Authentification JWT via API REST
- Stockage du token dans `localStorage`
- Intercepteurs Axios pour gestion automatique des tokens
- Protection de toutes les routes admin
- Déconnexion avec confirmation SweetAlert2

### 📊 Dashboard Principal
- **Statistiques en temps réel** :
  - Chiffre d'affaires
  - Nombre de commandes
  - Nouveaux clients
  - Produits en stock faible
- **Filtres de période** :
  - Jour
  - Semaine
  - Mois
  - Période personnalisée (date début/fin)
- **Graphiques interactifs** :
  - Ventes mensuelles (Bar Chart)
  - Répartition des ventes par catégorie (Pie Chart)

### 📦 Gestion des Commandes
- Liste complète des commandes avec pagination
- Recherche et filtres par statut
- Statuts disponibles :
  - En discussion
  - Confirmée
  - En préparation
  - Livrée
  - Annulée
- Modification de statut avec confirmation
- Détails complets de chaque commande

### 👤 Gestion des Clients (CRUD)
- Liste des clients avec pagination
- Création de nouveaux clients
- Modification des informations clients
- Suppression avec confirmation
- Recherche avancée
- Vue détaillée avec historique des commandes
- Total dépensé par client

### 🧵 Gestion du Stock
- **Gestion des Catégories** :
  - CRUD complet
  - Nom et description
- **Gestion des Produits** :
  - CRUD complet
  - Stock en mètres
  - Prix au mètre
  - Association à une catégorie
  - Alertes visuelles pour stock faible (< 10m)

### 💰 Finances
- **Statistiques** :
  - Solde journalier
  - Solde hebdomadaire
  - Solde mensuel
- **Graphiques** :
  - Évolution du chiffre d'affaires (Line Chart)
- **Transactions** :
  - Liste complète des transactions
  - Type (vente/dépense)
  - Montants avec codes couleur
  - Filtres par période

### 📤 Exportation des Données
- Export des clients (CSV/Excel)
- Export des commandes (CSV/Excel)
- Export des finances (CSV/Excel)
- Export du stock (CSV/Excel)
- Téléchargement automatique avec nom de fichier daté

## 🛠️ Stack Technique

- **React 18** (JSX)
- **Vite** (Build tool)
- **Tailwind CSS** (Styling)
- **React Router DOM** (Routing)
- **Axios** (HTTP Client)
- **JWT** (Authentication)
- **SweetAlert2** (Notifications)
- **Recharts** (Graphiques)
- **Lucide React** (Icônes)
- **Framer Motion** (Animations)

## 📁 Structure du Projet

```
src/
 ├─ api/
 │   └─ axios.js                    # Configuration Axios avec intercepteurs
 ├─ auth/
 │   ├─ AuthContext.jsx              # Contexte d'authentification
 │   └─ ProtectedRoute.jsx          # Protection des routes
 ├─ layouts/
 │   └─ admin/
 │       ├─ AdminLayout.jsx          # Layout principal admin
 │       ├─ Sidebar.jsx              # Navigation latérale
 │       └─ Header.jsx               # En-tête avec infos utilisateur
 ├─ pages/
 │   └─ admin/
 │       ├─ Login.jsx                # Page de connexion
 │       ├─ Dashboard.jsx            # Dashboard principal
 │       ├─ Orders.jsx                # Gestion des commandes
 │       ├─ Clients.jsx              # Gestion des clients
 │       ├─ Stock.jsx                 # Gestion du stock
 │       ├─ Finance.jsx               # Gestion des finances
 │       └─ Export.jsx                # Exportation des données
 ├─ components/
 │   └─ admin/
 │       ├─ StatCard.jsx              # Carte de statistique
 │       ├─ DataTable.jsx             # Table de données réutilisable
 │       ├─ Modal.jsx                 # Modal réutilisable
 │       └─ Loader.jsx                 # Composant de chargement
 └─ utils/
     └─ swal.js                       # Utilitaires SweetAlert2 centralisés
```

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
VITE_API_URL=http://localhost:3000/api
```

Pour la production :

```env
VITE_API_URL=https://api.reineafrique.com/api
```

## 🔌 API Endpoints Requis

Le dashboard s'attend à une API REST avec les endpoints suivants :

### Authentification
- `POST /api/auth/login` - Connexion
  - Body: `{ email, password }`
  - Response: `{ token, admin: { id, name, email } }`

### Dashboard
- `GET /api/admin/dashboard/stats?period=...` - Statistiques
- `GET /api/admin/dashboard/sales?period=...` - Données de ventes
- `GET /api/admin/dashboard/distribution?period=...` - Répartition des ventes

### Commandes
- `GET /api/admin/orders?status=...` - Liste des commandes
- `GET /api/admin/orders/:id` - Détails d'une commande
- `PUT /api/admin/orders/:id/status` - Modifier le statut

### Clients
- `GET /api/admin/clients` - Liste des clients
- `GET /api/admin/clients/:id` - Détails d'un client
- `POST /api/admin/clients` - Créer un client
- `PUT /api/admin/clients/:id` - Modifier un client
- `DELETE /api/admin/clients/:id` - Supprimer un client

### Stock
- `GET /api/admin/categories` - Liste des catégories
- `POST /api/admin/categories` - Créer une catégorie
- `PUT /api/admin/categories/:id` - Modifier une catégorie
- `DELETE /api/admin/categories/:id` - Supprimer une catégorie
- `GET /api/admin/products` - Liste des produits
- `POST /api/admin/products` - Créer un produit
- `PUT /api/admin/products/:id` - Modifier un produit
- `DELETE /api/admin/products/:id` - Supprimer un produit

### Finances
- `GET /api/admin/finance/stats?period=...` - Statistiques financières
- `GET /api/admin/finance/transactions?period=...` - Liste des transactions
- `GET /api/admin/finance/revenue?period=...` - Données de revenus

### Exports
- `GET /api/admin/export/clients?format=csv|xlsx` - Export clients
- `GET /api/admin/export/orders?format=csv|xlsx` - Export commandes
- `GET /api/admin/export/finance?format=csv|xlsx` - Export finances
- `GET /api/admin/export/stock?format=csv|xlsx` - Export stock

## 🚀 Démarrage

1. **Installer les dépendances** :
```bash
npm install
```

2. **Configurer l'API** :
Créez un fichier `.env` avec l'URL de votre API :
```env
VITE_API_URL=http://localhost:3000/api
```

3. **Lancer le serveur de développement** :
```bash
npm run dev
```

4. **Accéder au dashboard** :
- Site public : `http://localhost:5173`
- Dashboard admin : `http://localhost:5173/admin/login`

## 🔒 Sécurité

- Toutes les routes admin sont protégées par JWT
- Le token est automatiquement ajouté aux requêtes via intercepteur Axios
- Redirection automatique vers `/admin/login` en cas d'erreur 401/403
- Nettoyage du token à la déconnexion
- Protection contre les accès non autorisés

## 🎨 Design

- Design moderne et professionnel
- Palette de couleurs inspirée de l'Afrique (oranges, bruns)
- Animations fluides avec Framer Motion
- Responsive design (mobile-first)
- Sidebar rétractable sur mobile
- Tables responsives avec pagination
- Modals animés pour les actions

## 📝 Notes Importantes

- **Aucune donnée statique** : Toutes les données proviennent de l'API
- **SweetAlert2 uniquement** : Aucun `alert()` natif utilisé
- **Gestion d'erreurs complète** : Toutes les erreurs API sont gérées
- **Loading states** : Skeleton loaders et spinners pour une meilleure UX
- **Code modulaire** : Composants réutilisables et maintenables

## 🐛 Dépannage

### Erreur 401/403
- Vérifiez que le token JWT est valide
- Vérifiez que l'API renvoie le bon format de réponse
- Vérifiez la configuration de `VITE_API_URL`

### Les données ne se chargent pas
- Vérifiez la console du navigateur pour les erreurs
- Vérifiez que l'API est accessible
- Vérifiez les endpoints dans les DevTools Network

### Problèmes de style
- Vérifiez que Tailwind CSS est bien configuré
- Vérifiez que les classes Tailwind sont correctement compilées

## 📄 Licence

© 2024 Reine d'Afrique. Tous droits réservés.
