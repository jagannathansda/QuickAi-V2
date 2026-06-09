"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AuroraText } from "../components/ui/aurora-text";
import { CardSpotlight } from "../components/ui/card-spotlight";
import Orb from "../components/background/orb";
import { Heart, Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getToken, userId } = useAuth();

  useEffect(() => {
    const fetchCommunityPosts = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/get-published-creations`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setPosts(response.data.creations);
        }
      } catch (error) {
        console.error("Posts fetch fail:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCommunityPosts();
  }, [getToken]);

  const toggleLike = async (id) => {
    try {
      const token = await getToken();
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/user/toggle-like-creations`, 
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state for UI
      setPosts(prev => prev.map(post => {
        if (post.id === id) {
          const isLiked = post.likes.includes(userId);
          const newLikes = isLiked 
            ? post.likes.filter(uid => uid !== userId) 
            : [...post.likes, userId];
          return { ...post, likes: newLikes };
        }
        return post;
      }));
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  if (isLoading) {
    return (
      <main style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
        <Loader2 className="animate-spin" color="#06b6d4" size={40} />
      </main>
    );
  }

  return (
    <main className="community-main" style={{ position: 'relative', width: '100%', minHeight: '100vh', fontFamily: '"Inter", "Poppins", system-ui, sans-serif', overflowX: 'hidden' }}>
      
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, pointerEvents: 'none' }}>
        <Orb hoverIntensity={0.3} rotateOnHover={true} />
      </div>

      <style>{`
        * { box-sizing: border-box; }
        .community-wrapper
        { width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 20px 40px;
          display: flex;
          flex-direction: column; 
         }
        .uniform-grid 
        { display: grid; 
         grid-template-columns: repeat(4, 1fr); 
         gap: 20px; 
         width: 100%; 
        }
        .glass-card 
        { background-color: rgba(15, 15, 15, 0.4); 
         backdrop-filter: blur(16px); 
         border: 1px solid rgba(255, 255, 255, 0.08); 
         border-radius: 20px; 
         padding: 4px !important; 
         transition: transform 0.3s ease; 
         height: 100%; 
        }
        .glass-card:hover 
        { transform: translateY(-6px); 
         border-color: rgba(6, 182, 212, 0.5); 
        }
        .image-container 
        { width: 100%; 
         aspect-ratio: 3 / 4; 
         position: relative; 
         overflow: hidden; 
         border-radius: 16px; 
        }
        .image-container img 
        { width: 100%; 
         height: 100%; 
         object-fit: cover; }
        .card-overlay 
        { position: absolute; 
         bottom: 0; 
         left: 0; 
         width: 100%; 
         padding: 40px 14px 14px; 
         background: linear-gradient(to top, rgba(0,0,0,0.95), transparent); 
        }
        .prompt-text 
        { color: #f3f4f6; 
         font-size: 13px; 
         margin: 0 0 10px 0; 
         -webkit-line-clamp: 2; 
         display: -webkit-box; 
         -webkit-box-orient: vertical; 
         overflow: hidden; 
        }
        @media (max-width: 1024px) { .uniform-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) { .uniform-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>

      <div className="community-wrapper">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "900", color: "white" }}>Community <AuroraText>Showcase</AuroraText></h1>
          <p style={{ color: "#a1a1aa", fontSize: "clamp(13px, 2vw, 15px)", maxWidth: "500px", margin: "0 auto", lineHeight: "1.0", padding: "0 10px" }}>Explore stunning art and 3D models shared by our global community.</p>
        </div>

        <div className="uniform-grid">
          {posts.map((post, index) => {
            const isLiked = post.likes.includes(userId);
            return (
              <motion.div key={post.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                <CardSpotlight color="rgba(6, 182, 212, 0.1)" glowColor="#06b6d4" className="glass-card">
                  <div className="image-container">
                    <img src={post.content} alt="Generation" loading="lazy" />
                    <div className="card-overlay">
                      <p className="prompt-text">"{post.prompt}"</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#06b6d4', fontSize: '12px', fontWeight: '700' }}>User ID: {post.user_id.slice(-6)}</span>
                        <button 
                          onClick={() => toggleLike(post.id)}
                          style={{ 
                            background: isLiked ? 'rgba(239, 68, 68, 0.25)' : 'rgba(0,0,0,0.6)', 
                            border: '1px solid rgba(255,255,255,0.15)', borderRadius: '20px', padding: '5px 10px', 
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: isLiked ? '#ef4444' : '#fff' 
                          }}
                        >
                          <Heart size={12} fill={isLiked ? "#ef4444" : "none"} strokeWidth={2.5} />
                          <span style={{ fontSize: '12px', fontWeight: '800' }}>{post.likes.length}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </CardSpotlight>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}