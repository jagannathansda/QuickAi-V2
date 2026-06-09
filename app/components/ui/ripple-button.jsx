"use client";
import React, { useRef, useState } from "react";

export default function RippleButton({ children }) {
  const btnRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <button
      ref={btnRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative', overflow: 'hidden', padding: '14px 32px',
        borderRadius: '50px', backgroundColor: 'white', color: 'black',
        fontSize: '15px', fontWeight: '600', border: '1px solid #e5e7eb',
        cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'transform 0.2s'
      }}
      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <span style={{ position: 'relative', zIndex: 2 }}>{children}</span>
      {isHovered && (
        <div
          style={{
            position: 'absolute', left: pos.x, top: pos.y,
            width: '80px', height: '80px', background: 'rgba(0, 0, 0, 0.08)',
            transform: 'translate(-50%, -50%)', borderRadius: '50%', filter: 'blur(10px)',
            pointerEvents: 'none', zIndex: 1
          }}
        />
      )}
    </button>
  );
}