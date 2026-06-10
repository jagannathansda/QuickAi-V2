"use client";
import React, { useState, useEffect, useMemo } from "react";

export const TypewriterEffectSmooth = ({ words }) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const characters = useMemo(() => {
    const charsArray = [];
    words.forEach((word, wordIdx) => {
      const chars = word.text.split("");
      chars.forEach((char) => {
        charsArray.push({ char, color: word.color || "#ffffff", isNewline: false });
      });
      
      if (word.newline) {
        charsArray.push({ isNewline: true });
      } else if (wordIdx !== words.length - 1) {
        charsArray.push({ char: " ", color: "#ffffff", isNewline: false });
      }
    });
    return charsArray;
  }, [words]);

  useEffect(() => {
    let timeout;

    if (!isDeleting && visibleCount < characters.length) {
      timeout = setTimeout(() => {
        setVisibleCount((prev) => prev + 1);
      }, 50); 
    } else if (!isDeleting && visibleCount === characters.length) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2000); 
    } else if (isDeleting && visibleCount > 0) {
      timeout = setTimeout(() => {
        setVisibleCount((prev) => prev - 1);
      }, 30); 
    } else if (isDeleting && visibleCount === 0) {
      timeout = setTimeout(() => {
        setIsDeleting(false);
      }, 500); 
    }

    return () => clearTimeout(timeout);
  }, [visibleCount, isDeleting, characters.length]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '16px 0', minHeight: '140px' }}>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .cursor-blink {
          animation: blink 0.8s infinite;
        }
      `}</style>
      <div style={{
        fontSize: 'clamp(32px, 5vw, 54px)',
        fontWeight: '800',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        lineHeight: '1.2',
        whiteSpace: 'pre-wrap', 
        display: 'inline-block'
      }}>
        {characters.slice(0, visibleCount).map((item, idx) => {
          if (item.isNewline) return <br key={`br-${idx}`} />;
          return (
            <span key={`char-${idx}`} style={{ color: item.color, textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
              {item.char}
            </span>
          );
        })}
        <span
          className="cursor-blink"
          style={{
            display: 'inline-block',
            width: '3px',
            height: 'clamp(32px, 5vw, 54px)',
            backgroundColor: '#00B2FF',
            borderRadius: '2px',
            marginLeft: '6px',
            verticalAlign: 'bottom',
            position: 'relative',
            top: '4px'
          }}
        />
      </div>
    </div>
  );
};