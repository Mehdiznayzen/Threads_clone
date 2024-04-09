'use server';

import { revalidatePath } from "next/cache"
import { Thread } from "../models/thread.model"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"

// For creating threads
interface createThreadParams {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
}

// for creating threads
export const createThread = async ({ author, communityId, path, text } : createThreadParams) => {
    try {
        connectToDB()

        // create thread
        const createThread = await Thread.create({
            text,
            author,
            community : null
        })

        // Update User model
        await User.findByIdAndUpdate(author, {
            $push: { threads: createThread._id },
        });

        revalidatePath(path)
    } catch (error : any) {
        throw new Error(`Failed to create new thread : ${error.message}`)
    }
}

// For fetching the posts
export const fetchPosts = async (pageNumber = 1, pageSize = 20) => {
    try {
        connectToDB()

        // Calculate the number of posts of skip
        const skipAmount = (pageNumber -1) * pageSize

        // fetch the posts that have no parents
        const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
            .sort({ createdAt : 'desc' })
            .skip(skipAmount)
            .limit(pageSize)
            .populate({
                path: "author",
                model: User,
            })
            .populate({
                path: "children", // Populate the children field
                populate: {
                    path: "author", // Populate the author field within children
                    model: User,
                    select: "_id name parentId image", // Select only _id and username fields of the author
                },
            });

            const totalPostsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } })

            const posts = await postsQuery.exec()
            
            const isNext = totalPostsCount > skipAmount + posts.length;

            return { posts, isNext };

    } catch (error : any) {
        throw new Error(`Failed to fetch posts ${error.message}`)
    }
}

// for fetching thread by id
export const fetchThreadById = async (id : string) => {
    connectToDB()
    try {
        // TODO : Populate community

        const thread = await Thread.findById(id)
        .populate({
            path : 'author',
            model : User,
            select: '_id id name image'
        })
        .populate({
            path: 'children',
            model : Thread,
            populate : [
                {
                    path : 'author',
                    select: '_id id name parentId image'
                }
            ]
        }).exec()

        return thread
    } catch (error : any) {
        throw new Error(`Failed to fetch a thread ${error.message}`)
    }
}

// for add comment into the post 
export const addCommentToThread = async (threadId : string, userId: string, commentText : string, path : string) => {
    connectToDB()
    try {
        // Find the original thread by its ID
        const originalThread = await Thread.findById(threadId);
    
        if (!originalThread) {
            throw new Error("Thread not found");
        }
    
        // Create the new comment thread
        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId, // Set the parentId to the original thread's ID
        });
    
        // Save the comment thread to the database
        const savedCommentThread = await commentThread.save();
    
        // Add the comment thread's ID to the original thread's children array
        originalThread.children.push(savedCommentThread._id);
    
        // Save the updated original thread to the database
        await originalThread.save();
    
        revalidatePath(path);
    } catch (err) {
        console.error("Error while adding comment:", err);
        throw new Error("Unable to add comment");
    }
}