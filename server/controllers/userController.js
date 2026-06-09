import { clerkClient } from "@clerk/express";
import sql from "../configs/db.js";

export const getDashboardData = async (req, res) => {
    try {
        const { userId } = req.auth();
        const user = await clerkClient.users.getUser(userId);
        
        const free_usage = user?.privateMetadata?.free_usage || 0;
        const plan = req.plan || 'free';

        const creations = await sql`SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT 15`;

        const totalStats = await sql`SELECT COUNT(*) as total_count FROM creations WHERE user_id = ${userId}`;

        const articles = await sql`SELECT content FROM creations WHERE user_id = ${userId} AND type = 'article'`;
        
        let wordCount = 0;
        articles.forEach(item => {
            if (item.content) {
                wordCount += item.content.split(/\s+/).length;
            }
        });

        res.json({
            success: true,
            dashboardData: {
                creations,
                stats: {
                    totalGenerations: totalStats[0].total_count,
                    wordsWritten: wordCount,
                    creditUsage: free_usage,
                    plan: plan
                }
            }
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getUserCreations = async ( req, res) => {
    try {
        const {userId} = req.auth();
        const creations = await sql`SELECT * FROM creations where user_id = ${userId} ORDER BY created_at DESC`;
        res.json({success: true, creations});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const getPublishedCreations = async ( req, res) => {
    try {
        const creations = await sql`SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC`;
        res.json({success: true, creations});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const toggleLikeCreations = async ( req, res) => {
    try {
        const {userId} = req.auth();
        const {id} = req.body;
        const [creation] = await sql`SELECT * FROM creations WHERE id=${id}`

        if(!creation) {
            return res.json({success: false, message: "Creation not found"})
        }

        const currentLikes = creation.likes;
        const userIdStr = userId.toString();
        let updatedLikes;
        let message;

        if(currentLikes.includes(userIdStr)) {
            updatedLikes = currentLikes.filter((user) => user !== userIdStr)
            message = "Creation Unliked";
        } else {
            updatedLikes = [...currentLikes, userIdStr];
            message = "Creation Liked";
        }

        const formattedArray = `{${updatedLikes.join(',')}}`
        await sql`UPDATE creations SET likes = ${formattedArray}::text[] WHERE id = ${id}`;
        res.json({success: true, message});

    } catch (error) {
        res.json({success: false, message: error.message});
    }
}