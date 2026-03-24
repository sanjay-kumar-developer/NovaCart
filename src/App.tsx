/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

const INITIAL_PRODUCTS = [
  {
    name: 'NovaPods X',
    description: 'Next-gen spatial audio with adaptive noise cancellation.',
    price: 299.00,
    category: 'Audio',
    images: ['https://picsum.photos/seed/audio1/800/800', 'https://picsum.photos/seed/audio2/800/800'],
    stock: 50,
    rating: 4.9,
    reviewsCount: 128,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    name: 'FluxWatch Pro',
    description: 'Holographic display with advanced health tracking.',
    price: 499.00,
    category: 'Wearables',
    images: ['https://picsum.photos/seed/watch1/800/800', 'https://picsum.photos/seed/watch2/800/800'],
    stock: 30,
    rating: 4.8,
    reviewsCount: 85,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    name: 'AeroCharge Dock',
    description: 'Magnetic levitation charging for all your devices.',
    price: 149.00,
    category: 'Tech',
    images: ['https://picsum.photos/seed/charge1/800/800'],
    stock: 100,
    rating: 4.7,
    reviewsCount: 210,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    name: 'Vision Goggles v2',
    description: 'Augmented reality redefined for everyday use.',
    price: 899.00,
    category: 'Tech',
    images: ['https://picsum.photos/seed/vision1/800/800'],
    stock: 15,
    rating: 4.9,
    reviewsCount: 42,
    featured: true,
    createdAt: new Date().toISOString()
  }
];

function AppContent() {
  const { user, userRole, loading } = useAuth();

  useEffect(() => {
    const seedDatabase = async () => {
      if (userRole !== 'admin') return;
      
      const path = 'products';
      try {
        const productsSnap = await getDocs(collection(db, path));
        if (productsSnap.empty) {
          console.log('Seeding database with initial products...');
          for (const product of INITIAL_PRODUCTS) {
            await addDoc(collection(db, path), product);
          }
        }
      } catch (error) {
        console.error('Seeding error:', error);
      }
    };

    if (!loading && userRole === 'admin') {
      seedDatabase();
    }
  }, [loading, userRole]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-dark-bg">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-brand-violet blur-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} userRole={userRole} />
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/auth" />} />
            <Route 
              path="/admin/*" 
              element={userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} 
            />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-center" theme="dark" />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}


