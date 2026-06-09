"use client";
import React, { useState, useRef } from "react";
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
      <div style={{ marginLeft: "16px", color: "#06b6d4", fontSize: "12px", fontWeight: "600", letterSpacing: "0.5px" }}>quickai-nlp-engine</div>
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

const WordByWordText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");

  React.useEffect(() => {
    let i = 0;
    setDisplayedText("");
    
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i += 4; 
      if (i > text.length + 4) {
        clearInterval(interval);
        setDisplayedText(text);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <div style={{ color: "#e5e7eb", whiteSpace: "pre-wrap", lineHeight: "1.6", marginTop: "10px" }}>
      {displayedText}
    </div>
  );
};

export default function ResumeReviewPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [terminalPhase, setTerminalPhase] = useState("idle");
  const [reviewResult, setReviewResult] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);
  const { getToken } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setFileName(file.name);
      setTerminalPhase("selected");
      setReviewResult("");
    }
  };

  const handleReviewResume = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setTerminalPhase("processing");
    setReviewResult("");

    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("resume", selectedFile);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/ai/resume-review`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (response.data.success) {
        setReviewResult(response.data.content);
        setTerminalPhase("complete");
      } else {
        setErrorMessage(response.data.message);
        setTerminalPhase("error");
      }
    } catch (error) {
      setErrorMessage("Connection to NLP Engine failed.");
      setTerminalPhase("error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="main-page-wrapper" style={{ width: '100%', position: 'relative', fontFamily: 'system-ui, sans-serif' }}>
      
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
        <Orb hoverIntensity={0.3} rotateOnHover={true} hue={190} /> 
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
          border: 2px dashed rgba(6, 182, 212, 0.4);
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
          flex-grow: 1;
          min-height: 150px;
        }
        .upload-zone:hover {
          border-color: #06b6d4;
          background: rgba(6, 182, 212, 0.05);
          transform: translateY(-2px);
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
            height: 520px;
            flex-shrink: 0;
          }
          
          .card-content {
            height: 100%;
            padding: 14px; 
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
            <CardSpotlight color="rgba(6, 182, 212, 0.15)" glowColor="#06b6d4" className="h-full w-full">
              <div className="card-content">
                <div>
                  <h1 style={{ fontSize: "32px", fontWeight: "900", textAlign: "center", marginTop: "0px", marginBottom: "8px" }}>
                    <AuroraText>AI Resume Review</AuroraText>
                  </h1>
                  <p style={{ color: "#a1a1aa", fontSize: "14px", textAlign: "center", margin: 0 }}>Get instant feedback to improve your resume and land your dream job.</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", flexGrow: 1, minHeight: 0 }}>
                  <label style={{ color: "#e5e7eb", fontSize: "15px", fontWeight: "600" }}>Upload Your Resume</label>
                  
                  <input 
                    type="file" 
                    accept="application/pdf" 
                    ref={fileInputRef} 
                    style={{ display: "none" }} 
                    onChange={handleFileChange} 
                  />

                  <div className="upload-zone" onClick={() => fileInputRef.current.click()}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(6, 182, 212, 0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                      {fileName ? (
                        <>
                          <path d="M9 16.2L12 19l3-3" />
                          <line x1="12" y1="12" x2="12" y2="19" />
                        </>
                      ) : (
                        <>
                          <line x1="12" y1="18" x2="12" y2="12" />
                          <polyline points="9 15 12 12 15 15" />
                        </>
                      )}
                    </svg>
                    <div>
                      <p style={{ color: "#e5e7eb", fontSize: "14px", fontWeight: "500", margin: "0 0 4px 0" }}>
                        {fileName ? fileName : "Click to upload or drag & drop"}
                      </p>
                      <p style={{ color: "#71717a", fontSize: "12px", margin: 0 }}>PDF only</p>
                    </div>
                  </div>
                </div>

                <div 
                  style={{ marginTop: "auto", opacity: (!selectedFile || isProcessing) ? 0.5 : 1, cursor: (!selectedFile || isProcessing) ? "not-allowed" : "pointer" }}
                  onClick={(!selectedFile || isProcessing) ? undefined : handleReviewResume}
                >
                  <AnimatedShinyButton className="w-full" style={{ padding: "16px", fontSize: "16px", fontWeight: "bold", background: "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)", border: "none" }}>
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                      {isProcessing ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          Analyzing PDF...
                        </>
                      ) : (
                        <>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <line x1="10" y1="9" x2="8" y2="9" />
                          </svg>
                          Review Resume
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
              <TerminalLine delay={0} color="#a1a1aa">&gt; SYSTEM ONLINE. AWAITING PDF INPUT_</TerminalLine>
            )}

            {terminalPhase === "selected" && (
              <>
                <TerminalLine delay={0} color="#06b6d4"><span>ℹ</span> <span>Input buffer loaded: {fileName}</span></TerminalLine>
                <TerminalLine delay={0.2} color="#a1a1aa">&gt; Ready for document parsing sequence.</TerminalLine>
              </>
            )}

            {terminalPhase === "processing" && (
              <>
                <TerminalLine delay={0} color="#a1a1aa" isTyping={true}>&gt; quickai init --module "NLP_Resume_Analyzer_v3"</TerminalLine>
                <TerminalLine delay={1.5} color="#22c55e"><span>✔</span> <span>ATS logic & NLP parsers loaded successfully.</span></TerminalLine>
                <TerminalLine delay={2.2} color="#a1a1aa" isTyping={true}>&gt; quickai analyze --file "{fileName}" --mode strict</TerminalLine>
                <TerminalLine delay={3.8} color="#eab308"><span>⟳</span> <span>Extracting textual content and formatting structure...</span></TerminalLine>
                <TerminalLine delay={4.5} color="#06b6d4"><span>⟳</span> <span>Mapping action verbs and measurable outcomes...</span></TerminalLine>
                <TerminalLine delay={5.2} color="#06b6d4"><span>⟳</span> <span>Running ATS keyword density checks...</span></TerminalLine>
                <TerminalLine delay={6.0} color="#a1a1aa"><span>ℹ</span> <span>Awaiting tensor response from cloud compute cluster...</span></TerminalLine>
              </>
            )}

            {terminalPhase === "complete" && (
              <>
                <TerminalLine delay={0} color="#22c55e"><span>✔</span> <span>Document parsed. Generating optimization matrix.</span></TerminalLine>
                <div style={{ marginTop: "12px", padding: "12px", backgroundColor: "rgba(6, 182, 212, 0.1)", borderLeft: "3px solid #06b6d4", borderRadius: "4px" }}>
                  <TerminalLine delay={0.2} color="#06b6d4"><span>📊</span> <span>Resume Analysis Output Stream:</span></TerminalLine>
                  <WordByWordText text={reviewResult} />
                </div>
                <div style={{ marginTop: "16px" }}>
                  <TerminalLine delay={0} color="#a1a1aa" isTyping={true}>&gt; Engine idle. Standing by for next generation...</TerminalLine>
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