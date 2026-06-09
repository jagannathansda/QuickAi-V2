"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { AuroraText } from "../components/ui/aurora-text";
import { CardSpotlight } from "../components/ui/card-spotlight";
import { AnimatedShinyButton } from "../components/ui/shiny-button";
import Orb from "../components/background/orb";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";

// Terminal Window Component with Scroll Fixes
const TerminalWindow = ({ children }) => (
  <div style={{ backgroundColor: "rgba(15, 15, 15, 0.6)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.5)", fontFamily: "monospace", color: "#e5e7eb", fontSize: "14px", width: "100%", height: "100%", display: "flex", flexDirection: "column", minHeight: 0 }}>
    <div style={{ display: "flex", alignItems: "center", padding: "14px 16px", backgroundColor: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ display: "flex", gap: "8px" }}>
        <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ef4444" }} />
        <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#eab308" }} />
        <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#22c55e" }} />
      </div>
      <div style={{ marginLeft: "16px", color: "#a1a1aa", fontSize: "12px", fontWeight: "500", letterSpacing: "0.5px" }}>quickai-engine</div>
    </div>
    <div className="custom-terminal-scrollbar" style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "12px", flex: 1, overflowY: "auto", overflowX: "hidden" }}>
      {children}
      {/* Invisible Spacer to protect bottom padding during overflow */}
      <div style={{ height: "40px", flexShrink: 0 }} />
    </div>
  </div>
);

const TerminalLine = ({ delay, children, color = "white", isTyping = false }) => {
  if (isTyping) {
    return <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: "100%", opacity: 1 }} transition={{ delay, duration: 1.5, ease: "linear" }} style={{ color, whiteSpace: "nowrap", overflow: "hidden", borderRight: "2px solid rgba(255,255,255,0.5)" }}>{children}</motion.div>;
  }
  return <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.3 }} style={{ color, display: "flex", gap: "8px" }}>{children}</motion.div>;
};

