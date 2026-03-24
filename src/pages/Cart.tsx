import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center space-y-8 bg-white">
        <div className="w-24 h-24 bg-[#f5f5f7] rounded-full flex items-center justify-center text-apple-gray">
          <ShoppingBag size={48} />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-sans font-bold tracking-tight text-apple-text">Your cart is <span className="text-apple-gray">empty.</span></h2>
          <p className="text-apple-gray max-w-md mx-auto text-lg font-medium">
            Looks like you haven't added any gear to your collection yet.
          </p>
        </div>
        <Link to="/products" className="px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 space-y-16">
      <h1 className="text-5xl md:text-7xl font-sans font-bold tracking-tight text-apple-text">
        Shopping <span className="text-apple-gray">Cart.</span>
        <span className="ml-4 text-xl text-apple-gray font-medium">({totalItems} items)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="popLayout">
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-6 rounded-[2rem] flex flex-col sm:flex-row items-center gap-8 group border border-gray-100 hover:border-black/10 transition-all"
              >
                <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-[#f5f5f7] border border-black/5">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" referrerPolicy="no-referrer" />
                </div>

                <div className="flex-grow text-center sm:text-left space-y-1">
                  <h3 className="text-2xl font-sans font-bold text-apple-text group-hover:text-black transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-apple-gray font-bold text-xl">${item.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-6 bg-[#f5f5f7] rounded-full p-2">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all text-apple-text"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-6 text-center text-lg font-bold text-apple-text">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all text-apple-text"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden sm:block h-8 w-px bg-gray-100"></div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-4 text-apple-gray hover:text-red-500 hover:bg-red-50 transition-all rounded-full"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="space-y-8">
          <div className="bg-[#f5f5f7] p-12 rounded-[3rem] sticky top-32 space-y-12">
            <h2 className="text-4xl font-sans font-bold tracking-tight text-apple-text">Order Summary</h2>
            
            <div className="space-y-8 text-lg">
              <div className="flex justify-between text-apple-gray font-medium">
                <span>Subtotal</span>
                <span className="text-apple-text font-bold">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-apple-gray font-medium">
                <span>Shipping</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-apple-gray font-medium">
                <span>Estimated Tax</span>
                <span className="text-apple-text font-bold">${(totalPrice * 0.08).toFixed(2)}</span>
              </div>
              <div className="pt-8 border-t border-black/5 flex justify-between items-end">
                <span className="text-2xl font-sans font-bold text-apple-text">Total</span>
                <span className="text-5xl font-sans font-bold text-black">
                  ${(totalPrice * 1.08).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <Link to="/checkout" className="w-full h-20 bg-black text-white rounded-full font-bold text-xl flex items-center justify-center gap-3 hover:bg-gray-800 transition-all active:scale-95 shadow-2xl shadow-black/20">
                Checkout Now
                <ArrowRight size={24} />
              </Link>
              <div className="flex items-center justify-center gap-3 text-[12px] text-apple-gray uppercase tracking-[0.2em] font-bold">
                <Shield size={14} />
                Secure Checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
