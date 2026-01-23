import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { TrendingUp, Calendar } from 'lucide-react';
import api from '../../api/axios';
import StatCard from '../../components/admin/StatCard';
import DataTable from '../../components/admin/DataTable';
import Loader from '../../components/admin/Loader';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { showError } from '../../utils/swal';

const Finance = memo(() => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [stats, setStats] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  const fetchFinanceData = useCallback(async () => {
    try {
      setLoading(true);
      const params = { period };
      if (period === 'custom' && startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }

      const [statsRes, transactionsRes, revenueRes] = await Promise.all([
        api.get('/admin/finance/stats', { params }),
        api.get('/admin/finance/transactions', { params }),
        api.get('/admin/finance/revenue', { params }),
      ]);

      setStats(statsRes.data);
      setTransactions(transactionsRes.data);
      setRevenueData(revenueRes.data);
    } catch (error) {
      // Ne pas afficher d'erreur si c'est juste que l'API n'est pas disponible (404)
      if (error.response?.status && error.response.status !== 404) {
        showError('Erreur lors du chargement des données financières');
      }
    } finally {
      setLoading(false);
    }
  }, [period, startDate, endDate]);

  useEffect(() => {
    fetchFinanceData();
  }, [fetchFinanceData]);

  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  }, []);

  const getTypeBadge = useCallback((type) => {
    return type === 'vente' ? (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Vente
      </span>
    ) : (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
        Dépense
      </span>
    );
  }, []);

  const columns = useMemo(() => [
    {
      key: 'date',
      label: 'Date',
      render: (value) => new Date(value).toLocaleDateString('fr-FR'),
    },
    {
      key: 'type',
      label: 'Type',
      render: (value) => getTypeBadge(value),
    },
    {
      key: 'description',
      label: 'Description',
    },
    {
      key: 'amount',
      label: 'Montant',
      render: (value, row) => (
        <span className={row.type === 'vente' ? 'text-green-600' : 'text-red-600'}>
          {row.type === 'vente' ? '+' : '-'}
          {formatCurrency(Math.abs(value))}
        </span>
      ),
    },
  ], [formatCurrency, getTypeBadge]);

  return (
    <div className="space-y-6">
      {/* Header avec filtres */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Finances</h1>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2">
            <Calendar size={18} className="text-gray-500 dark:text-gray-400" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="border-none focus:ring-0 text-sm font-medium text-gray-700 dark:text-gray-300 bg-transparent dark:bg-gray-800 cursor-pointer"
            >
              <option value="day" className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">Jour</option>
              <option value="week" className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">Semaine</option>
              <option value="month" className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">Mois</option>
              <option value="custom" className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">Période personnalisée</option>
            </select>
          </div>
          {period === 'custom' && (
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
              />
              <span className="text-gray-500">-</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Solde Journalier"
          value={formatCurrency(stats.daily)}
          icon={TrendingUp}
          color="green"
          loading={loading}
        />
        <StatCard
          title="Solde Hebdomadaire"
          value={formatCurrency(stats.weekly)}
          icon={TrendingUp}
          color="blue"
          loading={loading}
        />
        <StatCard
          title="Solde Mensuel"
          value={formatCurrency(stats.monthly)}
          icon={TrendingUp}
          color="orange"
          loading={loading}
        />
      </div>

      {/* Graphique Évolution CA */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Évolution du Chiffre d'Affaires
        </h3>
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader size="lg" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#f97316"
                strokeWidth={2}
                name="Chiffre d'affaires"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Table des Transactions */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Transactions</h3>
        <DataTable columns={columns} data={transactions} loading={loading} searchable />
      </div>
    </div>
  );
};

export default Finance;
