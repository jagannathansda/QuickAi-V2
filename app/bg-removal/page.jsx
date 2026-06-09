"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { AuroraText } from "../components/ui/aurora-text";
import { CardSpotlight } from "../components/ui/card-spotlight";
import { AnimatedShinyButton } from "../components/ui/shiny-button";
import Orb from "../components/background/orb";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { Loader2 } from "lucide-react";

const TerminalWindow = ({ children }) => (
  <div style={{ backgroundColor: "rgba(15, 15, 15, 0.6)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.5)", fontFamily: "monospace", color: "#e5e7eb", fontSize: "14px", width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
    <div style={{ display: "flex", alignItems: "center", padding: "14px 16px", backgroundColor: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ display: "flex", gap: "8px" }}>
        <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ef4444" }} />
        <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#eab308" }} />
        <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#22c55e" }} />
      </div>
      <div style={{ marginLeft: "16px", color: "#f97316", fontSize: "12px", fontWeight: "600", letterSpacing: "0.5px" }}>quickai-vision-engine</div>
    </div>
    <div className="terminal-scroll" style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "12px", flex: 1, overflowY: "auto", overflowX: "hidden" }}>
      {children}
    </div>
  </div>
);

const TerminalLine = ({ delay, children, color = "white", isTyping = false }) => {
  if (isTyping) {
    return <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: "100%", opacity: 1 }} transition={{ delay, duration: 1.5, ease: "linear" }} style={{ color, whiteSpace: "nowrap", overflow: "hidden", borderRight: "2px solid rgba(255,255,255,0.5)" }}>{children}</motion.div>;
  }
  return <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.3 }} style={{ color, display: "flex", gap: "8px", lineHeight: "1.5" }}>{children}</motion.div>;
};

