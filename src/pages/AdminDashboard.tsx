import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Trash2, Edit2, Package, Users, ShoppingCart, 
  TrendingUp, Search, Filter, X, Save, Image as ImageIcon,
  Zap, Shield, Clock, Sparkles, Loader2, ChevronDown
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Product } from '../components/ProductCard';
import { toast } from 'sonner';
import { generateProductImage } from '../services/aiImageService';
import { cn } from '../lib/utils';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Tech',
    images: [''],
    stock: 0,
    featured: false,
    rating: 5.0,
    reviewsCount: 0
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const path = 'products';
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAIImage = async () => {
    if (!formData.name || !formData.description) {
      toast.error('Please provide a name and description first');
      return;
    }

    setIsGenerating(true);
    try {
      const imageUrl = await generateProductImage(formData.name, formData.description);
      setFormData({ ...formData, images: [imageUrl] });
      toast.success('AI Image generated successfully!');
    } catch (error) {
      toast.error('Failed to generate AI image');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const path = editingProduct ? `products/${editingProduct.id}` : 'products';
    try {
      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), {
          ...formData,
          updatedAt: new Date().toISOString()
        });
        toast.success('Product updated successfully');
      } else {
        await addDoc(collection(db, 'products'), {
          ...formData,
          createdAt: new Date().toISOString()
        });
        toast.success('Product added successfully');
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error: any) {
      handleFirestoreError(error, editingProduct ? OperationType.UPDATE : OperationType.CREATE, path);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    const path = `products/${id}`;
    try {
      await deleteDoc(doc(db, 'products', id));
      toast.success('Product deleted');
      fetchProducts();
    } catch (error: any) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      images: product.images,
      stock: product.stock,
      featured: product.featured || false,
      rating: product.rating,
      reviewsCount: product.reviewsCount
    });
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-sans font-bold tracking-tight text-apple-text">
            Admin <span className="text-brand-blue">Control.</span>
          </h1>
          <p className="text-apple-gray max-w-md font-medium">Manage your futuristic inventory and monitor performance.</p>
        </div>
        <button 
          onClick={() => {
            setEditingProduct(null);
            setFormData({
              name: '', description: '', price: 0, category: 'Tech',
              images: [''], stock: 0, featured: false, rating: 5.0, reviewsCount: 0
            });
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2 shadow-xl hover:shadow-brand-blue/20"
        >
          <Plus size={20} />
          Add New Product
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Package, label: 'Total Products', value: products.length, color: 'text-brand-blue', bg: 'bg-brand-blue/10' },
          { icon: ShoppingCart, label: 'Total Orders', value: '1,248', color: 'text-brand-violet', bg: 'bg-brand-violet/10' },
          { icon: Users, label: 'Active Users', value: '52.4k', color: 'text-green-600', bg: 'bg-green-50/50' },
          { icon: TrendingUp, label: 'Revenue', value: '$248k', color: 'text-yellow-600', bg: 'bg-yellow-50/50' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-black/5 space-y-4 shadow-sm hover:shadow-md transition-all">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] text-apple-gray uppercase tracking-widest font-bold">{stat.label}</p>
              <p className="text-3xl font-sans font-bold text-apple-text">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-[3rem] overflow-hidden border border-black/5 shadow-sm">
        <div className="p-8 border-b border-black/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h2 className="text-2xl font-sans font-bold text-apple-text">Inventory Management</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#f5f5f7] border-none rounded-full py-3 pl-12 pr-6 text-sm focus:ring-2 focus:ring-brand-blue outline-none w-full md:w-64 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#f5f5f7] text-[10px] uppercase tracking-widest text-apple-gray">
                <th className="px-8 py-6 font-bold">Product</th>
                <th className="px-8 py-6 font-bold">Category</th>
                <th className="px-8 py-6 font-bold">Price</th>
                <th className="px-8 py-6 font-bold">Stock</th>
                <th className="px-8 py-6 font-bold">Status</th>
                <th className="px-8 py-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {loading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-8 py-10">
                      <div className="h-12 bg-black/5 rounded-2xl w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-[#f5f5f7]/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden border border-black/5 bg-[#f5f5f7] shrink-0">
                        <img 
                          src={product.images?.[0] || `https://picsum.photos/seed/${product.id}/200/200`} 
                          alt="" 
                          className="w-full h-full object-cover mix-blend-multiply" 
                          referrerPolicy="no-referrer" 
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-apple-text group-hover:text-brand-blue transition-colors truncate">{product.name}</p>
                        <p className="text-[10px] text-apple-gray font-mono">ID: {product.id.slice(-8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 rounded-full bg-black/5 text-[10px] font-bold uppercase tracking-widest text-apple-gray">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-bold text-apple-text">${product.price.toFixed(2)}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        product.stock > 10 ? "bg-green-500" : "bg-red-500"
                      )}></div>
                      <span className="font-medium text-sm text-apple-text">{product.stock} units</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {product.featured ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-50 text-[10px] font-bold text-yellow-600 uppercase tracking-tight">
                        <Zap size={10} fill="currentColor" /> Featured
                      </span>
                    ) : (
                      <span className="text-[10px] text-apple-gray font-bold uppercase tracking-tight">Standard</span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(product)}
                        className="p-3 bg-[#f5f5f7] hover:bg-brand-blue hover:text-white rounded-2xl transition-all shadow-sm"
                        title="Edit Product"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-3 bg-[#f5f5f7] hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-sm"
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white p-8 md:p-12 rounded-[3rem] max-w-4xl w-full max-h-[90vh] overflow-y-auto space-y-8 shadow-2xl border border-black/5"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-sans font-bold tracking-tight text-apple-text">
                  {editingProduct ? 'Edit' : 'Add'} <span className="text-brand-blue">Product.</span>
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[#f5f5f7] rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-apple-gray uppercase tracking-widest font-bold">Product Name</label>
                    <input 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#f5f5f7] border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all" 
                      placeholder="NovaPods X" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-apple-gray uppercase tracking-widest font-bold">Description</label>
                    <textarea 
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-[#f5f5f7] border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-brand-blue outline-none resize-none transition-all" 
                      placeholder="Next-gen spatial audio..." 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] text-apple-gray uppercase tracking-widest font-bold">Price ($)</label>
                      <input 
                        type="number"
                        required
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        className="w-full bg-[#f5f5f7] border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-apple-gray uppercase tracking-widest font-bold">Stock</label>
                      <input 
                        type="number"
                        required
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                        className="w-full bg-[#f5f5f7] border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-apple-gray uppercase tracking-widest font-bold">Category</label>
                    <div className="relative">
                      <select 
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-[#f5f5f7] border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-brand-blue outline-none appearance-none cursor-pointer font-medium"
                      >
                        <option value="Tech">Tech</option>
                        <option value="Audio">Audio</option>
                        <option value="Wearables">Wearables</option>
                        <option value="Lifestyle">Lifestyle</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-apple-gray pointer-events-none" size={16} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] text-apple-gray uppercase tracking-widest font-bold">Image URL</label>
                      <button
                        type="button"
                        onClick={handleGenerateAIImage}
                        disabled={isGenerating}
                        className="text-[10px] font-bold uppercase tracking-widest text-brand-blue hover:text-brand-violet transition-colors flex items-center gap-1 disabled:opacity-50"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 size={12} className="animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles size={12} />
                            Generate with AI
                          </>
                        )}
                      </button>
                    </div>
                    <div className="flex gap-4 items-start">
                      <input 
                        required
                        value={formData.images[0]}
                        onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                        className="flex-grow bg-[#f5f5f7] border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all" 
                        placeholder="https://..." 
                      />
                      <div className="w-14 h-14 rounded-2xl bg-[#f5f5f7] border border-black/5 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                        {formData.images[0] ? (
                          <img src={formData.images[0]} className="w-full h-full object-cover mix-blend-multiply" referrerPolicy="no-referrer" />
                        ) : (
                          <ImageIcon size={20} className="text-apple-gray" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-5 rounded-2xl bg-[#f5f5f7] border border-black/5">
                    <input 
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-5 h-5 accent-black rounded-md cursor-pointer"
                    />
                    <label htmlFor="featured" className="text-sm font-bold cursor-pointer flex items-center gap-2 text-apple-text">
                      <Zap size={16} className="text-yellow-500" />
                      Featured Product
                    </label>
                  </div>

                  <div className="pt-4">
                    <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 py-4 shadow-xl hover:shadow-black/20">
                      <Save size={20} />
                      {editingProduct ? 'Update Product' : 'Create Product'}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
