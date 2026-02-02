import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Eye, Plus, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import Loader from '../../components/admin/Loader';
import { showConfirm } from '../../utils/swal';
import toastService from '../../utils/toastService';
import { ORDER_STATUS_CONFIG, ORDER_STATUS } from '../../config/constants';
import { ORDER_ENDPOINTS, CLIENT_ENDPOINTS, PRODUCT_ENDPOINTS } from '../../config/api';
import { formatCurrency, formatDate } from '../../utils/formatters';

const Orders = memo(() => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    client_id: '',
    date: new Date().toISOString().split('T')[0],
    status: ORDER_STATUS.EN_DISCUSSION,
    source: 'dashboard',
    items: [{ product_id: '', quantity: '', price: '' }],
  });

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const response = await api.get(ORDER_ENDPOINTS.LIST, { params });
      // S'assurer que response.data est un tableau
      const ordersData = Array.isArray(response.data) ? response.data : [];
      setOrders(ordersData);
      console.log('✅ Commandes chargées:', ordersData.length);
      
      if (ordersData.length === 0) {
        console.warn('⚠️ Aucune commande trouvée dans la réponse API');
      }
    } catch (error) {
      // En cas d'erreur, initialiser avec un tableau vide
      setOrders([]);
      console.error('❌ Erreur lors du chargement des commandes:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.response?.data?.message || error.message,
        data: error.response?.data,
        url: error.config?.url,
      });
      
      // Afficher un message d'erreur plus détaillé
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Erreur lors du chargement des commandes';
      
      // Ne pas afficher d'erreur pour les 404 (API non disponible) mais afficher pour les autres
      if (error.response?.status === 404) {
        console.warn('⚠️ API non disponible (404)');
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        // L'intercepteur gère déjà la redirection pour 401/403
        console.error('🔒 Erreur d\'authentification');
      } else {
        toastService.showError(
          `Erreur lors du chargement des commandes: ${errorMessage}`,
          'Erreur de chargement'
        );
      }
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const fetchClientsAndProducts = useCallback(async () => {
    try {
      const [clientsRes, productsRes] = await Promise.all([
        api.get(CLIENT_ENDPOINTS.LIST),
        api.get(PRODUCT_ENDPOINTS.LIST),
      ]);
      setClients(Array.isArray(clientsRes.data) ? clientsRes.data : []);
      setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
    } catch (error) {
      setClients([]);
      setProducts([]);
      if (error.response?.status && error.response.status !== 404) {
        toastService.showError('Erreur lors du chargement des clients et produits');
      }
    }
  }, []);

  useEffect(() => {
    if (isCreateModalOpen) {
      fetchClientsAndProducts();
    }
  }, [isCreateModalOpen, fetchClientsAndProducts]);

  const handleCreate = () => {
    setFormData({
      client_id: '',
      date: new Date().toISOString().split('T')[0],
      status: ORDER_STATUS.EN_DISCUSSION,
      source: 'dashboard',
      items: [{ product_id: '', quantity: '', price: '' }],
    });
    setIsCreateModalOpen(true);
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product_id: '', quantity: '', price: '' }],
    });
  };

  const handleRemoveItem = (index) => {
    if (formData.items.length > 1) {
      setFormData({
        ...formData,
        items: formData.items.filter((_, i) => i !== index),
      });
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Si le produit change, mettre à jour le prix automatiquement
    if (field === 'product_id') {
      const product = products.find(p => p.id === parseInt(value));
      if (product && product.price_per_meter) {
        newItems[index].price = product.price_per_meter;
      }
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validation
      if (!formData.client_id) {
        toastService.showError('Veuillez sélectionner un client');
        return;
      }
      if (formData.items.some(item => !item.product_id || !item.quantity || !item.price)) {
        toastService.showError('Veuillez remplir tous les champs des articles');
        return;
      }

      const orderData = {
        ...formData,
        client_id: parseInt(formData.client_id),
        items: formData.items.map(item => ({
          product_id: parseInt(item.product_id),
          quantity: parseFloat(item.quantity),
          price: parseFloat(item.price),
        })),
      };

      const response = await api.post(ORDER_ENDPOINTS.CREATE, orderData);
      if (response && (response.status === 201 || response.status === 200)) {
        toastService.showSuccess('Commande créée avec succès');
        
        const newOrder = response.data?.order || response.data;
        if (newOrder) {
          // Ajouter immédiatement la nouvelle commande à la liste
          setOrders(prevOrders => [newOrder, ...prevOrders]);
        }
        
        setIsCreateModalOpen(false);
        setFormData({
          client_id: '',
          date: new Date().toISOString().split('T')[0],
          status: ORDER_STATUS.EN_DISCUSSION,
          source: 'dashboard',
          items: [{ product_id: '', quantity: '', price: '' }],
        });
        // Rafraîchir pour s'assurer de la synchronisation complète
        fetchOrders();
      }
    } catch (error) {
      // Afficher le message d'erreur spécifique de l'API
      const errorMessage = 
        error.response?.data?.message ||
        error.response?.data?.error ||
        (error.response?.data?.errors ? 
          Object.values(error.response.data.errors).flat().join(', ') : 
          'Erreur lors de la création de la commande'
        );
      toastService.showError(errorMessage);
    }
  };

  const handleStatusChange = useCallback(async (orderId, newStatus) => {
    const { value: confirmed } = await showConfirm(
      `Voulez-vous changer le statut de cette commande ?`,
      'Modifier le statut'
    );

    if (confirmed) {
      try {
        const response = await api.put(ORDER_ENDPOINTS.UPDATE_STATUS(orderId), { status: newStatus });
        if (response && (response.status === 200 || response.status === 204)) {
          toastService.showSuccess('Statut mis à jour avec succès');
          
          const updatedOrder = response.data?.order || response.data;
          if (updatedOrder) {
            // Mettre à jour immédiatement le statut dans la liste
            setOrders(prevOrders => 
              prevOrders.map(order => 
                order.id === orderId ? { ...order, status: newStatus } : order
              )
            );
          }
          
          // Rafraîchir pour s'assurer de la synchronisation complète
          fetchOrders();
        }
      } catch (error) {
        const errorMessage = 
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Erreur lors de la mise à jour du statut';
        toastService.showError(errorMessage);
      }
    }
  }, [fetchOrders]);

  const getStatusBadge = useCallback((status) => {
    const config = ORDER_STATUS_CONFIG[status] || { label: status, color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  }, []);

  const columns = useMemo(() => [
    { key: 'id', label: 'ID' },
    {
      key: 'client',
      label: 'Client',
      render: (value, row) => row.client?.name || 'N/A',
    },
    {
      key: 'date',
      label: 'Date',
      render: (value) => formatDate(value),
    },
    {
      key: 'status',
      label: 'Statut',
      render: (value) => getStatusBadge(value),
    },
    {
      key: 'amount',
      label: 'Montant',
      render: (value) => formatCurrency(value),
    },
  ], [getStatusBadge]);

  const actions = (row) => (
    <div className="flex items-center justify-end space-x-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setSelectedOrder(row);
          setIsModalOpen(true);
        }}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title="Voir détails"
      >
        <Eye size={18} />
      </button>
      <select
        value={row.status}
        onChange={(e) => handleStatusChange(row.id, e.target.value)}
        onClick={(e) => e.stopPropagation()}
        className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500"
      >
        <option value={ORDER_STATUS.EN_DISCUSSION} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">En discussion</option>
        <option value={ORDER_STATUS.CONFIRMEE} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">Confirmée</option>
        <option value={ORDER_STATUS.EN_PREPARATION} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">En préparation</option>
        <option value={ORDER_STATUS.LIVREE} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">Livrée</option>
        <option value={ORDER_STATUS.ANNULEE} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">Annulée</option>
      </select>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Gestion des Commandes</h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={handleCreate}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Plus size={18} />
            Ajouter une commande
          </button>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 text-sm w-full sm:w-auto"
          >
            <option value="all" className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">Tous les statuts</option>
            <option value={ORDER_STATUS.EN_DISCUSSION} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">En discussion</option>
            <option value={ORDER_STATUS.CONFIRMEE} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">Confirmée</option>
            <option value={ORDER_STATUS.EN_PREPARATION} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">En préparation</option>
            <option value={ORDER_STATUS.LIVREE} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">Livrée</option>
            <option value={ORDER_STATUS.ANNULEE} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">Annulée</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        searchable
        actions={actions}
      />

      {/* Modal Détails Commande */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
        title="Détails de la commande"
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">ID Commande</p>
                <p className="font-medium">{selectedOrder.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">
                  {formatDate(selectedOrder.date)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Client</p>
                <p className="font-medium">{selectedOrder.client?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Statut</p>
                {getStatusBadge(selectedOrder.status)}
              </div>
              <div>
                <p className="text-sm text-gray-500">Montant Total</p>
                <p className="font-medium text-lg">
                  {formatCurrency(selectedOrder.amount)}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Articles</p>
              <div className="border border-gray-200 rounded-lg p-4">
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} className="flex justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{item.product?.name || 'Produit'}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} x {item.price} CFA
                      </p>
                    </div>
                    <p className="font-medium">
                      {item.quantity * item.price} CFA
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Création Commande */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setFormData({
            client_id: '',
            date: new Date().toISOString().split('T')[0],
            status: ORDER_STATUS.EN_DISCUSSION,
            source: 'dashboard',
            items: [{ product_id: '', quantity: '', price: '' }],
          });
        }}
        title="Créer une commande"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Client *
              </label>
              <select
                value={formData.client_id}
                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Sélectionner un client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Statut *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value={ORDER_STATUS.EN_DISCUSSION} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">En discussion</option>
                <option value={ORDER_STATUS.CONFIRMEE} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">Confirmée</option>
                <option value={ORDER_STATUS.EN_PREPARATION} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">En préparation</option>
                <option value={ORDER_STATUS.LIVREE} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">Livrée</option>
                <option value={ORDER_STATUS.ANNULEE} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">Annulée</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Source
              </label>
              <input
                type="text"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="dashboard"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Articles *
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-sm text-orange-500 hover:text-orange-600 font-medium"
              >
                + Ajouter un article
              </button>
            </div>
            <div className="space-y-3">
              {formData.items.map((item, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Produit</label>
                    <select
                      value={item.product_id}
                      onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
                      required
                    >
                      <option value="">Sélectionner</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                          {product.name} ({formatCurrency(product.price_per_meter || 0)}/m)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <label className="block text-xs text-gray-500 mb-1">Quantité</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
                      required
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-xs text-gray-500 mb-1">Prix unitaire</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
                      required
                    />
                  </div>
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            >
              Créer la commande
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
});

Orders.displayName = 'Orders';

export default Orders;
