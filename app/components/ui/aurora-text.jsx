"use client";
import React, { memo } from "react";

export const AuroraText = memo(
  ({
    children,
    className = "",
    colors = ["#FF0080", "#7928CA", "#0070F3", "#38bdf8"],
    speed = 1.5,
  }) => {
    const gradientStyle = {
      backgroundImage: `linear-gradient(135deg, ${colors.join(", ")}, ${colors[0]})`,
      backgroundSize: "200% auto",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      color: "transparent",
      animation: `aurora-pan ${10 / speed}s linear infinite`,
    };

    return (
      <>
        <style>{`
          @keyframes aurora-pan {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }
        `}</style>
        <span className={`relative inline-block ${className}`} style={gradientStyle}>
          {children}
        </span>
      </>
    );
  }
);

AuroraText.displayName = "AuroraText";