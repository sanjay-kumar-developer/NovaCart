import { motion } from 'motion/react';
import { ShoppingCart, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  rating: number;
  reviewsCount: number;
  featured?: boolean;
}

interface ProductCardProps {
  product: Product;
  key?: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const IMAGE_MAPPING: Record<string, string> = {
    'NovaPods X': '/src/assets/NovaPods-X.png',
    'FluxWatch Pro': '/src/assets/FluxWatch-Pro.png',
    'AeroCharge Dock': '/src/assets/AeroCharge-Dock.png',
    'Vision Goggles v2': '/src/assets/Vision-Goggles-v2.png',
    'NovaCase Ultra': '/src/assets/NovaCase-Ultra.png',
    'FluxPad Max': '/src/assets/FluxPad-Max.png'
  };

  const getImageUrl = () => {
    if (product.images?.[0] && !product.images[0].includes('picsum.photos')) {
      return product.images[0];
    }
    return IMAGE_MAPPING[product.name] || `https://picsum.photos/seed/${product.id}/800/1000`;
  };

  const imageUrl = getImageUrl();

  return (
    <motion.div
      whileHover={{ 
        y: -10,
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        rotateX: -2,
        rotateY: 2
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative bg-white rounded-3xl overflow-hidden transition-all duration-500 perspective-1000"
    >
      <Link to={`/product/${product.id}`} className="block aspect-[4/5] overflow-hidden bg-[#f5f5f7] relative">
        <img 
          src={imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${product.id}/800/1000`;
          }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
      </Link>

      <div className="p-6 flex flex-col h-[180px]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-apple-gray">
            {product.category}
          </span>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star size={12} fill="currentColor" />
            <span className="text-xs font-bold text-apple-text">{product.rating}</span>
          </div>
        </div>

        <div className="flex-grow">
          <h3 className="text-lg font-sans font-bold text-apple-text group-hover:text-black transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-apple-gray line-clamp-2 font-medium mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-black/5 mt-auto">
          <p className="text-xl font-sans font-bold text-apple-text">
            ${product.price.toFixed(2)}
          </p>
          <button 
            onClick={(e) => {
              e.preventDefault();
              addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: imageUrl
              });
            }}
            className="p-3 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-300 active:scale-90 shadow-lg hover:shadow-xl"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
