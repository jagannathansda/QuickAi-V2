import React, { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { FileText, Lightbulb, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {
    const [resumeFile, setResumeFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('');
    const { getToken } = useAuth();
    const { user } = useUser();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setResumeFile(file);
            setFileName(file.name);
            setContent(''); // Clear previous result
        } else {
            toast.error("Please upload a PDF file.");
        }
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!resumeFile) {
            toast.error("Please upload your resume first.");
            return;
        }
        setLoading(true);
        setContent('');
        try {
            const formData = new FormData();
            formData.append('resume', resumeFile);

            const { data } = await axios.post('/api/ai/resume-review', formData, {
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
                    .markdown-content h2 { font-size: 1.5rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; }
                    .markdown-content p { margin-bottom: 1.25rem; line-height: 1.75; font-size: 1.125rem; }
                    .markdown-content ul { margin-left: 1.5rem; margin-bottom: 1.25rem; list-style-type: disc; }
                    .markdown-content li { margin-bottom: 0.75rem; font-size: 1.125rem; }
                `}
            </style>

            {/* --- THE CHANGES --- */}
            {/* Main container classes now match the other tool pages */}
            <div className="h-full w-full bg-slate-100 p-4 lg:p-6">
                <div className="w-full max-w-7xl mx-auto bg-white border border-slate-200/80 rounded-3xl shadow-2xl shadow-slate-300/60 flex flex-col lg:h-full">
                    <div className="p-6 lg:p-8 border-b border-slate-200/80">
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 text-center">
                            <span className="bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500 bg-clip-text text-transparent animate-gradient">
                                AI Resume Review
                            </span>
                        </h1>
                        <p className="text-center text-lg text-gray-600 mt-4 max-w-2xl mx-auto">Get instant feedback to improve your resume and land your dream job.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 lg:flex-grow lg:min-h-0">
                        <form onSubmit={onSubmitHandler} className="lg:col-span-2 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-slate-200/80 flex flex-col">
                            <div>
                                <label className='text-base font-semibold text-slate-700 block mb-3'>Upload Your Resume</label>
                                <label htmlFor="file-upload" className="relative cursor-pointer w-full h-48 flex flex-col justify-center items-center border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/80 hover:bg-slate-100/80 transition-colors">
                                    <div className="text-center text-slate-400">
                                        <FileText className="w-10 h-10 mx-auto" />
                                        {fileName ? (
                                            <p className="mt-2 text-sm font-semibold text-slate-600">{fileName}</p>
                                        ) : (
                                            <>
                                                <p className="mt-2 text-sm font-semibold">Click to upload or drag & drop</p>
                                                <p className="text-xs mt-1">PDF only</p>
                                            </>
                                        )}
                                    </div>
                                    <input id="file-upload" type="file" accept="application/pdf" onChange={handleFileChange} className="sr-only" required />
                                </label>
                            </div>
                            
                            <div className="flex-grow"></div>

                            <div>
                                <div className="mt-8 bg-teal-50/60 border border-teal-200/60 text-teal-800/80 p-4 rounded-xl text-sm">
                                    <div className="flex items-center gap-3">
                                        <Lightbulb className="w-5 h-5 text-teal-500" />
                                        <h3 className="font-semibold">Pro Tip</h3>
                                    </div>
                                    <p className="mt-2">Ensure your resume is in PDF format for the most accurate review and feedback.</p>
                                </div>

                                <button disabled={loading} className='w-full flex justify-center items-center gap-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold px-4 py-3 mt-6 text-base rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-500/30'>
                                    {loading ? (
                                        <>
                                            <span className='w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin'></span>
                                            <span>Reviewing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FileText className='w-5 h-5' />
                                            <span>Review Resume</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className={`lg:col-span-3 flex flex-col lg:min-h-0 pr-4 lg:pr-0 ${!content ? 'min-h-[50vh]' : ''}`}>
                            <div className="p-6 lg:p-8 lg:flex-grow lg:overflow-y-auto h-full">
                                {loading ? (
                                   <div className='flex flex-col justify-center items-center h-full text-center text-slate-500'>
                                        <Sparkles className="w-12 h-12 mx-auto animate-pulse text-teal-400" />
                                        <p className="mt-4 font-semibold text-lg">Analyzing your resume...</p>
                                        <p className="text-sm">This may take a moment.</p>
                                   </div>
                                ) : !content ? (
                                  <div className="h-full w-full border-2 border-dashed border-slate-300 rounded-2xl flex flex-col justify-center items-center text-center text-slate-400 p-4">
                                        <FileText className='w-12 h-12 mx-auto' />
                                        <p className="mt-4 text-base font-medium">Your analysis results will appear here.</p>
                                  </div>
                                ) : (
                                  <div className='prose prose-slate max-w-none'>
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

export default ReviewResume;