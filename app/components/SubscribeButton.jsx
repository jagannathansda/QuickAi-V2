"use client";
import React from "react";
import { AnimatePresence, motion } from "motion/react";

const SubscribeButton = ({ isPremium, onClick }) => {
  return (
    <div style={{ width: '100%', padding: '6px 0', pointerEvents: 'none',marginTop: 'auto' }}>
      <AnimatePresence mode="wait">
        {isPremium ? (
          // Subscribed State (Premium User)
          <motion.button
            key="subscribed"
            style={{ 
              width: '100%', 
              padding: '12px 0', 
              borderRadius: '8px', 
              backgroundColor: 'rgba(168, 85, 247, 0.2)', 
              color: '#c084fc', 
              fontSize: '14px', 
              fontWeight: '600', 
              border: '1px solid rgba(168, 85, 247, 0.4)', 
              cursor: 'default', 
              overflow: 'hidden' 
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.span
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600' }}
            >
              Subscribed
            </motion.span>
          </motion.button>
        ) : (
          // Subscribe Action State (Normal User)
          <motion.button
            key="subscribe"
            style={{ 
              width: '100%', 
              padding: '12px 0', 
              borderRadius: '8px', 
              backgroundColor: 'white', 
              color: 'black', 
              fontSize: '14px', 
              fontWeight: '600', 
              border: 'none', 
              cursor: 'pointer', 
              transition: 'transform 0.2s', 
              overflow: 'hidden' 
            }}
            onClick={onClick}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.span
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
              style={{ display: 'block', width: '100%', textAlign: 'center' }}
            >
              Subscribe
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubscribeButton;