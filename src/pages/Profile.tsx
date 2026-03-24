import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { motion } from 'motion/react';
import { User as UserIcon, Package, MapPin, Settings, LogOut, ChevronRight, Clock, Shield } from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Profile() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      const path = 'orders';
      try {
        const q = query(
          collection(db, path), 
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        setOrders(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, path);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleLogout = async () => {
    await auth.signOut();
    toast.success('Signed out successfully');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] text-center space-y-8 border border-gray-100 shadow-sm">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#f5f5f7] mx-auto shadow-inner">
                <img 
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=f5f5f7&color=1d1d1f`} 
                  alt={user.displayName || 'User'} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-1 right-1 w-10 h-10 bg-black rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <Shield size={18} className="text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-sans font-bold tracking-tight text-apple-text">{user.displayName || 'Nova Explorer'}</h2>
              <p className="text-apple-gray font-medium">{user.email}</p>
            </div>

            <div className="pt-8 border-t border-gray-100 space-y-3">
              <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-[#f5f5f7] transition-all text-sm font-bold text-apple-text group">
                <div className="flex items-center gap-4">
                  <Settings size={20} className="text-apple-gray group-hover:text-black transition-colors" />
                  Account Settings
                </div>
                <ChevronRight size={16} className="text-apple-gray/40" />
              </button>
              <button onClick={handleLogout} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-red-50 transition-all text-sm font-bold text-red-500 group">
                <div className="flex items-center gap-4">
                  <LogOut size={20} />
                  Sign Out
                </div>
              </button>
            </div>
          </div>

          <div className="bg-[#f5f5f7] p-10 rounded-[3rem] space-y-8">
            <h3 className="font-sans font-bold text-xl text-apple-text">Elite Membership</h3>
            <div className="p-6 rounded-[2rem] bg-white border border-black/5 space-y-6 shadow-sm">
              <p className="text-sm text-apple-gray leading-relaxed font-medium">
                You are a <span className="text-black font-bold">Titanium Tier</span> member. Enjoy exclusive early access to all drops.
              </p>
              <div className="space-y-3">
                <div className="w-full h-2 bg-[#f5f5f7] rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-black"></div>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-apple-gray font-bold">750 / 1000 XP to next tier</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <h1 className="text-5xl md:text-7xl font-sans font-bold tracking-tight text-apple-text">
              Order <span className="text-apple-gray">History.</span>
            </h1>
            <div className="flex items-center gap-2 text-apple-gray text-sm font-bold uppercase tracking-widest">
              <Clock size={16} />
              Last updated: Just now
            </div>
          </div>

          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-[#f5f5f7] rounded-[2.5rem] animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white p-16 rounded-[3rem] text-center space-y-8 border border-gray-100">
              <div className="w-24 h-24 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto text-apple-gray">
                <Package size={48} />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-sans font-bold text-apple-text">No orders yet.</h3>
                <p className="text-apple-gray max-w-sm mx-auto font-medium text-lg">Your future purchases will appear here. Start exploring our catalog.</p>
              </div>
              <button onClick={() => navigate('/')} className="btn-primary px-12">Explore Products</button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 group border border-gray-100 hover:border-black/10 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-8">
                    <div className="w-20 h-20 rounded-2xl bg-[#f5f5f7] flex items-center justify-center text-apple-text border border-black/5">
                      <Package size={32} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-apple-gray uppercase tracking-[0.2em] font-bold">Order #{order.id.slice(-8)}</p>
                      <h4 className="text-2xl font-sans font-bold text-apple-text">{order.items.length} Items • ${order.total.toFixed(2)}</h4>
                      <p className="text-sm text-apple-gray font-medium">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                      <p className="text-[10px] text-apple-gray uppercase tracking-[0.2em] font-bold mb-2">Status</p>
                      <span className={cn(
                        "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                        order.status === 'delivered' ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                      )}>
                        {order.status}
                      </span>
                    </div>
                    <button className="p-5 rounded-2xl bg-[#f5f5f7] hover:bg-black hover:text-white transition-all group-hover:scale-110">
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
