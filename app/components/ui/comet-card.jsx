"use client";
import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";

export const CometCard = ({ rotateDepth = 15, translateDepth = 10, glowColor = "#ffffff", children }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [-rotateDepth, rotateDepth]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [rotateDepth, -rotateDepth]);
  
  const translateX = useTransform(mouseXSpring, [-0.5, 0.5], [-translateDepth, translateDepth]);
  const translateY = useTransform(mouseYSpring, [-0.5, 0.5], [translateDepth, -translateDepth]);

  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100]);
  
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 60%, rgba(255, 255, 255, 0) 100%)`;

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: '1200px', width: '100%', height: '100%' }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX, rotateY, x: translateX, y: translateY,
          width: '100%', height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.04)', 
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '24px',
          position: 'relative',
          transformStyle: 'preserve-3d'
        }}
        initial={{ scale: 1, z: 0, boxShadow: '0px 0px 0px rgba(0,0,0,0)', borderColor: 'rgba(255, 255, 255, 0.15)' }}
        whileHover={{ 
          scale: 1.02, 
          z: 20, 
          boxShadow: `0px 10px 40px -10px ${glowColor}80`,
          borderColor: glowColor,
          backgroundColor: 'rgba(255, 255, 255, 0.15)', 
          transition: { duration: 0.2 } 
        }}
      >
        <div style={{ transform: 'translateZ(30px)', width: '100%', height: '100%', padding: '24px' }}>
          {children}
        </div>
        
        <motion.div
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            borderRadius: '24px', pointerEvents: 'none', background: glareBackground,
            mixBlendMode: 'overlay', opacity: 1, transform: 'translateZ(1px)'
          }}
        />
      </motion.div>
    </div>
  );
};