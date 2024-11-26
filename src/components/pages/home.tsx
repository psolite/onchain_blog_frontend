"use client"

import React, { useEffect, useState } from 'react';
import { getPosts } from '../anchor/setup';

export interface Post {
    id: string;
    title: string;
    content: string;
    author: string;
    createdAt: any;
    updatedAt: any;
    isPublished: boolean;
}

const HomePage: React.FC<{ user?: string }> = ({ user }) => {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        // Fetch posts from an API or a local source
        const fetchPosts = async () => {
            // Replace with your data fetching logic
            const response = await getPosts();
            // const data = await response.json();
            setPosts(response.slice(0, 10)); // Limit to 10 posts
        };

        fetchPosts();
    }, []);

    return (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {posts.map((post) => (
                user && post.author === user ? (
                    <div key={post.id} className="bg-white p-6 rounded-lg shadow-md mt-4">
                        <a href={`/post/${post.id}`}>
                            <h2 className="text-2xl font-semibold mb-4">{post.title}</h2>
                            <p className="text-gray-700">{post.content.slice(0, 100)}</p>
                            <div className='flex items-center justify-between mt-4'>
                                <p className="text-sm text-gray-500">Author: {post.author.slice(0, 4)}...{post.author.slice(-4)}</p>
                                <p className="text-sm text-gray-500">Created At: {new Date(post.createdAt).toLocaleString()}</p>
                            </div>
                        </a>
                    </div>
                ) : (
                    <div key={post.id} className="bg-white p-6 rounded-lg shadow-md">
                        <a href={`/post/${post.id}`}>
                            <h2 className="text-2xl font-semibold mb-4">{post.title}</h2>
                            <p className="text-gray-700">{post.content.slice(0, 100)}</p>
                            <div className='flex items-center justify-between mt-4'>
                                <p className="text-sm text-gray-500">Author: {post.author.slice(0, 4)}...{post.author.slice(-4)}</p>
                                <p className="text-sm text-gray-500">Created At: {new Date(post.createdAt).toLocaleString()}</p>
                            </div>
                        </a>
                    </div>
                )
            ))}
        </div>
    )
}
export default HomePage;