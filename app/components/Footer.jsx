"use client";
import React from "react";
import { Sparkles } from "lucide-react";

const TwitterIcon = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const LinkedinIcon = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const GithubIcon = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 9 18v4"></path>
  </svg>
);

const Footer = () => {
  return (
    <footer id="footer" style={{ width: '100%', position: 'relative', overflow: 'hidden', fontFamily: '"Inter", "Poppins", system-ui, sans-serif', borderTop: '1px solid rgba(255, 255, 255, 0.05)', backgroundColor: 'transparent', paddingBottom: '0', marginTop: '40px' }}>
      
      <style>{`
        .f-container { max-width: 1200px; margin: 0 auto; padding: 80px 20px 0px 20px; display: flex; flex-direction: column; gap: 80px; }
        .f-top { display: grid; grid-template-columns: 1fr 1.5fr; gap: 60px; }
        @media (max-width: 850px) { .f-top { grid-template-columns: 1fr; } }
        
        .f-brand h2 { font-size: 32px; font-weight: 800; color: white; letter-spacing: -0.03em; margin-bottom: 16px; }
        .f-brand p { color: #a1a1aa; font-size: 16px; line-height: 1.6; max-width: 400px; margin-bottom: 32px; }
        
        .f-nav { display: flex; justify-content: flex-end; gap: 100px; }
        @media (max-width: 500px) { .f-nav { flex-direction: column; gap: 40px; justify-content: flex-start; } }
        
        .f-nav-col { display: flex; flex-direction: column; gap: 16px; }
        .f-nav-col h4 { color: white; font-size: 16px; font-weight: 600; margin-bottom: 8px; }
        
        .f-link { color: #a1a1aa; text-decoration: none; font-size: 15px; transition: color 0.2s ease; }
        .f-link:hover { color: white; }
        
        .f-bottom { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 32px; z-index: 10; position: relative; }
        
        .f-socials { display: flex; gap: 20px; }
        .f-social { color: #a1a1aa; transition: color 0.2s ease, transform 0.2s ease; cursor: pointer; }
        .f-social:hover { color: white; transform: translateY(-2px); }
        
        .f-giant-text { 
          font-size: clamp(4rem, 16vw, 18rem); 
          font-weight: 900; 
          line-height: 0.8; 
          letter-spacing: -0.04em; 
          text-align: center; 
          margin-top: 60px; 
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%); 
          -webkit-background-clip: text; 
          -webkit-text-fill-color: transparent; 
          user-select: none; 
          pointer-events: none; 
        }
      `}</style>
      
      <div className="f-container">
        <div className="f-top">
          
          <div className="f-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Sparkles size={28} color="#A855F7" />
              <h2>Quick.ai</h2>
            </div>
            <p>Transform your content creation workflow with cutting-edge AI tools designed for modern creators.</p>
            
            <form style={{ display: 'flex', gap: '8px', maxWidth: '360px' }} onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email address" 
                style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', backgroundColor: 'transparent', border: '1px solid rgba(255, 255, 255, 0.15)', color: 'white', fontSize: '14px', outline: 'none', transition: 'border 0.2s ease' }} 
                onFocus={(e) => e.target.style.border = '1px solid rgba(168, 85, 247, 0.6)'} 
                onBlur={(e) => e.target.style.border = '1px solid rgba(255, 255, 255, 0.15)'} 
              />
              <button 
                style={{ padding: '12px 24px', borderRadius: '8px', backgroundColor: 'white', color: 'black', fontSize: '14px', fontWeight: '600', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }} 
                onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'} 
                onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
              >
                Join
              </button>
            </form>
          </div>
          
          <div className="f-nav">
            <div className="f-nav-col">
              <h4>Product</h4>
              <a href="#" className="f-link">Features</a>
              <a href="#" className="f-link">Pricing</a>
              <a href="#" className="f-link">Testimonials</a>
              <a href="#" className="f-link">API Access</a>
            </div>
            <div className="f-nav-col">
              <h4>Company</h4>
              <a href="#" className="f-link">About Us</a>
              <a href="#" className="f-link">Blog</a>
              <a href="#" className="f-link">Privacy Policy</a>
              <a href="#" className="f-link">Terms of Service</a>
            </div>
          </div>

        </div>

        <div className="f-bottom">
          <span style={{ color: '#71717a', fontSize: '14px' }}>© 2026 Quick.ai. All rights reserved.</span>
          <div className="f-socials">
            <TwitterIcon size={18} className="f-social" />
            <LinkedinIcon size={18} className="f-social" />
            <GithubIcon size={18} className="f-social" />
          </div>
        </div>
      </div>
      
      <div className="f-giant-text">
        QUICK.AI
      </div>

    </footer>
  );
};

export default Footer;