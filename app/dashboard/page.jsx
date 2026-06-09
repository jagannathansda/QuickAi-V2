"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuroraText } from "../components/ui/aurora-text";
import { CardSpotlight } from "../components/ui/card-spotlight";
import Orb from "../components/background/orb";
import { 
  FileText, Image as ImageIcon, Heading, Clock, Activity, 
  MoreVertical, Download, Trash2, ArrowRight, Sparkles, Loader2 
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null); 
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { getToken } = useAuth();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    const fetchDashboardData = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/get-dashboard-data`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setDashboardData(response.data.dashboardData);
        }
      } catch (error) {
        console.error("Data fetch fail ho gaya:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [getToken]);

  const getIconForType = (type) => {
    switch(type) {
      case 'article': return <FileText size={18} color="#06b6d4" style={{ flexShrink: 0 }} />;
      case 'image': return <ImageIcon size={18} color="#10b981" style={{ flexShrink: 0 }} />;
      case 'blog-title': return <Heading size={18} color="#d946ef" style={{ flexShrink: 0 }} />;
      case 'resume-review': return <FileText size={18} color="#0ea5e9" style={{ flexShrink: 0 }} />;
      default: return <Sparkles size={18} color="#a1a1aa" style={{ flexShrink: 0 }} />;
    }
  };

  const getCreditPercentage = () => {
    if (!dashboardData) return 0;
    if (dashboardData.stats.plan === 'premium') return 100;
    return (dashboardData.stats.creditUsage / 10) * 100;
  };

  const renderExpandedContent = (content) => {
    if (!content) return "No content generated.";
    try {
      if (typeof content === 'string' && (content.startsWith('[') || content.startsWith('{'))) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          return parsed.map((item, idx) => (
            <div key={idx} style={{ padding: '6px 10px', background: 'rgba(6, 182, 212, 0.05)', border: '1px solid rgba(6, 182, 212, 0.1)', borderRadius: '8px', marginBottom: '6px', color: '#22d3ee', fontSize: '13px' }}>
              {item}
            </div>
          ));
        }
      }
    } catch (e) {}
    return <div style={{ color: '#d4d4d8', fontSize: '13px', lineHeight: '1.6' }}>{content}</div>;
  };

  const quickActionsList = [
    { title: "Draft new Article", desc: "AI optimized content", path: "/article-writer", icon: <FileText size={18} color="#06b6d4" style={{ flexShrink: 0 }} />, bg: "rgba(6, 182, 212, 0.1)" },
    { title: "Generate Image", desc: "High-res visuals", path: "/image-generator", icon: <ImageIcon size={18} color="#10b981" style={{ flexShrink: 0 }} />, bg: "rgba(16, 185, 129, 0.1)" },
    { title: "Blog Title Generator", desc: "Catchy & High CTR titles", path: "/title-generator", icon: <Heading size={18} color="#d946ef" style={{ flexShrink: 0 }} />, bg: "rgba(217, 70, 239, 0.1)" },
    { title: "Background Remover", desc: "Instant cutouts", path: "/bg-removal", icon: <ImageIcon size={18} color="#f59e0b" style={{ flexShrink: 0 }} />, bg: "rgba(245, 158, 11, 0.1)" },
    { title: "Resume Reviewer", desc: "ATS friendly analysis", path: "/resume-reviewer", icon: <FileText size={18} color="#0ea5e9" style={{ flexShrink: 0 }} />, bg: "rgba(14, 165, 233, 0.1)" },
    { title: "Object Remover", desc: "Clean up unwanted objects", path: "/object-removal", icon: <Sparkles size={18} color="#a855f7" style={{ flexShrink: 0 }} />, bg: "rgba(168, 85, 247, 0.1)" },
  ];

  if (isLoading) {
    return (
      <main className="main-container" style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#000' }}>
        <Loader2 className="animate-spin" color="#06b6d4" size={40} />
      </main>
    );
  }

  return (
    <main className="main-container" style={{ position: 'relative', width: '100%', height: '100vh', fontFamily: '"Inter", "Poppins", system-ui, sans-serif', overflow: 'hidden' }}>
      
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, pointerEvents: 'none' }}>
        <Orb hoverIntensity={0.2} rotateOnHover={true} />
      </div>

      <style>{`
        html, body { margin: 0 !important; padding: 0 !important; height: 100% !important; overflow: hidden !important; box-sizing: border-box; }
        * { box-sizing: border-box; }
        .main-container { height: 100vh; max-height: 100vh; overflow: hidden !important; display: flex; flex-direction: column; }
        .dashboard-wrapper { width: 100%; max-width: 1200px; margin: 0 auto; padding: 85px 20px 20px; display: flex; flex-direction: column; flex: 1; min-height: 0; gap: 16px; }
        .dashboard-grid { display: grid; grid-template-columns: 3.5fr 6.5fr; gap: 20px; flex: 1; min-height: 0; }
        .left-col, .right-col { display: flex; flex-direction: column; min-height: 0; gap: 16px; }
        
        .glass-panel {
          background-color: rgba(15, 15, 15, 0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          display: flex;
          flex-direction: column;
        }

        .history-list { flex: 1; overflow-y: auto; overflow-x: hidden; display: flex; flex-direction: column; gap: 8px; padding-right: 4px; }
        .history-row-container { display: flex; flex-direction: column; gap: 4px; }
        .history-row { display: grid; grid-template-columns: auto 1fr auto auto; align-items: center; gap: 12px; padding: 12px; border-radius: 12px; border: 1px solid transparent; transition: all 0.2s ease; cursor: pointer; }
        .history-row:hover { background: rgba(255, 255, 255, 0.03); border-color: rgba(255, 255, 255, 0.1); transform: translateX(4px); }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; flex-shrink: 0; }
        
        /* Desktop Grid */
        .quick-actions-grid { 
          display: grid; 
          grid-template-columns: repeat(2, 1fr); 
          grid-template-rows: repeat(3, 1fr); 
          gap: 10px; 
          flex: 1; 
          min-height: 0; 
        }

        .history-list::-webkit-scrollbar, .expanded-content-scroll::-webkit-scrollbar { width: 4px; }
        .history-list::-webkit-scrollbar-track, .expanded-content-scroll::-webkit-scrollbar-track { background: transparent; }
        .history-list::-webkit-scrollbar-thumb, .expanded-content-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

        /* --- Sirf ye media queries wala hissa replace karein --- */
