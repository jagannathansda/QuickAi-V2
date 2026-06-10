"use client";

import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react'; 
import { useClerk, UserButton, useUser } from '@clerk/nextjs';
import { GlassSurface } from './ui/glass-surface';
import { InteractiveHoverButton } from './ui/interactive-hover-button';
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const { user } = useUser();
    const { openSignIn } = useClerk();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const pathname = usePathname();
    const isToolPage = pathname !== '/';
    
    // Instead of using State for hover styles, we'll manipulate the DOM directly.
    // This stops React from constantly re-rendering the whole Navbar component.
    const hoverBgRef = useRef(null);
    const navRef = useRef(null);
    
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

    const handleMouseEnter = useCallback((e) => {
        if (!navRef.current || !hoverBgRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const parentRect = navRef.current.getBoundingClientRect();
        
        hoverBgRef.current.style.opacity = '1';
        hoverBgRef.current.style.left = `${rect.left - parentRect.left}px`;
        hoverBgRef.current.style.width = `${rect.width}px`;
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (hoverBgRef.current) {
            hoverBgRef.current.style.opacity = '0';
        }
    }, []);

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
            <GlassSurface width="100%" height="100%" borderRadius={40} blur={11} distortionScale={-180} backgroundOpacity={0}>
                
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: '100%', padding: '0 18px' }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center' }}>
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
                        {/* DOM Manipulation Target */}
                        <div 
                            ref={hoverBgRef}
                            style={{ 
                                position: 'absolute', 
                                top: 0, 
                                bottom: 0, 
                                left: 0, 
                                width: 0, 
                                opacity: 0, 
                                backgroundColor: 'rgba(255, 255, 255, 0.12)', 
                                borderRadius: '50px', 
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                                zIndex: 0 
                            }} 
                        />

                        {navItems.map((item, idx) => (
                            <Link key={idx} href={item.link} className="nav-link" onMouseEnter={handleMouseEnter}>
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className="desktop-nav" style={{ alignItems: 'center' }}>
                        {user ? (
                            <UserButton afterSignOutUrl="/" />
                        ) : (
                            <InteractiveHoverButton onClick={openSignIn}>Sign in</InteractiveHoverButton>
                        )}
                    </div>

                    <div className="mobile-nav" style={{ alignItems: 'center' }}>
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                </div>
            </GlassSurface>
            
            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div style={{ position: 'absolute', top: '70px', left: 0, right: 0, backgroundColor: 'rgba(15, 15, 15, 0.95)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: '20px', padding: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {navItems.map((item, idx) => (
                        <Link key={idx} href={item.link} style={{ display: 'block', padding: '12px 16px', color: 'white', textDecoration: 'none', fontWeight: 600, borderBottom: idx !== navItems.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                            {item.name}
                        </Link>
                    ))}
                    <div style={{ marginTop: '16px', padding: '0 16px' }}>
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