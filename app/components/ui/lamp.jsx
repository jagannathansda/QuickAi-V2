"use client";
import React from "react";
import { motion } from "framer-motion";

export const LampContainer = ({ children }) => {
  return (
    <div style={{ position: 'relative', display: 'flex', minHeight: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', width: '100%', zIndex: 0 }}>
      
      <div style={{ position: 'relative', display: 'flex', width: '100%', flex: 1, transform: 'scaleY(1.25)', alignItems: 'center', justifyContent: 'center', zIndex: 0, marginTop: '120px' }}>
        
        {/* Left Purple Cone */}
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{
            position: 'absolute', right: '50%', height: '14rem',
            backgroundImage: 'conic-gradient(from 70deg at center top, #A855F7, transparent, transparent)', 
            WebkitMaskImage: 'radial-gradient(circle at center top, white 10%, transparent 80%)',
          }}
        />

        {/* Right Pink Cone */}
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{
            position: 'absolute', left: '50%', height: '14rem',
            backgroundImage: 'conic-gradient(from 290deg at center top, transparent, transparent, #EC4899)', 
            WebkitMaskImage: 'radial-gradient(circle at center top, white 10%, transparent 80%)',
          }}
        />

        {/* NOTE: Yahan se wo 'backdropFilter: blur(12px)' wali line hata di gayi hai jo dabba bana rahi thi */}
        
        {/* Core glows (Pure color glows merged with background) */}
        <div style={{ position: 'absolute', zIndex: 50, height: '9rem', width: '28rem', transform: 'translateY(-50%)', borderRadius: '50%', backgroundColor: '#A855F7', opacity: 0.3, filter: 'blur(60px)' }}></div>
        
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "16rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{ position: 'absolute', zIndex: 30, height: '6rem', transform: 'translateY(-6rem)', borderRadius: '50%', backgroundColor: '#EC4899', filter: 'blur(40px)', opacity: 0.8 }}
        ></motion.div>

        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{ position: 'absolute', zIndex: 50, height: '2px', transform: 'translateY(-7rem)', backgroundImage: 'linear-gradient(to right, #A855F7, #EC4899)' }}
        ></motion.div>
      </div>

      <div style={{ position: 'relative', zIndex: 50, display: 'flex', transform: 'translateY(-12rem)', flexDirection: 'column', alignItems: 'center', padding: '0 20px', width: '100%' }}>
        {children}
      </div>
    </div>
  );
};