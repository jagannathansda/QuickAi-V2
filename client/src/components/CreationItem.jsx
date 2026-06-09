import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { ChevronDown } from 'lucide-react';

// A map to style badges based on creation type
const typeStyles = {
    image: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    text: 'bg-violet-100 text-violet-800 border-violet-200',
    code: 'bg-amber-100 text-amber-800 border-amber-200',
    default: 'bg-slate-100 text-slate-800 border-slate-200'
};

const CreationItem = ({ item }) => {
    const [expanded, setExpanded] = useState(false);

    const badgeStyle = typeStyles[item.type] || typeStyles.default;

    return (
        <div className='bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md'>
            {/* --- Item Header --- */}
            <div
                onClick={() => setExpanded(!expanded)}
                className='p-4 flex justify-between items-center cursor-pointer'
            >
                <div className='flex items-center gap-4'>
                    <div>
                        <h3 className='font-semibold text-slate-800'>{item.prompt}</h3>
                        <p className='text-xs text-slate-500 mt-1'>
                            {new Date(item.created_at).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </p>
                    </div>
                </div>
                <div className='flex items-center gap-4'>
                    <span className={`hidden sm:inline-block text-xs font-medium px-3 py-1 rounded-full border ${badgeStyle}`}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </span>
                    <ChevronDown
                        className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                    />
                </div>
            </div>

            {/* --- Collapsible Content --- */}
            <div
                className={`transition-all duration-500 ease-in-out grid ${expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
            >
                <div className='overflow-hidden'>
                    <div className='p-4 pt-2 border-t border-slate-200'>
                        {item.type === 'image' ? (
                            <img
                                src={item.content}
                                alt={item.prompt}
                                className='mt-2 w-full max-w-lg mx-auto rounded-lg shadow-md'
                            />
                        ) : (
                            <div className='mt-2 prose prose-sm prose-slate max-w-none'>
                                <Markdown>{item.content}</Markdown>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreationItem;