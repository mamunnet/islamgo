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

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="bg-gradient-to-br from-purple-800 to-purple-600 w-[300px] h-[300px] rounded-lg shadow-lg text-white p-6 relative flex flex-col items-center justify-center text-center font-bengali"
          >
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-white text-2xl hover:opacity-80 transition-opacity"
            >
              ×
            </button>
            <h3 className="text-xl font-semibold mb-4">
              এই অ্যাপটি তৈরি করেছেন মামুন 
            </h3>
            <p className="text-lg opacity-90">
              আরও অনেক নতুন ফিচার আসছে খুব শীঘ্রই...
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PopupBanner;
