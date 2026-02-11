import React from 'react';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiMessageCircle, FiEye } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const whatsappNumber = "+2290150035719"; 
  // Assuming this is the business number. Should be in constants.

  const handleWhatsApp = () => {
    const message = `Bonjour, je suis intéressé par l'article : ${product.name} (Prix: ${product.price} XOF)`;
    const url = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm hover:shadow-xl hover:shadow-orange-100 transition-all duration-300 flex flex-col h-full group border border-gray-100 overflow-hidden"
      whileHover={{ y: -4 }}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50 group">
        <img 
          src={product.image || "/images/placeholder-product.jpg"} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        
        {product.is_promo && (
          <div className="absolute top-2 left-2 bg-white/95 text-red-600 text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm z-10 border border-red-50">
            en promotion
          </div>
        )}
        
        {!product.is_available && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
            <span className="bg-gray-900 text-white font-medium text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
              Épuisé
            </span>
          </div>
        )}
      </div>

      <div className="p-2.5 flex-1 flex flex-col gap-2">
        <div className="min-w-0">
           <div className="flex justify-between items-start mb-0.5">
             <span className="text-[9px] uppercase tracking-wider text-gray-500 font-medium truncate">
                  {product.category || 'Collection'}
             </span>
             {product.is_available && (
                <span className="flex items-center gap-1 text-[9px] font-semibold text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
                    <span className="w-1 h-1 rounded-full bg-green-500"></span>
                    Disponible
                </span>
             )}
           </div>
           
           <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight truncate group-hover:text-orange-600 transition-colors">
                {product.name}
           </h3>
        </div>

        <div className="mt-auto flex items-center justify-between">
             <div className="flex flex-col">
               {product.is_promo && (
                 <span className="text-[9px] text-gray-400 line-through">
                    {(product.price * 1.2).toLocaleString('fr-FR')} FCFA
                 </span>
               )}
               <span className="text-sm font-bold text-gray-900">
                  {product.price.toLocaleString('fr-FR')} <span className="text-[10px] font-normal text-gray-500">FCFA</span>
               </span>
             </div>
        </div>
        
        <button
            onClick={(e) => {
              e.stopPropagation();
              product.is_available && addToCart(product);
            }}
            disabled={!product.is_available}
            className={`w-full flex items-center justify-center gap-1.5 py-1.5 rounded text-[11px] font-bold uppercase tracking-wide transition-all ${
              product.is_available 
                ? 'bg-gray-900 text-white hover:bg-orange-600 shadow-sm hover:shadow' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <FiShoppingCart size={12} />
            <span>Ajouter au panier</span>
          </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
