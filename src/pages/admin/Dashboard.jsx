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
import '../../styles/dashboard.css';
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
import toastService from '../../utils/toastService';
import { DASHBOARD_ENDPOINTS, ORDER_ENDPOINTS, PRODUCT_ENDPOINTS } from '../../config/api';
import { CHART_COLORS, PERIODS } from '../../config/constants';
import { formatCurrency } from '../../utils/formatters';

// Hook pour détecter la taille de l'écran
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

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
  const { width } = useWindowSize();
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState(PERIODS.MONTH);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [salesData, setSalesData] = useState(DEFAULT_SALES_DATA);
  const [salesDistribution, setSalesDistribution] = useState(DEFAULT_SALES_DISTRIBUTION);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [stockLoading, setStockLoading] = useState(false);

  // Calculer les dimensions des graphiques en fonction de la taille de l'écran
  const chartHeight = width < 640 ? 200 : width < 1024 ? 250 : 300;
  const pieRadius = width < 640 ? 50 : width < 1024 ? 60 : 70;
  const tickFontSize = width < 640 ? 10 : 12;
  const tooltipFontSize = width < 640 ? '11px' : '12px';

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const params = { period };
      if (period === 'custom' && startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }

      // Charger principaux widgets (stats & charts) en parallèle, commandes/stock séparément
      const [statsRes, salesRes, distributionRes] = await Promise.all([
        api.get(DASHBOARD_ENDPOINTS.STATS, { params }),
        api.get(DASHBOARD_ENDPOINTS.SALES, { params }),
        api.get(DASHBOARD_ENDPOINTS.DISTRIBUTION, { params }),
      ]);

      // Validation et protection des données reçues
      const statsData = {
        revenue: statsRes.data?.revenue ?? DEFAULT_STATS.revenue,
        orders: statsRes.data?.orders ?? DEFAULT_STATS.orders,
        clients: statsRes.data?.clients ?? DEFAULT_STATS.clients,
        lowStock: statsRes.data?.lowStock ?? DEFAULT_STATS.lowStock,
      };
      setStats(statsData);
      console.log('✅ Dashboard stats chargées:', statsData);
      
      // S'assurer que salesData est un tableau
      const salesDataArray = Array.isArray(salesRes.data) && salesRes.data.length > 0 
        ? salesRes.data 
        : DEFAULT_SALES_DATA;
      setSalesData(salesDataArray);
      console.log('✅ Données de ventes chargées:', salesDataArray.length, 'mois');
      
      // S'assurer que salesDistribution est un tableau
      const distributionData = Array.isArray(distributionRes.data) && distributionRes.data.length > 0
        ? distributionRes.data
        : DEFAULT_SALES_DISTRIBUTION;
      setSalesDistribution(distributionData);
      console.log('✅ Répartition des ventes chargée:', distributionData.length, 'catégories');

      // Fire-and-forget: charger commandes et stock séparément pour ne pas bloquer charts
      fetchRecentOrders();
      fetchLowStock();
    } catch (error) {
      // Si l'API n'est pas disponible, utiliser des données par défaut pour l'affichage
      setStats(DEFAULT_STATS);
      setSalesData(DEFAULT_SALES_DATA);
      setSalesDistribution(DEFAULT_SALES_DISTRIBUTION);
      
      console.error('❌ Erreur lors du chargement des données du dashboard:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.response?.data?.message || error.message,
        data: error.response?.data,
      });
      
      // Afficher un message d'erreur plus détaillé
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Erreur lors du chargement des données du dashboard';
      
      // Ne pas afficher d'erreur pour les 404 (API non disponible) mais afficher pour les autres
      if (error.response?.status === 404) {
        console.warn('⚠️ API non disponible (404)');
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        // L'intercepteur gère déjà la redirection pour 401/403
        console.error('🔒 Erreur d\'authentification');
      } else {
        toastService.showError(
          `Erreur lors du chargement des données: ${errorMessage}`,
          'Erreur de chargement'
        );
      }
    } finally {
      setLoading(false);
    }
  }, [period, startDate, endDate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Fetch recent orders separately (robust mapping)
  const fetchRecentOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await api.get(ORDER_ENDPOINTS.LIST, { params: { limit: 6, sort: 'created_at:desc' } });
      const data = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.data) ? res.data.data : [];
      // Normalize minimal fields used by the UI
      const normalized = data.map((o) => ({
        id: o.id ?? o._id ?? o.order_id,
        client: o.customer_name ?? o.customer?.name ?? o.client_name ?? (o.customer_email || '—'),
        status: o.status ?? o.state ?? o.order_status ?? '—',
        total: o.total ?? o.amount ?? o.grand_total ?? null,
      }));
      setRecentOrders(normalized.slice(0,5));
    } catch (err) {
      console.warn('Erreur commandes récentes', err?.response?.status || err.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch low stock items separately
  const fetchLowStock = async () => {
    try {
      setStockLoading(true);
      const res = await api.get(PRODUCT_ENDPOINTS.LIST, { params: { low_stock: true, limit: 6 } });
      const data = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.data) ? res.data.data : [];
      const normalized = data.map((p) => ({
        id: p.id ?? p._id ?? p.sku ?? Math.random().toString(36).slice(2,9),
        name: p.name ?? p.title ?? p.product_name ?? 'Produit',
        qty: p.stock ?? p.qty ?? p.quantity ?? (p.available ? `${p.available}` : '—'),
      }));
      setLowStockItems(normalized.slice(0,5));
    } catch (err) {
      console.warn('Erreur low stock', err?.response?.status || err.message);
    } finally {
      setStockLoading(false);
    }
  };

  // Expose manual refresh (header button)
  const handleRefresh = async () => {
    await fetchDashboardData();
    await fetchRecentOrders();
    await fetchLowStock();
  };


  return (
    <div className="relative dashboard-wave space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 px-4 sm:px-6 md:px-8 py-6">
      {/* Header avec filtres (maquette: texte d'accueil + boutons période) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 md:gap-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-gray-800 dark:text-white leading-tight">Bonjour, Admin!</h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">Bienvenue sur Reine d'Afrique — Tableau de bord</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex bg-transparent rounded-md shadow-sm" role="group">
            <button
              onClick={() => setPeriod(PERIODS.DAY)}
              className={`px-3 py-2 text-sm font-medium rounded-l-md border ${period === PERIODS.DAY ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-700 shadow' : 'bg-transparent text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'}`}
            >Jour</button>
            <button
              onClick={() => setPeriod(PERIODS.WEEK)}
              className={`px-3 py-2 text-sm font-medium border ${period === PERIODS.WEEK ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-700 shadow' : 'bg-transparent text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'}`}
            >Semaine</button>
            <button
              onClick={() => setPeriod(PERIODS.MONTH)}
              className={`px-3 py-2 text-sm font-medium rounded-r-md border ${period === PERIODS.MONTH ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-700 shadow' : 'bg-transparent text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'}`}
            >Mois</button>
          </div>

          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2 sm:p-2.5 md:p-3">
            <Calendar size={16} className="text-orange-500 dark:text-orange-400 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" />
            <select
              value={period === PERIODS.CUSTOM ? 'custom' : 'preset'}
              onChange={(e) => e.target.value === 'custom' ? setPeriod(PERIODS.CUSTOM) : setPeriod(PERIODS.MONTH)}
              className="border-none focus:ring-0 text-xs sm:text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 bg-transparent dark:bg-gray-800 cursor-pointer min-w-[160px]"
            >
              <option value="preset">01/04/2024 - 30/04/2024</option>
              <option value="custom">Période personnalisée</option>
            </select>
          </div>
          <button onClick={handleRefresh} className="ml-3 btn-refresh inline-flex items-center">
            Actualiser
          </button>
        </div>
      </div>

      {/* Bas: Commandes récentes + panneau droit (Stock Faible) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 sm:p-5 md:p-6">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3">Commandes Récentes</h3>
          <div className="overflow-x-auto">
            <table className="table-recent min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                {(recentOrders && recentOrders.length > 0 ? recentOrders : [
                  { id: '1', client: 'Aminata Diallo', status: 'En préparation', amount: '85 000 CFA' },
                  { id: '2', client: 'Ibrahima Koné', status: 'Livrée', amount: '120 000 CFA' },
                  { id: '3', client: 'Fatou Traoré', status: 'En discussion', amount: '50 000 CFA' },
                ]).map((row, idx) => (
                  <tr key={row.id || idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">{row.client || row.customer_name || row.customer?.name}</td>
                    <td className="px-4 py-3">
                      <span className={`badge-status ${row.status === 'Livrée' || row.status === 'delivered' ? 'badge-green' : row.status === 'En préparation' || row.status === 'processing' ? 'badge-yellow' : 'badge-orange'}`}>
                        {row.status || row.state}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">{row.amount ?? (row.total ? formatCurrency(row.total) : (row.total == null ? '—' : formatCurrency(row.total)))}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => console.log('Voir commande', row.id)} className="inline-flex items-center px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded shadow">Voir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 sm:p-5 md:p-6">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3">Stock Faible</h3>
          <ul className="space-y-3">
            {(lowStockItems && lowStockItems.length > 0 ? lowStockItems : [
              { id: 'p1', name: 'Wax Rouge', qty: '5 m' },
              { id: 'p2', name: 'Soie Dorée', qty: '2 m' },
              { id: 'p3', name: 'Bogolan Noir', qty: '3 m' },
            ]).map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-orange-100 flex items-center justify-center text-sm font-medium text-orange-700">{(item.name || item.title || '').split(' ').slice(0,1)}</div>
                  <div>
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{item.name || item.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{item.qty ?? (item.stock ? `${item.stock} unités` : '')}</div>
                  </div>
                </div>
                <div className="text-sm text-orange-600">-</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
        {/* Ventes Mensuelles */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 p-4 sm:p-5 md:p-6 lg:p-8 overflow-hidden relative hover:shadow-xl dark:hover:shadow-2xl transition-shadow">
          {/* Subtil overlay dégradé (remplace les motifs en carreaux) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(249,115,22,0.03), rgba(255,255,255,0))',
            }}
          />
          <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 md:mb-5 relative z-10">Ventes Mensuelles</h3>
          {loading ? (
            <div className="h-48 sm:h-64 md:h-72 lg:h-80 flex items-center justify-center relative z-10">
              <Loader size="lg" />
            </div>
          ) : salesData.length === 0 ? (
            <div className="h-48 sm:h-64 md:h-72 lg:h-80 flex items-center justify-center text-gray-500 dark:text-gray-400 relative z-10 text-sm sm:text-base">
              Aucune donnée disponible
            </div>
          ) : (
            <div className="w-full overflow-x-auto relative z-10">
              <ResponsiveContainer width="100%" height={chartHeight} minHeight={200}>
                <BarChart data={salesData} margin={{ top: 10, right: 15, left: 5, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: tickFontSize, fill: '#6b7280' }}
                    stroke="#9ca3af"
                  />
                  <YAxis 
                    tick={{ fontSize: tickFontSize, fill: '#6b7280' }}
                    tickFormatter={(value) => formatCurrency(value)}
                    stroke="#9ca3af"
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      fontSize: tooltipFontSize,
                      padding: '8px 12px'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: tooltipFontSize }}
                    iconSize={width < 640 ? 12 : 14}
                  />
                  <Bar dataKey="sales" fill="#f97316" name="Ventes" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Répartition des Ventes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-5 md:p-6 lg:p-8 overflow-hidden relative hover:shadow-xl dark:hover:shadow-2xl transition-all">
          {/* Subtil overlay dégradé (remplace les motifs en carreaux) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(225deg, rgba(234,88,12,0.03), rgba(255,255,255,0))',
            }}
          />
          <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 md:mb-5 relative z-10">Répartition des Ventes</h3>
          {loading ? (
            <div className="h-48 sm:h-64 md:h-72 lg:h-80 flex items-center justify-center relative z-10">
              <Loader size="lg" />
            </div>
          ) : salesDistribution.length === 0 ? (
            <div className="h-48 sm:h-64 md:h-72 lg:h-80 flex items-center justify-center text-gray-500 dark:text-gray-400 relative z-10 text-sm sm:text-base">
              Aucune donnée disponible
            </div>
          ) : (
            <div className="w-full overflow-x-auto relative z-10">
              <ResponsiveContainer width="100%" height={chartHeight} minHeight={200}>
                <PieChart>
                  <Pie
                    data={salesDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={pieRadius}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {salesDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      fontSize: tooltipFontSize,
                      padding: '8px 12px'
                    }}
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
