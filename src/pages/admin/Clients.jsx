import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import api from '../../api/axios';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import { showConfirm } from '../../utils/swal';
import toastService from '../../utils/toastService';
import { CLIENT_ENDPOINTS } from '../../config/api';
import { formatCurrency, formatDate } from '../../utils/formatters';

const Clients = memo(() => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(CLIENT_ENDPOINTS.LIST);
      // S'assurer que response.data est un tableau
      const clientsData = Array.isArray(response.data) ? response.data : [];
      setClients(clientsData);
      console.log('✅ Clients chargés:', clientsData.length);
      
      if (clientsData.length === 0) {
        console.warn('⚠️ Aucun client trouvé dans la réponse API');
      }
    } catch (error) {
      // En cas d'erreur, initialiser avec un tableau vide
      setClients([]);
      console.error('❌ Erreur lors du chargement des clients:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.response?.data?.message || error.message,
        data: error.response?.data,
        url: error.config?.url,
      });
      
      // Afficher un message d'erreur plus détaillé
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Erreur lors du chargement des clients';
      
      // Ne pas afficher d'erreur pour les 404 (API non disponible) mais afficher pour les autres
      if (error.response?.status === 404) {
        console.warn('⚠️ API non disponible (404)');
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        // L'intercepteur gère déjà la redirection pour 401/403
        console.error('🔒 Erreur d\'authentification');
      } else {
        toastService.showError(
          `Erreur lors du chargement des clients: ${errorMessage}`,
          'Erreur de chargement'
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleCreate = () => {
    setSelectedClient(null);
    setFormData({ name: '', email: '', phone: '', address: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
    setFormData({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (clientId) => {
    const { value: confirmed } = await showConfirm(
      'Êtes-vous sûr de vouloir supprimer ce client ?',
      'Supprimer le client'
    );

    if (confirmed) {
      try {
        await api.delete(CLIENT_ENDPOINTS.DELETE(clientId));
        toastService.showSuccess('Client supprimé avec succès');
        // Mettre à jour immédiatement l'état local
        setClients(prevClients => prevClients.filter(client => client.id !== clientId));
        // Rafraîchir pour s'assurer de la synchronisation
        fetchClients();
      } catch (error) {
        const errorMessage = 
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Erreur lors de la suppression du client';
        toastService.showError(errorMessage);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (selectedClient) {
        response = await api.put(CLIENT_ENDPOINTS.UPDATE(selectedClient.id), formData);
        toastService.showSuccess('Client modifié avec succès');
      } else {
        response = await api.post(CLIENT_ENDPOINTS.CREATE, formData);
        toastService.showSuccess('Client créé avec succès');
      }
      
      // Si la requête a réussi, mettre à jour immédiatement l'état local
      if (response && (response.status === 201 || response.status === 200)) {
        const updatedClient = response.data?.client || response.data;
        
        if (updatedClient) {
          if (selectedClient) {
            // Mise à jour : remplacer le client modifié dans la liste
            setClients(prevClients => 
              prevClients.map(client => 
                client.id === selectedClient.id ? updatedClient : client
              )
            );
          } else {
            // Création : ajouter le nouveau client à la liste
            setClients(prevClients => [...prevClients, updatedClient]);
          }
        }
        
        setIsModalOpen(false);
        setFormData({ name: '', email: '', phone: '', address: '' });
        setSelectedClient(null);
        
        // Rafraîchir la liste pour s'assurer de la synchronisation complète
        fetchClients();
      }
    } catch (error) {
      // Afficher le message d'erreur spécifique de l'API
      let errorMessage = 'Erreur lors de la sauvegarde du client';
      
      if (error.response?.data?.errors) {
        // Erreurs de validation - afficher toutes les erreurs
        const validationErrors = Object.values(error.response.data.errors).flat();
        errorMessage = validationErrors.join(', ');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      toastService.showError(errorMessage);
    }
  };

  const handleViewDetails = async (client) => {
    try {
      const response = await api.get(CLIENT_ENDPOINTS.SHOW(client.id));
      setSelectedClient(response.data);
      setIsDetailsModalOpen(true);
    } catch (error) {
      toastService.showError('Erreur lors du chargement des détails');
    }
  };


  const columns = useMemo(() => [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nom' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Téléphone' },
    {
      key: 'totalOrders',
      label: 'Commandes',
      render: (value) => value || 0,
    },
    {
      key: 'totalSpent',
      label: 'Total dépensé',
      render: (value) => formatCurrency(value || 0),
    },
  ], []);

  const actions = (row) => (
    <div className="flex items-center justify-end space-x-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleViewDetails(row);
        }}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title="Voir détails"
      >
        <Eye size={18} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleEdit(row);
        }}
        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
        title="Modifier"
      >
        <Edit size={18} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(row.id);
        }}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="Supprimer"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Gestion des Clients</h1>
        <button
          onClick={handleCreate}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus size={20} />
          <span>Nouveau Client</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={clients}
        loading={loading}
        searchable
        actions={actions}
      />

      {/* Modal Création/Modification */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedClient(null);
        }}
        title={selectedClient ? 'Modifier le client' : 'Nouveau client'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom complet *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:border-orange-500"
              placeholder="Entrez le nom complet du client"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:border-orange-500"
              placeholder="exemple@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Téléphone *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:border-orange-500"
              placeholder="+229 XX XX XX XX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Adresse
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:border-orange-500 resize-none"
              placeholder="Adresse complète du client (optionnel)"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setFormData({ name: '', email: '', phone: '', address: '' });
                setSelectedClient(null);
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              {selectedClient ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Détails Client */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedClient(null);
        }}
        title="Détails du client"
        size="lg"
      >
        {selectedClient && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Nom</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedClient.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedClient.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Téléphone</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedClient.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Adresse</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedClient.address || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Nombre de commandes</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedClient.totalOrders || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total dépensé</p>
                <p className="font-medium text-lg text-gray-900 dark:text-white">
                  {formatCurrency(selectedClient.totalSpent || 0)}
                </p>
              </div>
            </div>

            {selectedClient.orders && selectedClient.orders.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Historique des commandes</p>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 max-h-64 overflow-y-auto bg-gray-50 dark:bg-gray-900/50">
                  {selectedClient.orders.map((order) => (
                    <div key={order.id} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Commande #{order.id}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(order.date)}
                        </p>
                      </div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(order.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
});

Clients.displayName = 'Clients';

export default Clients;
