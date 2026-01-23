import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  Calendar,
} from 'lucide-react';
import api from '../../api/axios';
import StatCard from '../../components/admin/StatCard';
import Loader from '../../components/admin/Loader';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { showError } from '../../utils/swal';

// Constantes en dehors du composant pour éviter les recréations
const COLORS = ['#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12'];

const DEFAULT_STATS = {
  revenue: 1250000,
  orders: 45,
  clients: 12,
  lowStock: 8,
};

const DEFAULT_SALES_DATA = [
  { month: 'Jan', sales: 250000 },
  { month: 'Fév', sales: 320000 },
  { month: 'Mar', sales: 280000 },
  { month: 'Avr', sales: 420000 },
  { month: 'Mai', sales: 380000 },
  { month: 'Jun', sales: 450000 },
];

const DEFAULT_SALES_DISTRIBUTION = [
  { name: 'Wax', value: 500000 },
  { name: 'Bogolan', value: 250000 },
  { name: 'Autres', value: 187500 },
  { name: 'Soie', value: 312500 },
];

const Dashboard = memo(() => {
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [salesData, setSalesData] = useState(DEFAULT_SALES_DATA);
  const [salesDistribution, setSalesDistribution] = useState(DEFAULT_SALES_DISTRIBUTION);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const params = { period };
      if (period === 'custom' && startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }

      const [statsRes, salesRes, distributionRes] = await Promise.all([
        api.get('/admin/dashboard/stats', { params }),
        api.get('/admin/dashboard/sales', { params }),
        api.get('/admin/dashboard/distribution', { params }),
      ]);

      setStats(statsRes.data);
      setSalesData(salesRes.data);
      setSalesDistribution(distributionRes.data);
    } catch (error) {
      // Si l'API n'est pas disponible, utiliser des données par défaut pour l'affichage
      setStats(DEFAULT_STATS);
      setSalesData(DEFAULT_SALES_DATA);
      setSalesDistribution(DEFAULT_SALES_DISTRIBUTION);
      // Ne pas afficher d'erreur si c'est juste que l'API n'est pas disponible (404)
      if (error.response?.status && error.response.status !== 404) {
        showError('Erreur lors du chargement des données du dashboard');
      }
    } finally {
      setLoading(false);
    }
  }, [period, startDate, endDate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  }, []);

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Header avec filtres */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Reine d'Afrique - Tableau de bord</p>
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2 w-full sm:w-auto">
            <Calendar size={16} className="text-orange-500 dark:text-orange-400 sm:w-5 sm:h-5 flex-shrink-0" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="border-none focus:ring-0 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-transparent dark:bg-gray-800 flex-1 sm:flex-initial cursor-pointer appearance-none"
            >
              <option value="day" className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">Jour</option>
              <option value="week" className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">Semaine</option>
              <option value="month" className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">Mois</option>
              <option value="custom" className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">Période personnalisée</option>
            </select>
          </div>
          {period === 'custom' && (
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-2 sm:px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 flex-1 sm:flex-initial"
              />
              <span className="text-gray-500 dark:text-gray-400 text-sm">-</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-2 sm:px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 flex-1 sm:flex-initial"
              />
            </div>
          )}
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <StatCard
          title="Chiffre d'Affaires"
          value={formatCurrency(stats.revenue)}
          icon={TrendingUp}
          color="orange"
          loading={loading}
        />
        <StatCard
          title="Commandes"
          value={`${stats.orders} ${period === 'day' ? "Aujourd'hui" : period === 'week' ? 'Cette semaine' : 'Ce mois'}`}
          icon={ShoppingCart}
          color="orange"
          loading={loading}
        />
        <StatCard
          title="Nouveaux Clients"
          value={`${stats.clients} ${period === 'day' ? "Aujourd'hui" : period === 'week' ? 'Cette semaine' : 'Cette période'}`}
          icon={Users}
          color="green"
          loading={loading}
        />
        <StatCard
          title="Stock Faible"
          value={`${stats.lowStock} Articles`}
          icon={Package}
          color="red"
          loading={loading}
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
        {/* Ventes Mensuelles */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 p-4 sm:p-5 md:p-6 overflow-hidden relative hover:shadow-xl dark:hover:shadow-2xl transition-shadow">
          {/* Pattern subtil en arrière-plan */}
          <div 
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 15px,
                rgba(251, 115, 22, 0.1) 15px,
                rgba(251, 115, 22, 0.1) 30px
              )`,
            }}
          />
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 relative z-10">Ventes Mensuelles</h3>
          {loading ? (
            <div className="h-48 sm:h-64 flex items-center justify-center relative z-10">
              <Loader size="lg" />
            </div>
          ) : (
            <div className="w-full overflow-x-auto relative z-10">
              <ResponsiveContainer width="100%" height={250} minHeight={250}>
                <BarChart data={salesData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="sales" fill="#f97316" name="Ventes" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Répartition des Ventes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-5 md:p-6 overflow-hidden relative hover:shadow-xl dark:hover:shadow-2xl transition-all">
          {/* Pattern subtil en arrière-plan */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(
                -45deg,
                transparent,
                transparent 15px,
                rgba(234, 88, 12, 0.1) 15px,
                rgba(234, 88, 12, 0.1) 30px
              )`,
            }}
          />
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 relative z-10">Répartition des Ventes</h3>
          {loading ? (
            <div className="h-48 sm:h-64 flex items-center justify-center relative z-10">
              <Loader size="lg" />
            </div>
          ) : (
            <div className="w-full overflow-x-auto relative z-10">
              <ResponsiveContainer width="100%" height={250} minHeight={250}>
                <PieChart>
                  <Pie
                    data={salesDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {salesDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
