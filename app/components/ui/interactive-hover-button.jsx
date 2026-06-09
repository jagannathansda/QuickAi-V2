"use client";
import React from "react";
import { ArrowRight } from "lucide-react";

export function InteractiveHoverButton({ children, className = "", ...props }) {
  return (
    <button className={`inter-hover-btn ${className}`} {...props}>
      <style>{`
        .inter-hover-btn {
          position: relative;
          width: auto;
          cursor: pointer;
          overflow: hidden;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(0, 0, 0, 0.4);
          padding: 0 20px;
          color: white;
          font-family: inherit;
          font-weight: 600;
          transition: border-color 0.3s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 44px; /* Optimized height */
        }
        .inter-hover-btn:hover { border-color: white; }
        
        .inter-content-default { 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          gap: 8px; 
          height: 100%;
        }
        
        .inter-dot {
          background-color: white;
          height: 6px; 
          width: 6px;
          border-radius: 50%;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .inter-hover-btn:hover .inter-dot { transform: scale(110); }
        
        .inter-text-default {
          display: flex;
          align-items: center;
          font-size: 13.5px;
          line-height: 1; /* Fixes baseline misalignment */
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .inter-hover-btn:hover .inter-text-default { transform: translateX(48px); opacity: 0; }
        
        .inter-content-hover {
          position: absolute; top: 0; left: 0; z-index: 10;
          display: flex; height: 100%; width: 100%; align-items: center; justify-content: center; gap: 8px;
          opacity: 0; transform: translateX(48px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: black; font-size: 13.5px; line-height: 1;
        }
        .inter-hover-btn:hover .inter-content-hover { transform: translateX(0); opacity: 1; }
      `}</style>

      <div className="inter-content-default">
        <div className="inter-dot"></div>
        <span className="inter-text-default">{children}</span>
      </div>
      
      <div className="inter-content-hover">
        <span>{children}</span>
        <ArrowRight size={15} />
      </div>
    </button>
  );
}