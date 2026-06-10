"use client";
import React from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";

export const CardSpotlight = ({
  children,
  radius = 400,
  color = "rgba(168, 85, 247, 0.15)",
  glowColor = "#a855f7",
  className = "",
  ...props
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <>
      <style>{`
        @media (hover: none) and (pointer: coarse), (max-width: 768px) {
          .spotlight-layer { 
            display: none !important; 
          }
          .glass-container { 
            backdrop-filter: blur(10px) !important; 
            -webkit-backdrop-filter: blur(10px) !important;
            transform: none !important;
          }
        }
      `}</style>

      <motion.div
        className={`glass-container ${className}`}
        onMouseMove={handleMouseMove}
        initial="initial"
        whileHover="hover"
        variants={{
          initial: { scale: 1, boxShadow: '0px 0px 0px rgba(0,0,0,0)', borderColor: 'rgba(255, 255, 255, 0.15)' },
          hover: {
            scale: 1.02,
            boxShadow: `0px 10px 40px -10px ${glowColor}80`,
            borderColor: glowColor,
            transition: { duration: 0.2 }
          }
        }}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          borderRadius: "24px",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          backgroundColor: "rgba(255, 255, 255, 0.06)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          overflow: "hidden",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          transform: "translateZ(0)",
          willChange: "transform, box-shadow, border-color"
        }}
        {...props}
      >
        <motion.div
          className="spotlight-layer"
          variants={{
            initial: { opacity: 0 },
            hover: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } }
          }}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            background: useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, ${color}, transparent 80%)`,
            transform: "translateZ(0)",
            willChange: "background, opacity"
          }}
        />
        
        <div style={{ position: "relative", zIndex: 1, height: "100%", width: "100%", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
          {children}
        </div>
      </motion.div>
    </>
  );
};