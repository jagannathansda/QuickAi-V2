"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useClerk, UserButton, useUser } from '@clerk/nextjs';
import { CardSpotlight } from './ui/card-spotlight';
import { InteractiveHoverButton } from './ui/interactive-hover-button';
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const { user } = useUser();
    const { openSignIn } = useClerk();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const pathname = usePathname();
    
    const [hoverStyle, setHoverStyle] = useState({ opacity: 0, left: 0, width: 0 });
    const navRef = useRef(null);

    const isToolPage = pathname !== '/';
    
    const navItems = isToolPage ? [
        { name: "Home", link: "/" },
        { name: "Tools", link: "/#features" },
        { name: "Dashboard", link: "/dashboard" },
        { name: "Community", link: "/community" },
    ] : [
        { name: "Home", link: "/" },
        { name: "Tools", link: "/#features" },
        { name: "Subscriptions", link: "/#pricing" },
        { name: "About", link: "/#footer" },
    ];

    const handleMouseEnter = (e) => {
        if (!navRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const parentRect = navRef.current.getBoundingClientRect();
        
        setHoverStyle({
          opacity: 1,
          left: rect.left - parentRect.left,
          width: rect.width,
        });
    };

    const handleMouseLeave = () => {
        setHoverStyle((prev) => ({ ...prev, opacity: 0 }));
    };

    return (
        <>
        <style>{`
            .desktop-nav { display: flex; }
            .mobile-nav { display: none; }
            
            .nav-link {
                position: relative;
                text-decoration: none;
                color: #a1a1aa;
                font-family: Arial, sans-serif;
                font-size: 14px;
                font-weight: 700;
                padding: 8px 18px;
                border-radius: 50px;
                transition: color 0.2s ease;
                z-index: 1;
            }
            .nav-link:hover { color: #ffffff; }

            .blue-glass-nav {
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                transition: border-color 0.3s ease, box-shadow 0.3s ease !important;
            }
            .blue-glass-nav:hover {
                border-color: rgba(59, 130, 246, 0.6) !important;
                box-shadow: 0 0 15px rgba(59, 130, 246, 0.3) !important;
            }
            
            @media (max-width: 768px) {
                .desktop-nav { display: none !important; }
                .mobile-nav { display: flex !important; }
            }
        `}</style>

        <div style={{
            position: 'fixed',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '95%',
            maxWidth: '1200px',
            height: '54px',
            zIndex: 50
        }}>
            <CardSpotlight 
                color="rgba(59, 130, 246, 0.25)"
                className="blue-glass-nav"
                style={{ 
                    width: '100%', 
                    height: '100%', 
                    padding: 0, 
                    borderRadius: '40px', 
                    background: 'rgba(20, 20, 20, 0.175)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    overflow: 'hidden'
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: '100%', padding: '0 20px', position: 'relative', zIndex: 10, boxSizing: 'border-box' }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', width: '130px', flexShrink: 0 }}>
                        <Link href="/">
                            <Image src="/assets/logo.svg" alt="QuickAI logo" width={120} height={28} priority />
                        </Link>
                    </div>

                    <div 
                        ref={navRef}
                        className="desktop-nav" 
                        onMouseLeave={handleMouseLeave}
                        style={{ position: 'relative', flexDirection: 'row', alignItems: 'center', gap: '4px' }}
                    >
                        <div style={{ position: 'absolute', top: 0, bottom: 0, left: hoverStyle.left, width: hoverStyle.width, opacity: hoverStyle.opacity, backgroundColor: 'rgba(255, 255, 255, 0.12)', borderRadius: '50px', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 0 }} />

                        {navItems.map((item, idx) => (
                            <Link key={idx} href={item.link} className="nav-link" onMouseEnter={handleMouseEnter}>
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '130px', flexShrink: 0 }}>
                        <div className="desktop-nav" style={{ alignItems: 'center', width: '100%', justifyContent: 'flex-end' }}>
                            {user ? (
                                <UserButton afterSignOutUrl="/" />
                            ) : (
                                <InteractiveHoverButton onClick={openSignIn}>Sign in</InteractiveHoverButton>
                            )}
                        </div>

                        <div className="mobile-nav" style={{ alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>

                </div>
            </CardSpotlight>
            
            {isMobileMenuOpen && (
                <div style={{ position: 'absolute', top: '70px', left: 0, right: 0, backgroundColor: 'rgba(20, 20, 20, 0.8)', backdropFilter: 'blur(16px)', borderRadius: '20px', padding: '16px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                    {navItems.map((item, idx) => (
                        <Link key={idx} href={item.link} style={{ display: 'block', padding: '12px 16px', color: 'white', textDecoration: 'none', fontWeight: 600, borderBottom: idx !== navItems.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                            {item.name}
                        </Link>
                    ))}
                    <div style={{ marginTop: '16px', padding: '0 16px', display: 'flex', justifyContent: 'center' }}>
                        {user ? (
                            <UserButton afterSignOutUrl="/" />
                        ) : (
                            <InteractiveHoverButton onClick={openSignIn}>Sign in</InteractiveHoverButton>
                        )}
                    </div>
                </div>
            )}
        </div>
        </>
    );
}

export default Navbar;