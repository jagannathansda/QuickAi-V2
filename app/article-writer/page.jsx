"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AuroraText } from "../components/ui/aurora-text";
import { CardSpotlight } from "../components/ui/card-spotlight";
import { AnimatedShinyButton } from "../components/ui/shiny-button";
import Orb from "../components/background/orb";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";

// FIXED: Scrollbar class aur explicit minHeight fix lagaya hai
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
    {/* FIXED: Added 'custom-terminal-scrollbar' class */}
    <div className="custom-terminal-scrollbar" style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "12px", flex: 1, overflowY: "auto", overflowX: "hidden" }}>
      {children}
      <div style={{ height: "40px", flexShrink: 0 }} />
    </div>
  </div>
);

// WORD-BY-WORD RESULT COMPONENT
const WordByWordText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!text) return;
    
    const tokens = text.split(/(\s+)/); 
    let i = 0;
    setDisplayedText("");
    
    const chunkSize = tokens.length > 600 ? 8 : 2; 

    const interval = setInterval(() => {
      i += chunkSize;
      if (i >= tokens.length) {
        clearInterval(interval);
        setDisplayedText(text); 
      } else {
        setDisplayedText(tokens.slice(0, i).join(""));
      }
    }, 16); 

    return () => clearInterval(interval);
  }, [text]);

  return (
    <div style={{ color: "#22c55e", whiteSpace: "pre-wrap", lineHeight: "1.6", marginTop: "10px" }}>
      {displayedText}
    </div>
  );
};

// TYPING EFFECT COMPONENT
const TerminalLine = ({ delay = 0, children, color = "white", isTyping = false }) => {
  if (isTyping) {
    return <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: "100%", opacity: 1 }} transition={{ delay, duration: 1.5, ease: "linear" }} style={{ color, whiteSpace: "nowrap", overflow: "hidden", borderRight: "2px solid rgba(255,255,255,0.5)" }}>{children}</motion.div>;
  }
  return <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.3 }} style={{ color, display: "flex", gap: "8px", lineHeight: "1.4" }}>{children}</motion.div>;
};

