import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiArrowLeft, FiCheck, FiTruck, FiShield, FiPhone, FiX } from 'react-icons/fi';
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import Wrapper from "../components/Layout/Wrapper";
import { useCart } from '../contexts/CartContext';
import { useLoading } from '../contexts/LoadingContext';
import api from '../api/axios';
import { SHOP_ENDPOINTS } from '../config/api';
import toastService from '../utils/toastService';
import Swal from 'sweetalert2';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { startLoading, stopLoading } = useLoading();
    
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showOrderModal, setShowOrderModal] = useState(false);

    // Form state for direct order
    const [orderForm, setOrderForm] = useState({
        nom: '',
        prenom: '',
        telephone: '',
        adresse: '',
        ville: '',
        email: '' // optional
    });

    useEffect(() => {
        const fetchProduct = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(SHOP_ENDPOINTS.GET_PRODUCT(id));
                setProduct(response.data);
            } catch (error) {
                console.error("Error fetching product:", error);
                toastService.error("Impossible de charger le produit.");
                navigate('/shop');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrderForm(prev => ({ ...prev, [name]: value }));
    };

    const handleDirectOrder = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!orderForm.nom || !orderForm.telephone || !orderForm.adresse) {
            toastService.error("Veuillez remplir les champs obligatoires (*)");
            return;
        }

        startLoading();
        try {
            const orderPayload = {
                client_id: null, // Guest checkout
                guest_info: {
                    ...orderForm,
                    commentaire: "Commande directe depuis la page produit"
                },
                date: new Date().toISOString().split('T')[0],
                status: 'en_attente',
                delivery_status: 'en_attente',
                items: [{
                    product_id: product.id,
                    quantity: 1, // Default to 1 for direct order
                    price: product.price_per_meter || product.price
                }]
            };

            await api.post(SHOP_ENDPOINTS.ORDERS, orderPayload);
            setShowOrderModal(false);
            stopLoading();

            // Success Popup as requested
            Swal.fire({
                title: 'Commande reçue !',
                text: 'Nous avons bien reçu votre commande. Un de nos agents vous contactera dans quelques instants pour la finaliser.',
                icon: 'success',
                confirmButtonColor: '#f97316',
                confirmButtonText: 'Retour à la boutique'
            }).then(() => {
                navigate('/shop');
            });

        } catch (error) {
            stopLoading();
            console.error("Order error:", error);
            toastService.error("Une erreur est survenue lors de la commande.");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="w-12 h-12 border-b-2 border-orange-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!product) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col min-h-screen bg-gray-50"
        >
            <Header logoSrc="/images/logo2.png" />
            
            <main className="flex-grow pt-8 pb-16">
                <Wrapper>
                    {/* Breadcrumb */}
                    <div className="flex items-center mb-6 text-sm text-gray-500">
                        <Link to="/" className="hover:text-orange-500">Accueil</Link>
                        <span className="mx-2">/</span>
                        <Link to="/shop" className="hover:text-orange-500">Boutique</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
                    </div>

                    <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl">
                        <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
                            
                            {/* Left: Image Section */}
                            <div className="bg-gray-100 relative group overflow-hidden h-[400px] lg:h-[600px]">
                                <img 
                                    src={product.image || "/images/placeholder-product.jpg"} 
                                    alt={product.name}
                                    className="object-cover w-full h-full transition-transform duration-700 hover:scale-105 cursor-zoom-in"
                                />
                                {product.is_promo && (
                                    <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                        PROMO
                                    </div>
                                )}
                            </div>

                            {/* Right: Product Details */}
                            <div className="flex flex-col h-full p-6 lg:p-10">
                                <div className="mb-auto">
                                    <span className="block mb-2 text-xs font-bold tracking-wider text-orange-500 uppercase">
                                        {product.category?.name || 'Reine Afrique'} // Check if category is object or string
                                    </span>
                                    
                                    <h1 className="mb-4 text-3xl font-bold leading-tight text-gray-900">
                                        {product.name}
                                    </h1>

                                    <div className="flex items-baseline gap-4 mb-6">
                                        <span className="text-3xl font-extrabold text-gray-900">
                                            {(product.price_per_meter || product.price).toLocaleString('fr-FR')} 
                                            <span className="ml-1 text-base font-normal text-gray-500">FCFA</span>
                                        </span>
                                        {product.is_available ? (
                                            <span className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-green-700 bg-green-100 rounded-full">
                                                <FiCheck size={14} /> En stock
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 text-xs font-bold text-red-700 bg-red-100 rounded-full">
                                                Épuisé
                                            </span>
                                        )}
                                    </div>

                                    <div className="mb-8 prose-sm prose text-gray-600 max-w-none">
                                        <p>{product.description || "Aucune description disponible pour cet article."}</p>
                                    </div>
                                    
                                    {/* Features / Trust Badges */}
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50">
                                            <div className="p-2 text-orange-500 bg-white rounded-full shadow-sm">
                                                <FiTruck size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-900">Livraison Rapide</p>
                                                <p className="text-[10px] text-gray-500">Partout au Bénin</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                                            <div className="p-2 text-blue-500 bg-white rounded-full shadow-sm">
                                                <FiShield size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-900">Qualité Garantie</p>
                                                <p className="text-[10px] text-gray-500">Tissu authentique</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="pt-6 space-y-3 border-t border-gray-100">
                                    <button 
                                        onClick={() => setShowOrderModal(true)}
                                        disabled={!product.is_available}
                                        className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg shadow-orange-200 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 ${
                                            product.is_available 
                                                ? 'bg-orange-500 text-white hover:bg-orange-600' 
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        Commander Maintenant
                                    </button>
                                    
                                    <button 
                                        onClick={() => addToCart(product)}
                                        disabled={!product.is_available}
                                        className="flex items-center justify-center w-full gap-2 px-6 py-3 font-bold text-gray-700 transition-colors bg-white border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:text-orange-500"
                                    >
                                        <FiShoppingCart size={20} />
                                        Ajouter au panier
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Wrapper>
            </main>
            <Footer />

            {/* Modal de Commande Rapide */}
            <AnimatePresence>
                {showOrderModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowOrderModal(false)}
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} 
                            animate={{ scale: 1, opacity: 1, y: 0 }} 
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative z-10 w-full max-w-md overflow-hidden bg-white shadow-2xl rounded-2xl"
                        >
                            <div className="p-6 border-b border-orange-100 bg-orange-50">
                                <h3 className="text-xl font-bold text-gray-800">Finaliser votre commande</h3>
                                <p className="mt-1 text-sm text-gray-500">Laissez vos coordonnées pour être recontacté.</p>
                                <button 
                                    onClick={() => setShowOrderModal(false)}
                                    className="absolute p-1 text-gray-400 bg-white rounded-full top-4 right-4 hover:text-gray-600"
                                >
                                    <FiX size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleDirectOrder} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-1 text-xs font-bold text-gray-700">Nom *</label>
                                        <input 
                                            type="text" 
                                            name="nom"
                                            value={orderForm.nom}
                                            onChange={handleInputChange}
                                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                                            placeholder="Votre nom"
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-xs font-bold text-gray-700">Prénom</label>
                                        <input 
                                            type="text" 
                                            name="prenom"
                                            value={orderForm.prenom}
                                            onChange={handleInputChange}
                                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                                            placeholder="Votre prénom" 
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-1 text-xs font-bold text-gray-700">Téléphone *</label>
                                    <input 
                                        type="tel" 
                                        name="telephone"
                                        value={orderForm.telephone}
                                        onChange={handleInputChange}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                                        placeholder="Ex: 97000000"
                                        required 
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 text-xs font-bold text-gray-700">Ville/Quartier *</label>
                                    <input 
                                        type="text" 
                                        name="adresse"
                                        value={orderForm.adresse}
                                        onChange={handleInputChange}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                                        placeholder="Ex: Cotonou, Haie Vive"
                                        required 
                                    />
                                </div>

                                <div className="pt-4">
                                    <button 
                                        type="submit"
                                        className="flex items-center justify-center w-full gap-2 py-3 font-bold text-white transition-all bg-orange-600 shadow-lg hover:bg-orange-700 rounded-xl shadow-orange-200 active:scale-95"
                                    >
                                        <span>Confirmer la commande</span>
                                        <FiCheck />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ProductDetail;
