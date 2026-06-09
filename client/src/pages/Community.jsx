import { useAuth, useUser } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react';
import { Heart, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
    const [creations, setCreations] = useState([]);
    const { user } = useUser();
    const [loading, setLoading] = useState(true);
    const { getToken } = useAuth();

    const fetchCreations = async () => {
        try {
            const { data } = await axios.get('/api/user/get-published-creations', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            if (data.success) {
                setCreations(data.creations);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
        setLoading(false);
    };

    const imageLikeToggle = async (id) => {
        try {
            const { data } = await axios.post('/api/user/toggle-like-creations', { id }, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            if (data.success) {
                toast.success(data.message);
                await fetchCreations();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (user) {
            fetchCreations();
        }
    }, [user]);

    const SkeletonLoader = () => (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
            <div className="w-full aspect-square bg-slate-200"></div>
            <div className="p-4">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="flex justify-end items-center mt-2">
                    <div className="h-4 bg-slate-200 rounded w-6"></div>
                </div>
            </div>
        </div>
    );

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
            <div className="h-full w-full bg-slate-100 p-4 lg:p-6 overflow-y-auto">
                <div className="w-full max-w-7xl mx-auto">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-800">
                            <span className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent animate-gradient">
                                Community Showcase
                            </span>
                        </h1>
                        <p className="text-slate-500 mt-2">Explore creations from our talented community.</p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array.from({ length: 8 }).map((_, index) => <SkeletonLoader key={index} />)}
                        </div>
                    ) : creations.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {creations.map((creation) => (
                                <div key={creation.id} className='bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1'>
                                    <div className="aspect-square w-full overflow-hidden">
                                        <img src={creation.content} alt={creation.prompt} className='w-full h-full object-cover'/>
                                    </div>
                                    <div className="p-4 flex justify-between items-center">
                                        <p className='text-slate-600 text-sm font-medium leading-snug truncate pr-4'>{creation.prompt}</p>
                                        <div className='flex items-center justify-end gap-2 text-slate-500 flex-shrink-0'>
                                            <p className="font-semibold text-sm">{creation.likes.length}</p>
                                            <Heart
                                                onClick={() => imageLikeToggle(creation.id)}
                                                className={`w-5 h-5 cursor-pointer transition-transform active:scale-90 ${creation.likes.includes(user.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <ImageIcon className="w-16 h-16 mx-auto text-slate-400" />
                            <h3 className="mt-4 text-lg font-semibold text-slate-600">No Creations Yet</h3>
                            <p className="mt-1 text-sm text-slate-500">Be the first to create and publish an image!</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Community;