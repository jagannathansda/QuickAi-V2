"use client";
import Particles from "@tsparticles/react";
import { Sparkle } from "lucide-react";
import { useMemo, useState, useCallback } from "react";
import { loadFull } from "tsparticles";

const options = {
  key: "star", name: "Star",
  particles: {
    number: { value: 20, density: { enable: false } },
    color: { value: ["#7c3aed", "#bae6fd", "#a78bfa", "#93c5fd", "#0284c7", "#fafafa", "#38bdf8"] },
    shape: { type: "star", options: { star: { sides: 4 } } },
    opacity: { value: 0.8 }, size: { value: { min: 1, max: 4 } },
    rotate: { value: { min: 0, max: 360 }, enable: true, direction: "clockwise", animation: { enable: true, speed: 10, sync: false } },
    links: { enable: false }, reduceDuplicates: true, move: { enable: true, center: { x: 120, y: 45 } },
  },
  interactivity: { events: {} }, smooth: true, fpsLimit: 120, background: { color: "transparent", size: "cover" }, fullScreen: { enable: false }, detectRetina: true,
  absorbers: [{ enable: true, opacity: 0, size: { value: 1, density: 1, limit: { radius: 5, mass: 5 } }, position: { x: 110, y: 45 } }],
  emitters: [{ autoPlay: true, fill: true, life: { wait: true }, rate: { quantity: 5, delay: 0.5 }, position: { x: 110, y: 45 } }],
};

export default function AiButton({ text = "Generate Article" }) {
  const [isHovering, setIsHovering] = useState(false);

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const modifiedOptions = useMemo(() => {
    options.autoPlay = isHovering;
    return options;
  }, [isHovering]);

  return (
    <button
      className="relative outline-none border-none cursor-pointer w-full"
      style={{
        borderRadius: "9999px", 
        padding: "3px", // Outer glow translucent ring aur patli kar di
        background: "linear-gradient(to right, rgba(96, 165, 250, 0.4), rgba(192, 38, 211, 0.4))",
        boxShadow: "0 4px 20px rgba(139, 92, 246, 0.3)",
        transition: "transform 0.2s ease",
        transform: isHovering ? "scale(1.02)" : "scale(1)",
        display: "block"
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.98)"}
      onMouseUp={(e) => e.currentTarget.style.transform = "scale(1.02)"}
    >
      <div 
        className="relative flex items-center justify-center gap-2 text-white w-full"
        style={{
          borderRadius: "9999px",
          padding: "10px 24px", // Yahan HEIGHT kam ki gayi hai (10px padding vertical)
          background: "linear-gradient(to right, #60a5fa, #a855f7)", 
          boxSizing: "border-box",
          zIndex: 10,
          overflow: "hidden"
        }}
      >
        <Sparkle className="size-5" fill="white" color="white" style={{ zIndex: 10, width: "18px", height: "18px" }} />

        {/* Floating Sparkles adjusted for new height */}
        <Sparkle fill="white" color="white" style={{ position: "absolute", bottom: "8px", left: "20%", width: "10px", height: "10px", transform: "rotate(15deg)", animation: "pulse 2s infinite", zIndex: 10 }} />
        <Sparkle fill="white" color="white" style={{ position: "absolute", top: "6px", left: "30%", width: "6px", height: "6px", transform: "rotate(-10deg)", animation: "pulse 2.5s infinite 1s", zIndex: 10 }} />

        <span style={{ fontSize: "15px", fontWeight: "700", letterSpacing: "0.5px", zIndex: 10 }}>{text}</span>
      </div>
      
      {/* Particles Engine */}
      <div style={{
        position: "absolute", top: "-15px", bottom: "-15px", left: "-15px", right: "-15px",
        zIndex: 0, pointerEvents: "none",
        opacity: isHovering ? 1 : 0, transition: "opacity 0.3s ease"
      }}>
        <Particles
          id={`particles-${text.replace(/\s+/g, '-')}`}
          init={particlesInit}
          options={modifiedOptions}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </button>
  );
}