export default function ArticleWriterPage() {
  const [selectedLength, setSelectedLength] = useState("short");
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [terminalPhase, setTerminalPhase] = useState("idle");
  const { getToken } = useAuth();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const lengths = [
    { id: "short", label: "Short", tokens: 400 },
    { id: "medium", label: "Medium", tokens: 800 },
    { id: "long", label: "Long", tokens: 1500 }
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    setGeneratedContent("");
    setTerminalPhase("loading");

    try {
      const token = await getToken();
      const selectedTokenCount = lengths.find(l => l.id === selectedLength).tokens;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/ai/generate-article`,
        {
          prompt: `Write an SEO optimized article about: ${topic}`,
          length: selectedTokenCount
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setGeneratedContent(response.data.content);
        setTerminalPhase("complete");
      } else {
        setGeneratedContent(`[ERROR]: ${response.data.message}`);
        setTerminalPhase("error");
      }
    } catch (error) {
      setGeneratedContent("[ERROR]: Connection to backend failed.");
      setTerminalPhase("error");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main style={{ height: '100vh', width: '100%', margin: 0, padding: 0, position: 'relative', overflow: 'hidden', boxSizing: "border-box", fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
        <Orb hoverIntensity={0.2} rotateOnHover={true} />
      </div>

      <style>{`
        .writer-container {
          display: grid;
          grid-template-columns: 4fr 6fr;
          gap: 24px;
          width: 95%; 
          max-width: 1200px; 
          margin: 0 auto;
          height: 100vh;
          padding-top: 100px; 
          padding-bottom: 24px; 
          box-sizing: border-box;
          align-items: stretch;
        }
        
        /* FIXED: Added min-height: 0 to prevent the layout from stretching out of view */
        .left-panel, .right-panel {
          height: 100%;
          width: 100%;
          min-height: 0; 
        }
        
        .card-content {
          display: flex;
          flex-direction: column;
          gap: 28px;
          padding: 14px; 
          box-sizing: border-box;
          height: 100%;
        }

        /* FIXED: Beautiful custom sleek scrollbar for terminal */
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
          .writer-container { 
            display: flex;
            flex-direction: column;
            width: 100%;
            padding: 100px 8px 24px 8px; 
            height: 100vh;
            overflow-y: auto;
            overflow-x: hidden;
          }
          .left-panel {
            height: auto;
            flex-shrink: 0;
          }
          .right-panel {
            height: 500px;
            flex-shrink: 0;
            margin-top: 10px;
          }
          .card-content {
            padding: 2px; 
            gap: 24px;
          }
        }
      `}</style>

      <div className="writer-container">
        
        <div className="left-panel" style={{ position: 'relative', borderRadius: '24px' }}>
          <CardSpotlight color="rgba(6, 182, 212, 0.15)" glowColor="#06b6d4" className="h-full w-full">
            <div className="card-content">
              <div>
                <h1 style={{ fontSize: "42px", fontWeight: "900", margin: "0 0 6px 0", letterSpacing: "-0.03em", lineHeight: "1.1", textAlign: "center" }}>
                  <AuroraText>AI Article Writer</AuroraText>
                </h1>
                <p style={{ color: "#a1a1aa", fontSize: "17px", margin: 0, lineHeight: "1.5", fontWeight: "400" }}>
                  Provide a topic and let AI craft an SEO-optimized article instantly.
                </p>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ color: "#e5e7eb", fontSize: "18px", fontWeight: "750" }}>Article Topic</label>
                <textarea 
                  rows="5"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. The impact of AI on healthcare..." 
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.4)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px", padding: "14px", color: "white", fontSize: "15px", outline: "none", boxSizing: "border-box", width: "100%", resize: "none", fontFamily: "inherit", transition: "border 0.2s"
                  }} 
                  onFocus={(e) => e.target.style.borderColor = "rgba(6, 182, 212, 0.5)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ color: "#e5e7eb", fontSize: "18px", fontWeight: "750" }}>Article Length</label>
                <div style={{ position: "relative", display: "flex", backgroundColor: "rgba(0,0,0,0.4)", borderRadius: "9999px", padding: "4px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  {lengths.map((len) => (
                    <div 
                      key={len.id}
                      onClick={() => setSelectedLength(len.id)}
                      style={{ flex: 1, position: "relative", cursor: "pointer", padding: "8px 0", textAlign: "center", zIndex: 10 }}
                    >
                      {selectedLength === len.id && (
                        <motion.div 
                          layoutId="pill-bg"
                          transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: "9999px" }}
                        />
                      )}
                      <span style={{ position: "relative", zIndex: 20, color: selectedLength === len.id ? "white" : "#a1a1aa", fontSize: "14px", fontWeight: selectedLength === len.id ? "700" : "500", transition: "color 0.2s" }}>
                        {len.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div 
                style={{ marginTop: "auto", paddingBottom: "10px", cursor: isGenerating || !topic.trim() ? "not-allowed" : "pointer", opacity: isGenerating || !topic.trim() ? 0.5 : 1 }}
                onClick={!isGenerating && topic.trim() ? handleGenerate : undefined}
              >
                 <AnimatedShinyButton className="w-full">
                   {isGenerating ? "Generating..." : "Generate Article"}
                 </AnimatedShinyButton>
              </div>
            </div>
          </CardSpotlight>
        </div>

        <div className="right-panel">
          <TerminalWindow>
            {terminalPhase === "idle" && (
              <TerminalLine delay={0} color="#a1a1aa">&gt; Awaiting prompt to initialize QuickAi reasoning engine...</TerminalLine>
            )}

            {terminalPhase === "loading" && (
              <>
                <TerminalLine delay={0} color="#a1a1aa" isTyping={true}>&gt; quickai generate article --topic "{topic.substring(0, 15)}..."</TerminalLine>
                <TerminalLine delay={1.5} color="#22c55e"><span>✔</span> <span>Initializing QuickAi reasoning engine.</span></TerminalLine>
                <TerminalLine delay={2.2} color="#22c55e"><span>✔</span> <span>Analyzing context and gathering web sources.</span></TerminalLine>
                <TerminalLine delay={3.0} color="#22c55e"><span>✔</span> <span>Structuring article outline for {selectedLength} length.</span></TerminalLine>
                <TerminalLine delay={3.8} color="#22c55e"><span>✔</span> <span>Drafting highly engaging paragraphs.</span></TerminalLine>
                <TerminalLine delay={4.5} color="#06b6d4"><span>ℹ</span> <span>Awaiting response from backend cluster...</span></TerminalLine>
              </>
            )}

            {terminalPhase === "complete" && (
              <>
                <TerminalLine delay={0} color="#22c55e"><span>✔</span> <span>Success! Article generation completed.</span></TerminalLine>
                <TerminalLine delay={0.2} color="#06b6d4"><span>ℹ</span> <span>Output Stream:</span></TerminalLine>
                <WordByWordText text={generatedContent} />
              </>
            )}

            {terminalPhase === "error" && (
              <>
                <TerminalLine delay={0} color="#ef4444"><span>✖</span> <span>FATAL ERROR INTERCEPTED</span></TerminalLine>
                <TerminalLine delay={0.2} color="#ef4444">{generatedContent}</TerminalLine>
              </>
            )}
          </TerminalWindow>
        </div>

      </div>
    </main>
  );
}