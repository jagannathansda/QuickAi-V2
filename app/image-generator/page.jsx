"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { AuroraText } from "../components/ui/aurora-text";
import { CardSpotlight } from "../components/ui/card-spotlight";
import { AnimatedShinyButton } from "../components/ui/shiny-button";
import Orb from "../components/background/orb";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { Download, Loader2 } from "lucide-react";

const TerminalWindow = ({ children }) => (
  <div style={{ backgroundColor: "rgba(15, 15, 15, 0.6)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.5)", fontFamily: "monospace", color: "#e5e7eb", fontSize: "14px", width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
    <div style={{ display: "flex", alignItems: "center", padding: "14px 16px", backgroundColor: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ display: "flex", gap: "8px" }}>
        <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ef4444" }} />
        <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#eab308" }} />
        <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#22c55e" }} />
      </div>
      <div style={{ marginLeft: "16px", color: "#a1a1aa", fontSize: "12px", fontWeight: "500", letterSpacing: "0.5px" }}>quickai-diffusion-engine</div>
    </div>
    <div className="custom-terminal-scrollbar" style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "12px", flex: 1, overflowY: "auto", overflowX: "hidden" }}>
      {children}
      <div style={{ height: "40px", flexShrink: 0 }} />
    </div>
  </div>
);

const TerminalLine = ({ delay, children, color = "white", isTyping = false }) => {
  if (isTyping) {
    return <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: "100%", opacity: 1 }} transition={{ delay, duration: 1.5, ease: "linear" }} style={{ color, whiteSpace: "nowrap", overflow: "hidden", borderRight: "2px solid rgba(255,255,255,0.5)" }}>{children}</motion.div>;
  }
  return <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.3 }} style={{ color, display: "flex", gap: "8px", lineHeight: "1.5" }}>{children}</motion.div>;
};

