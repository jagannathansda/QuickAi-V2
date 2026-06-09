"use client";

import React, { useId } from "react";
import { ArrowRight } from "lucide-react";

export default function SlideArrowButton({
  text = "Get Started",
  primaryColor = "#6f3cff",
  className = "",
  onClick,
  height = "46px",      // Default height for Hero section
  fontSize = "14px",    // Default font size
  ...props
}) {
  const uniqueId = useId().replace(/:/g, ""); // Har button ka unique CSS banega
  
  return (
    <>
      <style>{`
        .slide-btn-${uniqueId} {
          position: relative;
          border-radius: 9999px;
          background-color: white;
          border: 1px solid white;
          cursor: pointer;
          display: flex;
          align-items: center;
          height: ${height};
          overflow: hidden;
          font-family: Arial, sans-serif;
        }
        .slide-bg-${uniqueId} {
          position: absolute;
          left: 2px;
          top: 2px;
          height: calc(${height} - 4px);
          width: calc(${height} - 4px);
          display: flex;
          align-items: center;
          justify-content: flex-end;
          border-radius: 9999px;
          transition: width 0.3s ease-in-out;
        }
        .slide-btn-${uniqueId}:hover .slide-bg-${uniqueId} {
          width: calc(100% - 4px);
        }
        .slide-icon-${uniqueId} {
          width: calc(${height} - 4px);
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
        }
        .slide-text-${uniqueId} {
          position: relative;
          left: calc(${height} - 4px);
          z-index: 10;
          white-space: nowrap;
          padding-right: calc(${height} + 12px);
          color: black;
          font-size: ${fontSize};
          font-weight: 700;
          transition: all 0.3s ease-in-out;
        }
        .slide-btn-${uniqueId}:hover .slide-text-${uniqueId} {
          left: 14px;
          color: white;
        }
      `}</style>
      <button className={`slide-btn-${uniqueId} ${className}`} onClick={onClick} {...props}>
        <div className={`slide-bg-${uniqueId}`} style={{ backgroundColor: primaryColor }}>
          <span className={`slide-icon-${uniqueId}`}>
            <ArrowRight size={parseInt(height) > 40 ? 18 : 16} />
          </span>
        </div>
        <span className={`slide-text-${uniqueId}`}>{text}</span>
      </button>
    </>
  );
}