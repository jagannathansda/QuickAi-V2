import React, { useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { ImageUp, Scissors, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [object, setObject] = useState('');
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('');
    const { getToken } = useAuth();
    const { user } = useUser();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setContent(''); // Clear previous result
        }
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!imageFile) {
            toast.error("Please upload an image first.");
            return;
        }
        if (object.split(' ').length > 1) {
            toast.error('Please enter only one object name.');
            return;
        }
        setLoading(true);
        setContent('');
        try {
            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('object', object);

            const { data } = await axios.post('/api/ai/remove-image-object', formData, {
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
            {/* Main container classes now match the other tool pages */}
            <div className="h-full w-full bg-slate-100 p-4 lg:p-6">
                <div className="w-full max-w-7xl mx-auto bg-white border border-slate-200/80 rounded-3xl shadow-2xl shadow-slate-300/60 flex flex-col lg:h-full">
                    <div className="p-6 lg:p-8 border-b border-slate-200/80">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800 text-center">
                            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                                AI Object Remover
                            </span>
                        </h1>
                        <p className="text-center text-slate-500 mt-2">Erase any unwanted object from your photos.</p>
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
                                                <p className="mt-2 text-sm font-semibold">Click to upload</p>
                                            </div>
                                        )}
                                        <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} className="sr-only" required />
                                    </label>
                                </div>
                                <div>
                                    <label className='text-xl font-semibold text-slate-700 block mb-4'>Object to Remove</label>
                                    <input
                                        onChange={(e) => setObject(e.target.value)}
                                        value={object}
                                        type="text"
                                        className='w-full p-3.5 text-base text-slate-800 bg-slate-100/80 rounded-xl border border-slate-300/80 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none placeholder:text-slate-400'
                                        placeholder='e.g., car, person, bottle'
                                        required
                                    />
                                </div>
                            </div>
                            
                            <button disabled={loading} className='w-full flex justify-center items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-4 py-3 mt-8 text-base rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30'>
                                {loading ? (
                                    <>
                                        <span className='w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin'></span>
                                        <span>Removing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Scissors className='w-5 h-5' />
                                        <span>Remove Object</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className={`lg:col-span-3 flex flex-col lg:min-h-0 pr-4 lg:pr-0 ${!content ? 'min-h-[50vh]' : ''}`}>
                            <div className="p-6 lg:p-8 lg:flex-grow lg:overflow-y-auto h-full">
                                {loading ? (
                                   <div className='flex flex-col justify-center items-center h-full text-center text-slate-500'>
                                        <Sparkles className="w-12 h-12 mx-auto animate-pulse text-blue-400" />
                                        <p className="mt-4 font-semibold text-lg">Processing your image...</p>
                                        <p className="text-sm">This may take a moment.</p>
                                   </div>
                                ) : !content ? (
                                  <div className="h-full w-full border-2 border-dashed border-slate-300 rounded-2xl flex flex-col justify-center items-center text-center text-slate-400">
                                        <Scissors className='w-12 h-12 mx-auto' />
                                        <p className="mt-4 text-base font-medium">Your processed image will appear here.</p>
                                  </div>
                                ) : (
                                  <div className='h-full w-full flex items-center justify-center'>
                                      <img src={content} alt='Processed art with object removed' className='max-h-full max-w-full object-contain' />
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

export default RemoveObject;