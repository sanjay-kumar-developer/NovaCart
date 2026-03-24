import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, SlidersHorizontal, Zap, Star, ChevronDown, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../firebase';
import ProductCard, { Product } from '../components/ProductCard';
import { cn } from '../lib/utils';

const CATEGORIES = ['All', 'Tech', 'Audio', 'Wearables', 'Lifestyle'];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const querySearch = searchParams.get('search');
    if (querySearch !== null) {
      setSearchTerm(querySearch);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        
        if (fetchedProducts.length === 0) {
          // Fallback to mock data
          setProducts([
            {
              id: '1',
              name: 'NovaPods X',
              description: 'Next-gen spatial audio with adaptive noise cancellation.',
              price: 299.00,
              category: 'Audio',
              images: ['/src/assets/NovaPods-X.png'],
              stock: 50,
              rating: 4.9,
              reviewsCount: 128,
              featured: true
            },
            {
              id: '2',
              name: 'FluxWatch Pro',
              description: 'Holographic display with advanced health tracking.',
              price: 499.00,
              category: 'Wearables',
              images: ['/src/assets/FluxWatch-Pro.png'],
              stock: 30,
              rating: 4.8,
              reviewsCount: 85,
              featured: true
            },
            {
              id: '3',
              name: 'AeroCharge Dock',
              description: 'Magnetic levitation charging for all your devices.',
              price: 149.00,
              category: 'Tech',
              images: ['/src/assets/AeroCharge-Dock.png'],
              stock: 100,
              rating: 4.7,
              reviewsCount: 210,
              featured: true
            },
            {
              id: '4',
              name: 'Vision Goggles v2',
              description: 'Augmented reality redefined for everyday use.',
              price: 899.00,
              category: 'Tech',
              images: ['/src/assets/Vision-Goggles-v2.png'],
              stock: 15,
              rating: 4.9,
              reviewsCount: 42,
              featured: true
            },
            {
              id: '5',
              name: 'NovaCase Ultra',
              description: 'Self-healing liquid metal protection for your devices.',
              price: 79.00,
              category: 'Lifestyle',
              images: ['/src/assets/NovaCase-Ultra.png'],
              stock: 200,
              rating: 4.6,
              reviewsCount: 312
            },
            {
              id: '6',
              name: 'FluxPad Max',
              description: 'Interactive OLED surface for creative professionals.',
              price: 349.00,
              category: 'Tech',
              images: ['/src/assets/FluxPad-Max.png'],
              stock: 45,
              rating: 4.8,
              reviewsCount: 67
            }
          ]);
        } else {
          setProducts(fetchedProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products
    .filter(p => activeCategory === 'All' || p.category === activeCategory)
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // newest is default from firebase
    });

  const clearFilters = () => {
    setSearchTerm('');
    setActiveCategory('All');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 space-y-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-sans font-bold tracking-tight text-apple-text">
            The <span className="text-apple-gray">Catalog.</span>
          </h1>
          <p className="text-apple-gray max-w-md text-lg font-medium">Browse our curated collection of future-ready technology and lifestyle essentials.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#f5f5f7] border-none rounded-full py-3 pl-12 pr-6 text-sm focus:ring-2 focus:ring-brand-blue focus:neon-glow-blue outline-none w-full md:w-64 transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-apple-gray hover:text-black"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="relative group">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#f5f5f7] border-none rounded-full py-3 pl-6 pr-12 text-sm focus:ring-2 focus:ring-black outline-none appearance-none cursor-pointer font-medium"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-apple-gray pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-8 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
              activeCategory === cat 
                ? "bg-black text-white shadow-lg neon-glow-blue" 
                : "bg-[#f5f5f7] text-apple-gray hover:bg-gray-200"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="aspect-[4/5] bg-[#f5f5f7] rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-32 text-center space-y-6">
          <div className="w-20 h-20 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto text-apple-gray">
            <Search size={40} />
          </div>
          <h3 className="text-2xl font-sans font-bold text-apple-text">No products found</h3>
          <p className="text-apple-gray font-medium">Try adjusting your search or filters.</p>
          <button onClick={clearFilters} className="px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors">Clear All Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
