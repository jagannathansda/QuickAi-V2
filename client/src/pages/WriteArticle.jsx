import { Edit, Lightbulb, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth, useUser } from '@clerk/clerk-react';
import Markdown from 'react-markdown';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {
    const articleLengthOptions = [
        { length: 800, text: 'Short' },
        { length: 1200, text: 'Medium' },
        { length: 1600, text: 'Long' },
    ];

    const [selectedLength, setSelectedLength] = useState(articleLengthOptions[0]);
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
            const prompt = `Write an article about ${input} with a word count around ${selectedLength.length} words.`;
            const { data } = await axios.post('/api/ai/generate-article', { prompt, length: selectedLength.length }, {
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
                    .markdown-content h1, .markdown-content h2, .markdown-content h3 { margin-top: 2rem; margin-bottom: 1rem; font-weight: 700; letter-spacing: -0.025em; }
                    .markdown-content h1 { font-size: 2.25rem; }
                    .markdown-content h2 { font-size: 1.875rem; }
                    .markdown-content h3 { font-size: 1.5rem; }
                    .markdown-content p { margin-bottom: 1.25rem; line-height: 1.75; font-size: 1.125rem; }
                    .markdown-content ul, .markdown-content ol { margin-left: 1.5rem; margin-bottom: 1.25rem; }
                    .markdown-content li { margin-bottom: 0.75rem; font-size: 1.125rem; }
                    .markdown-content a { color: #2563eb; text-decoration: none; font-weight: 600; }
                    .markdown-content a:hover { text-decoration: underline; }
                `}
            </style>

            {/* Main container with responsive height control */}
            <div className="h-full w-full bg-slate-100 p-4 lg:p-6">
                <div className="w-full max-w-7xl mx-auto bg-white border border-slate-200/80 rounded-3xl shadow-2xl shadow-slate-300/60 overflow-hidden flex flex-col lg:h-full">
                    <div className="p-6 lg:p-8 border-b border-slate-200/80">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800 text-center">
                            <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                                AI Article Writer
                            </span>
                        </h1>
                        <p className="text-center text-slate-500 mt-2">Create compelling articles on any topic in seconds.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 lg:flex-grow lg:min-h-0">
                        <form onSubmit={onSubmitHandler} className="lg:col-span-2 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-slate-200/80 flex flex-col">
                            <div className="space-y-8 flex-grow">
                                <div>
                                    <label className='text-xl font-semibold text-slate-700 block mb-4'>Article Topic</label>
                                    <input
                                        onChange={(e) => setInput(e.target.value)}
                                        value={input}
                                        type="text"
                                        className='w-full p-3.5 text-base text-slate-800 bg-slate-100/80 rounded-xl border border-slate-300/80 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none placeholder:text-slate-400'
                                        placeholder='e.g., The future of AI'
                                        required
                                    />
                                </div>
                                <div>
                                    <label className='text-xl font-semibold text-slate-700 block mb-4'>Article Length</label>
                                    <div className='flex w-full bg-slate-100/80 p-1.5 rounded-xl border border-slate-300/80'>
                                        {articleLengthOptions.map((item) => (
                                            <button
                                                type="button"
                                                onClick={() => setSelectedLength(item)}
                                                className={`w-full text-center text-sm font-semibold py-2.5 rounded-lg transition-all duration-300 ${selectedLength.length === item.length ? 'bg-white text-blue-600 shadow-lg shadow-slate-300/20' : 'text-slate-500 hover:bg-slate-200/60'}`}
                                                key={item.length}
                                            >
                                                {item.text}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8 bg-blue-50/60 border border-blue-200/60 text-blue-800/80 p-4 rounded-xl text-sm">
                                <div className="flex items-center gap-3">
                                    <Lightbulb className="w-5 h-5 text-blue-500" />
                                    <h3 className="font-semibold">Pro Tip</h3>
                                </div>
                                <p className="mt-2">For the best results, be specific with your topic. Instead of "AI", try "How AI is transforming the healthcare industry".</p>
                            </div>

                            <button disabled={loading} className='w-full flex justify-center items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-4 py-3 mt-6 text-base rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30'>
                                {loading ? (
                                    <>
                                        <span className='w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin'></span>
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className='w-5 h-5' />
                                        <span>Generate Article</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Right column with refined responsive scrolling */}
                        <div className='lg:col-span-3 flex flex-col lg:min-h-0'>
                            <div className="p-6 lg:p-8 lg:flex-grow lg:overflow-y-auto">
                                {loading ? (
                                   <div className='flex flex-col justify-center items-center h-full text-center text-slate-500'>
                                       <Sparkles className="w-12 h-12 mx-auto animate-pulse text-blue-400" />
                                       <p className="mt-4 font-semibold text-lg">Crafting your article...</p>
                                       <p className="text-sm">This may take a moment.</p>
                                   </div>
                                ) : !content ? (
                                  <div className="h-full w-full border-2 border-dashed border-slate-300 rounded-2xl flex flex-col justify-center items-center text-center text-slate-400">
                                      <Edit className='w-12 h-12 mx-auto' />
                                      <p className="mt-4 text-base font-medium">Your generated article will appear here.</p>
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

export default WriteArticle;