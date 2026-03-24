import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-black/5 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
              <span className="text-white font-sans font-bold text-xl">N</span>
            </div>
            <span className="text-2xl font-sans font-bold tracking-tighter text-apple-text">
              Nova<span className="text-apple-gray">Cart</span>
            </span>
          </Link>
          <p className="text-apple-gray text-sm leading-relaxed max-w-xs font-medium">
            Future Commerce, Delivered. Experience the next generation of lifestyle and tech marketplace.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="p-2 bg-black/5 rounded-full hover:bg-black hover:text-white transition-all duration-300 text-apple-gray">
              <Twitter size={18} />
            </a>
            <a href="#" className="p-2 bg-black/5 rounded-full hover:bg-black hover:text-white transition-all duration-300 text-apple-gray">
              <Instagram size={18} />
            </a>
            <a href="#" className="p-2 bg-black/5 rounded-full hover:bg-black hover:text-white transition-all duration-300 text-apple-gray">
              <Youtube size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-sans font-bold text-apple-text text-lg mb-6">Shop</h4>
          <ul className="space-y-4 text-sm text-apple-gray font-medium">
            <li><Link to="/products?category=tech" className="hover:text-black transition-colors">Tech & Gadgets</Link></li>
            <li><Link to="/products?category=lifestyle" className="hover:text-black transition-colors">Lifestyle</Link></li>
            <li><Link to="/products?category=audio" className="hover:text-black transition-colors">Audio Experience</Link></li>
            <li><Link to="/products?category=wearables" className="hover:text-black transition-colors">Wearables</Link></li>
            <li><Link to="/products?category=featured" className="hover:text-black transition-colors">Featured Drops</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-sans font-bold text-apple-text text-lg mb-6">Support</h4>
          <ul className="space-y-4 text-sm text-apple-gray font-medium">
            <li><Link to="/help" className="hover:text-black transition-colors">Help Center</Link></li>
            <li><Link to="/shipping" className="hover:text-black transition-colors">Shipping & Returns</Link></li>
            <li><Link to="/track" className="hover:text-black transition-colors">Order Tracking</Link></li>
            <li><Link to="/faq" className="hover:text-black transition-colors">FAQs</Link></li>
            <li><Link to="/contact" className="hover:text-black transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="font-sans font-bold text-apple-text text-lg mb-6">Newsletter</h4>
          <p className="text-apple-gray text-sm font-medium">Join the elite. Get early access to future drops.</p>
          <div className="relative group">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full bg-black/5 border border-black/10 rounded-full py-3 px-6 text-sm focus:outline-none focus:border-black transition-colors"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black text-white rounded-full hover:scale-110 transition-transform">
              <Mail size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-10 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] text-apple-gray font-bold uppercase tracking-widest">
        <p>© 2026 NovaCart. All rights reserved.</p>
        <div className="flex gap-8">
          <Link to="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-black transition-colors">Terms of Service</Link>
          <Link to="/cookies" className="hover:text-black transition-colors">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
}
