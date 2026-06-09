import React, { useState, useEffect } from 'react';
import { AiToolsData } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

// --- Reusable Card Component with Apple-inspired frosted glass effect ---
const ToolCard = ({ tool, index }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onClick={() => user && navigate(tool.path)}
      // Card now has frosted glass effect (bg-white/60 + backdrop-blur)
      className={`group relative w-full max-w-sm p-6 overflow-hidden 
                 bg-white/60 backdrop-blur-md border border-slate-200
                 rounded-3xl shadow-md cursor-pointer
                 transition-all duration-500 ease-out hover:shadow-xl hover:-translate-y-1
                 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
    >
      {/* Self-contained spotlight effect */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(300px at ${mousePosition.x}px ${mousePosition.y}px, rgba(168, 85, 247, 0.1), transparent 80%)`,
        }}
      />
      
      <div className="relative z-10 flex flex-col h-full">
        <tool.Icon
          className='w-12 h-12 p-3 text-white rounded-xl shadow-lg'
          style={{ background: `linear-gradient(to bottom, ${tool.bg.from}, ${tool.bg.to})` }}
        />
        <h3 className='mt-6 mb-2 text-xl font-bold text-slate-800'>
          {tool.title}
        </h3>
        <p className='text-slate-600 text-sm'>
          {tool.description}
        </p>
      </div>
    </div>
  );
};


// --- Main AiTools Component with white background ---
const AiTools = () => {
  return (
    <div className='relative w-full px-4 pt-28 pb-24 sm:px-8 md:px-16 bg-white overflow-hidden'>

      <div className='relative z-10 max-w-7xl mx-auto'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900'>
            Powerful AI Tools
          </h2>
          <p className='mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto'>
            Everything you need to create, enhance, and optimize your content with cutting-edge AI technology.
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {AiToolsData.map((tool, index) => (
            <ToolCard key={index} tool={tool} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AiTools;