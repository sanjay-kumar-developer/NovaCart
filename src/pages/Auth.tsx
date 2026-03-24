import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Github, Chrome } from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { toast } from 'sonner';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Welcome back to NovaCart');
      } else {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        const userPath = `users/${user.uid}`;
        try {
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: name,
            role: 'customer',
            createdAt: new Date().toISOString()
          });
          toast.success('Account created successfully');
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, userPath);
        }
      }
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const { user } = await signInWithPopup(auth, provider);
      const userPath = `users/${user.uid}`;
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: 'customer',
            createdAt: new Date().toISOString()
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, userPath);
      }
      toast.success('Signed in with Google');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-blue/10 blur-[150px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 md:p-12 rounded-[3rem] max-w-md w-full space-y-8 relative overflow-hidden"
      >
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-display font-bold tracking-tighter">
            {isLogin ? 'Welcome ' : 'Join '}
            <span className="text-brand-blue">NovaCart</span>
          </h2>
          <p className="text-white/50 text-sm">
            {isLogin ? 'Enter your credentials to access the future.' : 'Create an account to start your journey.'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="relative"
              >
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/5 border border-black/10 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-brand-blue focus:neon-glow-blue transition-all duration-300"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input
              type="email"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/5 border border-black/10 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-brand-blue focus:neon-glow-blue transition-all duration-300"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/5 border border-black/10 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-brand-blue focus:neon-glow-blue transition-all duration-300"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-4"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest">
            <span className="bg-dark-surface px-4 text-white/30">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-2xl py-3 hover:bg-white/10 transition-colors"
          >
            <Chrome size={18} />
            <span className="text-sm font-medium">Google</span>
          </button>
          <button className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-2xl py-3 hover:bg-white/10 transition-colors">
            <Github size={18} />
            <span className="text-sm font-medium">GitHub</span>
          </button>
        </div>

        <p className="text-center text-sm text-white/50">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-brand-blue font-bold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
