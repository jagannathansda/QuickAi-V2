import React from 'react';
import { Protect, useClerk, useUser } from '@clerk/clerk-react';
import { Eraser, FileText, Hash, House, Image, LogOut, Scissors, SquarePen, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
    { to: '/ai', label: 'Dashboard', Icon: House },
    { to: '/ai/write-article', label: 'Write Article', Icon: SquarePen },
    { to: '/ai/blog-titles', label: 'Blog Titles', Icon: Hash },
    { to: '/ai/generate-images', label: 'Generate Images', Icon: Image },
    { to: '/ai/remove-background', label: 'Remove Background', Icon: Eraser },
    { to: '/ai/remove-object', label: 'Remove Object', Icon: Scissors },
    { to: '/ai/review-resume', label: 'Review Resume', Icon: FileText },
    { to: '/ai/community', label: 'Community', Icon: Users },
];

const Sidebar = ({ sidebar, setSidebar }) => {

    const { user } = useUser();
    const { signOut, openUserProfile } = useClerk();

    // Return null if user data isn't loaded to prevent errors
    if (!user) return null;

    return (
        <div className={`w-60 md:w-72 bg-white border-r border-slate-200 flex flex-col items-center 
                         max-sm:absolute max-sm:top-14 max-sm:bottom-0 z-50 
                         ${sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'} 
                         transition-all duration-300 ease-in-out`}>
            
            {/* --- Main Content Area (Scrollable) --- */}
            <div className='flex-grow w-full overflow-y-auto'>
                <div className='my-7'>
                    <img src={user.imageUrl} alt="User Avatar" className='w-16 md:w-20 h-16 md:h-20 rounded-full mx-auto' />
                    <h1 className='mt-2 text-center font-semibold md:text-base text-slate-800'>{user.fullName}</h1>
                </div>
                
                <div className='px-4 md:px-6 mt-5 text-sm md:text-base font-medium'>
                    {navItems.map(({ to, label, Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/ai'}
                            onClick={() => setSidebar(false)}
                            className={({ isActive }) => 
                                `px-3.5 py-2 md:px-4 md:py-2.5 flex items-center gap-3 md:gap-4 rounded-full mb-1 transition-colors duration-200 ${
                                    isActive 
                                    ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-sm' 
                                    : 'hover:bg-slate-100 text-slate-600'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon className={`w-4 h-4 md:w-5 md:h-5 transition-colors ${isActive ? 'text-white' : 'text-slate-500'}`} />
                                    {label}
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </div>

            {/* --- Sticky Footer Section --- */}
            <div className='w-full border-t border-slate-200 p-4 px-6 flex items-center justify-between shrink-0'>
                <div onClick={openUserProfile} className='flex gap-3 items-center cursor-pointer group'>
                    <img src={user.imageUrl} className='w-9 h-9 md:w-10 md:h-10 rounded-full' alt="User profile" />
                    <div>
                        <h1 className='text-sm md:text-base font-medium text-slate-800 group-hover:text-purple-600 transition-colors'>{user.fullName}</h1>
                        <p className='text-xs md:text-sm text-slate-500'>
                            <Protect plan='premium' fallback="Free Plan">
                                Premium Plan
                            </Protect>
                        </p>
                    </div>
                </div>
                <LogOut onClick={() => signOut()} className='w-5 md:w-5 text-slate-400 hover:text-red-500 transition cursor-pointer' />
            </div>
        </div>
    );
};

export default Sidebar;