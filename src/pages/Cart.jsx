import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import Wrapper from "../components/Layout/Wrapper";
import { useCart } from '../contexts/CartContext';

const Cart = () => {
    const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col"
        >
            <Header logoSrc="/images/logo2.png" />
            <main className="pt-4 flex-grow bg-gray-50 pb-20">
                <Wrapper>
                    <div className="mb-8">
                        <button 
                            onClick={() => navigate('/shop')}
                            className="flex items-center text-gray-500 hover:text-orange-500 transition-colors"
                        >
                            <FiArrowLeft className="mr-2" /> Continuer mes achats
                        </button>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-8 font-playfair">Mon Panier</h1>

                    {cartItems.length > 0 ? (
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Cart Items List */}
                            <div className="lg:w-2/3 space-y-4">
                                {cartItems.map(item => (
                                    <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm flex flex-col sm:flex-row items-center gap-4">
                                        <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                            <img 
                                                src={item.image || "/images/placeholder-product.jpg"} 
                                                alt={item.name} 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="flex-grow text-center sm:text-left">
                                            <h3 className="font-bold text-gray-800">{item.name}</h3>
                                            <p className="text-orange-500 font-medium">{item.price.toLocaleString('fr-FR')} FCFA</p>
                                        </div>

                                        <div className="flex items-center bg-gray-100 rounded-lg">
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-2 text-gray-600 hover:text-orange-500 transition-colors"
                                            >
                                                <FiMinus size={16} />
                                            </button>
                                            <span className="w-10 text-center font-medium">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-2 text-gray-600 hover:text-orange-500 transition-colors"
                                            >
                                                <FiPlus size={16} />
                                            </button>
                                        </div>

                                        <div className="font-bold text-gray-800 w-24 text-right">
                                            {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                                        </div>

                                        <button 
                                            onClick={() => removeFromCart(item.id)}
                                            className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <FiTrash2 size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary Box */}
                            <div className="lg:w-1/3">
                                <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
                                    <h2 className="text-xl font-bold text-gray-800 mb-6">Récapitulatif</h2>
                                    
                                    <div className="space-y-3 text-sm text-gray-600 mb-6 border-b border-gray-100 pb-6">
                                        <div className="flex justify-between">
                                            <span>Sous-total</span>
                                            <span>{getCartTotal().toLocaleString('fr-FR')} FCFA</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Livraison</span>
                                            <span className="text-orange-500 font-medium">Calculé à l'étape suivante</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center text-lg font-bold text-gray-900 mb-6">
                                        <span>Total</span>
                                        <span>{getCartTotal().toLocaleString('fr-FR')} FCFA</span>
                                    </div>

                                    <button 
                                        onClick={() => navigate('/checkout')}
                                        className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-2"
                                    >
                                        Terminé <FiArrowRight />
                                    </button>
                                    
                                    <p className="mt-4 text-xs text-gray-400 text-center">
                                        Cliquez sur "Terminé" pour visualiser le résumé et valider.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 text-orange-500 rounded-full mb-6">
                                <FiShoppingCart size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Votre panier est vide</h2>
                            <p className="text-gray-500 mb-8">Découvrez nos articles uniques et commencez votre shopping !</p>
                            <button 
                                onClick={() => navigate('/shop')}
                                className="px-8 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                Voir les articles
                            </button>
                        </div>
                    )}
                </Wrapper>
            </main>
            <Footer />
        </motion.div>
    );
};

export default Cart;
