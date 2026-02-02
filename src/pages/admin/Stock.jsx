import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import api from '../../api/axios';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import { showConfirm } from '../../utils/swal';
import toastService from '../../utils/toastService';
import { CATEGORY_ENDPOINTS, PRODUCT_ENDPOINTS } from '../../config/api';
import { LOW_STOCK_THRESHOLD } from '../../config/constants';
import { formatCurrency } from '../../utils/formatters';

const Stock = memo(() => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products'); // 'categories' or 'products'
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
  const [productForm, setProductForm] = useState({
    name: '',
    categoryId: '',
    stock: 0,
    pricePerMeter: 0,
    description: '',
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [categoriesRes, productsRes] = await Promise.all([
        api.get(CATEGORY_ENDPOINTS.LIST),
        api.get(PRODUCT_ENDPOINTS.LIST),
      ]);
      // S'assurer que les données sont des tableaux
      const categoriesData = Array.isArray(categoriesRes.data) ? categoriesRes.data : [];
      const productsData = Array.isArray(productsRes.data) ? productsRes.data : [];
      setCategories(categoriesData);
      setProducts(productsData);
      console.log('✅ Données chargées - Catégories:', categoriesData.length, 'Produits:', productsData.length);
      
      if (categoriesData.length === 0 && productsData.length === 0) {
        console.warn('⚠️ Aucune donnée trouvée dans la réponse API');
      }
    } catch (error) {
      // En cas d'erreur, initialiser avec des tableaux vides
      setCategories([]);
      setProducts([]);
      console.error('❌ Erreur lors du chargement des données:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.response?.data?.message || error.message,
        data: error.response?.data,
        url: error.config?.url,
      });
      
      // Afficher un message d'erreur plus détaillé
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Erreur lors du chargement des données';
      
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
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Gestion des catégories
  const handleCreateCategory = () => {
    setSelectedCategory(null);
    setCategoryForm({ name: '', description: '' });
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setCategoryForm({
      name: category.name || '',
      description: category.description || '',
    });
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    const { value: confirmed } = await showConfirm(
      'Êtes-vous sûr de vouloir supprimer cette catégorie ?',
      'Supprimer la catégorie'
    );

    if (confirmed) {
      try {
        const response = await api.delete(CATEGORY_ENDPOINTS.DELETE(categoryId));
        if (response && (response.status === 200 || response.status === 204)) {
          toastService.showSuccess('Catégorie supprimée avec succès');
          // Mettre à jour immédiatement l'état local
          setCategories(prevCategories => prevCategories.filter(category => category.id !== categoryId));
          // Rafraîchir pour s'assurer de la synchronisation
          fetchData();
        }
      } catch (error) {
        const errorMessage = 
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Erreur lors de la suppression de la catégorie';
        toastService.showError(errorMessage);
      }
    }
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (selectedCategory) {
        response = await api.put(CATEGORY_ENDPOINTS.UPDATE(selectedCategory.id), categoryForm);
        toastService.showSuccess('Catégorie modifiée avec succès');
      } else {
        response = await api.post(CATEGORY_ENDPOINTS.CREATE, categoryForm);
        toastService.showSuccess('Catégorie créée avec succès');
      }
      if (response && (response.status === 201 || response.status === 200)) {
        const updatedCategory = response.data?.category || response.data;
        
        if (updatedCategory) {
          if (selectedCategory) {
            // Mise à jour : remplacer la catégorie modifiée dans la liste
            setCategories(prevCategories => 
              prevCategories.map(category => 
                category.id === selectedCategory.id ? updatedCategory : category
              )
            );
          } else {
            // Création : ajouter la nouvelle catégorie à la liste
            setCategories(prevCategories => [...prevCategories, updatedCategory]);
          }
        }
        
        setIsCategoryModalOpen(false);
        setCategoryForm({ name: '', description: '' });
        setSelectedCategory(null);
        // Rafraîchir pour s'assurer de la synchronisation complète
        fetchData();
      }
    } catch (error) {
      const errorMessage = 
        error.response?.data?.message ||
        error.response?.data?.error ||
        (error.response?.data?.errors ? 
          Object.values(error.response.data.errors).flat().join(', ') : 
          'Erreur lors de la sauvegarde de la catégorie'
        );
      toastService.showError(errorMessage);
    }
  };

  // Gestion des produits
  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setProductForm({
      name: '',
      categoryId: '',
      stock: 0,
      pricePerMeter: 0,
      description: '',
    });
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setProductForm({
      name: product.name || '',
      categoryId: product.categoryId || '',
      stock: product.stock || 0,
      pricePerMeter: product.pricePerMeter || 0,
      description: product.description || '',
    });
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    const { value: confirmed } = await showConfirm(
      'Êtes-vous sûr de vouloir supprimer ce produit ?',
      'Supprimer le produit'
    );

    if (confirmed) {
      try {
        const response = await api.delete(PRODUCT_ENDPOINTS.DELETE(productId));
        if (response && (response.status === 200 || response.status === 204)) {
          toastService.showSuccess('Produit supprimé avec succès');
          // Mettre à jour immédiatement l'état local
          setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
          // Rafraîchir pour s'assurer de la synchronisation
          fetchData();
        }
      } catch (error) {
        const errorMessage = 
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Erreur lors de la suppression du produit';
        toastService.showError(errorMessage);
      }
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    try {
      // S'assurer que categoryId est un entier
      const productData = {
        ...productForm,
        categoryId: productForm.categoryId ? parseInt(productForm.categoryId, 10) : productForm.categoryId,
        stock: parseFloat(productForm.stock) || 0,
        pricePerMeter: parseFloat(productForm.pricePerMeter) || 0,
      };
      
      let response;
      if (selectedProduct) {
        response = await api.put(PRODUCT_ENDPOINTS.UPDATE(selectedProduct.id), productData);
        toastService.showSuccess('Produit modifié avec succès');
      } else {
        response = await api.post(PRODUCT_ENDPOINTS.CREATE, productData);
        toastService.showSuccess('Produit créé avec succès');
      }
      if (response && (response.status === 201 || response.status === 200)) {
        const updatedProduct = response.data?.product || response.data;
        
        if (updatedProduct) {
          if (selectedProduct) {
            // Mise à jour : remplacer le produit modifié dans la liste
            setProducts(prevProducts => 
              prevProducts.map(product => 
                product.id === selectedProduct.id ? updatedProduct : product
              )
            );
          } else {
            // Création : ajouter le nouveau produit à la liste
            setProducts(prevProducts => [...prevProducts, updatedProduct]);
          }
        }
        
        setIsProductModalOpen(false);
        setProductForm({
          name: '',
          categoryId: '',
          stock: 0,
          pricePerMeter: 0,
          description: '',
        });
        setSelectedProduct(null);
        // Rafraîchir pour s'assurer de la synchronisation complète
        fetchData();
      }
    } catch (error) {
      const errorMessage = 
        error.response?.data?.message ||
        error.response?.data?.error ||
        (error.response?.data?.errors ? 
          Object.values(error.response.data.errors).flat().join(', ') : 
          'Erreur lors de la sauvegarde du produit'
        );
      toastService.showError(errorMessage);
    }
  };


  const categoryColumns = useMemo(() => [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nom' },
    { key: 'description', label: 'Description' },
  ], []);

  const productColumns = useMemo(() => [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nom' },
    {
      key: 'category',
      label: 'Catégorie',
      render: (value, row) => {
        const category = categories.find((c) => c.id === row.categoryId);
        return category?.name || 'N/A';
      },
    },
    {
      key: 'stock',
      label: 'Stock (m)',
      render: (value) => (
        <span className={value < LOW_STOCK_THRESHOLD ? 'text-red-600 font-bold' : ''}>
          {value} m
        </span>
      ),
    },
    {
      key: 'pricePerMeter',
      label: 'Prix/mètre',
      render: (value) => formatCurrency(value),
    },
  ], [categories]);

  const categoryActions = (row) => (
    <div className="flex items-center justify-end space-x-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleEditCategory(row);
        }}
        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
        title="Modifier"
      >
        <Edit size={18} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteCategory(row.id);
        }}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="Supprimer"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );

  const productActions = (row) => (
    <div className="flex items-center justify-end space-x-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleEditProduct(row);
        }}
        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
        title="Modifier"
      >
        <Edit size={18} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteProduct(row.id);
        }}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="Supprimer"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Gestion du Stock</h1>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-1 flex space-x-1 border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
            activeTab === 'products'
              ? 'bg-orange-500 text-white'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          Produits
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex-1 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
            activeTab === 'categories'
              ? 'bg-orange-500 text-white'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          Catégories
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <>
          <div className="flex justify-end">
            <button
              onClick={handleCreateProduct}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Plus size={20} />
              <span>Nouveau Produit</span>
            </button>
          </div>
          <DataTable
            columns={productColumns}
            data={products}
            loading={loading}
            searchable
            actions={productActions}
          />
        </>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <>
          <div className="flex justify-end">
            <button
              onClick={handleCreateCategory}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Plus size={20} />
              <span>Nouvelle Catégorie</span>
            </button>
          </div>
          <DataTable
            columns={categoryColumns}
            data={categories}
            loading={loading}
            searchable
            actions={categoryActions}
          />
        </>
      )}

      {/* Modal Catégorie */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setSelectedCategory(null);
        }}
        title={selectedCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
      >
        <form onSubmit={handleSubmitCategory} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom
            </label>
            <input
              type="text"
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={categoryForm.description}
              onChange={(e) =>
                setCategoryForm({ ...categoryForm, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:border-orange-500 resize-none"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              {selectedCategory ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Produit */}
      <Modal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedProduct(null);
        }}
        title={selectedProduct ? 'Modifier le produit' : 'Nouveau produit'}
      >
        <form onSubmit={handleSubmitProduct} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom
            </label>
            <input
              type="text"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Catégorie
            </label>
            <select
              value={productForm.categoryId}
              onChange={(e) =>
                setProductForm({ ...productForm, categoryId: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:border-orange-500"
            >
              <option value="" className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">Sélectionner une catégorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Stock (mètres)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={productForm.stock}
                onChange={(e) =>
                  setProductForm({ ...productForm, stock: parseFloat(e.target.value) })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prix au mètre (CFA)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={productForm.pricePerMeter}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    pricePerMeter: parseFloat(e.target.value),
                  })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:border-orange-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={productForm.description}
              onChange={(e) =>
                setProductForm({ ...productForm, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:border-orange-500 resize-none"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setIsProductModalOpen(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              {selectedProduct ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
});

Stock.displayName = 'Stock';

export default Stock;
