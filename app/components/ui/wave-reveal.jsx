"use client";
import React from "react";
import { motion } from "framer-motion";

export default function WaveReveal({ text, direction = "up", delay = 0 }) {
  const words = text.trim().split(/\s/);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: '800', fontFamily: '"Inter", "Poppins", system-ui, sans-serif', letterSpacing: '-0.03em', color: 'white', marginBottom: '10px' }}>
      {words.map((word, wordIdx) => (
        <span key={`word-${wordIdx}`} style={{ display: 'inline-flex', overflow: 'hidden' }}>
          {word.split("").map((letter, letterIdx) => {
            const letterDelay = delay + (wordIdx * 0.04) + (letterIdx * 0.01);
            return (
              <motion.span
                key={`letter-${wordIdx}-${letterIdx}`}
                initial={{ opacity: 0, y: direction === "up" ? 20 : -20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ 
                  duration: 0.6, 
                  delay: letterDelay, 
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: 3,
                  ease: "easeOut"
                }}
                style={{ display: 'inline-block' }}
              >
                {letter}
              </motion.span>
            );
          })}
        </span>
      ))}
    </div>
  );
}