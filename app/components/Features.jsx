"use client";
import React from "react";
import Link from "next/link";
import { ColourfulText } from "./ui/colourful-text";
import { CardSpotlight } from "./ui/card-spotlight";
import { PenTool, Heading, Image as ImageIcon, Eraser, Scissors, FileText } from "lucide-react";
import { motion } from "framer-motion";

const featuresData = [
  { icon: <PenTool color="white" />, color: "#06b6d4", spotlight: "rgba(6, 182, 212, 0.15)", title: "AI Article Writer", desc: "Generate high-quality, engaging, and SEO-optimized articles on any topic instantly with our advanced AI writing technology. Perfect for blogs, marketing, and research.", bentoClass: "bento-large", link: "/article-writer" },
  { icon: <Heading color="white" />, color: "#d946ef", spotlight: "rgba(217, 70, 239, 0.15)", title: "Blog Title Generator", desc: "Find the perfect, catchy title for your posts.", bentoClass: "bento-wide", link: "/title-generator" },
  { icon: <ImageIcon color="white" />, color: "#10b981", spotlight: "rgba(16, 185, 129, 0.15)", title: "AI Image Gen", desc: "Create stunning visuals.", bentoClass: "bento-square", link: "/image-generator" },
  { icon: <Eraser color="white" />, color: "#f97316", spotlight: "rgba(249, 115, 22, 0.15)", title: "BG Removal", desc: "Effortlessly remove backgrounds from your images with pixel-perfect AI precision in seconds.", bentoClass: "bento-tall", link: "/bg-removal" },
  { icon: <Scissors color="white" />, color: "#3b82f6", spotlight: "rgba(59, 130, 246, 0.15)", title: "Object Removal", desc: "Clean up unwanted objects.", bentoClass: "bento-square", link: "/object-removal" },
  { icon: <FileText color="white" />, color: "#0ea5e9", spotlight: "rgba(14, 165, 233, 0.15)", title: "Resume Reviewer", desc: "Get your resume reviewed by AI to improve your chances of landing your dream job.", bentoClass: "bento-wide", link: "/resume-reviewer" }
];

const Features = () => {
  return (
    <div id="features" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 20px 40px', position: 'relative', zIndex: 10, fontFamily: '"Inter", "Poppins", system-ui, sans-serif' }}>

      <style>{`
        #features { scroll-margin-top: -60px; }
        .bento-grid { display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(3, 150px); gap: 16px; width: 100%; max-width: 1200px; }
        .bento-large { grid-column: span 2; grid-row: span 2; } .bento-wide { grid-column: span 2; grid-row: span 1; } .bento-tall { grid-column: span 1; grid-row: span 2; } .bento-square { grid-column: span 1; grid-row: span 1; }

        @media (max-width: 850px) {
          .bento-grid { grid-template-columns: 1fr; grid-template-rows: auto; max-width: 500px; }
          .bento-large, .bento-wide, .bento-tall, .bento-square { grid-column: span 1; grid-row: span 1; min-height: 160px; }
        }
      `}</style>

      <div style={{ textAlign: 'center', marginBottom: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '800', color: 'white', letterSpacing: '-0.02em', marginBottom: '6px' }}
        >
          <span>Powerful</span>
          <ColourfulText text="AI Tools" />
        </motion.h2>

        <div style={{ color: '#a1a1aa', fontSize: '15px', maxWidth: '650px', lineHeight: '1.5', fontWeight: '400', letterSpacing: '0.01em' }}>
          Everything you need to create, enhance, and optimize your content with cutting-edge AI technology.
        </div>
      </div>

      <div className="bento-grid">
        {featuresData.map((feature, idx) => (
          <Link key={idx} href={feature.link} className={feature.bentoClass} style={{ height: '100%', width: '100%', boxSizing: 'border-box', textDecoration: 'none' }}>
            <CardSpotlight color={feature.spotlight} glowColor={feature.color}>
              <div style={{ padding: feature.bentoClass === 'bento-large' ? '8px' : '6px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-start', overflow: 'hidden', boxSizing: 'border-box' }}>

                <div style={{ width: feature.bentoClass === 'bento-large' ? '42px' : '32px', height: feature.bentoClass === 'bento-large' ? '42px' : '32px', borderRadius: '10px', backgroundColor: feature.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px', boxShadow: `0 4px 20px ${feature.color}50`, flexShrink: 0 }}>
                  {React.cloneElement(feature.icon, { size: feature.bentoClass === 'bento-large' ? 22 : 16 })}
                </div>

                <h3 style={{ color: 'white', fontSize: feature.bentoClass === 'bento-large' ? '20px' : '15px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '4px', flexShrink: 0 }}>
                  {feature.title}
                </h3>

                <p style={{ color: '#a1a1aa', fontSize: feature.bentoClass === 'bento-large' ? '14px' : '12px', lineHeight: '1.4', fontWeight: '400', opacity: 0.9, display: '-webkit-box', WebkitLineClamp: feature.bentoClass === 'bento-large' ? 4 : 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0, flexShrink: 0 }}>
                  {feature.desc}
                </p>

              </div>
            </CardSpotlight>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Features;