@media (max-width: 1024px) {
  html, body { overflow: auto !important; height: auto !important; }
  .main-container { height: auto; min-height: 100vh; overflow: auto !important; }
  .dashboard-wrapper { height: auto; overflow: visible; padding: 100px 16px 24px; }
  
  /* 1. Grid ko Flex me badla taaki overlapping bilkul khatam ho jaye */
  .dashboard-grid { 
    display: flex !important; 
    flex-direction: column !important; 
    gap: 24px !important; 
    height: auto !important;
    flex: none !important;
  }
  
  /* 2. Dono columns ki height and flex constraints reset ki */
  .left-col, .right-col { 
    height: auto !important; 
    flex: none !important; 
    overflow: visible !important;
  }
  
  /* Recent Activity ki height mobile pe fixed rakhi taaki scroll sahi chale */
  .left-col .glass-panel { 
    height: 450px !important; 
  }
  
  /* Stats Grid ko ek ke neeche ek kiya */
  .stats-grid { 
    grid-template-columns: 1fr !important; 
    gap: 12px !important;
  }
  
  /* Quick Actions Wrapper Fix */
  .right-col .glass-panel { 
    height: auto !important; 
    flex: none !important; 
  }
  
  /* Quick Actions Cards Grid */
  .quick-actions-grid { 
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important; 
    grid-template-rows: auto !important; 
    gap: 12px !important;
  }
  
  .quick-actions-grid a {
    height: auto !important;
    min-height: 68px !important;
  }
}

