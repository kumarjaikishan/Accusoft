import React from 'react';
import { Wallet, Coins } from 'lucide-react';
import { motion } from 'framer-motion';

const Preloader = () => {
  return (
    <div className="preloader-overlay">
      <div className="preloader-container">
        <div className="relative">
          {/* Main Wallet Icon */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20 
            }}
            className="wallet-wrapper"
          >
            <motion.div
              animate={{ 
                rotate: [0, -5, 5, 0],
                y: [0, -4, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <Wallet size={80} strokeWidth={1.5} className="text-blue-600 dark:text-blue-400 drop-shadow-xl" />
            </motion.div>
          </motion.div>

          {/* Falling Coins */}
          <div className="coins-spawn-area">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{ y: -60, x: i * 20 - 20, opacity: 0, scale: 0.6 }}
                animate={{ 
                  y: [null, -10, 20],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  delay: i * 0.6,
                  ease: "easeInOut"
                }}
              >
                <Coins size={20} className="text-amber-500 fill-amber-500/20" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Text Section */}
        <div className="mt-8 text-center space-y-2">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300"
          >
            ACCUSOFT
          </motion.h2>
          <motion.div 
            className="flex items-center gap-1 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Loading your finances
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
