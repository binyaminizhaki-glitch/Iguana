import { motion } from 'motion/react';
import React from 'react';

export function IguanaMascot({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[#f28c38] opacity-20 blur-3xl rounded-full w-48 h-48 mx-auto top-1/2 -translate-y-1/2"></div>
      
      {/* Abstract Iguana / Mascot Shape */}
      <div className="relative w-40 h-40 bg-[#3d653e] rounded-[40px] rotate-[15deg] shadow-lg overflow-hidden border-4 border-[#fffcf8]/20 flex items-center justify-center">
        {/* Soft geometric styling to hint at a layered mascot */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#557e55] rounded-full mix-blend-screen opacity-80"></div>
        <div className="absolute bottom-4 left-6 w-16 h-16 bg-[#2d4c2e] rounded-full opacity-50"></div>
        
        {/* 'Eye' element */}
        <motion.div 
          className="absolute top-10 right-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-inner"
          animate={{ scaleY: [1, 0.1, 1] }}
          transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 5, ease: "linear" }}
        >
          <div className="w-3 h-3 bg-slate-900 rounded-full"></div>
        </motion.div>
        
        {/* Little 'spine' detail */}
        <div className="absolute -left-2 top-8 w-4 h-4 bg-[#f28c38] rounded-full"></div>
        <div className="absolute -left-1 top-16 w-3 h-3 bg-[#f28c38] rounded-full opacity-80"></div>
        <div className="absolute left-1 top-24 w-2 h-2 bg-[#f28c38] rounded-full opacity-60"></div>
      </div>
    </motion.div>
  );
}
