import { useState, useEffect, memo } from "react";
import { Menu, X, ShoppingCart, Search, Phone, MapPin, Heart } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../contexts/CartContext";
import toastService from "../../utils/toastService";

const TopBar = () => (
  <div className="relative z-50 px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-medium tracking-wide bg-amber-950 text-amber-50/90">
    <div className="flex flex-col items-center justify-between gap-1 sm:gap-2 mx-auto max-w-7xl sm:flex-row text-center sm:text-left">
      <div className="flex items-center hidden gap-6 sm:flex">
        <span className="flex items-center gap-2 transition-colors cursor-default hover:text-white">
          <Phone size={14} className="text-amber-500"/> 
          +229 01 50 03 57 19
        </span>
        <span className="flex items-center gap-2 transition-colors cursor-default hover:text-white">
          <MapPin size={14} className="text-amber-500"/> 
          Cotonou, Bénin
        </span>
      </div>
      <div className="w-full text-center sm:w-auto animate-pulse-slow">
        <span className="font-bold text-amber-400">LIVRAISON GRATUITE</span> à partir de 1500 FCFA
      </div>
    </div>
  </div>
);

const Header = memo(({ logoSrc }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { getCartCount, showCartPopup, dismissCartPopup } = useCart();
  const cartCount = getCartCount();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    // Note: We might want to keep popup open until manually dismissed or navigating to cart
    if (location.pathname === '/cart') {
        dismissCartPopup();
    }
  }, [location.pathname, dismissCartPopup]);

  const navLinks = [
    { name: "Accueil", path: "/" },
    { name: "Articles en vente", path: "/shop" },
    { name: "À propos", path: "/about" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const term = e.target.search.value;
    if (term.trim()) {
      navigate(`/shop?search=${encodeURIComponent(term)}`);
      setSearchOpen(false);
    }
  };

  return (
    <div className="relative z-50 flex flex-col w-full">
      <TopBar />
      <header
        className={`sticky top-0 w-full transition-all duration-300 border-b ${
            scrolled 
              ? "bg-white/95 backdrop-blur-xl shadow-sm border-gray-200/50 py-2" 
              : "bg-white border-transparent py-4"
        }`}
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
                
                {/* Logo Section */}
                <Link to="/" className="relative z-10 flex-shrink-0 group">
                    <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3">
                        <img 
                          src={logoSrc} 
                          alt="Reine d'Afrique" 
                          className={`w-auto object-contain transition-all duration-300 ${scrolled ? 'h-10' : 'h-12 md:h-14'}`} 
                        />
                    </motion.div>
                </Link>

                {/* Desktop Navigation - Centered */}
                <nav className="items-center hidden gap-1 lg:flex">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.path} 
                            to={link.path}
                            className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                              location.pathname === link.path 
                                ? 'bg-amber-50 text-amber-900' 
                                : 'text-gray-600 hover:text-amber-900 hover:bg-gray-50'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Actions Area */}
                <div className="flex items-center gap-1 sm:gap-2">
                    {/* Search Trigger */}
                    <button 
                        onClick={() => setSearchOpen(!searchOpen)}
                        className={`p-2.5 rounded-full transition-all duration-200 ${
                          searchOpen ? 'bg-amber-100 text-amber-900' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        aria-label="Rechercher"
                    >
                        <Search size={20} strokeWidth={2} />
                    </button>

                    {/* Benin Flag */}
                    <div className="hidden sm:block p-2.5">
                        <img 
                            src="https://flagcdn.com/w40/bj.png" 
                            alt="Bénin" 
                            className="w-6 h-auto rounded shadow-sm object-cover" 
                        />
                    </div>

                     {/* Cart : si vide → toast uniquement ; si non vide → aller au panier */}
                    <Link 
                      to="/cart" 
                      onClick={(e) => {
                        dismissCartPopup();
                        if (cartCount === 0) {
                          e.preventDefault();
                          toastService.showWarning("Votre panier est vide.", "Panier", 3500);
                        }
                      }}
                      className="p-2.5 text-gray-600 hover:text-amber-900 hover:bg-amber-50 rounded-full transition-all duration-200 relative group"
                    >
                        <ShoppingCart size={20} strokeWidth={2} />
                        <AnimatePresence>
                          {cartCount > 0 && (
                              <motion.span 
                                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                                className="absolute top-1 right-0.5 bg-red-500 text-white text-[10px] font-bold h-4 w-4 md:h-5 md:w-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                              >
                                  {cartCount}
                              </motion.span>
                          )}
                        </AnimatePresence>
                        
                         {/* Pop-up Notification blinking */}
                         <AnimatePresence>
                            {showCartPopup && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="absolute top-12 right-0 w-max z-50"
                                >
                                    <div className="bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-xl relative animate-pulse flex items-center gap-2 cursor-pointer hover:bg-orange-600 transition-colors">
                                        <div className="absolute -top-1 right-3 w-3 h-3 bg-orange-500 transform rotate-45"></div>
                                        <span>Valider ma commande</span>
                                        <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                                    </div>
                                </motion.div>
                            )}
                         </AnimatePresence>
                    </Link>

                     {/* Mobile Menu Toggle */}
                     <button 
                        onClick={() => setMenuOpen(true)}
                        className="p-2 ml-1 text-gray-800 transition-colors rounded-lg lg:hidden hover:bg-gray-100"
                     >
                        <Menu size={26} strokeWidth={2} />
                     </button>
                </div>
            </div>
        </div>
        
        {/* Search Bar - Expandable */}
        <AnimatePresence>
            {searchOpen && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-white border-t border-gray-100 shadow-inner"
                >
                    <div className="max-w-4xl px-4 py-6 mx-auto">
                        <form onSubmit={handleSearch}>
                            <div className="relative group">
                                <Search className="absolute text-gray-400 transition-colors -translate-y-1/2 left-5 top-1/2 group-focus-within:text-amber-500" size={22} />
                                <input 
                                    name="search"
                                    type="text" 
                                    placeholder="Rechercher nos tissus, accessoires..." 
                                    className="w-full py-4 pr-12 text-lg transition-all border border-transparent shadow-sm bg-gray-50 group-hover:bg-white group-hover:border-gray-200 rounded-2xl pl-14 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white"
                                    autoFocus
                                    autoComplete="off"
                                />
                                <button 
                                  type="button" 
                                  onClick={() => setSearchOpen(false)} 
                                  className="absolute p-1 text-gray-400 transition-colors -translate-y-1/2 rounded-full right-4 top-1/2 hover:text-gray-600 hover:bg-gray-100"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="flex justify-center gap-2 mt-3 text-sm text-gray-500">
                              <span>Populaire :</span>
                              <button type="button" onClick={() => navigate('/shop?search=soie')} className="underline hover:text-amber-600 decoration-amber-200">Soie</button>
                              <button type="button" onClick={() => navigate('/shop?search=bazin')} className="underline hover:text-amber-600 decoration-amber-200">Bazin</button>
                              <button type="button" onClick={() => navigate('/shop?search=dentelle')} className="underline hover:text-amber-600 decoration-amber-200">Dentelle</button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </header>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {menuOpen && (
            <>
                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setMenuOpen(false)}
                    className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
                />
                
                {/* Drawer */}
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                    className="fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-white shadow-2xl z-[70] overflow-y-auto flex flex-col rounded-l-2xl"
                    style={{ paddingTop: 'env(safe-area-inset-top)', paddingRight: 'env(safe-area-inset-right)' }}
                >
                    <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 bg-gray-50/50">
                         <img src={logoSrc} alt="Logo" className="object-contain w-auto h-10" />
                         <button 
                           onClick={() => setMenuOpen(false)} 
                           className="p-2 -mr-2 text-gray-500 transition-colors rounded-lg hover:text-red-500 hover:bg-red-50"
                         >
                            <X size={24} />
                         </button>
                    </div>

                    <div className="flex-1 px-4 py-4 overflow-y-auto">
                        <nav className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.path} 
                                    to={link.path}
                                    onClick={() => setMenuOpen(false)}
                                    className={`text-base font-medium px-4 py-3 rounded-xl flex justify-between items-center group transition-all ${
                                      location.pathname === link.path 
                                        ? 'bg-amber-50 text-amber-900' 
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-amber-700'
                                    }`}
                                >
                                    {link.name}
                                    {/* Chevron icon could go here */}
                                </Link>
                            ))}
                        </nav>
                        
                        <div className="px-4 mt-8">
                           <Link
                              to="/cart"
                              onClick={(e) => {
                                if (cartCount === 0) {
                                  e.preventDefault();
                                  toastService.showWarning("Votre panier est vide.", "Panier", 3500);
                                }
                                setMenuOpen(false);
                              }}
                              className="flex flex-col items-center justify-center p-4 transition-colors bg-amber-50 rounded-2xl text-amber-900 hover:bg-amber-100 w-full"
                           >
                              <ShoppingCart size={24} className="mb-2 opacity-80" />
                              <span className="text-xs font-bold">Mon Panier ({cartCount})</span>
                           </Link>
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-100 bg-gradient-to-b from-white to-gray-50">
                        <div className="flex items-center gap-3 p-4 mb-4 bg-white border border-gray-100 shadow-sm rounded-xl">
                            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-amber-100">
                                <Phone size={20} className="text-amber-700" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500">Service Client</p>
                                <a href="tel:+2290150035719" className="text-sm font-bold text-gray-900">+229 01 50 03 57 19</a>
                            </div>
                        </div>
                        
                        <motion.a
                          href="https://wa.me/+2290150035719"
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-orange-200 flex items-center justify-center gap-2 hover:from-orange-600 hover:to-amber-600 transition-all"
                        >
                          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" className="w-5 h-5 filter brightness-0 invert" />
                          Discuter sur WhatsApp
                        </motion.a>
                    </div>
                </motion.div>
            </>
        )}
      </AnimatePresence>
    </div>
  );
});

Header.displayName = 'Header';

export default Header;

