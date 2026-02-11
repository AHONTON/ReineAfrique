import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiArrowLeft, FiUser, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import Wrapper from "../components/Layout/Wrapper";
import { useCart } from '../contexts/CartContext';
import { useLoading } from '../contexts/LoadingContext';
import toastService from '../utils/toastService';
import Swal from 'sweetalert2';
import api from '../api/axios';
import { SHOP_ENDPOINTS } from '../config/api';

const Checkout = () => {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const { startLoading, stopLoading } = useLoading();
    
    // State to toggle the Modal Form
    const [isFormOpen, setIsFormOpen] = useState(false);

    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        telephone: '',
        adresse: '',
        ville: '',
        email: '',
        commentaire: ''
    });

    // Redirect if cart is empty
    React.useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/shop');
        }
    }, [cartItems, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!formData.nom || !formData.prenom || !formData.telephone || !formData.adresse || !formData.ville) {
            toastService.showError("Veuillez remplir tous les champs obligatoires (*)");
            return false;
        }
        return true;
    };

    const handleConfirmOrder = async () => {
        if (!validateForm()) return;

        startLoading();
        try {
            const orderPayload = {
                client_id: null,
                guest_info: {
                    nom: formData.nom,
                    prenom: formData.prenom,
                    telephone: formData.telephone,
                    email: formData.email,
                    address: formData.adresse,
                    city: formData.ville,
                    commentaire: formData.commentaire
                },
                date: new Date().toISOString().split('T')[0],
                status: 'en_attente',
                delivery_status: 'en_attente',
                items: cartItems.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            await api.post(SHOP_ENDPOINTS.ORDERS, orderPayload);

            stopLoading();
            setIsFormOpen(false);
            
            Swal.fire({
                title: 'Commande reçue !',
                text: 'Nous avons bien reçu votre commande. Un de nos agents vous contactera dans quelques instants pour la finaliser.',
                icon: 'success',
                confirmButtonColor: '#f97316',
                confirmButtonText: 'Retour à l\'accueil'
            }).then(() => {
                clearCart();
                navigate('/');
            });

        } catch (error) {
            stopLoading();
            console.error(error);
            const msg = error.response?.data?.message || "Une erreur est survenue lors de l'envoi de la commande.";
            toastService.showError(msg);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col"
        >
            <Header logoSrc="/images/logo2.png" />
            <main className="pt-4 flex-grow bg-gray-50 pb-20 relative">
                <Wrapper>
                    {/* Summary View (Always Visible as Step 1) */}
                    <div className="max-w-4xl mx-auto">
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-white p-8 rounded-xl shadow-sm"
                        >
                            <h1 className="text-2xl font-bold text-gray-900 mb-6 font-playfair border-b pb-4">Résumé de la Commande</h1>

                            {/* Products List Summary */}
                            <div className="mb-8">
                                <h3 className="font-bold text-gray-800 mb-4 pb-1">Articles ({cartItems.length})</h3>
                                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img src={item.image || "/images/placeholder-product.jpg"} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-800 block">{item.name}</span>
                                                    <span className="text-sm text-gray-500">Quantité: {item.quantity}</span>
                                                </div>
                                            </div>
                                            <div className="font-medium text-gray-800">
                                                {(item.price * item.quantity).toLocaleString('fr-FR')} F
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t-2 border-dashed border-gray-200 pt-6 mb-8">
                                <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                                    <span>Total à payer</span>
                                    <span className="text-orange-600">{getCartTotal().toLocaleString('fr-FR')} FCFA</span>
                                </div>
                                <p className="text-sm text-gray-400 mt-2 text-right italic">
                                    * Frais de livraison calculés lors de la confirmation
                                </p>
                            </div>

                            <div className="flex justify-end">
                                <button 
                                    onClick={() => setIsFormOpen(true)}
                                    className="bg-orange-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all flex items-center gap-2"
                                >
                                    Valider la commande <FiCheck />
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Modal Form Overlay */}
                    <AnimatePresence>
                        {isFormOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsFormOpen(false)}
                                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                                ></motion.div>
                                
                                <motion.div 
                                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                    className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 max-h-[90vh] overflow-y-auto"
                                >
                                    <div className="p-6 md:p-8">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-playfair border-b pb-4">
                                            Vos Coordonnées
                                        </h2>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Nom *</label>
                                                <div className="relative">
                                                    <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                                                    <input 
                                                        type="text" 
                                                        name="nom"
                                                        value={formData.nom}
                                                        onChange={handleChange}
                                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                                        placeholder="Votre nom"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Prénom *</label>
                                                <div className="relative">
                                                    <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                                                    <input 
                                                        type="text" 
                                                        name="prenom"
                                                        value={formData.prenom}
                                                        onChange={handleChange}
                                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                                        placeholder="Votre prénom"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Téléphone *</label>
                                                <div className="relative">
                                                    <FiPhone className="absolute left-3 top-3.5 text-gray-400" />
                                                    <input 
                                                        type="tel" 
                                                        name="telephone"
                                                        value={formData.telephone}
                                                        onChange={handleChange}
                                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                                        placeholder="ex: 97000000"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Email</label>
                                                <div className="relative">
                                                    <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                                                    <input 
                                                        type="email" 
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                                        placeholder="Optionnel"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-sm font-medium text-gray-700">Adresse de livraison *</label>
                                                <div className="relative">
                                                    <FiMapPin className="absolute left-3 top-3.5 text-gray-400" />
                                                    <input 
                                                        type="text" 
                                                        name="adresse"
                                                        value={formData.adresse}
                                                        onChange={handleChange}
                                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                                        placeholder="Quartier, rue, maison..."
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Ville *</label>
                                                <input 
                                                    type="text" 
                                                    name="ville"
                                                    value={formData.ville}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                                    placeholder="Cotonou"
                                                />
                                            </div>

                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-sm font-medium text-gray-700">Précision / Commentaire</label>
                                                <textarea 
                                                    name="commentaire"
                                                    value={formData.commentaire}
                                                    onChange={handleChange}
                                                    rows="3"
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                                    placeholder="Instructions spéciales pour la livraison..."
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div className="flex justify-between md:justify-end gap-3">
                                            <button 
                                                onClick={() => setIsFormOpen(false)}
                                                className="px-6 py-3 text-gray-500 hover:text-gray-800 font-medium"
                                            >
                                                Annuler
                                            </button>
                                            <button 
                                                onClick={handleConfirmOrder}
                                                className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 shadow-lg shadow-green-200 transition-all flex items-center gap-2"
                                            >
                                                <FiCheck /> Confirmer
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                </Wrapper>
            </main>
            <Footer />
        </motion.div>
    );
};

export default Checkout;
