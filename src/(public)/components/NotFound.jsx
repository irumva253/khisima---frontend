/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowRight, Search } from "lucide-react";
import { useEffect, useState } from "react";
import {motion } from "framer-motion";
import Logo from "@/assets/logo.png";

function NotFound() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Typewriter effect for the error message
    const timer = setTimeout(() => {
      const element = document.querySelector('.error-message');
      if (element) {
        element.classList.add('typing-complete');
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-16 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 rounded-full bg-primary/10"
            initial={{ 
              opacity: 0,
              y: Math.random() * 100 - 50,
              x: Math.random() * 100 - 50
            }}
            animate={{ 
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2
            }}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <img 
          src={Logo} 
          alt="Khisima Logo" 
          className="h-16 w-auto mx-auto mb-2"
        />
      </motion.div>

      <div className="text-center max-w-2xl mx-auto relative z-10">
        {/* Main 404 display */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
          className="mb-8"
        >
          <h1 className="text-9xl font-bold text-primary mb-4 relative">
            4
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="inline-block"
            >
              0
            </motion.span>
            4
          </h1>
        </motion.div>

        {/* Animated search icon */}
        <motion.div
          animate={{ 
            rotate: [0, 5, -5, 0],
            y: [0, -5, 0]
          }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="mb-6"
        >
          <Search className="h-16 w-16 text-primary/70 mx-auto" />
        </motion.div>

        {/* Error message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">Page Not Found</h2>
          <div className="error-message h-16 overflow-hidden">
            <p className="text-lg text-muted-foreground">
              Sorry, we couldn't find the page you're looking for. Perhaps you've mistyped the URL or the page has been moved.
            </p>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
        >
          <Button asChild size="lg" className="gap-2 bg-primary hover:bg-primary/90">
            <Link to="/">
              <Home className="h-5 w-5" />
              Back to Homepage
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link to="/contact">
              Contact Support
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-10 pt-6 border-t border-gray-200"
        >
          <p className="text-sm text-muted-foreground mb-3">Popular Pages</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/services" className="text-sm text-primary hover:underline">Services</Link>
            <Link to="/solutions" className="text-sm text-primary hover:underline">Solutions</Link>
            <Link to="/about-us" className="text-sm text-primary hover:underline">About Us</Link>
            <Link to="/contact" className="text-sm text-primary hover:underline">Contact</Link>
          </div>
        </motion.div>
      </div>

      {/* Floating elements */}
      <motion.div 
        className="absolute bottom-10 left-10 text-7xl opacity-5 text-primary"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        K
      </motion.div>
      <motion.div 
        className="absolute top-10 right-10 text-7xl opacity-5 text-primary"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, delay: 1 }}
      >
        H
      </motion.div>

      <style jsx>{`
        .error-message {
          position: relative;
        }
        
        .error-message::before {
          content: "";
          position: absolute;
          height: 100%;
          width: 100%;
          background-color: white;
          animation: typewriter 1.5s ease-in-out;
        }
        
        .typing-complete::before {
          animation: none;
          width: 0;
        }
        
        @keyframes typewriter {
          from { width: 100% }
          to { width: 0 }
        }
      `}</style>
    </div>
  );
}

export default NotFound;