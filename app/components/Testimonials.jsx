"use client";
import React from "react";
import { TextFlip } from "./ui/text-flip";
import { AnimatedTestimonials } from "./ui/animated-testimonials";

const testimonialsData = [
  { quote: "Quick.ai has revolutionized our content workflow. The quality of the articles is outstanding, and it saves us hours of work every week.", name: "John Doe", designation: "Marketing Director", src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=500&auto=format&fit=crop" },
  { quote: "The AI tools have helped us produce high-quality content faster than ever before. It's an indispensable part of our creative process now.", name: "Jane Smith", designation: "Content Creator", src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=500&auto=format&fit=crop" },
  { quote: "As a writer, I was skeptical, but the AI assistant is brilliant. It helps me overcome writer's block and generate ideas instantly.", name: "Sarah Lee", designation: "Freelance Writer", src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=500&auto=format&fit=crop" }
];

const Testimonials = () => {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 20px', position: 'relative', zIndex: 10, fontFamily: '"Inter", "Poppins", system-ui, sans-serif' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <div style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: '800', color: 'white', letterSpacing: '-0.03em', marginBottom: '12px' }}>
          <TextFlip prefix="" words={["Loved", "Trusted"]} suffix="by Creators" />
        </div>
        
        <div style={{ color: '#a1a1aa', fontSize: '17px', maxWidth: '650px', lineHeight: '1.6', fontWeight: '400', letterSpacing: '0.01em' }}>
          Don't just take our word for it. Here's what our users are saying.
        </div>
      </div>

      <AnimatedTestimonials testimonials={testimonialsData} autoplay={true} />
    </div>
  );
};

export default Testimonials;