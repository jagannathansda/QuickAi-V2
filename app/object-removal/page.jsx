"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { AuroraText } from "../components/ui/aurora-text";
import { CardSpotlight } from "../components/ui/card-spotlight";
import { AnimatedShinyButton } from "../components/ui/shiny-button";
import Orb from "../components/background/orb";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { Loader2, Download } from "lucide-react";

const TerminalWindow = ({ children }) => (
  <div style={{ backgroundColor: "rgba(15, 15, 15, 0.6)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.5)", fontFamily: "monospace", color: "#e5e7eb", fontSize: "14px", width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
    <div style={{ display: "flex", alignItems: "center", padding: "14px 16px", backgroundColor: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ display: "flex", gap: "8px" }}>
        <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ef4444" }} />
        <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#eab308" }} />
        <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#22c55e" }} />
      </div>
      <div style={{ marginLeft: "16px", color: "#a855f7", fontSize: "12px", fontWeight: "600", letterSpacing: "0.5px" }}>quickai-inpainting-engine</div>
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

export default function ObjectRemoverPage() {
  const [objectName, setObjectName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [terminalPhase, setTerminalPhase] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
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

  const handleRemoveObject = async () => {
    if (!selectedFile || !objectName.trim()) return;

    setIsProcessing(true);
    setTerminalPhase("processing");
    setResultImage(null);

    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("object", objectName);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/ai/remove-image-object`,
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
        setErrorMessage(response.data.message);
        setTerminalPhase("error");
      }
    } catch (error) {
      setErrorMessage("Connection to Inpainting Engine failed.");
      setTerminalPhase("error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="main-page-wrapper" style={{ width: '100%', position: 'relative', fontFamily: 'system-ui, sans-serif' }}>
      
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
        <Orb hoverIntensity={0.3} rotateOnHover={true} hue={280} /> 
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
          border: 2px dashed rgba(168, 85, 247, 0.4);
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
          min-height: 140px;
          overflow: hidden;
        }
        .upload-zone:hover {
          border-color: #a855f7;
          background: rgba(168, 85, 247, 0.05);
          transform: translateY(-2px);
        }

        .custom-input {
          background-color: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 16px;
          color: white;
          width: 100%;
          box-sizing: border-box;
          outline: none;
          font-size: 15px;
          transition: border-color 0.3s ease;
        }
        .custom-input:focus {
          border-color: #a855f7;
        }

        .custom-terminal-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-terminal-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-terminal-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 999px; }
        .custom-terminal-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.25); }

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
            <CardSpotlight color="rgba(168, 85, 247, 0.15)" glowColor="#a855f7" className="h-full w-full">
              <div className="card-content">
                <div>
                  <h1 style={{ fontSize: "32px", fontWeight: "900", textAlign: "center", marginTop: "0px", marginBottom: "8px" }}>
                    <AuroraText>AI Object Remover</AuroraText>
                  </h1>
                  <p style={{ color: "#a1a1aa", fontSize: "14px", textAlign: "center", margin: 0 }}>Erase any unwanted object from your photos.</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px", flex: 1, minHeight: 0 }}>
                  <label style={{ color: "#e5e7eb", fontSize: "15px", fontWeight: "600" }}>Upload Image</label>
                  
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    style={{ display: "none" }} 
                    onChange={handleFileChange} 
                  />

                  <div className="upload-zone" style={{ flex: 1 }} onClick={() => fileInputRef.current.click()}>
                    {previewUrl ? (
                      <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <img src={previewUrl} alt="Preview" style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", borderRadius: "8px" }} />
                      </div>
                    ) : (
                      <>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(168, 85, 247, 0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                          <circle cx="9" cy="9" r="2" />
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                          <path d="M12 12v6" />
                          <path d="m9 15 3-3 3 3" />
                        </svg>
                        <div>
                          <p style={{ color: "#e5e7eb", fontSize: "14px", fontWeight: "500", margin: "0" }}>Click to upload</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
                  <label style={{ color: "#e5e7eb", fontSize: "15px", fontWeight: "600" }}>Object to Remove</label>
                  <input 
                    type="text" 
                    value={objectName}
                    onChange={(e) => setObjectName(e.target.value)}
                    placeholder="e.g., car, person, bottle" 
                    className="custom-input"
                  />
                </div>

                <div 
                  style={{ marginTop: "auto", paddingTop: "10px", opacity: (!selectedFile || !objectName.trim() || isProcessing) ? 0.5 : 1, cursor: (!selectedFile || !objectName.trim() || isProcessing) ? "not-allowed" : "pointer" }}
                  onClick={(!selectedFile || !objectName.trim() || isProcessing) ? undefined : handleRemoveObject}
                >
                  <AnimatedShinyButton className="w-full" style={{ padding: "16px", fontSize: "16px", fontWeight: "bold", background: "linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)", border: "none" }}>
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                      {isProcessing ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          Reconstructing Canvas...
                        </>
                      ) : (
                        <>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="6" cy="6" r="3"/>
                            <circle cx="6" cy="18" r="3"/>
                            <line x1="20" y1="4" x2="8.12" y2="15.88"/>
                            <line x1="14.47" y1="14.48" x2="20" y2="20"/>
                            <line x1="8.12" y1="8.12" x2="12" y2="12"/>
                          </svg>
                          Remove Object
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
                <TerminalLine delay={0} color="#a855f7"><span>ℹ</span> <span>Input buffer loaded: {selectedFile?.name}</span></TerminalLine>
                <TerminalLine delay={0.2} color="#a1a1aa">&gt; Specify object target and initialize sequence.</TerminalLine>
              </>
            )}

            {terminalPhase === "processing" && (
              <>
                <TerminalLine delay={0} color="#a1a1aa" isTyping={true}>&gt; quickai init --module "LaMa_Inpainting_v2"</TerminalLine>
                <TerminalLine delay={1.5} color="#22c55e"><span>✔</span> <span>Context-aware inpainting module loaded.</span></TerminalLine>
                <TerminalLine delay={2.2} color="#a1a1aa" isTyping={true}>&gt; quickai process --erase "{objectName}" --fill "seamless"</TerminalLine>
                <TerminalLine delay={3.8} color="#eab308"><span>⟳</span> <span>Generating segmentation mask for target area...</span></TerminalLine>
                <TerminalLine delay={4.5} color="#06b6d4"><span>⟳</span> <span>Applying Fast Fourier Convolutions (FFC)...</span></TerminalLine>
                <TerminalLine delay={5.2} color="#06b6d4"><span>⟳</span> <span>Synthesizing background textures & lighting...</span></TerminalLine>
                <TerminalLine delay={6.0} color="#a1a1aa"><span>ℹ</span> <span>Awaiting tensor response from cloud compute cluster...</span></TerminalLine>
              </>
            )}

            {terminalPhase === "complete" && resultImage && (
              <>
                <TerminalLine delay={0} color="#22c55e"><span>✔</span> <span>Unwanted pixels successfully erased.</span></TerminalLine>
                
                <div style={{ marginTop: "12px", padding: "12px", backgroundColor: "rgba(168, 85, 247, 0.1)", borderLeft: "3px solid #a855f7", borderRadius: "4px" }}>
                  <TerminalLine delay={0.2} color="#a855f7"><span>✨</span> <span>Image Reconstruction Complete!</span></TerminalLine>
                  <TerminalLine delay={0.4} color="#e5e7eb">Masking Accuracy: 98.4%</TerminalLine>
                  <TerminalLine delay={0.6} color="#e5e7eb">Blending Mode: Seamless Clone</TerminalLine>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  transition={{ delay: 1.0, duration: 0.5 }}
                  style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}
                >
                  <div style={{ width: "100%", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", backgroundColor: "#111" }}>
                    <img src={resultImage} alt="Reconstructed Art" style={{ maxWidth: "100%", height: "auto", display: "block" }} />
                  </div>
                  
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <a 
                      href={resultImage} 
                      download={`quickai-removed-${objectName.replace(/\s+/g, '-')}.jpg`} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ textDecoration: "none", color: "black", backgroundColor: "white", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: "6px" }}
                    >
                      <Download size={14} />
                      Download Clean Image
                    </a>
                  </div>
                </motion.div>
                
                <div style={{ marginTop: "16px" }}>
                  <TerminalLine delay={1.5} color="#a1a1aa" isTyping={true}>&gt; Awaiting next image for modification...</TerminalLine>
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