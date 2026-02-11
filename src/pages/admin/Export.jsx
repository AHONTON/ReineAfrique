import { useState } from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import api from '../../api/axios';
import { showLoading, closeLoading } from '../../utils/swal';
import toastService from '../../utils/toastService';
import { EXPORT_ENDPOINTS } from '../../config/api';
import { EXPORT_TYPES, EXPORT_FORMATS } from '../../config/constants';

const Export = () => {
  const [exporting, setExporting] = useState(null);

  const handleExport = async (type, format) => {
    try {
      setExporting(`${type}-${format}`);
      showLoading('Génération du fichier...');

      const response = await api.get(`/admin/export/${type}`, {
        params: { format },
        responseType: 'blob',
      });

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      closeLoading();
      toastService.showSuccess('Export réussi !', 'Fichier téléchargé');
      setExporting(null);
    } catch {
      closeLoading();
      toastService.showError('Erreur lors de l\'export');
      setExporting(null);
    }
  };

  const exportOptions = [
    {
      title: 'Clients',
      description: 'Exporter la liste complète des clients',
      type: EXPORT_TYPES.CLIENTS,
      icon: FileText,
    },
    {
      title: 'Commandes',
      description: 'Exporter toutes les commandes',
      type: EXPORT_TYPES.ORDERS,
      icon: FileText,
    },
    {
      title: 'Finances',
      description: 'Exporter les données financières',
      type: EXPORT_TYPES.FINANCE,
      icon: FileSpreadsheet,
    },
    {
      title: 'Stock',
      description: 'Exporter l\'état du stock',
      type: EXPORT_TYPES.STOCK,
      icon: FileSpreadsheet,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Exportation des Données</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Téléchargez vos données au format CSV ou Excel
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {exportOptions.map((option) => (
          <div
            key={option.type}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <option.icon className="text-orange-500" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{option.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{option.description}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleExport(option.type, EXPORT_FORMATS.CSV)}
                    disabled={exporting === `${option.type}-${EXPORT_FORMATS.CSV}`}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download size={18} />
                    <span>CSV</span>
                  </button>
                  <button
                    onClick={() => handleExport(option.type, EXPORT_FORMATS.XLSX)}
                    disabled={exporting === `${option.type}-${EXPORT_FORMATS.XLSX}`}
                    className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download size={18} />
                    <span>Excel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-2">Instructions</h3>
        <ul className="list-disc list-inside space-y-2 text-blue-700">
          <li>Les fichiers CSV peuvent être ouverts avec Excel, Google Sheets ou tout tableur</li>
          <li>Les fichiers Excel (.xlsx) conservent la mise en forme et les formules</li>
          <li>Les exports incluent toutes les données disponibles pour la période sélectionnée</li>
          <li>Les fichiers sont nommés automatiquement avec la date d'export</li>
        </ul>
      </div>
    </div>
  );
};

export default Export;
