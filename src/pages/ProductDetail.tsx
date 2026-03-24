import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Star, ArrowLeft, Shield, Truck, Zap, Minus, Plus, Heart, Share2, Sparkles, Loader2 } from 'lucide-react';
import { db } from '../firebase';
import { Product } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { generateProductImage } from '../services/aiImageService';
import { cn } from '../lib/utils';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const { addToCart } = useCart();
  const { userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          // Fallback to mock data if not found in DB
          const mock = [
            {
              id: '1',
              name: 'NovaPods X',
              description: 'Next-gen spatial audio with adaptive noise cancellation. Experience sound like never before with our proprietary Flux-Audio technology.',
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
              description: 'Holographic display with advanced health tracking. The ultimate companion for your futuristic lifestyle.',
              price: 499.00,
              category: 'Wearables',
              images: ['/src/assets/FluxWatch-Pro.png'],
              stock: 30,
              rating: 4.8,
              reviewsCount: 85,
              featured: true
            }
          ].find(p => p.id === id);
          
          if (mock) {
            setProduct(mock as Product);
          } else {
            toast.error('Product not found');
            navigate('/');
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  const handleGenerateAIImage = async () => {
    if (!product || !id) return;
    
    setIsGenerating(true);
    try {
      const imageUrl = await generateProductImage(product.name, product.description);
      const updatedImages = [...product.images, imageUrl];
      
      await updateDoc(doc(db, 'products', id), {
        images: updatedImages,
        updatedAt: new Date().toISOString()
      });
      
      setProduct({ ...product, images: updatedImages });
      setActiveImage(updatedImages.length - 1);
      toast.success('AI Image generated and added to gallery!');
    } catch (error) {
      toast.error('Failed to generate AI image');
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-gray-100 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 space-y-24">
      <Link to="/products" className="inline-flex items-center gap-2 text-apple-gray hover:text-black transition-colors group font-medium">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Gallery
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Image Gallery */}
        <div className="space-y-8">
          <motion.div 
            layoutId={`product-image-${product.id}`}
            className="aspect-square rounded-[2.5rem] overflow-hidden bg-[#f5f5f7]"
          >
            <img 
              src={product.images[activeImage]} 
              alt={product.name} 
              className="w-full h-full object-cover mix-blend-multiply"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          <div className="grid grid-cols-4 gap-6">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={cn(
                  "aspect-square rounded-2xl overflow-hidden border-2 transition-all bg-[#f5f5f7]",
                  activeImage === i ? "neon-glow-blue border-brand-blue" : "border-transparent opacity-50 hover:opacity-100"
                )}
              >
                <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover mix-blend-multiply" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="px-4 py-1.5 rounded-full bg-black/5 text-apple-gray text-xs font-bold uppercase tracking-widest">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star size={16} fill="currentColor" />
                <span className="font-bold text-apple-text">{product.rating}</span>
                <span className="text-apple-gray text-sm font-medium">({product.reviewsCount} reviews)</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-sans font-bold tracking-tight text-apple-text leading-tight">
              {product.name}
            </h1>

            {userRole === 'admin' && (
              <button
                onClick={handleGenerateAIImage}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue/10 text-brand-blue rounded-full font-bold text-sm hover:bg-brand-blue/20 transition-all disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Generating AI Image...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Generate New AI Image
                  </>
                )}
              </button>
            )}
            
            <p className="text-4xl font-sans font-bold text-apple-text">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <p className="text-xl text-apple-gray leading-relaxed font-medium">
            {product.description}
          </p>

          <div className="space-y-8 pt-10 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center gap-10">
              <div className="space-y-3">
                <p className="text-xs text-apple-gray uppercase tracking-widest font-bold">Quantity</p>
                <div className="flex items-center gap-6 bg-[#f5f5f7] rounded-full p-1.5">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div className="flex-grow flex gap-4 pt-6 sm:pt-0">
                <button 
                  onClick={() => addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity,
                    image: product.images[0]
                  })}
                  className="flex-grow h-16 bg-black text-white rounded-full font-bold text-lg hover:bg-gray-800 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                <button className="w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors text-apple-gray hover:text-red-500">
                  <Heart size={24} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
              {[
                { icon: Zap, title: 'Instant Ship', desc: 'Ships in 24h' },
                { icon: Shield, title: 'Warranty', desc: '2 Year Elite' },
                { icon: Truck, title: 'Free Delivery', desc: 'Global coverage' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-apple-gray">
                  <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] flex items-center justify-center text-black">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-apple-text">{item.title}</p>
                    <p className="text-xs uppercase tracking-widest font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Specifications / Details */}
      <section className="pt-24 border-t border-gray-100">
        <h2 className="text-4xl font-sans font-bold mb-16 tracking-tight text-apple-text">Technical <span className="text-apple-gray">Specifications.</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { label: 'Connectivity', value: 'Quantum-Link 5.0' },
            { label: 'Battery Life', value: '72 Hours Active' },
            { label: 'Material', value: 'Aerospace Titanium' },
            { label: 'Weight', value: '180g Ultra-Light' },
            { label: 'Processing', value: 'NovaCore AI Chip' },
            { label: 'Waterproof', value: 'IPX8 Certified' }
          ].map((spec, i) => (
            <div key={i} className="bg-[#f5f5f7] p-8 rounded-3xl flex justify-between items-center">
              <span className="text-apple-gray text-sm font-bold uppercase tracking-widest">{spec.label}</span>
              <span className="font-bold text-apple-text text-lg">{spec.value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
