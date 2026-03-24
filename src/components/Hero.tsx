import { motion } from 'motion/react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-6 pt-20 bg-[#f5f5f7]">
      <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-4"
        >
          <h1 className="text-5xl md:text-7xl font-sans font-bold leading-tight tracking-tight text-apple-text">
            NovaCart. <br />
            <span className="text-apple-gray">The future of shopping.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-apple-gray max-w-2xl mx-auto font-medium">
            Experience the next generation of lifestyle and tech marketplace. 
            Curated for those who live ahead of time.
          </p>

          <div className="flex flex-wrap justify-center gap-8 pt-6">
            <Link to="/products" className="apple-link flex items-center gap-1 text-xl font-medium">
              Shop Now <ChevronRight size={20} />
            </Link>
            <Link to="/about" className="apple-link flex items-center gap-1 text-xl font-medium">
              Learn More <ChevronRight size={20} />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ rotateX: 5, rotateY: -5, scale: 1.02 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          className="pt-16 w-full max-w-5xl mx-auto perspective-1000"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src="https://picsum.photos/seed/apple-style/1600/900" 
              alt="Featured Product" 
              className="w-full h-auto object-cover transform transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
