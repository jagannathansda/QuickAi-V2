import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className='relative flex items-center justify-center w-full min-h-screen overflow-hidden
                    bg-[url(/gradientBackground.png)] bg-cover bg-center bg-no-repeat
                    px-4 py-16 sm:px-6 md:px-8'>
      
      {/* --- Subtle Background Glow --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-3xl max-h-3xl
                      bg-radial-gradient(ellipse_at_center,_rgba(255,255,255,0.3)_0%,_rgba(255,255,255,0)_70%)
                      opacity-50 blur-3xl pointer-events-none">
      </div>

      {/* Main content container with a simple fade-in animation */}
      <div className='relative text-center flex flex-col items-center animate-fadeIn'>
        {/* --- Main Heading with Fix for Mobile Spacing --- */}
        <h1
          className='text-4xl leading-tight sm:text-5xl sm:leading-tight md:text-6xl md:leading-tight
                     font-bold text-slate-900 max-w-4xl'
        >
          Create amazing content{' '}
          <br className='hidden md:block'/>with <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400'>AI tools</span>
        </h1>

        {/* --- Sub-headline with new, less prominent gray color --- */}
        <p
          className='mt-4 sm:mt-6 mb-8 sm:mb-10 text-base sm:text-lg text-gray-600
                      max-w-prose mx-auto leading-relaxed'
        >
          Transform your content creation with our suite of premium AI tools. Write articles, generate stunning images, and streamline your workflow with ease.
        </p>

        {/* --- Action Buttons --- */}
        <div className='flex flex-col sm:flex-row flex-wrap justify-center gap-4'>
          {/* --- Animated Gradient Button --- */}
          <button
            onClick={() => navigate('/ai')}
            className='px-8 py-3 rounded-full font-semibold text-white shadow-lg
                       bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500
                       bg-[length:200%_auto]
                       hover:bg-[position:100%_0]
                       transition-[background-position] duration-500 ease-in-out
                       focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50'
          >
            Start creating now
          </button>
          <button
            className='bg-white/70 backdrop-blur-sm text-gray-800 
                       px-8 py-3 rounded-full font-semibold border border-gray-300 
                       shadow-md hover:bg-white 
                       active:scale-95 transition-all duration-300 ease-in-out
                       focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50'
          >
            Watch demo
          </button>
        </div>

        {/* --- Social Proof with Responsive Spacing --- */}
        <div className='flex items-center gap-3 mt-10 sm:mt-12 text-sm sm:text-base'>
          <img src={assets.user_group} alt="User group" className='h-7 sm:h-8 object-contain'/>
          <span className='font-medium text-gray-600 '>Trusted by 10k+ people</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;