"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const TextFlip = ({ prefix, words, suffix }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [words]);

  return (
    <motion.div 
      layout 
      style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '12px' 
      }}
    >
      {prefix && (
        <motion.span layout transition={{ type: "spring", stiffness: 300, damping: 30 }}>
          {prefix}
        </motion.span>
      )}
      
      <motion.div 
        layout 
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            layout
            key={index}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ color: '#A855F7', whiteSpace: 'nowrap', display: 'inline-block' }} 
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </motion.div>

      {suffix && (
        <motion.span layout transition={{ type: "spring", stiffness: 300, damping: 30 }}>
          {suffix}
        </motion.span>
      )}
    </motion.div>
  );
};