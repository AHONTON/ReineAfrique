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
import toastService from '../../utils/toastService';
import { FINANCE_ENDPOINTS } from '../../config/api';
import { PERIODS, TRANSACTION_TYPE, TRANSACTION_TYPE_CONFIG } from '../../config/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';

const Finance = memo(() => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(PERIODS.MONTH);
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
        api.get(FINANCE_ENDPOINTS.STATS, { params }),
        api.get(FINANCE_ENDPOINTS.TRANSACTIONS, { params }),
        api.get(FINANCE_ENDPOINTS.REVENUE, { params }),
      ]);

      setStats(statsRes.data || { daily: 0, weekly: 0, monthly: 0 });
      // S'assurer que les données sont des tableaux
      // TransactionResource::collection() retourne { data: [...] }
      const transactionsData = transactionsRes.data?.data || transactionsRes.data;
      setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
      
      // Valider et formater les données de revenue pour le graphique
      const rawRevenueData = revenueRes.data?.data || revenueRes.data;
      const validRevenueData = Array.isArray(rawRevenueData) 
        ? rawRevenueData.filter(item => item && item.date && typeof item.revenue === 'number')
        : [];
      setRevenueData(validRevenueData);
    } catch (error) {
      // En cas d'erreur, initialiser avec des valeurs par défaut
      setStats({ daily: 0, weekly: 0, monthly: 0 });
      setTransactions([]);
      setRevenueData([]);
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

  const getTypeBadge = useCallback((type) => {
    const config = TRANSACTION_TYPE_CONFIG[type] || TRANSACTION_TYPE_CONFIG[TRANSACTION_TYPE.DEPENSE];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  }, []);

  const columns = useMemo(() => [
    {
      key: 'date',
      label: 'Date',
      render: (value) => formatDate(value),
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
        <span className={row.type === TRANSACTION_TYPE.VENTE ? 'text-green-600' : 'text-red-600'}>
          {row.type === TRANSACTION_TYPE.VENTE ? '+' : '-'}
          {formatCurrency(Math.abs(value))}
        </span>
      ),
    },
  ], [getTypeBadge]);

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
              <option value={PERIODS.DAY} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">Jour</option>
              <option value={PERIODS.WEEK} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">Semaine</option>
              <option value={PERIODS.MONTH} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">Mois</option>
              <option value={PERIODS.CUSTOM} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">Période personnalisée</option>
            </select>
          </div>
          {period === PERIODS.CUSTOM && (
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
        ) : revenueData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            Aucune donnée disponible pour cette période
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => formatCurrency(value)}
              />
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
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
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
});

Finance.displayName = 'Finance';

export default Finance;
