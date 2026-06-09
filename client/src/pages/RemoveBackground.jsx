import React, { useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Eraser, ImageUp, Lightbulb, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('');
    const { getToken } = useAuth();
    const { user } = useUser();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setContent(''); // Clear previous result when a new image is selected
        }
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!imageFile) {
            toast.error("Please upload an image first.");
            return;
        }
        setLoading(true);
        setContent('');
        try {
            const formData = new FormData();
            formData.append('image', imageFile);

            const { data } = await axios.post('/api/ai/remove-image-background', formData, {
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
            {/* Main container with full height and padding */}
            <div className="h-full w-full bg-slate-100 p-4 lg:p-6">
                <div className="w-full max-w-7xl mx-auto bg-white border border-slate-200/80 rounded-3xl shadow-2xl shadow-slate-300/60 flex flex-col lg:h-full">
                    <div className="p-6 lg:p-8 border-b border-slate-200/80">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800 text-center">
                            <span className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 bg-clip-text text-transparent animate-gradient">
                                AI Background Remover
                            </span>
                        </h1>
                        <p className="text-center text-slate-500 mt-2">Instantly remove the background from any image with a single click.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 lg:flex-grow lg:min-h-0">
                        <form onSubmit={onSubmitHandler} className="lg:col-span-2 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-slate-200/80 flex flex-col">
                            <div className="space-y-8 flex-grow">
                                <div>
                                    <label className='text-xl font-semibold text-slate-700 block mb-4'>Upload Image</label>
                                    <label htmlFor="file-upload" className="relative cursor-pointer w-full h-48 flex flex-col justify-center items-center border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/80 hover:bg-slate-100/80 transition-colors">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="h-full w-full object-contain rounded-2xl p-2" />
                                        ) : (
                                            <div className="text-center text-slate-400">
                                                <ImageUp className="w-10 h-10 mx-auto" />
                                                <p className="mt-2 text-sm font-semibold">Click to upload or drag & drop</p>
                                                <p className="text-xs mt-1">PNG, JPG, WEBP, etc.</p>
                                            </div>
                                        )}
                                        <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} className="sr-only" required />
                                    </label>
                                </div>
                            </div>
                            
                            <div className="mt-8 bg-orange-50/60 border border-orange-200/60 text-orange-800/80 p-4 rounded-xl text-sm">
                                <div className="flex items-center gap-3">
                                    <Lightbulb className="w-5 h-5 text-orange-500" />
                                    <h3 className="font-semibold">Pro Tip</h3>
                                </div>
                                <p className="mt-2">For the cleanest result, use an image with a clear subject and a simple background.</p>
                            </div>

                            <button disabled={loading} className='w-full flex justify-center items-center gap-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold px-4 py-3 mt-6 text-base rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/30'>
                                {loading ? (
                                    <>
                                        <span className='w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin'></span>
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Eraser className='w-5 h-5' />
                                        <span>Remove Background</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className='lg:col-span-3 flex flex-col lg:min-h-0 min-h-[50vh] pr-4 lg:pr-0'>
                            <div className="p-6 lg:p-8 lg:flex-grow lg:overflow-y-auto h-full">
                                {loading ? (
                                   <div className='flex flex-col justify-center items-center h-full text-center text-slate-500'>
                                        <Sparkles className="w-12 h-12 mx-auto animate-pulse text-orange-400" />
                                        <p className="mt-4 font-semibold text-lg">Removing background...</p>
                                        <p className="text-sm">This may take a moment.</p>
                                   </div>
                                ) : !content ? (
                                  <div className="h-full w-full border-2 border-dashed border-slate-300 rounded-2xl flex flex-col justify-center items-center text-center text-slate-400">
                                        <Eraser className='w-12 h-12 mx-auto' />
                                        <p className="mt-4 text-base font-medium">Your processed image will appear here.</p>
                                  </div>
                                ) : (
                                  <div className='h-full w-full flex items-center justify-center'>
                                      <img src={content} alt='Processed art with background removed' className='max-h-full max-w-full object-contain' />
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

export default RemoveBackground;