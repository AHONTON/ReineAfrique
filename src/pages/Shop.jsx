import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import Wrapper from "../components/Layout/Wrapper";
import ProductCard from "../components/Shop/ProductCard";
import ShopBanner from "../components/Shop/ShopBanner";
import api from '../api/axios';
import { SHOP_ENDPOINTS } from '../config/api';
import toastService from '../utils/toastService';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        const query = searchParams.get("search");
        if (query) {
            setSearchTerm(query);
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    api.get(SHOP_ENDPOINTS.PRODUCTS),
                    api.get(SHOP_ENDPOINTS.CATEGORIES)
                ]);

                // Map API products to View Model
                const mappedProducts = (Array.isArray(productsRes.data) ? productsRes.data : []).map(p => ({
                    ...p,
                    price: p.price_per_meter || p.pricePerMeter, // Handle both cases
                    category: categoriesRes.data.find(c => c.id === (p.categoryId || p.category_id))?.name || 'Autre'
                }));

                setProducts(mappedProducts);
                setCategories(categoriesRes.data || []);
            } catch (error) {
                console.error("Error fetching shop data:", error);
                toastService.showError("Impossible de charger les articles.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const ProductSkeleton = () => (
      <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm animate-pulse border border-gray-100 h-full flex flex-col min-w-0 w-full">
          <div className="aspect-square bg-gray-200" />
          <div className="p-3 sm:p-4 flex flex-col flex-1 min-h-[120px] sm:min-h-[140px]">
              <div className="flex justify-between mb-0.5 sm:mb-1">
                  <div className="h-2.5 sm:h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-2.5 sm:h-3 bg-gray-200 rounded w-12 sm:w-14" />
              </div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-full mb-1" />
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3 mb-1.5 sm:mb-2" />
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/4 mt-auto" />
              <div className="h-[44px] sm:h-10 bg-gray-200 rounded-lg sm:rounded-xl mt-2 sm:mt-3" />
          </div>
      </div>
    );

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesFilter = selectedCategory === "all" || product.category_id === parseInt(selectedCategory) || product.categoryId === parseInt(selectedCategory);
        return matchesSearch && matchesFilter;
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen flex flex-col"
        >
            <Header logoSrc="/images/logo2.png" />
            <main className="pt-0 flex-grow bg-gray-50 pb-16 sm:pb-20 flex flex-col">
                {/* Bannière hero pleine largeur */}
                <ShopBanner />

                <Wrapper className="flex-1 pt-6 sm:pt-8">
                    {/* Search and Filters - responsive, sticky adapté mobile */}
                    <div className="flex flex-col items-center justify-center mb-6 sm:mb-10 space-y-4 sm:space-y-6 sticky top-16 sm:top-20 z-30 bg-gray-50/95 backdrop-blur-sm p-3 sm:p-4 rounded-xl -mx-4 sm:mx-0 px-4 sm:px-0">
                        
                        {/* Search Bar */}
                        <div className="relative w-full max-w-xl group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="text-gray-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Rechercher un tissu, une tenue..." 
                                className="w-full pl-11 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-full shadow-sm text-sm sm:text-base text-gray-700 focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all placeholder-gray-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Categories Filters - scroll horizontal sur mobile */}
                        <div className="flex flex-wrap sm:flex-wrap items-center justify-center gap-2 max-w-4xl w-full overflow-x-auto pb-1 sm:pb-0 scrollbar-hide -mx-1 px-1 sm:mx-0 sm:px-0">
                            <button
                                onClick={() => setSelectedCategory("all")}
                                className={`shrink-0 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all transform hover:scale-105 ${
                                    selectedCategory === "all"
                                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 ring-2 ring-orange-500 ring-offset-2' 
                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-orange-300'
                                }`}
                            >
                                Tout
                            </button>
                            {isLoading 
                              ? [...Array(4)].map((_, i) => <div key={i} className="h-9 w-24 bg-white rounded-full animate-pulse"></div>)
                              : categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`shrink-0 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all transform hover:scale-105 ${
                                        selectedCategory === cat.id 
                                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 ring-2 ring-orange-500 ring-offset-2' 
                                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-orange-300'
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grille produits - alignée sur toute la largeur, colonnes égales */}
                    {isLoading ? (
                         <div className="w-full min-w-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6 justify-items-stretch items-stretch">
                            {[...Array(8)].map((_, i) => (
                                <ProductSkeleton key={i} />
                            ))}
                         </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="w-full min-w-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6 justify-items-stretch items-stretch">
                            {filteredProducts.map((product, index) => (
                                <ProductCard key={product.id} product={product} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 sm:py-20 px-4 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-dashed border-gray-200">
                            <div className="mx-auto h-16 w-16 sm:h-24 sm:w-24 text-gray-200 mb-3 sm:mb-4">
                                <Search className="h-full w-full" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-medium text-gray-900">Aucun article trouvé</h3>
                            <p className="text-gray-500 mt-2 text-sm sm:text-base">Essayez de modifier vos filtres ou votre recherche.</p>
                            <button 
                                onClick={() => {setSearchTerm(""); setSelectedCategory("all");}}
                                className="mt-4 sm:mt-6 px-5 py-2.5 sm:px-6 bg-orange-50 text-orange-600 rounded-full font-medium hover:bg-orange-100 transition-colors text-sm sm:text-base"
                            >
                                Réinitialiser tout
                            </button>
                        </div>
                    )}
                </Wrapper>
            </main>
            <Footer />
        </motion.div>
    );
};

export default Shop;
