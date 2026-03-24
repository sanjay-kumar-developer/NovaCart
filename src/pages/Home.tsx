import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { motion } from 'motion/react';
import { db } from '../firebase';
import Hero from '../components/Hero';
import ProductCard, { Product } from '../components/ProductCard';
import { ArrowRight, Zap, Shield, Truck, RefreshCcw, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_PRODUCTS: Product[] = [
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
  }
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const q = query(collection(db, 'products'), where('featured', '==', true), limit(4));
        const querySnapshot = await getDocs(q);
        const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        
        if (products.length === 0) {
          setFeaturedProducts(MOCK_PRODUCTS);
        } else {
          setFeaturedProducts(products);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setFeaturedProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="space-y-32 pb-32">
      <Hero />

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {[
          { icon: Zap, title: 'Ultra Fast', desc: 'Global delivery in 48 hours.' },
          { icon: Shield, title: 'Secure', desc: 'Next-gen encryption for payments.' },
          { icon: Truck, title: 'Free Shipping', desc: 'On all orders over $500.' },
          { icon: RefreshCcw, title: 'Easy Returns', desc: '30-day no-questions policy.' }
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center text-black mx-auto">
              <feature.icon size={24} />
            </div>
            <h3 className="text-lg font-sans font-bold">{feature.title}</h3>
            <p className="text-apple-gray text-sm leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-6xl font-sans font-bold tracking-tight">
            Featured <span className="text-apple-gray">Drops.</span>
          </h2>
          <p className="text-apple-gray max-w-xl mx-auto text-lg">
            Handpicked selection of our most advanced technology and lifestyle essentials.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[4/5] bg-black/5 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="flex justify-center pt-8">
          <Link to="/products" className="apple-link flex items-center gap-1 text-lg font-medium">
            View All Products <ChevronRight size={20} />
          </Link>
        </div>
      </section>

      {/* Brand Story / CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <motion.div 
          whileHover={{ rotateX: 2, rotateY: -2, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative overflow-hidden rounded-[3rem] bg-black text-white p-12 md:p-24 text-center space-y-8 perspective-1000 shadow-2xl"
        >
          {/* 3D Floating Elements */}
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotateX: [0, 10, 0],
              rotateY: [0, 20, 0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 right-10 w-32 h-32 bg-white/10 blur-xl rounded-full"
          />
          <motion.div
            animate={{ 
              y: [0, 20, 0],
              rotateX: [0, -15, 0],
              rotateY: [0, -25, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-10 left-10 w-48 h-48 bg-white/5 blur-2xl rounded-full"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotateX: 10 }}
            whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 space-y-8"
          >
            <h2 className="text-4xl md:text-7xl font-sans font-bold tracking-tight max-w-4xl mx-auto leading-[1.1]">
              Ready to Step into the <br />
              <span className="text-apple-gray">Future of Commerce?</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
              Join thousands of early adopters and experience the next generation of shopping. 
              Elite products, seamless experience.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-8">
              <Link to="/auth" className="w-full sm:w-auto px-10 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 transition-all active:scale-95 shadow-xl">
                Get Started Now
              </Link>
              <Link to="/about" className="w-full sm:w-auto px-10 py-4 border border-white/20 rounded-full font-bold text-lg hover:bg-white/10 transition-all active:scale-95">
                Learn More
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
