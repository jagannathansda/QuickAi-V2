import React, { useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { ChevronDown, Image as ImageIcon, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {
    const imageStyleOptions = ['Realistic', 'Ghibli', 'Anime', 'Cartoon', 'Fantasy', '3D', 'Portrait'];

    const [selectedStyle, setSelectedStyle] = useState('Realistic');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [input, setInput] = useState('');
    const [publish, setPublish] = useState(false);
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('');
    const { getToken } = useAuth();
    const { user } = useUser();

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setContent('');
        try {
            const prompt = `Generate an image of ${input} in the style of ${selectedStyle}`;
            const { data } = await axios.post('/api/ai/generate-image', { prompt, publish }, {
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
                `}
            </style>

            {/* --- THE CHANGES --- */}
            {/* Main container classes now match BlogTitles.jsx */}
            <div className="h-full w-full bg-slate-100 p-4 lg:p-6">
                <div className="w-full max-w-7xl mx-auto bg-white border border-slate-200/80 rounded-3xl shadow-2xl shadow-slate-300/60 flex flex-col lg:h-full">
                    <div className="p-6 lg:p-8 border-b border-slate-200/80">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800 text-center">
                            <span className="bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent animate-gradient">
                                AI Image Generator
                            </span>
                        </h1>
                        <p className="text-center text-slate-500 mt-2">Bring your imagination to life with a simple description.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 lg:flex-grow lg:min-h-0">
                        <form onSubmit={onSubmitHandler} className="lg:col-span-2 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-slate-200/80 flex flex-col">
                            <div className="space-y-8 flex-grow">
                                <div>
                                    <label className='text-xl font-semibold text-slate-700 block mb-4'>Describe Your Image</label>
                                    <textarea
                                        onChange={(e) => setInput(e.target.value)}
                                        value={input}
                                        rows={4}
                                        className='w-full p-3.5 text-base text-slate-800 bg-slate-100/80 rounded-xl border border-slate-300/80 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow outline-none placeholder:text-slate-400'
                                        placeholder='e.g., A futuristic city with flying cars at sunset'
                                        required
                                    />
                                </div>
                                <div>
                                    <label className='text-xl font-semibold text-slate-700 block mb-4'>Art Style</label>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            className="w-full flex justify-between items-center p-3.5 text-base text-slate-800 bg-slate-100/80 rounded-xl border border-slate-300/80"
                                        >
                                            {selectedStyle}
                                            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        {isDropdownOpen && (
                                            <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                                                {imageStyleOptions.map((item) => (
                                                    <div
                                                        key={item}
                                                        onClick={() => {
                                                            setSelectedStyle(item);
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
                                <div className="flex items-center justify-between">
                                    <label className='text-xl font-semibold text-slate-700'>Make Public</label>
                                    <label className='relative cursor-pointer'>
                                        <input type="checkbox" onChange={(e) => setPublish(e.target.checked)} checked={publish} className='sr-only peer' />
                                        <div className='w-11 h-6 bg-slate-200 rounded-full peer-checked:bg-green-500 transition'></div>
                                        <span className='absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5'></span>
                                    </label>
                                </div>
                            </div>
                            
                            <button disabled={loading} className='w-full flex justify-center items-center gap-3 bg-gradient-to-r from-green-500 to-cyan-500 text-white font-semibold px-4 py-3 mt-8 text-base rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/30'>
                                {loading ? (
                                    <>
                                        <span className='w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin'></span>
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    <>
                                        <ImageIcon className='w-5 h-5' />
                                        <span>Generate Image</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className='lg:col-span-3 flex flex-col lg:min-h-0 min-h-[50vh] pr-4 lg:pr-0'>
                            <div className="p-6 lg:p-8 lg:flex-grow lg:overflow-y-auto h-full">
                                {loading ? (
                                   <div className='flex flex-col justify-center items-center h-full text-center text-slate-500'>
                                        <Sparkles className="w-12 h-12 mx-auto animate-pulse text-green-400" />
                                        <p className="mt-4 font-semibold text-lg">Creating your image...</p>
                                        <p className="text-sm">This may take a moment.</p>
                                   </div>
                                ) : !content ? (
                                  <div className="h-full w-full border-2 border-dashed border-slate-300 rounded-2xl flex flex-col justify-center items-center text-center text-slate-400">
                                        <ImageIcon className='w-12 h-12 mx-auto' />
                                        <p className="mt-4 text-base font-medium">Your generated image will appear here.</p>
                                  </div>
                                ) : (
                                  <div className='h-full w-full flex items-center justify-center p-2'>
                                      <img src={content} alt='Generated art' className='max-h-full max-w-full object-contain rounded-lg shadow-md' />
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

export default GenerateImages;