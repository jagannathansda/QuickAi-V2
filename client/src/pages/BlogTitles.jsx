import React, { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { ChevronDown, Hash, Lightbulb, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {
    const blogCategories = ['General', 'Technology', 'Business', 'Health', 'LifeStyle', 'Education', 'Travel', 'Food'];

    const [selectedCategory, setSelectedCategory] = useState('General');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('');
    const { getToken } = useAuth();
    const { user } = useUser();

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setContent('');
        try {
            const prompt = `Generate a list of blog titles for the keyword "${input}" in the category of ${selectedCategory}.`;
            const { data } = await axios.post('/api/ai/generate-blog-title', { prompt }, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            if (data.success) {
                setContent(data.content);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
        setLoading(false);
    };

    if (!user) {
        return null;
    }

    return (
        <>
            <style>
                {`
                    @keyframes gradient-animation {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    .animate-gradient {
                        background-size: 200% 200%;
                        animation: gradient-animation 5s ease infinite;
                    }
                    .markdown-content ul { list-style-position: inside; }
                    .markdown-content li { margin-bottom: 0.75rem; font-size: 1.125rem; line-height: 1.75; }
                `}
            </style>

            <div className="h-full w-full bg-slate-100 p-4 lg:p-6">
                {/* Removed overflow-hidden from here to allow for the custom border/shadow effect */}
                <div className="w-full max-w-7xl mx-auto bg-white border border-slate-200/80 rounded-3xl shadow-2xl shadow-slate-300/60 flex flex-col lg:h-full">
                    <div className="p-6 lg:p-8 border-b border-slate-200/80">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800 text-center">
                            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent animate-gradient">
                                AI Blog Title Generator
                            </span>
                        </h1>
                        <p className="text-center text-slate-500 mt-2">Generate catchy titles for your next blog post.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 lg:flex-grow lg:min-h-0">
                        {/* The form section now only has a bottom border on small screens */}
                        <form onSubmit={onSubmitHandler} className="lg:col-span-2 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-slate-200/80 flex flex-col">
                            <div className="space-y-8 flex-grow">
                                <div>
                                    <label className='text-xl font-semibold text-slate-700 block mb-4'>Primary Keyword</label>
                                    <input
                                        onChange={(e) => setInput(e.target.value)}
                                        value={input}
                                        type="text"
                                        className='w-full p-3.5 text-base text-slate-800 bg-slate-100/80 rounded-xl border border-slate-300/80 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow outline-none placeholder:text-slate-400'
                                        placeholder='e.g., Sustainable living'
                                        required
                                    />
                                </div>
                                <div>
                                    <label className='text-xl font-semibold text-slate-700 block mb-4'>Blog Category</label>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            className="w-full flex justify-between items-center p-3.5 text-base text-slate-800 bg-slate-100/80 rounded-xl border border-slate-300/80"
                                        >
                                            {selectedCategory}
                                            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        {isDropdownOpen && (
                                            <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-10">
                                                {blogCategories.map((item) => (
                                                    <div
                                                        key={item}
                                                        onClick={() => {
                                                            setSelectedCategory(item);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className="p-3 text-sm text-slate-700 hover:bg-slate-100 cursor-pointer first:rounded-t-xl last:rounded-b-xl"
                                                    >
                                                        {item}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8 bg-purple-50/60 border border-purple-200/60 text-purple-800/80 p-4 rounded-xl text-sm">
                                <div className="flex items-center gap-3">
                                    <Lightbulb className="w-5 h-5 text-purple-500" />
                                    <h3 className="font-semibold">Pro Tip</h3>
                                </div>
                                <p className="mt-2">Use a broad keyword to get a wider variety of creative title suggestions.</p>
                            </div>

                            <button disabled={loading} className='w-full flex justify-center items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-4 py-3 mt-6 text-base rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30'>
                                {loading ? (
                                    <>
                                        <span className='w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin'></span>
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className='w-5 h-5' />
                                        <span>Generate Titles</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* --- THE FIX --- */}
                        {/* Added a right padding (pr-4) on small screens to create the offset. */}
                        {/* The border is now applied to the inner content div, which fills the remaining space. */}
                        <div className='lg:col-span-3 flex flex-col lg:min-h-0 min-h-[50vh] pr-4 lg:pr-0'>
                            <div className="p-6 lg:p-8 lg:flex-grow lg:overflow-y-auto h-full"> {/* Ensure inner div takes full height */}
                                {loading ? (
                                   <div className='flex flex-col justify-center items-center h-full text-center text-slate-500'>
                                        <Sparkles className="w-12 h-12 mx-auto animate-pulse text-purple-400" />
                                        <p className="mt-4 font-semibold text-lg">Generating titles...</p>
                                        <p className="text-sm">This may take a moment.</p>
                                   </div>
                                ) : !content ? (
                                  <div className="h-full w-full border-2 border-dashed border-slate-300 rounded-2xl flex flex-col justify-center items-center text-center text-slate-400 p-4">
                                        <Hash className='w-12 h-12 mx-auto' />
                                        <p className="mt-4 text-base font-medium">Your generated titles will appear here.</p>
                                  </div>
                                ) : (
                                  <div className='markdown-content text-slate-700'>
                                      <Markdown>{content}</Markdown>
                                  </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default BlogTitles;