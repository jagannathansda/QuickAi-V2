import React from 'react';
import { PricingTable } from '@clerk/clerk-react';

const Plan = () => {
  return (
    <div className='relative w-full px-4 pt-28 pb-24 sm:px-8 md:px-16 bg-white  overflow-hidden'>
      {/* --- Subtle Background Glow --- */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[800px]
                   bg-radial-gradient(ellipse_at_center,_rgba(168,85,247,0.1)_0%,_rgba(255,255,255,0)_70%)
                   pointer-events-none"
      />
      
      <div className='relative z-10 max-w-7xl mx-auto animate-fadeIn'>
        {/* --- Header Section --- */}
        <div className='text-center'>
          <h2 className='text-4xl sm:text-5xl font-bold text-slate-900 '>
            Choose Your Plan
          </h2>
          <p className='mt-4 text-lg text-gray-600  max-w-2xl mx-auto'>
            Start for free and scale up as you grow. Find the perfect plan for your content creation needs.
          </p>
        </div>

        {/* --- Clerk Pricing Table Container --- */}
        <div className='mt-16 max-w-5xl mx-auto'>
          <PricingTable />
        </div>
      </div>
    </div>
  )
}

export default Plan;