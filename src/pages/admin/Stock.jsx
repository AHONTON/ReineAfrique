import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import api from '../../api/axios';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import { showError, showSuccess, showConfirm } from '../../utils/swal';

const Stock = () => {
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, productsRes] = await Promise.all([
        api.get('/admin/categories'),
        api.get('/admin/products'),
      ]);
      setCategories(categoriesRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      showError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

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
        await api.delete(`/admin/categories/${categoryId}`);
        showSuccess('Catégorie supprimée avec succès');
        fetchData();
      } catch (error) {
        showError('Erreur lors de la suppression de la catégorie');
      }
    }
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    try {
      if (selectedCategory) {
        await api.put(`/admin/categories/${selectedCategory.id}`, categoryForm);
        showSuccess('Catégorie modifiée avec succès');
      } else {
        await api.post('/admin/categories', categoryForm);
        showSuccess('Catégorie créée avec succès');
      }
      setIsCategoryModalOpen(false);
      fetchData();
    } catch (error) {
      showError('Erreur lors de la sauvegarde de la catégorie');
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
        await api.delete(`/admin/products/${productId}`);
        showSuccess('Produit supprimé avec succès');
        fetchData();
      } catch (error) {
        showError('Erreur lors de la suppression du produit');
      }
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    try {
      if (selectedProduct) {
        await api.put(`/admin/products/${selectedProduct.id}`, productForm);
        showSuccess('Produit modifié avec succès');
      } else {
        await api.post('/admin/products', productForm);
        showSuccess('Produit créé avec succès');
      }
      setIsProductModalOpen(false);
      fetchData();
    } catch (error) {
      showError('Erreur lors de la sauvegarde du produit');
    }
  };

  const categoryColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nom' },
    { key: 'description', label: 'Description' },
  ];

  const productColumns = [
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
        <span className={value < 10 ? 'text-red-600 font-bold' : ''}>
          {value} m
        </span>
      ),
    },
    {
      key: 'pricePerMeter',
      label: 'Prix/mètre',
      render: (value) =>
        new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'XOF',
        }).format(value),
    },
  ];

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Gestion du Stock</h1>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md p-1 flex space-x-1">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'products'
              ? 'bg-orange-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Produits
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'categories'
              ? 'bg-orange-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom
            </label>
            <input
              type="text"
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={categoryForm.description}
              onChange={(e) =>
                setCategoryForm({ ...categoryForm, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom
            </label>
            <input
              type="text"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <select
              value={productForm.categoryId}
              onChange={(e) =>
                setProductForm({ ...productForm, categoryId: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={productForm.description}
              onChange={(e) =>
                setProductForm({ ...productForm, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsProductModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              {selectedProduct ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Stock;
