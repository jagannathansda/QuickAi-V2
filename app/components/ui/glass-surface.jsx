"use client";
import { useEffect, useRef, useState, useId } from 'react';

export const GlassSurface = ({
  children,
  width = "100%",
  height = "100%",
  borderRadius = 40,
  borderWidth = 0.07,
  brightness = 50,
  opacity = 0.93,
  blur = 11,
  displace = 0,
  backgroundOpacity = 0.02, // Ekdum halka frost
  saturation = 1.2,
  distortionScale = -180, // Liquid edges
  redOffset = 0,
  greenOffset = 10,
  blueOffset = 20,
  xChannel = 'R',
  yChannel = 'G',
  mixBlendMode = 'difference',
  className = '',
  style = {}
}) => {
  const uniqueId = useId().replace(/:/g, '-');
  const filterId = `glass-filter-${uniqueId}`;
  const redGradId = `red-grad-${uniqueId}`;
  const blueGradId = `blue-grad-${uniqueId}`;

  const containerRef = useRef(null);
  const feImageRef = useRef(null);
  const redChannelRef = useRef(null);
  const greenChannelRef = useRef(null);
  const blueChannelRef = useRef(null);
  const gaussianBlurRef = useRef(null);

  const generateDisplacementMap = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    const actualWidth = rect?.width || 800;
    const actualHeight = rect?.height || 64;
    const edgeSize = Math.min(actualWidth, actualHeight) * (borderWidth * 0.5);

    // FIXED: Added exact width and height to SVG root to prevent 0x0 parsing in Chrome
    const svgContent = `
      <svg width="${actualWidth}" height="${actualHeight}" viewBox="0 0 ${actualWidth} ${actualHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="rgba(0,0,0,0)"/>
            <stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="rgba(0,0,0,0)"/>
            <stop offset="100%" stop-color="blue"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" fill="black" />
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#${redGradId})" />
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#${blueGradId})" style="mix-blend-mode: ${mixBlendMode}" />
        <rect x="${edgeSize}" y="${edgeSize}" width="${actualWidth - edgeSize * 2}" height="${actualHeight - edgeSize * 2}" rx="${borderRadius}" fill="rgba(128,128,128,${opacity})" style="filter:blur(${blur}px)" />
      </svg>
    `;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
  };

  const updateDisplacementMap = () => {
    if (feImageRef.current) {
      const dataUrl = generateDisplacementMap();
      feImageRef.current.setAttribute('href', dataUrl);
      feImageRef.current.setAttributeNS('http://www.w3.org/1999/xlink', 'href', dataUrl);
    }
  };

  useEffect(() => {
    updateDisplacementMap();
    [
      { ref: redChannelRef, offset: redOffset },
      { ref: greenChannelRef, offset: greenOffset },
      { ref: blueChannelRef, offset: blueOffset }
    ].forEach(({ ref, offset }) => {
      if (ref.current) {
        ref.current.setAttribute('scale', (distortionScale + offset).toString());
        ref.current.setAttribute('xChannelSelector', xChannel);
        ref.current.setAttribute('yChannelSelector', yChannel);
      }
    });
    if (gaussianBlurRef.current) {
      gaussianBlurRef.current.setAttribute('stdDeviation', displace.toString());
    }
  }, [width, height, borderRadius, borderWidth, brightness, opacity, blur, displace, distortionScale, redOffset, greenOffset, blueOffset, xChannel, yChannel, mixBlendMode]);

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver(() => { updateDisplacementMap(); });
    resizeObserver.observe(containerRef.current);
    return () => { resizeObserver.disconnect(); };
  }, []);

  useEffect(() => { updateDisplacementMap(); }, [width, height]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        ...style,
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: `${borderRadius}px`,
        background: `rgba(255, 255, 255, ${backgroundOpacity})`,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        
        // This makes the magic happen!
        backdropFilter: `url(#${filterId}) saturate(${saturation})`,
        WebkitBackdropFilter: `url(#${filterId}) saturate(${saturation})`,
        
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <svg 
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, pointerEvents: 'none', zIndex: -10 }} 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
            <feImage ref={feImageRef} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
            <feDisplacementMap ref={redChannelRef} in="SourceGraphic" in2="map" result="dispRed" />
            <feColorMatrix in="dispRed" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
            <feDisplacementMap ref={greenChannelRef} in="SourceGraphic" in2="map" result="dispGreen" />
            <feColorMatrix in="dispGreen" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
            <feDisplacementMap ref={blueChannelRef} in="SourceGraphic" in2="map" result="dispBlue" />
            <feColorMatrix in="dispBlue" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" result="output" />
            <feGaussianBlur ref={gaussianBlurRef} in="output" stdDeviation="0.7" />
          </filter>
        </defs>
      </svg>

      <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  );
};