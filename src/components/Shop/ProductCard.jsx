import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const price = product.price_per_meter ?? product.price ?? 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.is_available) addToCart({ ...product, price });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="h-full flex min-w-0 w-full"
    >
      <Link
        to={`/product/${product.id}`}
        className="group flex flex-col h-full w-full min-w-0 bg-white rounded-xl sm:rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-orange-100/50 hover:border-orange-100 transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
      >
        {/* Zone image - ratio 1:1 uniforme, responsive */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <motion.img
            src={product.image || "/images/placeholder-product.jpg"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            onLoad={() => setImageLoaded(true)}
            style={{ opacity: imageLoaded ? 1 : 0 }}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse" />
          )}

          {/* Badge promo */}
          {product.is_promo && (
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-md z-10">
              Promo
            </span>
          )}

          {/* Overlay épuisé */}
          {!product.is_available && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center z-10">
              <span className="bg-gray-800 text-white text-xs font-semibold px-4 py-2 rounded-full uppercase tracking-wider">
                Épuisé
              </span>
            </div>
          )}

        </div>

        {/* Contenu - hauteur uniforme, responsive (mobile-first) */}
        <div className="flex flex-col flex-1 p-3 sm:p-4 min-h-[120px] sm:min-h-[140px]">
          <div className="flex justify-between items-start gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-gray-500 font-medium truncate">
              {product.category || 'Collection'}
            </span>
            {product.is_available && (
              <span className="shrink-0 flex items-center gap-1 text-[8px] sm:text-[9px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-500" />
                En stock
              </span>
            )}
          </div>

          <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors mb-1.5 sm:mb-2 flex-1">
            {product.name}
          </h3>

          {/* Prix */}
          <div className="mt-auto space-y-0.5 sm:space-y-1">
            {product.is_promo && (
              <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                {(price * 1.2).toLocaleString('fr-FR')} FCFA
              </span>
            )}
            <p className="text-sm sm:text-base font-bold text-gray-900">
              {Number(price).toLocaleString('fr-FR')}{' '}
              <span className="text-[10px] sm:text-xs font-normal text-gray-500">FCFA</span>
            </p>
          </div>

          {/* Bouton ajouter - zone tactile 44px min sur mobile */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.is_available}
            className={`mt-2 sm:mt-3 w-full flex items-center justify-center gap-1.5 sm:gap-2 min-h-[44px] py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wide transition-all duration-200 ${
              product.is_available
                ? 'bg-gray-900 text-white hover:bg-orange-500 active:scale-[0.98] shadow-sm hover:shadow'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="hidden sm:inline">Ajouter au panier</span>
            <span className="sm:hidden">Ajouter</span>
          </button>
        </div>
      </Link>
    </motion.article>
  );
};

export default ProductCard;
