import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PopupBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the banner has been shown before
    const hasSeenBanner = localStorage.getItem('hasSeenBanner');
    
    if (!hasSeenBanner) {
      setIsVisible(true);
      // Set the flag in localStorage
      localStorage.setItem('hasSeenBanner', 'true');
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-800 to-purple-600 p-6 rounded-lg shadow-lg text-white max-w-[90%] w-[600px] z-50 text-center font-bengali"
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-white text-2xl hover:opacity-80 transition-opacity"
        >
          ×
        </button>
        <h3 className="text-xl font-semibold mb-2">
          এই অ্যাপটি তৈরি করেছেন মামুন 
        </h3>
        <p className="text-lg opacity-90">
          আরও অনেক নতুন ফিচার আসছে খুব শীঘ্রই...
        </p>
      </motion.div>
    </AnimatePresence>
  );
};

export default PopupBanner;
