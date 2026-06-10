"use client";
import React, { useMemo } from "react";
import { TextFlip } from "./ui/text-flip";
import { PricingTable } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const FLIP_WORDS = ["Plan", "Subscription"];

const Pricing = () => {
  const tableAppearance = useMemo(() => ({
    baseTheme: dark,
    variables: {
      colorBackground: 'transparent',
      colorText: '#ffffff',
      colorTextSecondary: '#a1a1aa',
      colorPrimary: '#06b6d4',
    },
    elements: {
      pricingTable: { gap: '24px' },
      pricingTableCardDivider: { display: 'none' },
      pricingTableCardFeatureIcon: { color: '#06b6d4' },
      pricingTableCardButton: {
        background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
        border: 'none',
        fontWeight: 'bold',
        padding: '14px',
        fontSize: '16px',
        borderRadius: '12px',
        color: '#ffffff',
      }
    }
  }), []);

  return (
    <div id="pricing" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 20px 100px 20px', position: 'relative', zIndex: 1, fontFamily: '"Inter", "Poppins", system-ui, sans-serif' }}>
      
      <style>{`
        div[role="dialog"], .cl-rootBox, .cl-modalBackdrop {
            z-index: 99999 !important;
        }
        
        .cl-modalContent {
            background-color: rgba(15, 15, 15, 0.85) !important;
            backdrop-filter: blur(24px) !important;
            -webkit-backdrop-filter: blur(24px) !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            transform: translateZ(0);
            will-change: backdrop-filter;
        }

        .cl-pricingTableCard [class*="cl-internal-"],
        .cl-pricingTableCard .cl-pricingTableCardFeatureList,
        .cl-pricingTableCardHeader,
        .cl-pricingTableCardContent,
        .cl-pricingTableCardFooter {
            background: transparent !important;
            background-color: transparent !important;
        }

        .cl-pricingTableCard [class*="cl-internal-"],
        .cl-pricingTableCardFeature span, 
        .cl-pricingTableCardTitle, 
        .cl-pricingTableCardDescription, 
        .cl-pricingTableCardPrice {
            color: #ffffff !important;
        }

        .cl-pricingTableCard {
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            background: rgba(255, 255, 255, 0.05) !important;
            backdrop-filter: blur(16px) !important;
            -webkit-backdrop-filter: blur(16px) !important;
            box-shadow: 0 20px 40px rgba(0,0,0,0.5) !important;
            transform: translateZ(0);
            will-change: backdrop-filter, box-shadow;
        }

        @media (max-width: 768px) {
            .cl-pricingTableCard, .cl-modalContent {
                backdrop-filter: blur(8px) !important;
                -webkit-backdrop-filter: blur(8px) !important;
            }
        }
      `}</style>

          <div style={{ textAlign: 'center', marginBottom: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: '800', color: 'white', letterSpacing: '-0.03em', marginBottom: '8px' }}>
              <TextFlip prefix="Choose Your" words={FLIP_WORDS} suffix="" />
            </div>
            <div style={{ color: '#a1a1aa', fontSize: '15px', maxWidth: '600px', lineHeight: '1.5', fontWeight: '400', letterSpacing: '0.01em' }}>
              Start for free and scale up as you grow. Find the perfect plan for your content creation needs.
            </div>
          </div>

          <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', justifyContent: 'center' }}>
            <PricingTable appearance={tableAppearance} />
          </div>
        </div>
      );
    };

export default Pricing;