import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Plus, Edit, Trash2, Eye, Phone } from 'lucide-react';
import api from '../../api/axios';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import { showConfirm } from '../../utils/swal';
import toastService from '../../utils/toastService';
import { CLIENT_ENDPOINTS, ORDER_ENDPOINTS } from '../../config/api';
import { ORDER_STATUS, ORDER_STATUS_CONFIG } from '../../config/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';

const Clients = memo(() => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
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
    setFormData({ firstName: '', lastName: '', email: '', phone: '', address: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
    const parts = (client.name || '').split(' ');
    setFormData({
      firstName: parts.shift() || '',
      lastName: parts.join(' ') || '',
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
      // Conserver compatibilité backend: envoyer `name` construit
      const payload = {
        ...formData,
        name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
      };

      if (selectedClient) {
        response = await api.put(CLIENT_ENDPOINTS.UPDATE(selectedClient.id), payload);
        toastService.showSuccess('Client modifié avec succès');
      } else {
        response = await api.post(CLIENT_ENDPOINTS.CREATE, payload);
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
        setFormData({ firstName: '', lastName: '', email: '', phone: '', address: '' });
        setSelectedClient(null);
        
        // Rafraîchir la liste pour s'assurer de la synchronisation complète
        // Essayer de détecter automatiquement si le numéro est sur WhatsApp
        if (response && (response.status === 201 || response.status === 200)) {
          const created = response.data?.client || response.data;
          if (created && created.id) {
            // Appel optionnel au backend pour vérifier WhatsApp; ignore les erreurs 404
            try {
              const checkRes = await api.get(CLIENT_ENDPOINTS.CHECK_WHATSAPP(created.id));
              const hasWhatsApp = checkRes.data?.hasWhatsApp === true;
              if (typeof hasWhatsApp === 'boolean') {
                setClients(prev => prev.map(c => c.id === created.id ? { ...c, hasWhatsApp } : c));
              }
            } catch (err) {
              // Backend may not implement this endpoint; c'est facultatif
            }
          }
        }
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

  // Aucune vérification WhatsApp côté client (logique supprimée).

  const handleViewDetails = async (client) => {
    try {
      const response = await api.get(CLIENT_ENDPOINTS.SHOW(client.id));
      setSelectedClient(response.data);
      setIsDetailsModalOpen(true);
    } catch (error) {
      toastService.showError('Erreur lors du chargement des détails');
    }
  };


  const handleInlineOrderStatusChange = async (clientId, orderId, newStatus) => {
    const { value: confirmed } = await showConfirm('Voulez-vous changer le statut de cette commande ?', 'Modifier le statut');
    if (!confirmed) return;

    // Visual inline loading state for this order
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, updatingOrderIds: [...(c.updatingOrderIds || []), orderId] } : c));

    try {
      await api.put(ORDER_ENDPOINTS.UPDATE_STATUS(orderId), { status: newStatus });
      // Mettre à jour localement le client et ses commandes
      setClients(prev => prev.map(c => {
        if (c.id !== clientId) return c;
        const updatedOrders = Array.isArray(c.orders) ? c.orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o) : c.orders;
        return { ...c, orders: updatedOrders, updatingOrderIds: (c.updatingOrderIds || []).filter(id => id !== orderId) };
      }));

      // Si selectedClient correspond, mettre à jour aussi
      setSelectedClient(prev => prev && prev.id === clientId ? { ...prev, orders: (prev.orders || []).map(o => o.id === orderId ? { ...o, status: newStatus } : o) } : prev);

      toastService.showSuccess('Statut mis à jour avec succès');
    } catch (err) {
      // remove loading flag
      setClients(prev => prev.map(c => c.id === clientId ? { ...c, updatingOrderIds: (c.updatingOrderIds || []).filter(id => id !== orderId) } : c));
      const errorMessage = err.response?.data?.message || 'Erreur lors de la mise à jour du statut';
      toastService.showError(errorMessage);
    }
  };

  // Normalise le numéro pour appel téléphonique : retire les caractères non numériques
  // et s'assure que le numéro commence par l'indicatif Bénin (+229).
  const formatPhoneForCall = (phone) => {
    if (!phone) return null;
    try {
      let s = String(phone).trim();
      s = s.replace(/[^\d+]/g, '');
      // Si commence par + garder
      if (s.startsWith('+')) return s;
      // Si commence par 00 -> remplacer par +
      if (s.startsWith('00')) return `+${s.slice(2)}`;
      // Si commence par 229 (sans +)
      if (s.startsWith('229')) return `+${s}`;
      // Sinon, présumer format local et préfixer +229
      return `+229${s}`;
    } catch (err) {
      return null;
    }
  };

  // Format pour affichage dans la table: affiche clairement l'indicatif +229
  // puis la partie locale (ex: +22901xxxxxx). Si numéro absent, retourne '—'.
  const formatPhoneForDisplay = (phone) => {
    if (!phone) return '—';
    try {
      let s = String(phone).trim();
      s = s.replace(/[^\d+]/g, '');
      if (s.startsWith('+')) return s;
      if (s.startsWith('00')) return `+${s.slice(2)}`;
      if (s.startsWith('229')) return `+${s}`;
      return `+229${s}`;
    } catch (err) {
      return phone;
    }
  };

  const splitName = (name) => {
    if (!name) return { first: '', last: '' };
    const parts = name.split(' ');
    return { first: parts.shift() || '', last: parts.join(' ') || '' };
  };


  const columns = useMemo(() => [
    { key: 'id', label: 'ID' },
    { key: 'lastName', label: 'Nom', render: (value, row) => splitName(row.name).last || '—' },
    { key: 'firstName', label: 'Prénom', render: (value, row) => splitName(row.name).first || '—' },
    { key: 'email', label: 'Email (optionnel)' },
    {
      key: 'phone',
      label: 'Téléphone',
      render: (value) => {
        const display = formatPhoneForDisplay(value);
        if (display === '—') return display;
        if (display.startsWith('+229')) {
          return (
            <span className="flex items-center gap-2">
              <span className="text-xs text-gray-500">+229</span>
              <span className="font-medium">{display.slice(4)}</span>
            </span>
          );
        }
        return <span className="font-medium">{display}</span>;
      }
    },
    {
      key: 'address',
      label: 'Adresse / Quartier',
      render: (value, row) => row.address || '—',
    },
  ], []);

  const actions = (row) => (
    <div className="flex items-center justify-end space-x-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          const formatted = formatPhoneForCall(row.phone || '');
          if (!formatted) {
            toastService.showError('Numéro invalide');
            return;
          }
          window.open(`tel:${formatted}`, '_self');
        }}
        className={`p-2 ${row.phone ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-400 opacity-50 cursor-not-allowed'} rounded-lg transition-colors`}
        title={row.phone ? `Appeler (+229)` : 'Pas de numéro'}
      >
        <Phone size={18} />
      </button>
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
    <div className="space-y-4 sm:space-y-6 min-w-0">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:border-orange-500"
                    placeholder="Nom de famille"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prénom *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:border-orange-500"
                    placeholder="Prénom"
                  />
                </div>
              </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email (optionnel)
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                setFormData({ firstName: '', lastName: '', email: '', phone: '', address: '' });
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
