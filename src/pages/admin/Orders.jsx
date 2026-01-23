import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Eye, Edit } from 'lucide-react';
import api from '../../api/axios';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import Loader from '../../components/admin/Loader';
import { showError, showSuccess, showConfirm } from '../../utils/swal';

// Constantes en dehors du composant
const STATUS_CONFIG = {
  'en_discussion': { label: 'En discussion', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  'confirmee': { label: 'Confirmée', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  'en_preparation': { label: 'En préparation', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  'livree': { label: 'Livrée', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  'annulee': { label: 'Annulée', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
};

const Orders = memo(() => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const response = await api.get('/admin/orders', { params });
      setOrders(response.data);
    } catch (error) {
      // Ne pas afficher d'erreur si c'est juste que l'API n'est pas disponible (404)
      if (error.response?.status && error.response.status !== 404) {
        showError('Erreur lors du chargement des commandes');
      }
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = useCallback(async (orderId, newStatus) => {
    const { value: confirmed } = await showConfirm(
      `Voulez-vous changer le statut de cette commande ?`,
      'Modifier le statut'
    );

    if (confirmed) {
      try {
        await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
        showSuccess('Statut mis à jour avec succès');
        fetchOrders();
      } catch (error) {
        showError('Erreur lors de la mise à jour du statut');
      }
    }
  }, []);

  const getStatusBadge = useCallback((status) => {
    const config = STATUS_CONFIG[status] || { label: status, color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  }, []);

  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
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
      render: (value) => new Date(value).toLocaleDateString('fr-FR'),
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
  ], [getStatusBadge, formatCurrency]);

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
        <option value="en_discussion" className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">En discussion</option>
        <option value="confirmee" className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">Confirmée</option>
        <option value="en_preparation" className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">En préparation</option>
        <option value="livree" className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">Livrée</option>
        <option value="annulee" className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">Annulée</option>
      </select>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Gestion des Commandes</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 text-sm w-full sm:w-auto"
        >
          <option value="all" className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">Tous les statuts</option>
          <option value="en_discussion" className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">En discussion</option>
          <option value="confirmee" className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">Confirmée</option>
          <option value="en_preparation" className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">En préparation</option>
          <option value="livree" className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">Livrée</option>
          <option value="annulee" className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">Annulée</option>
        </select>
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
                  {new Date(selectedOrder.date).toLocaleDateString('fr-FR')}
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
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'XOF',
                  }).format(selectedOrder.amount)}
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
    </div>
  );
});

Orders.displayName = 'Orders';

export default Orders;