@media (max-width: 640px) {
  /* Chote mobiles par quick actions single column me dikhega */
  .quick-actions-grid { 
    grid-template-columns: 1fr !important; 
    grid-template-rows: auto !important; 
  }
}
      `}</style>

      <div className="dashboard-wrapper">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexShrink: 0 }}>
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{ fontSize: "32px", fontWeight: "900", margin: "0 0 4px 0", letterSpacing: "-0.02em", color: "white" }}
            >
              Welcome back, <AuroraText>Creator</AuroraText>
            </motion.h1>
            <p style={{ color: "#a1a1aa", margin: 0, fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#22c55e", boxShadow: "0 0 10px #22c55e" }}></span>
              System pulse is optimal. Ready to generate.
            </p>
          </div>
          
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '50px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: '0.3s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
            <Sparkles size={16} style={{ flexShrink: 0 }} /> New Generation
          </button>
        </div>

        <div className="dashboard-grid">
          
          <div className="left-col">
            <CardSpotlight color="rgba(6, 182, 212, 0.15)" glowColor="#06b6d4" className="glass-panel" style={{ height: '100%' }}>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexShrink: 0 }}>
                  <h2 style={{ color: 'white', margin: 0, fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={18} color="#06b6d4" style={{ flexShrink: 0 }} /> Recent Activity
                  </h2>
                  <span style={{ fontSize: '12px', color: '#06b6d4', cursor: 'pointer', fontWeight: '600' }}>View All</span>
                </div>

                <div className="history-list">
                  {dashboardData?.creations && dashboardData.creations.length > 0 ? (
                    dashboardData.creations.map((item) => {
                      const isExpanded = expandedRow === item.id;
                      return (
                        <div key={item.id} className="history-row-container">
                          <div 
                            className="history-row" 
                            onClick={() => setExpandedRow(isExpanded ? null : item.id)}
                            onMouseEnter={() => setHoveredRow(item.id)} 
                            onMouseLeave={() => setHoveredRow(null)}
                            style={{ background: isExpanded ? 'rgba(255, 255, 255, 0.04)' : 'transparent', borderColor: isExpanded ? 'rgba(255, 255, 255, 0.1)' : 'transparent' }}
                          >
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              {getIconForType(item.type)}
                            </div>
                            <div style={{ overflow: 'hidden', minWidth: 0 }}>
                              <h3 style={{ color: 'white', fontSize: '14px', fontWeight: '600', margin: '0 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.prompt || "Untitled Generation"}
                              </h3>
                              <p style={{ color: '#71717a', fontSize: '11px', margin: 0, textTransform: 'capitalize' }}>
                                {item.type} • {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                              </p>
                            </div>
                            <div style={{ display: 'flex', gap: '6px', opacity: hoveredRow === item.id ? 1 : 0, transition: 'opacity 0.2s', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                              <button style={{ background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer', padding: '4px' }}><Download size={14} /></button>
                              <button style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}><Trash2 size={14} /></button>
                            </div>
                            <MoreVertical size={14} color="#52525b" style={{ opacity: hoveredRow === item.id ? 0 : 1, transition: 'opacity 0.2s', flexShrink: 0 }} />
                          </div>

                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1, transition: { height: { duration: 0.25 }, opacity: { duration: 0.2 } } }}
                                exit={{ height: 0, opacity: 0, transition: { height: { duration: 0.2 }, opacity: { duration: 0.15 } } }}
                                style={{ overflow: 'hidden' }}
                              >
                                <div style={{ background: 'rgba(9, 9, 11, 0.5)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '14px', margin: '4px 0 8px 0' }}>
                                  <p style={{ color: '#71717a', fontSize: '11px', fontWeight: '600', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Generated Output:</p>
                                  <div className="expanded-content-scroll" style={{ maxHeight: '180px', overflowY: 'auto', wordBreak: 'break-word', whiteSpace: 'pre-wrap', paddingRight: '4px' }}>
                                    {renderExpandedContent(item.content)}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })
                  ) : (
                    <div style={{ color: '#71717a', textAlign: 'center', marginTop: '40px', fontSize: '14px' }}>
                      No history found. Start generating!
                    </div>
                  )}
                </div>
              </div>
            </CardSpotlight>
          </div>

          <div className="right-col">
            
            <div className="stats-grid">
              <CardSpotlight color="rgba(6, 182, 212, 0.15)" glowColor="#06b6d4" className="glass-panel" style={{ height: '100%' }}>
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', position: 'relative', zIndex: 10 }}>
                  <p style={{ color: '#a1a1aa', margin: '0 0 6px 0', fontSize: '13px', fontWeight: '500' }}>Total Generations</p>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                    <h3 style={{ color: 'white', margin: 0, fontSize: '28px', fontWeight: '800' }}>
                      {dashboardData?.stats.totalGenerations || 0}
                    </h3>
                  </div>
                </div>
              </CardSpotlight>

              <CardSpotlight color="rgba(217, 70, 239, 0.15)" glowColor="#d946ef" className="glass-panel" style={{ height: '100%' }}>
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', position: 'relative', zIndex: 10 }}>
                  <p style={{ color: '#a1a1aa', margin: '0 0 6px 0', fontSize: '13px', fontWeight: '500' }}>Words Written</p>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                    <h3 style={{ color: 'white', margin: 0, fontSize: '28px', fontWeight: '800' }}>
                      {dashboardData?.stats.wordsWritten >= 1000 ? `${(dashboardData?.stats.wordsWritten / 1000).toFixed(1)}K` : dashboardData?.stats.wordsWritten || 0}
                    </h3>
                  </div>
                </div>
              </CardSpotlight>

              <CardSpotlight color="rgba(16, 185, 129, 0.15)" glowColor="#10b981" className="glass-panel" style={{ height: '100%' }}>
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', position: 'relative', zIndex: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ color: '#a1a1aa', margin: '0 0 6px 0', fontSize: '13px', fontWeight: '500' }}>Credit Usage</p>
                      <h3 style={{ color: 'white', margin: 0, fontSize: '28px', fontWeight: '800' }}>
                        {dashboardData?.stats.plan === 'premium' ? 'Unlmtd' : `${dashboardData?.stats.creditUsage || 0}/10`}
                      </h3>
                    </div>
                    <Activity size={20} color="#10b981" opacity={0.8} style={{ flexShrink: 0 }} />
                  </div>
                  <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', marginTop: '12px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${getCreditPercentage()}%`, background: 'linear-gradient(90deg, #06b6d4, #10b981)', borderRadius: '10px' }} />
                  </div>
                </div>
              </CardSpotlight>
            </div>

            {/* Quick Actions Container */}
            <CardSpotlight color="rgba(6, 182, 212, 0.15)" glowColor="#06b6d4" className="glass-panel" style={{ flex: 1, minHeight: 0 }}>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', zIndex: 10, overflow: 'hidden' }}>
                
                <div style={{ position: 'absolute', right: '-40px', bottom: '-40px', opacity: 0.02, pointerEvents: 'none' }}>
                  <svg width="200" height="200" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="4 4" />
                  </svg>
                </div>

                <h2 style={{ color: 'white', margin: '0 0 14px 0', fontSize: '18px', fontWeight: '700', flexShrink: 0 }}>Quick Actions</h2>
                
                <div className="quick-actions-grid">
                  {quickActionsList.map((action, index) => (
                    <Link key={index} href={action.path} style={{ textDecoration: 'none', display: 'block', height: '100%', minHeight: 0 }}>
                      <div 
                        style={{ 
                          background: 'rgba(255,255,255,0.02)', 
                          border: '1px solid rgba(255,255,255,0.05)', 
                          borderRadius: '14px', 
                          padding: '10px 14px', 
                          cursor: 'pointer', 
                          transition: 'all 0.2s ease', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          height: '100%',
                          minHeight: 0
                        }} 
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                        }} 
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                          <div style={{ background: action.bg, padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {action.icon}
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <h4 style={{ color: 'white', margin: '0 0 1px 0', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{action.title}</h4>
                            <p style={{ color: '#71717a', margin: 0, fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{action.desc}</p>
                          </div>
                        </div>
                        <ArrowRight size={14} color="#52525b" style={{ flexShrink: 0, marginLeft: '6px' }} />
                      </div>
                    </Link>
                  ))}
                </div>

              </div>
            </CardSpotlight>

          </div>
        </div>
      </div>
    </main>
  );
}