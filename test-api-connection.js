/**
 * Script de test pour vérifier la connexion à l'API
 * 
 * Usage dans la console du navigateur:
 * 1. Ouvrez la console (F12)
 * 2. Copiez-collez TOUT le contenu de ce fichier
 * 3. Appuyez sur Entrée
 * 
 * Le script va tester :
 * - La configuration de l'API
 * - La présence du token
 * - La connexion aux endpoints principaux
 */

(async function testAPIConnection() {
  console.log('🔍 Test de connexion à l\'API...\n');
  
  // 1. Vérifier la configuration
  // Essayer de récupérer l'URL depuis window ou utiliser la valeur par défaut
  const API_BASE_URL = window.API_BASE_URL || 'http://localhost:8000/api';
  console.log('📍 URL de l\'API:', API_BASE_URL);
  
  // 2. Vérifier le token
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.error('❌ Aucun token trouvé dans localStorage');
    console.log('💡 Solution: Connectez-vous d\'abord');
    return;
  }
  console.log('✅ Token trouvé:', token.substring(0, 20) + '...');
  
  // 3. Tester les endpoints
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
