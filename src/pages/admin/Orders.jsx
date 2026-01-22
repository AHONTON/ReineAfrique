import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit } from 'lucide-react';
import api from '../../api/axios';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import Loader from '../../components/admin/Loader';
import { showError, showSuccess, showConfirm } from '../../utils/swal';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const response = await api.get('/admin/orders', { params });
      setOrders(response.data);
    } catch (error) {
      showError('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
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
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'en_discussion': { label: 'En discussion', color: 'bg-yellow-100 text-yellow-800' },
      'confirmee': { label: 'Confirmée', color: 'bg-blue-100 text-blue-800' },
      'en_preparation': { label: 'En préparation', color: 'bg-orange-100 text-orange-800' },
      'livree': { label: 'Livrée', color: 'bg-green-100 text-green-800' },
      'annulee': { label: 'Annulée', color: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const columns = [
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
      render: (value) =>
        new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'XOF',
        }).format(value),
    },
  ];

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
        className="px-3 py-1 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
      >
        <option value="en_discussion">En discussion</option>
        <option value="confirmee">Confirmée</option>
        <option value="en_preparation">En préparation</option>
        <option value="livree">Livrée</option>
        <option value="annulee">Annulée</option>
      </select>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Commandes</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">Tous les statuts</option>
          <option value="en_discussion">En discussion</option>
          <option value="confirmee">Confirmée</option>
          <option value="en_preparation">En préparation</option>
          <option value="livree">Livrée</option>
          <option value="annulee">Annulée</option>
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
};

export default Orders;
