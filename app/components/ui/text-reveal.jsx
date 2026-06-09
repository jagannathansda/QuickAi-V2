"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const TextReveal = ({ text }) => {
  const sectionRef = useRef(null);
  
  // Jab text screen ke neeche se upar (navbar ki taraf) aayega, tab yeh effect chalega
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 85%", "start 25%"] 
  });

  const words = text.split(" ");

  return (
    <div ref={sectionRef} style={{ position: 'relative', zIndex: 0, padding: '20px 0', width: '100%' }}>
      <p style={{ 
        display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', 
        fontSize: 'clamp(2.5rem, 6vw, 4.2rem)', fontWeight: '800', 
        fontFamily: '"Inter", "Poppins", system-ui, sans-serif', 
        letterSpacing: '-0.03em', color: 'white', marginBottom: '16px' 
      }}>
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + (1 / words.length);
          return (
            <Word key={i} progress={scrollYProgress} range={[start, end]}>
              {word}
            </Word>
          );
        })}
      </p>
    </div>
  );
};

const Word = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0.15, 1]); // 15% faded se 100% bright tak
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span style={{ position: 'absolute', opacity: 0.2 }}>{children}</span>
      <motion.span style={{ opacity: opacity, color: 'white' }}>
        {children}
      </motion.span>
    </span>
  );
};