export default function BackgroundRemoverPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [terminalPhase, setTerminalPhase] = useState("idle");
  const fileInputRef = useRef(null);
  const { getToken } = useAuth();

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResultImage(null);
      setTerminalPhase("selected");
    }
  };

  const handleRemoveBackground = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setTerminalPhase("processing");
    setResultImage(null);

    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/ai/remove-image-background`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (response.data.success) {
        setResultImage(response.data.content);
        setTerminalPhase("complete");
      } else {
        setTerminalPhase("error");
      }
    } catch (error) {
      setTerminalPhase("error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="main-page-wrapper" style={{ width: '100%', position: 'relative', fontFamily: 'system-ui, sans-serif' }}>
      
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
        <Orb hoverIntensity={0.3} rotateOnHover={true} hue={25} /> 
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
          padding: 14px; 
          box-sizing: border-box;
          height: 100%;
        }

        .upload-zone {
          border: 2px dashed rgba(249, 115, 22, 0.3);
          background: rgba(255, 255, 255, 0.02);
          border-radius: 16px;
          padding: 32px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          position: relative;
          overflow: hidden;
        }
        .upload-zone:hover {
          border-color: #f97316;
          background: rgba(249, 115, 22, 0.05);
          transform: translateY(-2px);
        }

        .pro-tip-box {
          background: rgba(249, 115, 22, 0.05);
          border: 1px solid rgba(249, 115, 22, 0.2);
          border-radius: 16px;
          padding: 14px 20px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .terminal-scroll::-webkit-scrollbar { width: 4px; }
        .terminal-scroll::-webkit-scrollbar-track { background: transparent; }
        .terminal-scroll::-webkit-scrollbar-thumb { background: rgba(249,115,22,0.3); border-radius: 10px; }

        .checkerboard-bg {
          background-color: #1a1a1a;
          background-image: linear-gradient(45deg, #2a2a2a 25%, transparent 25%, transparent 75%, #2a2a2a 75%, #2a2a2a), 
                            linear-gradient(45deg, #2a2a2a 25%, transparent 25%, transparent 75%, #2a2a2a 75%, #2a2a2a);
          background-size: 20px 20px;
          background-position: 0 0, 10px 10px;
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
            height: 480px;
            flex-shrink: 0;
            margin-top: 10px;
          }
        }
      `}</style>

      <div className="generator-container">
        <div className="left-panel">
          <div style={{ position: 'relative', borderRadius: '24px', height: '100%' }}>
            <CardSpotlight color="rgba(249, 115, 22, 0.15)" glowColor="#f97316" className="h-full w-full">
              <div className="card-content">
                <div>
                  <h1 style={{ fontSize: "32px", fontWeight: "900", textAlign: "center", marginTop: "0px", marginBottom: "8px" }}>
                    <AuroraText>AI Background Remover</AuroraText>
                  </h1>
                  <p style={{ color: "#a1a1aa", fontSize: "14px", textAlign: "center", margin: 0 }}>Instantly remove the background from any image with a single click.</p>
                </div>

                {/* 1. CHNAGE HERE: added 'flex: 1' to fill vertical space */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px", flex: 1 ,minHeight: 0}}>
                  <label style={{ color: "#e5e7eb", fontSize: "15px", fontWeight: "600" }}>Upload Image</label>
                  
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    style={{ display: "none" }} 
                    onChange={handleFileChange} 
                  />

                  {/* 2. CHANGE HERE: added inline style 'flex: 1' and 'height: "100%"' to stretch the dashed border */}
                  <div className="upload-zone" style={{ flex: 1, height: "100%", minHeight: 0 }} onClick={() => fileInputRef.current.click()}>
                    {previewUrl ? (
                      // 3. CHANGE HERE: Changed height from 220px to 100% so preview uses full stretched area
                      <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", padding: "10px", minHeight: 0 }}>
                        <img src={previewUrl} alt="Preview" style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", borderRadius: "8px" }} />
                      </div>
                    ) : (
                      <>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(249, 115, 22, 0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <div>
                          <p style={{ color: "#e5e7eb", fontSize: "14px", fontWeight: "500", margin: "0 0 4px 0" }}>Click to upload or drag & drop</p>
                          <p style={{ color: "#71717a", fontSize: "12px", margin: 0 }}>PNG, JPG, WEBP, etc.</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                
                <div 
                  style={{ marginTop: "auto", paddingTop: "10px", opacity: (!selectedFile || isProcessing) ? 0.5 : 1, cursor: (!selectedFile || isProcessing) ? "not-allowed" : "pointer" }}
                  onClick={(!selectedFile || isProcessing) ? undefined : handleRemoveBackground}
                >
                  <AnimatedShinyButton className="w-full" style={{ padding: "16px", fontSize: "16px", fontWeight: "bold", background: "linear-gradient(135deg, #ff4500 0%, #f97316 100%)", border: "none" }}>
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                      {isProcessing ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          Processing Canvas...
                        </>
                      ) : (
                        <>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m20 20-6.444-6.444a5.5 5.5 0 1 0-7.778-7.778 5.5 5.5 0 0 0 7.778 7.778L20 20Z"/>
                          </svg>
                          Remove Background
                        </>
                      )}
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
              <TerminalLine delay={0} color="#a1a1aa">&gt; SYSTEM ONLINE. AWAITING IMAGE INPUT_</TerminalLine>
            )}

            {terminalPhase === "selected" && (
              <>
                <TerminalLine delay={0} color="#06b6d4"><span>ℹ</span> <span>Input buffer loaded: {selectedFile?.name}</span></TerminalLine>
                <TerminalLine delay={0.2} color="#a1a1aa">&gt; Ready for extraction sequence.</TerminalLine>
              </>
            )}

            {terminalPhase === "processing" && (
              <>
                <TerminalLine delay={0} color="#a1a1aa" isTyping={true}>&gt; quickai init --module "BiRefNet_Matting"</TerminalLine>
                <TerminalLine delay={1.5} color="#22c55e"><span>✔</span> <span>Highly optimized vision segmentation models locked.</span></TerminalLine>
                <TerminalLine delay={2.2} color="#a1a1aa" isTyping={true}>&gt; quickai process --isolate-bg --src "{selectedFile?.name}"</TerminalLine>
                <TerminalLine delay={3.8} color="#eab308"><span>⟳</span> <span>Running contrast & pixel-frequency mapping...</span></TerminalLine>
                <TerminalLine delay={4.5} color="#06b6d4"><span>⟳</span> <span>Executing salient object detection topology...</span></TerminalLine>
                <TerminalLine delay={5.2} color="#06b6d4"><span>⟳</span> <span>Extracting trimap alpha-channel values...</span></TerminalLine>
                <TerminalLine delay={6.0} color="#a1a1aa"><span>ℹ</span> <span>Awaiting final tensor output from secure cloud cluster...</span></TerminalLine>
              </>
            )}

            {terminalPhase === "complete" && resultImage && (
              <>
                <TerminalLine delay={0} color="#22c55e"><span>✔</span> <span>Background pixels successfully separated and nullified.</span></TerminalLine>
                <div style={{ marginTop: "12px", padding: "12px", backgroundColor: "rgba(249, 115, 22, 0.1)", borderLeft: "3px solid #f97316", borderRadius: "4px" }}>
                  <TerminalLine delay={0.2} color="#f97316"><span>✂</span> <span>Matting Extraction Completed!</span></TerminalLine>
                  <TerminalLine delay={0.4} color="#e5e7eb">Output Mode: RGBA Transparent</TerminalLine>
                  <TerminalLine delay={0.6} color="#e5e7eb">Edge Defringe: Applied (100%)</TerminalLine>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  transition={{ delay: 1.2, duration: 0.5 }}
                  style={{ marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}
                >
                  <div className="checkerboard-bg" style={{ width: "100%", height: "250px", borderRadius: "12px", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <img src={resultImage} alt="Extracted Object" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                  </div>
                  <a 
                    href={resultImage} 
                    download="quickai-removed-bg.png" 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ textDecoration: "none", color: "black", backgroundColor: "white", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download Transparent PNG
                  </a>
                </motion.div>
              </>
            )}

            {terminalPhase === "error" && (
              <>
                <TerminalLine delay={0} color="#ef4444"><span>✖</span> <span>FATAL ERROR INTERCEPTED</span></TerminalLine>
                <TerminalLine delay={0.2} color="#ef4444">Failed to process alpha channel mapping. Target server rejected payload.</TerminalLine>
              </>
            )}
          </TerminalWindow>
        </div>
      </div>
    </main>
  );
}