export default function TitleGeneratorPage() {
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [keyword, setKeyword] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTitles, setGeneratedTitles] = useState([]);
  const [terminalPhase, setTerminalPhase] = useState("idle");
  const { getToken } = useAuth();

  const categories = [
    { name: "General", color: "#ffffff", shadow: "rgba(255, 255, 255, 0.5)" },
    { name: "Technology", color: "#06b6d4", shadow: "rgba(6, 182, 212, 0.5)" },
    { name: "Business", color: "#a855f7", shadow: "rgba(168, 85, 247, 0.5)" },
    { name: "Health", color: "#22c55e", shadow: "rgba(34, 197, 94, 0.5)" },
    { name: "LifeStyle", color: "#ec4899", shadow: "rgba(236, 72, 153, 0.5)" },
    { name: "Education", color: "#f59e0b", shadow: "rgba(245, 158, 11, 0.5)" },
    { name: "Travel", color: "#3b82f6", shadow: "rgba(59, 130, 246, 0.5)" },
    { name: "Food", color: "#f43f5e", shadow: "rgba(244, 63, 94, 0.5)" }
  ];

  // API Trigger Integration
  const handleGenerateTitles = async () => {
    if (!keyword.trim()) return;

    setIsGenerating(true);
    setGeneratedTitles([]);
    setTerminalPhase("loading");

    try {
      const token = await getToken();
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/ai/generate-blog-title`,
        { keyword: keyword, category: selectedCategory },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setGeneratedTitles(response.data.titles);
        setTerminalPhase("complete");
      } else {
        setGeneratedTitles([`[ERROR]: ${response.data.message}`]);
        setTerminalPhase("error");
      }
    } catch (error) {
      setGeneratedTitles(["[ERROR]: Connection to backend cluster failed."]);
      setTerminalPhase("error");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="main-page-wrapper" style={{ width: '100%', position: 'relative', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Background Orb */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
        <Orb hoverIntensity={0.2} rotateOnHover={true} />
      </div>

      <style>{`
        /* Desktop Specific Rules - Strict No Scroll */
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

        /* EXACT LARGE SCREEN LAYOUT */
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
          padding: 14px; 
          box-sizing: border-box;
          height: 100%;
        }

        .pill-btn {
          padding: 10px 24px;
          border-radius: 9999px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
          min-width: 110px;
          text-align: center;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
        }
        
        .pill-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.2);
        }

        /* Sleek Terminal Scrollbar Custom Rules */
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

        /* PERFECT MOBILE LAYOUT FIX */
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
            height: 480px;
            flex-shrink: 0;
            margin-top: 10px;
          }
        }
      `}</style>

      <div className="generator-container">
        {/* Left Panel */}
        <div className="left-panel">
          <div style={{ position: 'relative', borderRadius: '24px', height: '100%' }}>
            <CardSpotlight color="rgba(6, 182, 212, 0.15)" glowColor="#06b6d4" className="h-full w-full">
              <div className="card-content">
                <div>
                  <h1 style={{ fontSize: "36px", fontWeight: "900", textAlign: "center", marginTop: "0px", marginBottom: "8px" }}>
                    <AuroraText>AI Blog Title Generator</AuroraText>
                  </h1>
                  <p style={{ color: "#a1a1aa", fontSize: "15px", textAlign: "center" }}>Generate catchy titles for your next blog post.</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <label style={{ color: "#e5e7eb", fontSize: "16px", fontWeight: "600" }}>Primary Keyword</label>
                  <input 
                    type="text" 
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="e.g., Sustainable living" 
                    style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "16px", color: "white", width: "100%", boxSizing: "border-box", outline: "none", fontSize: "15px" }} 
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <label style={{ color: "#e5e7eb", fontSize: "16px", fontWeight: "600" }}>Blog Category</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
                    {categories.map((cat) => {
                      const isSelected = selectedCategory === cat.name;
                      return (
                        <button 
                          key={cat.name} 
                          onClick={() => setSelectedCategory(cat.name)}
                          className="pill-btn"
                          style={{ 
                            border: `1px solid ${isSelected ? cat.color : 'rgba(255,255,255,0.1)'}`,
                            color: isSelected ? '#fff' : '#a1a1aa',
                            boxShadow: isSelected ? `0 0 15px ${cat.shadow}, inset 0 0 10px ${cat.shadow}` : 'none',
                            '--hover-shadow': `0 0 10px ${cat.shadow}`
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) e.currentTarget.style.boxShadow = `0 0 8px ${cat.shadow}`;
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          {cat.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div 
                  style={{ marginTop: "auto", cursor: isGenerating || !keyword.trim() ? "not-allowed" : "pointer", opacity: isGenerating || !keyword.trim() ? 0.5 : 1 }}
                  onClick={!isGenerating && keyword.trim() ? handleGenerateTitles : undefined}
                >
                  <AnimatedShinyButton className="w-full" style={{ padding: "16px", fontSize: "16px", fontWeight: "bold" }}>
                    {isGenerating ? "Generating..." : "Generate Titles"}
                  </AnimatedShinyButton>
                </div>
              </div>
            </CardSpotlight>
          </div>
        </div>

        {/* Right Panel - Terminal */}
        <div className="right-panel">
          <TerminalWindow>
            
            {/* IDLE STATE */}
            {terminalPhase === "idle" && (
              <TerminalLine delay={0} color="#a1a1aa">&gt; Awaiting prompt data to initialize TitleGen module...</TerminalLine>
            )}

            {/* LOADING STATE */}
            {terminalPhase === "loading" && (
              <>
                <TerminalLine delay={0} color="#a1a1aa" isTyping={true}>&gt; quickai generate titles --keyword "{keyword.substring(0, 20)}" --category "{selectedCategory}"</TerminalLine>
                <TerminalLine delay={1.5} color="#eab308"><span>⟳</span> <span>Scanning current global SEO trends...</span></TerminalLine>
                <TerminalLine delay={2.8} color="#22c55e"><span>✔</span> <span>Semantic analysis matrix built successfully.</span></TerminalLine>
                <TerminalLine delay={3.8} color="#22c55e"><span>✔</span> <span>Applying high-CTR psychological hooks.</span></TerminalLine>
                <TerminalLine delay={4.8} color="#06b6d4"><span>ℹ</span> <span>Awaiting response from compute cluster...</span></TerminalLine>
              </>
            )}

            {/* COMPLETE STATE */}
            {terminalPhase === "complete" && (
              <>
                <TerminalLine delay={0} color="#22c55e"><span>✔</span> <span>Success! High-performance variations created.</span></TerminalLine>
                <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <TerminalLine delay={0.2} color="#06b6d4"><span>ℹ</span> <span>Generated {generatedTitles.length} optimized variations:</span></TerminalLine>
                  {generatedTitles.map((title, idx) => (
  <TerminalLine key={idx} delay={0.4 + idx * 0.15} color="#e5e7eb">
    <span style={{ display: "block", whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: "1.5" }}>
      {idx + 1}. {title}
    </span>
  </TerminalLine>
))}
                </div>
                <TerminalLine delay={0.6 + generatedTitles.length * 0.15} color="#a1a1aa" isTyping={true}>&gt; Engine idle. Standing by for next generation...</TerminalLine>
              </>
            )}

            {/* ERROR STATE */}
            {terminalPhase === "error" && (
              <>
                <TerminalLine delay={0} color="#ef4444"><span>✖</span> <span>FATAL EXCEPTION OVERRIDE</span></TerminalLine>
                <TerminalLine delay={0.3} color="#ef4444">{generatedTitles[0]}</TerminalLine>
              </>
            )}

          </TerminalWindow>
        </div>
      </div>
    </main>
  );
}