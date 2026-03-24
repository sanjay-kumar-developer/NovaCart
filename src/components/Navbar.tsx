import { Link, useNavigate } from 'react-router-dom';
import { User } from 'firebase/auth';
import { ShoppingCart, User as UserIcon, LogOut, Menu, X, Shield, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../firebase';
import { cn } from '../lib/utils';

interface NavbarProps {
  user: User | null;
  userRole: 'admin' | 'customer' | null;
}

export default function Navbar({ user, userRole }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-3',
        isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-black/5' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-12">
        <Link to="/" className="flex items-center gap-2 group z-50">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center transition-transform duration-300">
            <span className="text-white font-sans font-bold text-lg">N</span>
          </div>
          <span className="text-xl font-sans font-semibold tracking-tight hidden sm:block">
            NovaCart
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          <Link to="/" className="text-xs font-medium text-apple-text/80 hover:text-black transition-colors">Home</Link>
          <Link to="/products" className="text-xs font-medium text-apple-text/80 hover:text-black transition-colors">Shop</Link>
          <Link to="/about" className="text-xs font-medium text-apple-text/80 hover:text-black transition-colors">About</Link>
        </div>

          <div className="flex items-center gap-4 z-50">
            <div className="relative flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.form
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 240, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    onSubmit={handleSearch}
                    className="relative flex items-center"
                  >
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search gear..."
                      className="w-full bg-[#f5f5f7] border-none rounded-full py-2.5 px-6 pr-10 text-sm focus:ring-2 focus:ring-black outline-none transition-all font-medium"
                      autoFocus
                    />
                    <button type="submit" className="absolute right-3 text-apple-gray hover:text-black transition-colors">
                      <Search size={18} />
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-apple-gray hover:text-black transition-all hover:scale-110"
              >
                <Search size={22} />
              </button>
            </div>

          <Link to="/cart" className="relative p-2 text-apple-text/80 hover:text-black transition-colors">
            <ShoppingCart size={18} />
            <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-black text-white text-[8px] flex items-center justify-center rounded-full font-bold">0</span>
          </Link>

          {user ? (
            <div className="hidden md:flex items-center gap-2">
              {userRole === 'admin' && (
                <Link to="/admin" className="p-2 text-apple-text/80 hover:text-brand-blue transition-colors">
                  <Shield size={18} />
                </Link>
              )}
              <Link to="/profile" className="p-2 text-apple-text/80 hover:text-black transition-colors">
                <UserIcon size={18} />
              </Link>
              <button onClick={handleLogout} className="p-2 text-apple-text/80 hover:text-red-500 transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="hidden md:block text-xs font-medium text-white bg-black px-4 py-2 rounded-full hover:bg-gray-800 transition-colors">
              Sign In
            </Link>
          )}

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-apple-text"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-black/5 p-6 flex flex-col gap-6 md:hidden overflow-hidden"
          >
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium">Home</Link>
            <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium">Shop</Link>
            <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium flex items-center justify-between">
              Cart <span className="bg-black text-white px-2 py-0.5 rounded-full text-[10px]">0</span>
            </Link>
            {user ? (
              <>
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium">Profile</Link>
                {userRole === 'admin' && <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium">Admin</Link>}
                <button onClick={handleLogout} className="text-sm font-medium text-red-500 text-left">Logout</button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="bg-black text-white text-center py-3 rounded-2xl text-sm font-medium">Sign In</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
