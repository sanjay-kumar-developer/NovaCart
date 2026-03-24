import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Truck, Shield, CheckCircle2, ArrowRight, ArrowLeft, Zap } from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please sign in to complete your order');
      navigate('/auth');
      return;
    }

    setLoading(true);
    const path = 'orders';
    try {
      const orderData = {
        userId: user.uid,
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: totalPrice * 1.08, // Including tax
        status: 'pending',
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          zip: formData.zip
        },
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, path), orderData);
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00d2ff', '#9d50bb', '#ffffff']
      });

      setStep(3);
      clearCart();
      toast.success('Order placed successfully!');
    } catch (error: any) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
        <h2 className="text-3xl font-display font-bold">Your cart is empty</h2>
        <Link to="/" className="btn-primary">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-16 relative">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-black/5 -z-10"></div>
        {[1, 2, 3].map((s) => (
          <div 
            key={s}
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-500 z-10 ${
              step >= s ? "bg-black text-white shadow-xl scale-110" : "bg-white border border-black/10 text-apple-gray"
            }`}
          >
            {step > s ? <CheckCircle2 size={24} /> : s}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16"
          >
            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="text-4xl font-sans font-bold tracking-tight text-apple-text flex items-center gap-4">
                  <Truck className="text-brand-blue" size={32} />
                  Shipping <span className="text-apple-gray">Details.</span>
                </h2>
                <p className="text-apple-gray font-medium">Where should we send your futuristic gear?</p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-apple-gray uppercase tracking-widest font-bold">First Name</label>
                  <input name="firstName" onChange={handleInputChange} value={formData.firstName} className="w-full bg-[#f5f5f7] border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-apple-gray uppercase tracking-widest font-bold">Last Name</label>
                  <input name="lastName" onChange={handleInputChange} value={formData.lastName} className="w-full bg-[#f5f5f7] border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all" placeholder="Doe" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-apple-gray uppercase tracking-widest font-bold">Address</label>
                <input name="address" onChange={handleInputChange} value={formData.address} className="w-full bg-[#f5f5f7] border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all" placeholder="123 Future St" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-apple-gray uppercase tracking-widest font-bold">City</label>
                  <input name="city" onChange={handleInputChange} value={formData.city} className="w-full bg-[#f5f5f7] border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all" placeholder="Neo Tokyo" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-apple-gray uppercase tracking-widest font-bold">ZIP Code</label>
                  <input name="zip" onChange={handleInputChange} value={formData.zip} className="w-full bg-[#f5f5f7] border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all" placeholder="100-0001" />
                </div>
              </div>

              <button onClick={() => setStep(2)} className="btn-primary w-full h-16 flex items-center justify-center gap-2 text-lg shadow-xl hover:shadow-black/20">
                Continue to Payment
                <ArrowRight size={20} />
              </button>
            </div>

            <div className="bg-[#f5f5f7] p-10 rounded-[3rem] h-fit space-y-8 sticky top-32">
              <h3 className="font-sans font-bold text-2xl text-apple-text">Order Summary</h3>
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white overflow-hidden border border-black/5">
                        <img src={item.image} alt="" className="w-full h-full object-cover mix-blend-multiply" />
                      </div>
                      <span className="text-apple-text font-medium">{item.name} <span className="text-apple-gray ml-1">x{item.quantity}</span></span>
                    </div>
                    <span className="font-bold text-apple-text">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-8 border-t border-black/5 flex justify-between items-end">
                <span className="text-apple-gray font-medium">Total (incl. tax)</span>
                <span className="text-4xl font-sans font-bold text-black">${(totalPrice * 1.08).toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-md mx-auto space-y-10"
          >
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-brand-blue/10 rounded-full flex items-center justify-center text-brand-blue mx-auto">
                <CreditCard size={48} />
              </div>
              <h2 className="text-4xl md:text-5xl font-sans font-bold tracking-tight text-apple-text">
                Payment <span className="text-apple-gray">Method.</span>
              </h2>
              <p className="text-apple-gray font-medium">Secure quantum-encrypted transaction.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] text-apple-gray uppercase tracking-widest font-bold">Card Number</label>
                <input name="cardNumber" onChange={handleInputChange} value={formData.cardNumber} className="w-full bg-[#f5f5f7] border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all" placeholder="**** **** **** ****" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-apple-gray uppercase tracking-widest font-bold">Expiry</label>
                  <input name="expiry" onChange={handleInputChange} value={formData.expiry} className="w-full bg-[#f5f5f7] border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all" placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-apple-gray uppercase tracking-widest font-bold">CVV</label>
                  <input name="cvv" onChange={handleInputChange} value={formData.cvv} className="w-full bg-[#f5f5f7] border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all" placeholder="***" />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1 h-16 flex items-center justify-center gap-2">
                <ArrowLeft size={20} />
                Back
              </button>
              <button 
                onClick={handlePlaceOrder} 
                disabled={loading}
                className="btn-primary flex-[2] h-16 flex items-center justify-center gap-2 shadow-xl hover:shadow-black/20"
              >
                {loading ? 'Processing...' : 'Place Order'}
                {!loading && <Zap size={20} />}
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 text-apple-gray">
              <Shield size={16} />
              <span className="text-[10px] uppercase tracking-widest font-bold">256-bit SSL Secure</span>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-10 py-12"
          >
            <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto">
              <CheckCircle2 size={64} />
            </div>
            <div className="space-y-4">
              <h2 className="text-6xl md:text-8xl font-sans font-bold tracking-tight text-apple-text">Order <span className="text-apple-gray">Confirmed.</span></h2>
              <p className="text-apple-gray text-xl max-w-md mx-auto font-medium">
                Your futuristic gear is being prepared for hyper-speed delivery. 
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button onClick={() => navigate('/profile')} className="btn-primary px-12">View Orders</button>
              <button onClick={() => navigate('/')} className="btn-secondary px-12">Back to Shop</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
