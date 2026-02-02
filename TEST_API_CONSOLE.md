# 🧪 Test de Connexion API - Console du Navigateur

## Instructions

1. **Ouvrez la console du navigateur** (F12 ou Ctrl+Shift+I)
2. **Allez dans l'onglet Console**
3. **Copiez-collez le script ci-dessous** et appuyez sur Entrée

## Script de Test

```javascript
(async function testAPIConnection() {
  console.log('🔍 Test de connexion à l\'API...\n');
  
  // Configuration
  const API_BASE_URL = 'http://localhost:8000/api';
  console.log('📍 URL de l\'API:', API_BASE_URL);
  
  // Vérifier le token
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.error('❌ Aucun token trouvé dans localStorage');
    console.log('💡 Solution: Connectez-vous d\'abord');
    return;
  }
  console.log('✅ Token trouvé:', token.substring(0, 20) + '...');
  
  // Tester les endpoints
  const endpoints = [
    { name: 'Clients', url: '/admin/clients' },
    { name: 'Catégories', url: '/admin/categories' },
    { name: 'Produits', url: '/admin/products' },
    { name: 'Commandes', url: '/admin/orders' },
    { name: 'Dashboard Stats', url: '/admin/dashboard/stats' },
  ];
  
  console.log('\n📡 Test des endpoints...\n');
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint.url}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        const count = Array.isArray(data) ? data.length : 'N/A';
        console.log(`✅ ${endpoint.name}: OK (${response.status}) - ${count} éléments`);
        if (Array.isArray(data) && data.length > 0) {
          console.log('   Exemple:', JSON.stringify(data[0], null, 2).substring(0, 200) + '...');
        }
      } else {
        console.error(`❌ ${endpoint.name}: Erreur ${response.status}`);
        console.error('   Message:', data.message || data.error || 'Erreur inconnue');
        
        if (response.status === 401 || response.status === 403) {
          console.error('   🔒 Problème d\'authentification - Token invalide ou expiré');
        }
      }
    } catch (error) {
      console.error(`❌ ${endpoint.name}: Erreur réseau`);
      console.error('   Détails:', error.message);
      
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        console.error('   💡 L\'API n\'est probablement pas démarrée');
        console.error('   💡 Vérifiez: cd reine_afrique_api && php artisan serve');
      }
    }
  }
  
  console.log('\n✅ Test terminé');
  console.log('\n💡 Si des erreurs apparaissent:');
  console.log('   1. Vérifiez que l\'API est démarrée (php artisan serve)');
  console.log('   2. Vérifiez que vous êtes connecté');
  console.log('   3. Vérifiez l\'URL de l\'API dans constants.js');
  console.log('   4. Consultez les logs Laravel (storage/logs/laravel.log)');
})();
```

## Résultats Attendus

### ✅ Succès
```
✅ Clients: OK (200) - 5 éléments
✅ Catégories: OK (200) - 3 éléments
✅ Produits: OK (200) - 12 éléments
```

### ❌ Erreurs Communes

#### Erreur 401/403
```
❌ Clients: Erreur 401
🔒 Problème d'authentification - Token invalide ou expiré
```
**Solution:** Reconnectez-vous

#### Erreur 404
```
❌ Clients: Erreur 404
```
**Solution:** Vérifiez que l'API est démarrée

#### Erreur Réseau
```
❌ Clients: Erreur réseau
Failed to fetch
```
**Solution:** Vérifiez que l'API est accessible sur `http://localhost:8000`

## Interprétation des Résultats

- **Tous les endpoints OK** → L'API fonctionne correctement, le problème est ailleurs
- **Erreurs 401/403** → Problème d'authentification, reconnectez-vous
- **Erreurs 404** → L'API n'est pas démarrée ou l'URL est incorrecte
- **Erreurs réseau** → L'API n'est pas accessible (CORS, firewall, etc.)
