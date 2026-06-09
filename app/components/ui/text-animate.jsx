"use client";
import { motion } from "framer-motion";

export const TextAnimate = ({ children }) => {
  const words = children.split(" ");
  
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5px' }}>
      {words.map((word, idx) => (
        <motion.span
          key={idx}
          initial={{ opacity: 0, filter: 'blur(10px)', y: 10 }}
          animate={{ 
            opacity: [0, 1, 1, 0], 
            filter: ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(10px)'], 
            y: [10, 0, 0, 10] 
          }}
          transition={{
            duration: 8, 
            times: [0, 0.1, 0.8, 1],
            delay: 2.2 + (idx * 0.05),
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut"
          }}
          style={{ display: 'inline-block' }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};