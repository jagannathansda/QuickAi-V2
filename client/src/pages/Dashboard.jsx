import React, { useEffect, useState } from 'react';
import { Gem, Sparkles, Lightbulb } from 'lucide-react';
import { Protect, useAuth } from '@clerk/clerk-react';
import CreationItem from '../components/CreationItem';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
    const [creations, setCreations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getToken } = useAuth();

    const getDashboardData = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/user/get-user-creations', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });

            if (data.success) {
                // Sort creations to show the most recent ones first
                const sortedCreations = data.creations.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setCreations(sortedCreations);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message || "Failed to fetch creations.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDashboardData();
    }, []);

    // Loader Component
    const Loader = () => (
        <div className='flex flex-col justify-center items-center h-full min-h-64 text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent mb-4'></div>
            <p className='text-slate-600 font-medium'>Loading Your Creations...</p>
        </div>
    );

    // Empty State Component
    const EmptyState = () => (
        <div className='text-center p-8 mt-6 bg-white rounded-xl border border-dashed border-slate-300'>
            <div className='flex justify-center items-center mx-auto w-16 h-16 bg-slate-100 rounded-full mb-4'>
                <Lightbulb className='w-8 h-8 text-slate-500' />
            </div>
            <h3 className='text-xl font-semibold text-slate-800'>No Creations Yet</h3>
            <p className='text-slate-500 mt-2 mb-4'>Your creative journey starts here. Let's make something amazing!</p>
            <button className='bg-violet-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-violet-700 transition-colors'>
                Start Creating
            </button>
        </div>
    );

    return (
        <div className='h-full bg-slate-50 overflow-y-scroll p-4 sm:p-6 md:p-8'>
            <div className='max-w-7xl mx-auto'>
                {/* --- Header --- */}
                <header>
                    <h1 className='text-3xl font-bold text-slate-900'>Dashboard</h1>
                    <p className='text-slate-500 mt-1'>Welcome back! Here's a summary of your activity.</p>
                </header>

                {/* --- Stats Grid --- */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 my-8'>
                    {/* Stat Card 1: Total Creations */}
                    <div className='flex items-center p-5 bg-white rounded-xl border border-slate-200 shadow-sm'>
                        <div className='flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center'>
                            <Sparkles className='w-6 h-6' />
                        </div>
                        <div className='ml-4'>
                            <p className='text-sm text-slate-500'>Total Creations</p>
                            <h2 className='text-2xl font-bold text-slate-800'>{loading ? '...' : creations.length}</h2>
                        </div>
                    </div>
                    {/* Stat Card 2: Active Plan */}
                    <div className='flex items-center p-5 bg-white rounded-xl border border-slate-200 shadow-sm'>
                        <div className='flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] text-white flex justify-center items-center'>
                            <Gem className='w-6 h-6' />
                        </div>
                        <div className='ml-4'>
                            <p className='text-sm text-slate-500'>Active Plan</p>
                            <h2 className='text-2xl font-bold text-slate-800'>
                                <Protect plan="premium" fallback="Free">Premium</Protect>
                            </h2>
                        </div>
                    </div>
                </div>

                {/* --- Recent Creations Section --- */}
                <section>
                    <h2 className='text-xl font-bold text-slate-900 mb-4'>Recent Creations</h2>
                    {loading ? (
                        <Loader />
                    ) : creations.length > 0 ? (
                        <div className='space-y-4'>
                            {creations.map((item) => (
                                <CreationItem key={item.id} item={item} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState />
                    )}
                </section>
            </div>
        </div>
    );
};

export default Dashboard;