# Spécification API - Dashboard Admin Reine d'Afrique

## Table des matières
1. [Authentification](#authentification)
2. [Dashboard](#dashboard)
3. [Commandes](#commandes)
4. [Clients](#clients)
5. [Stock](#stock)
6. [Finances](#finances)
7. [Exports](#exports)

---

## Authentification

### POST `/auth/login`
**Description:** Connexion de l'administrateur

**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Réponse (200):**
```json
{
  "token": "string (JWT)",
  "admin": {
    "id": "number",
    "name": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "avatar": "string (URL, optionnel)",
    "photo": "string (URL, optionnel)",
    "image": "string (URL, optionnel)"
  }
}
```

**Erreurs:**
- 401: Identifiants invalides
- 500: Erreur serveur

---

## Dashboard

### GET `/admin/dashboard/stats`
**Description:** Récupère les statistiques générales du dashboard

**Query Parameters:**
- `period` (string, required): `"day" | "week" | "month" | "custom"`
- `startDate` (string, optional): Format ISO date (si period = "custom")
- `endDate` (string, optional): Format ISO date (si period = "custom")

**Réponse (200):**
```json
{
  "revenue": "number (en XOF)",
  "orders": "number",
  "clients": "number",
  "lowStock": "number"
}
```

**Exemple:**
```json
{
  "revenue": 1250000,
  "orders": 45,
  "clients": 12,
  "lowStock": 8
}
```

### GET `/admin/dashboard/sales`
**Description:** Récupère les données de ventes pour le graphique en barres

**Query Parameters:**
- `period` (string, required): `"day" | "week" | "month" | "custom"`
- `startDate` (string, optional)
- `endDate` (string, optional)

**Réponse (200):**
```json
[
  {
    "month": "string (ex: 'Jan', 'Fév', 'Mar')",
    "sales": "number (en XOF)"
  }
]
```

**Exemple:**
```json
[
  { "month": "Jan", "sales": 250000 },
  { "month": "Fév", "sales": 320000 },
  { "month": "Mar", "sales": 280000 }
]
```

### GET `/admin/dashboard/distribution`
**Description:** Récupère la répartition des ventes par catégorie pour le graphique en camembert

**Query Parameters:**
- `period` (string, required)
- `startDate` (string, optional)
- `endDate` (string, optional)

**Réponse (200):**
```json
[
  {
    "name": "string (nom de la catégorie)",
    "value": "number (en XOF)"
  }
]
```

**Exemple:**
```json
[
  { "name": "Wax", "value": 500000 },
  { "name": "Bogolan", "value": 250000 },
  { "name": "Soie", "value": 312500 },
  { "name": "Autres", "value": 187500 }
]
```

---

## Commandes

### GET `/admin/orders`
**Description:** Liste toutes les commandes (avec filtrage optionnel)

**Query Parameters:**
- `status` (string, optional): `"en_discussion" | "confirmee" | "en_preparation" | "livree" | "annulee"`

**Headers:**
- `Authorization: Bearer {token}`

**Réponse (200):**
```json
[
  {
    "id": "number",
    "date": "string (ISO date)",
    "status": "string",
    "amount": "number (en XOF)",
    "client": {
      "id": "number",
      "name": "string"
    },
    "items": [
      {
        "product": {
          "id": "number",
          "name": "string"
        },
        "quantity": "number",
        "price": "number (en XOF)"
      }
    ]
  }
]
```

### PUT `/admin/orders/{orderId}/status`
**Description:** Met à jour le statut d'une commande

**Body:**
```json
{
  "status": "string (en_discussion | confirmee | en_preparation | livree | annulee)"
}
```

**Réponse (200):**
```json
{
  "message": "Statut mis à jour avec succès",
  "order": {
    "id": "number",
    "status": "string",
    ...
  }
}
```

**Statuts possibles:**
- `en_discussion`: En discussion
- `confirmee`: Confirmée
- `en_preparation`: En préparation
- `livree`: Livrée
- `annulee`: Annulée

---

## Clients

### GET `/admin/clients`
**Description:** Liste tous les clients

**Réponse (200):**
```json
[
  {
    "id": "number",
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string (optionnel)",
    "totalOrders": "number",
    "totalSpent": "number (en XOF)"
  }
]
```

### GET `/admin/clients/{clientId}`
**Description:** Récupère les détails complets d'un client avec son historique de commandes

**Réponse (200):**
```json
{
  "id": "number",
  "name": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "totalOrders": "number",
  "totalSpent": "number",
  "orders": [
    {
      "id": "number",
      "date": "string (ISO date)",
      "amount": "number",
      "status": "string"
    }
  ]
}
```

### POST `/admin/clients`
**Description:** Crée un nouveau client

**Body:**
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "phone": "string (required)",
  "address": "string (optional)"
}
```

**Réponse (201):**
```json
{
  "message": "Client créé avec succès",
  "client": {
    "id": "number",
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "totalOrders": 0,
    "totalSpent": 0
  }
}
```

### PUT `/admin/clients/{clientId}`
**Description:** Met à jour un client existant

**Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "address": "string"
}
```

**Réponse (200):**
```json
{
  "message": "Client modifié avec succès",
  "client": { ... }
}
```

### DELETE `/admin/clients/{clientId}`
**Description:** Supprime un client

**Réponse (200):**
```json
{
  "message": "Client supprimé avec succès"
}
```

---

## Stock

### GET `/admin/categories`
**Description:** Liste toutes les catégories de produits

**Réponse (200):**
```json
[
  {
    "id": "number",
    "name": "string",
    "description": "string"
  }
]
```

### POST `/admin/categories`
**Description:** Crée une nouvelle catégorie

**Body:**
```json
{
  "name": "string (required)",
  "description": "string (optional)"
}
```

**Réponse (201):**
```json
{
  "message": "Catégorie créée avec succès",
  "category": {
    "id": "number",
    "name": "string",
    "description": "string"
  }
}
```

### PUT `/admin/categories/{categoryId}`
**Description:** Met à jour une catégorie

**Body:**
```json
{
  "name": "string",
  "description": "string"
}
```

**Réponse (200):**
```json
{
  "message": "Catégorie modifiée avec succès",
  "category": { ... }
}
```

### DELETE `/admin/categories/{categoryId}`
**Description:** Supprime une catégorie

**Réponse (200):**
```json
{
  "message": "Catégorie supprimée avec succès"
}
```

### GET `/admin/products`
**Description:** Liste tous les produits

**Réponse (200):**
```json
[
  {
    "id": "number",
    "name": "string",
    "categoryId": "number",
    "stock": "number (en mètres)",
    "pricePerMeter": "number (en XOF)",
    "description": "string"
  }
]
```

### POST `/admin/products`
**Description:** Crée un nouveau produit

**Body:**
```json
{
  "name": "string (required)",
  "categoryId": "number (required)",
  "stock": "number (required, en mètres)",
  "pricePerMeter": "number (required, en XOF)",
  "description": "string (optional)"
}
```

**Réponse (201):**
```json
{
  "message": "Produit créé avec succès",
  "product": {
    "id": "number",
    "name": "string",
    "categoryId": "number",
    "stock": "number",
    "pricePerMeter": "number",
    "description": "string"
  }
}
```

### PUT `/admin/products/{productId}`
**Description:** Met à jour un produit

**Body:**
```json
{
  "name": "string",
  "categoryId": "number",
  "stock": "number",
  "pricePerMeter": "number",
  "description": "string"
}
```

**Réponse (200):**
```json
{
  "message": "Produit modifié avec succès",
  "product": { ... }
}
```

### DELETE `/admin/products/{productId}`
**Description:** Supprime un produit

**Réponse (200):**
```json
{
  "message": "Produit supprimé avec succès"
}
```

---

## Finances

### GET `/admin/finance/stats`
**Description:** Récupère les statistiques financières (soldes journalier, hebdomadaire, mensuel)

**Query Parameters:**
- `period` (string, required): `"day" | "week" | "month" | "custom"`
- `startDate` (string, optional)
- `endDate` (string, optional)

**Réponse (200):**
```json
{
  "daily": "number (en XOF)",
  "weekly": "number (en XOF)",
  "monthly": "number (en XOF)"
}
```

**Exemple:**
```json
{
  "daily": 45000,
  "weekly": 320000,
  "monthly": 1250000
}
```

### GET `/admin/finance/transactions`
**Description:** Liste toutes les transactions financières

**Query Parameters:**
- `period` (string, required)
- `startDate` (string, optional)
- `endDate` (string, optional)

**Réponse (200):**
```json
[
  {
    "id": "number",
    "date": "string (ISO date)",
    "type": "string ('vente' | 'depense')",
    "description": "string",
    "amount": "number (en XOF, positif pour vente, négatif pour dépense)"
  }
]
```

**Exemple:**
```json
[
  {
    "id": 1,
    "date": "2024-01-15T10:30:00Z",
    "type": "vente",
    "description": "Vente de tissu Wax",
    "amount": 125000
  },
  {
    "id": 2,
    "date": "2024-01-15T14:20:00Z",
    "type": "depense",
    "description": "Achat de matériel",
    "amount": -50000
  }
]
```

### GET `/admin/finance/revenue`
**Description:** Récupère les données d'évolution du chiffre d'affaires pour le graphique linéaire

**Query Parameters:**
- `period` (string, required)
- `startDate` (string, optional)
- `endDate` (string, optional)

**Réponse (200):**
```json
[
  {
    "date": "string (format: 'YYYY-MM-DD' ou 'MMM' pour mois)",
    "revenue": "number (en XOF)"
  }
]
```

**Exemple:**
```json
[
  { "date": "2024-01", "revenue": 250000 },
  { "date": "2024-02", "revenue": 320000 },
  { "date": "2024-03", "revenue": 280000 }
]
```

---

## Exports

### GET `/admin/export/{type}`
**Description:** Exporte les données au format CSV ou Excel

**Path Parameters:**
- `type` (string, required): `"clients" | "orders" | "finance" | "stock"`

**Query Parameters:**
- `format` (string, required): `"csv" | "xlsx"`

**Réponse (200):**
- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (pour xlsx)
- Content-Type: `text/csv` (pour csv)
- Body: Fichier binaire (blob)

**Headers de réponse:**
```
Content-Disposition: attachment; filename="clients-2024-01-15.csv"
Content-Type: text/csv; charset=utf-8
```

**Exemples d'URLs:**
- `/admin/export/clients?format=csv`
- `/admin/export/clients?format=xlsx`
- `/admin/export/orders?format=csv`
- `/admin/export/orders?format=xlsx`
- `/admin/export/finance?format=xlsx`
- `/admin/export/stock?format=csv`

---

## Sécurité et Authentification

### Headers requis
Toutes les routes `/admin/*` nécessitent un header d'authentification:
```
Authorization: Bearer {token}
```

Le token est obtenu via `/auth/login` et doit être stocké côté client.

### Gestion des erreurs
- **401 Unauthorized**: Token invalide ou expiré → Rediriger vers `/admin/login`
- **403 Forbidden**: Accès refusé
- **404 Not Found**: Ressource non trouvée (géré silencieusement pour certaines routes)
- **500 Internal Server Error**: Erreur serveur

### Format des réponses d'erreur
```json
{
  "message": "string (message d'erreur)",
  "error": "string (type d'erreur, optionnel)"
}
```

---

## Notes importantes

1. **Format de dates**: Utiliser le format ISO 8601 (`YYYY-MM-DDTHH:mm:ssZ`) pour les dates complètes, ou `YYYY-MM-DD` pour les dates simples.

2. **Devise**: Tous les montants sont en **XOF (Franc CFA)**.

3. **Pagination**: Les endpoints de liste peuvent nécessiter une pagination future. Pour l'instant, retourner toutes les données.

4. **Filtres de période**:
   - `day`: Données du jour actuel
   - `week`: Données de la semaine actuelle (lundi à dimanche)
   - `month`: Données du mois actuel
   - `custom`: Période personnalisée (nécessite `startDate` et `endDate`)

5. **Relations entre entités**:
   - Les commandes doivent inclure les informations du client (relation)
   - Les produits doivent pouvoir être liés à une catégorie
   - Les clients doivent avoir un historique de commandes

6. **Stock faible**: Un produit est considéré en stock faible si `stock < 10` mètres.
