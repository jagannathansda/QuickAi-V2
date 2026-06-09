import React from 'react';
import { Twitter, Linkedin, Github } from 'lucide-react'; // Example icons

const Footer = () => {
    return (
        <footer className="w-full px-4 sm:px-8 md:px-16 pt-16 pb-8 bg-slate-50 ">
            <div className="max-w-7xl mx-auto">
                {/* --- Top Section: Logo, Links, and Newsletter --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-slate-200 ">
                    
                    {/* Logo and Description */}
                    <div className="lg:col-span-2">
                        <div className="text-2xl font-bold text-slate-800  flex items-center gap-2 mb-4">
                            <span className="text-2xl text-purple-600">✳︎</span>
                            <span>Quick.ai</span>
                        </div>
                        <p className="text-base text-slate-600  max-w-sm">
                            Experience the power of AI. Transform your content creation with our suite of premium tools.
                        </p>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-base font-semibold text-slate-900  mb-4">Company</h3>
                        <ul className="space-y-3 text-slate-600 ">
                            <li><a href="#" className="hover:text-purple-600 transition-colors">Home</a></li>
                            <li><a href="#" className="hover:text-purple-600 transition-colors">About us</a></li>
                            <li><a href="#" className="hover:text-purple-600 transition-colors">Contact us</a></li>
                            <li><a href="#" className="hover:text-purple-600 transition-colors">Privacy policy</a></li>
                        </ul>
                    </div>

                    {/* Subscribe to Newsletter */}
                    <div>
                        <h3 className="text-base font-semibold text-slate-900  mb-4">Subscribe to our newsletter</h3>
                        <p className="mb-4 text-slate-600 ">The latest news, articles, and resources, sent to your inbox weekly.</p>
                        <form className="flex flex-col sm:flex-row gap-2">
                            <input 
                                className="w-full h-10 px-3 rounded-lg bg-white  border border-slate-300 dark:border-slate-700
                                           focus:outline-none focus:ring-2 focus:ring-purple-500" 
                                type="email" 
                                placeholder="Enter your email" 
                            />
                            <button 
                                type="submit"
                                className="px-5 h-10 rounded-lg font-semibold bg-slate-900 text-white 
                                           hover:bg-slate-800  transition-colors shrink-0"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* --- Bottom Section: Copyright and Socials --- */}
                <div className="flex flex-col-reverse sm:flex-row items-center justify-between pt-8 gap-4">
                    <p className="text-sm text-slate-500 ">
                        Copyright {new Date().getFullYear()} © Quick.ai. All Right Reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="#" className="text-slate-500 hover:text-purple-600 transition-colors"><Twitter size={20} /></a>
                        <a href="#" className="text-slate-500 hover:text-purple-600 transition-colors"><Linkedin size={20} /></a>
                        <a href="#" className="text-slate-500 hover:text-purple-600 transition-colors"><Github size={20} /></a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
