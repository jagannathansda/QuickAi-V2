import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';

// --- Reusable Testimonial Card with Apple-inspired frosted glass effect ---
const TestimonialCard = ({ testimonial, index }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Staggered entrance animation
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
      // Card now has frosted glass effect (bg-white/60 + backdrop-blur)
      className={`group relative flex flex-col h-full p-6 overflow-hidden 
                 bg-white/60 backdrop-blur-md border border-slate-200
                 rounded-3xl shadow-md
                 transition-all duration-500 ease-out
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
        {/* Main quote content */}
        <div className="flex-grow">
          <p className='text-base text-slate-700'>
            "{testimonial.content}"
          </p>
        </div>
        
        {/* Stars and Author Info */}
        <div className='mt-6 pt-4 border-t border-slate-200'>
          <div className="flex items-center justify-between">
            <div className='flex items-center gap-4'>
              <img src={testimonial.image} className='w-11 h-11 object-cover rounded-full' alt={testimonial.name} />
              <div>
                <h3 className='font-bold text-slate-800'>
                  {testimonial.name}
                </h3>
                <p className='text-sm text-slate-500'>
                  {testimonial.title}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 shrink-0">
              {Array(5).fill(0).map((_, i) => (
                <img key={i} src={i < testimonial.rating ? assets.star_icon : assets.star_dull_icon} className="w-4 h-4" alt="star rating"/>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- Main Testimonial Component with white background ---
const Testimonial = () => {
  const dummyTestimonialData = [
    {
      image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
      name: 'John Doe',
      title: 'Marketing Director',
      content: 'Quick.ai has revolutionized our content workflow. The quality of the articles is outstanding, and it saves us hours of work every week.',
      rating: 5,
    },
    {
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
      name: 'Jane Smith',
      title: 'Content Creator',
      content: 'The AI tools have helped us produce high-quality content faster than ever before. It\'s an indispensable part of our creative process now.',
      rating: 5,
    },
    {
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
      name: 'Sarah Lee',
      title: 'Freelance Writer',
      content: 'As a writer, I was skeptical, but the AI assistant is brilliant. It helps me overcome writer\'s block and generate ideas instantly.',
      rating: 4,
    },
  ];

  return (
    <div className='relative w-full px-4 py-24 sm:px-8 md:px-16 bg-white overflow-hidden'>
      <div className='relative z-10 max-w-7xl mx-auto'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl sm:text-5xl font-bold text-slate-900'>
            Loved by Creators
          </h2>
          <p className='mt-4 text-lg text-gray-600 max-w-2xl mx-auto'>
            Don't just take our word for it. Here's what our users are saying.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {dummyTestimonialData.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;