"use client";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export const AnimatedTestimonials = ({ testimonials, autoplay = false }) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, testimonials.length]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 0', fontFamily: '"Inter", "Poppins", system-ui, sans-serif', width: '100%' }}>
      <style>{`
        .test-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        @media (max-width: 768px) { .test-grid { grid-template-columns: 1fr; gap: 40px; } }
        .test-btn { display: flex; height: 44px; width: 44px; align-items: center; justify-content: center; border-radius: 50%; background-color: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); cursor: pointer; transition: transform 0.3s, background-color 0.3s; }
        .test-btn:hover { background-color: rgba(255, 255, 255, 0.15); }
        .test-btn svg { color: white; transition: transform 0.3s; }
        .test-btn-left:hover svg { transform: rotate(-12deg); }
        .test-btn-right:hover svg { transform: rotate(12deg); }
      `}</style>
      <div className="test-grid">
        <div>
          <div style={{ position: 'relative', height: '340px', width: '100%' }}>
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src}
                  initial={{ opacity: 0, scale: 0.9, z: -100, rotate: randomRotateY() }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.6,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY(),
                    zIndex: isActive(index) ? 40 : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -20, 0] : 0,
                  }}
                  exit={{ opacity: 0, scale: 0.9, z: 100, rotate: randomRotateY() }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  style={{ position: 'absolute', inset: 0, transformOrigin: 'bottom' }}
                >
                  <img
                    src={testimonial.src}
                    alt={testimonial.name}
                    draggable={false}
                    style={{ height: '100%', width: '100%', borderRadius: '24px', objectFit: 'cover', objectPosition: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '16px 0' }}>
          <motion.div
            key={active}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <h3 style={{ fontSize: '28px', fontWeight: '700', color: 'white', marginBottom: '4px', letterSpacing: '-0.02em' }}>
              {testimonials[active].name}
            </h3>
            <p style={{ fontSize: '15px', color: '#a1a1aa', marginBottom: '32px' }}>
              {testimonials[active].designation}
            </p>
            <motion.p style={{ fontSize: '18px', color: '#e5e7eb', lineHeight: '1.6' }}>
              {testimonials[active].quote.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                  animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut", delay: 0.02 * index }}
                  style={{ display: 'inline-block' }}
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
          </motion.div>
          <div style={{ display: 'flex', gap: '16px', paddingTop: '40px' }}>
            <button onClick={handlePrev} className="test-btn test-btn-left">
              <IconArrowLeft size={20} />
            </button>
            <button onClick={handleNext} className="test-btn test-btn-right">
              <IconArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};