export default function ImageGeneratorPage() {
  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [isPublic, setIsPublic] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [terminalPhase, setTerminalPhase] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const { getToken } = useAuth();

  const artStyles = [
    { name: "Realistic", color: "#10b981", shadow: "rgba(16, 185, 129, 0.5)" },
    { name: "Anime", color: "#ec4899", shadow: "rgba(236, 72, 153, 0.5)" },
    { name: "3D Render", color: "#3b82f6", shadow: "rgba(59, 130, 246, 0.5)" },
    { name: "Cyberpunk", color: "#eab308", shadow: "rgba(234, 179, 8, 0.5)" },
    { name: "Cinematic", color: "#a855f7", shadow: "rgba(168, 85, 247, 0.5)" },
    { name: "Pixel Art", color: "#ef4444", shadow: "rgba(239, 68, 68, 0.5)" }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGeneratedImage(null);
    setTerminalPhase("loading");

    try {
      const token = await getToken();
      const finalPrompt = `${prompt}, highly detailed, ${selectedStyle} style, 8k resolution, masterpiece`;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/ai/generate-image`,
        { prompt: finalPrompt, publish: isPublic },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setGeneratedImage(response.data.content);
        setTerminalPhase("complete");
      } else {
        setErrorMessage(response.data.message);
        setTerminalPhase("error");
      }
    } catch (error) {
      setErrorMessage("Connection to Diffusion Cluster failed.");
      setTerminalPhase("error");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="main-page-wrapper" style={{ width: '100%', position: 'relative', fontFamily: 'system-ui, sans-serif' }}>
      
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
        <Orb hoverIntensity={0.3} rotateOnHover={true} hue={160} /> 
      </div>

      <style>{`
        @media (min-width: 951px) {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            height: 100vh;
          }
          
          .main-page-wrapper {
            height: 100vh;
            overflow: hidden !important;
          }
        }

        .generator-container {
          display: grid;
          grid-template-columns: 4fr 6fr;
          gap: 24px;
          width: 95%; 
          max-width: 1200px; 
          margin: 0 auto;
          height: calc(100vh - 130px); 
          margin-top: 95px; 
          box-sizing: border-box;
          align-items: stretch;
        }
        
        .left-panel, .right-panel {
          height: 100%;
          width: 100%;
          min-height: 0;
        }
        
        .card-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 14px 20px; 
          box-sizing: border-box;
          height: 100%;
        }

        .pill-btn {
          padding: 8px 18px;
          border-radius: 9999px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.3s ease;
          flex: 1;
          min-width: 95px;
          text-align: center;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
        }
        
        .pill-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.2);
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }
        .toggle-switch input { opacity: 0; width: 0; height: 0; }
        .slider {
          position: absolute; cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(255,255,255,0.05);
          transition: .4s; border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .slider:before {
          position: absolute; content: "";
          height: 16px; width: 16px; left: 3px; bottom: 3px;
          background-color: #a1a1aa;
          transition: .4s; border-radius: 50%;
        }
        input:checked + .slider { 
          background-color: rgba(16, 185, 129, 0.2); 
          border-color: #10b981;
        }
        input:checked + .slider:before {
          transform: translateX(20px);
          background-color: #10b981;
        }

        .custom-terminal-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-terminal-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-terminal-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 999px;
        }
        .custom-terminal-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        @media (max-width: 950px) {
          .main-page-wrapper {
            height: auto;
            min-height: 100vh;
            overflow-y: auto !important;
          }

          .generator-container { 
            display: flex;
            flex-direction: column;
            width: 100%;
            height: auto;
            margin-top: 80px; 
            padding: 10px 8px 40px 8px;
            overflow: visible;
          }
          
          .left-panel {
            height: auto; 
            flex-shrink: 0;
          }
          
          .card-content {
            height: auto;
            padding: 2px; 
            gap: 20px;
          }

          .right-panel {
            height: 600px;
            flex-shrink: 0;
            margin-top: 10px;
          }
        }
      `}</style>

      <div className="generator-container">
        <div className="left-panel">
          <div style={{ position: 'relative', borderRadius: '24px', height: '100%' }}>
            <CardSpotlight color="rgba(16, 185, 129, 0.15)" glowColor="#10b981" className="h-full w-full">
              <div className="card-content">
                <div>
                  <h1 style={{ fontSize: "32px", fontWeight: "900", textAlign: "center", marginTop: "0px", marginBottom: "8px" }}>
                    <AuroraText>AI Image Generator</AuroraText>
                  </h1>
                  <p style={{ color: "#a1a1aa", fontSize: "14px", textAlign: "center", margin: 0 }}>Bring your imagination to life with a simple description.</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
                  <label style={{ color: "#e5e7eb", fontSize: "15px", fontWeight: "600" }}>Describe Your Image</label>
                  <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A futuristic city with flying cars at sunset, highly detailed, 8k resolution..." 
                    rows={4}
                    style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "16px", color: "white", width: "100%", boxSizing: "border-box", outline: "none", fontSize: "14px", resize: "none", fontFamily: "inherit" }} 
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ color: "#e5e7eb", fontSize: "15px", fontWeight: "600" }}>Art Style</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "flex-start" }}>
                    {artStyles.map((style) => {
                      const isSelected = selectedStyle === style.name;
                      return (
                        <button 
                          key={style.name} 
                          onClick={() => setSelectedStyle(style.name)}
                          className="pill-btn"
                          style={{ 
                            border: `1px solid ${isSelected ? style.color : 'rgba(255,255,255,0.1)'}`,
                            color: isSelected ? '#fff' : '#a1a1aa',
                            boxShadow: isSelected ? `0 0 12px ${style.shadow}, inset 0 0 8px ${style.shadow}` : 'none',
                          }}
                        >
                          {style.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "9999px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <label style={{ color: "#e5e7eb", fontSize: "15px", fontWeight: "600", cursor: "pointer", userSelect: "none" }} onClick={() => setIsPublic(!isPublic)}>
                    Make Public
                  </label>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
                    <span className="slider"></span>
                  </label>
                </div>

                <div 
                  style={{ marginTop: "auto", paddingTop: "10px", opacity: (!prompt.trim() || isGenerating) ? 0.5 : 1, cursor: (!prompt.trim() || isGenerating) ? "not-allowed" : "pointer" }}
                  onClick={(!prompt.trim() || isGenerating) ? undefined : handleGenerate}
                >
                  <AnimatedShinyButton className="w-full" style={{ padding: "16px", fontSize: "16px", fontWeight: "bold" }}>
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                      {isGenerating ? <Loader2 className="animate-spin" size={18} /> : null}
                      {isGenerating ? "Synthesizing Image..." : "Generate Image"}
                    </span>
                  </AnimatedShinyButton>
                </div>
              </div>
            </CardSpotlight>
          </div>
        </div>

        <div className="right-panel">
          <TerminalWindow>
            {terminalPhase === "idle" && (
              <TerminalLine delay={0} color="#a1a1aa">&gt; SYSTEM ONLINE. AWAITING PROMPT INJECTION_</TerminalLine>
            )}

            {terminalPhase === "loading" && (
              <>
                <TerminalLine delay={0} color="#a1a1aa" isTyping={true}>&gt; quickai init --module "StableDiffusion_vX"</TerminalLine>
                <TerminalLine delay={1.5} color="#22c55e"><span>✔</span> <span>Diffusion engine initialized successfully.</span></TerminalLine>
                <TerminalLine delay={2.2} color="#a1a1aa" isTyping={true}>&gt; quickai render --prompt "{prompt.substring(0, 15)}..." --style "{selectedStyle}"</TerminalLine>
                <TerminalLine delay={3.8} color="#eab308"><span>⟳</span> <span>Loading latent space weights and text encoders...</span></TerminalLine>
                <TerminalLine delay={4.5} color="#06b6d4"><span>⟳</span> <span>Injecting noise & computing trajectory...</span></TerminalLine>
                <TerminalLine delay={5.2} color="#06b6d4"><span>⟳</span> <span>Denoising steps (15/50) - Establishing structure...</span></TerminalLine>
                <TerminalLine delay={6.0} color="#06b6d4"><span>⟳</span> <span>Denoising steps (50/50) - Refining textures...</span></TerminalLine>
                <TerminalLine delay={6.8} color="#06b6d4"><span>ℹ</span> <span>Awaiting response from cloud compute cluster...</span></TerminalLine>
              </>
            )}

            {terminalPhase === "complete" && generatedImage && (
              <>
                <TerminalLine delay={0} color="#22c55e"><span>✔</span> <span>Upscaling image to high resolution.</span></TerminalLine>
                <div style={{ marginTop: "12px", padding: "12px", backgroundColor: "rgba(16, 185, 129, 0.1)", borderLeft: "3px solid #10b981", borderRadius: "4px" }}>
                  <TerminalLine delay={0.2} color="#10b981"><span>✨</span> <span>Render Complete!</span></TerminalLine>
                  <TerminalLine delay={0.4} color="#e5e7eb">Status: Secure URL Generated</TerminalLine>
                  <TerminalLine delay={0.6} color="#e5e7eb">Visibility: {isPublic ? "Publicly Shared" : "Private"}</TerminalLine>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  transition={{ delay: 1.0, duration: 0.5 }}
                  style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}
                >
                  <div style={{ width: "100%", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
                    <img src={generatedImage} alt="Generated Art" style={{ width: "100%", height: "auto", display: "block" }} />
                  </div>
                  
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <a 
                      href={generatedImage} 
                      download="quickai-generation.png" 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ textDecoration: "none", color: "black", backgroundColor: "white", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: "6px" }}
                    >
                      <Download size={14} />
                      Download Image
                    </a>
                  </div>
                </motion.div>
                
                <div style={{ marginTop: "16px" }}>
                  <TerminalLine delay={1.5} color="#a1a1aa" isTyping={true}>&gt; Waiting for next imagination prompt...</TerminalLine>
                </div>
              </>
            )}

            {terminalPhase === "error" && (
              <>
                <TerminalLine delay={0} color="#ef4444"><span>✖</span> <span>FATAL EXCEPTION OVERRIDE</span></TerminalLine>
                <TerminalLine delay={0.3} color="#ef4444">{errorMessage}</TerminalLine>
              </>
            )}
          </TerminalWindow>
        </div>
      </div>
    </main>
  );
}