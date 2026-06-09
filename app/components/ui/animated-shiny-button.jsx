"use client";
import React from "react";
import { ChevronRight } from "lucide-react";

export function AnimatedShinyButton({ children }) {
  return (
    <div style={{ 
      position: 'relative', 
      display: 'inline-block', 
      borderRadius: '50px', 
      padding: '2px', 
      background: 'linear-gradient(90deg, #A855F7, #EC4899, #06b6d4, #A855F7)', 
      backgroundSize: '300% 100%', 
      animation: 'gradient-shift 4s linear infinite',
      boxShadow: '0 4px 20px rgba(168, 85, 247, 0.3)'
    }}>
      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .shiny-inner:hover .shiny-chevron { transform: translateX(5px); }
        .shiny-inner:hover { background-color: #111111 !important; }
      `}</style>
      <button
        className="shiny-inner"
        style={{
          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '12px 28px', backgroundColor: '#000000', borderRadius: '50px',
          color: 'white', fontSize: '15px', fontWeight: '600', cursor: 'pointer', border: 'none',
          width: '100%', height: '100%', transition: 'background-color 0.3s'
        }}
      >
        {children}
        <ChevronRight size={18} className="shiny-chevron" style={{ marginLeft: '6px', transition: 'transform 0.3s' }} />
      </button>
    </div>
  );
}