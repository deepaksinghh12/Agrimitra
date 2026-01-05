"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, MessageSquare, ThumbsUp, User, Plus, Send } from "lucide-react";

type Comment = {
    id: number;
    author: string;
    text: string;
    timestamp: string;
};

type Post = {
    id: number;
    author: string;
    title: string;
    content: string;
    likes: number;
    comments: Comment[];
    timestamp: string;
    tag: string;
};

const initialPosts: Post[] = [
    {
        id: 1,
        author: "Ramesh Kumar",
        title: "Best fertilizer for Wheat?",
        content: "I am sowing wheat this week. Which NPK ratio is best for the initial stage? Using DAP currently.",
        likes: 12,
        comments: [
            { id: 1, author: "Suresh", text: "DAP is good. Add some Potash too.", timestamp: "2h ago" },
            { id: 2, author: "Dr. Singh", text: "NPK 12:32:16 is recommended for basal dose.", timestamp: "1h ago" }
        ],
        timestamp: "4h ago",
        tag: "Wheat"
    },
    {
        id: 2,
        author: "Anita Devi",
        title: "Tomato price trend",
        content: "Prices are dropping in Mandi. Should I hold my harvest for a week?",
        likes: 8,
        comments: [
            { id: 3, author: "Vikram", text: "Heavy rains expected, prices might go up next week.", timestamp: "30m ago" }
        ],
        timestamp: "1d ago",
        tag: "Market"
    },
    {
        id: 3,
        author: "Kishan Singh",
        title: "Paddy leaf turning yellow",
        content: "My paddy crop is 40 days old and leaves are turning yellow at the tips. Is this Zinc deficiency?",
        likes: 15,
        comments: [
            { id: 4, author: "AgriMitra User", text: "Yes, looks like Khaira disease. Spray Zinc Sulphate.", timestamp: "5h ago" }
        ],
        timestamp: "2d ago",
        tag: "Disease"
    },
    {
        id: 4,
        author: "Rajeshwari",
        title: "PM-KISAN installment date?",
        content: "When is the 17th installment of PM-KISAN coming? Has anyone received it?",
        likes: 45,
        comments: [
            { id: 5, author: "Sunil", text: "Government announced it for next month.", timestamp: "1d ago" }
        ],
        timestamp: "2d ago",
        tag: "Scheme"
    },
    {
        id: 5,
        author: "Manoj Verma",
        title: "Best tractor for small farm",
        content: "I have 3 acres. Looking for a mini tractor. Mahindra or Swaraj?",
        likes: 6,
        comments: [],
        timestamp: "3d ago",
        tag: "Machinery"
    }
];

export default function ForumPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPostTitle, setNewPostTitle] = useState("");
    const [newPostContent, setNewPostContent] = useState("");
    const [showNewPost, setShowNewPost] = useState(false);
    const [language, setLanguage] = useState<"en" | "hi">("en");

    // Load from local storage or init
    useEffect(() => {
        const saved = localStorage.getItem("kisan_forum_posts");
        if (saved) {
            setPosts(JSON.parse(saved));
        } else {
            setPosts(initialPosts);
        }
    }, []);

    // Save to local storage whenever posts change
    useEffect(() => {
        if (posts.length > 0) {
            localStorage.setItem("kisan_forum_posts", JSON.stringify(posts));
        }
    }, [posts]);

    const handleLike = (id: number) => {
        setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
    };

    const handleCreatePost = () => {
        if (!newPostTitle.trim() || !newPostContent.trim()) return;

        const newPost: Post = {
            id: Date.now(),
            author: "You", // Mock user
            title: newPostTitle,
            content: newPostContent,
            likes: 0,
            comments: [],
            timestamp: "Just now",
            tag: "General"
        };

        setPosts([newPost, ...posts]);
        setNewPostTitle("");
        setNewPostContent("");
        setShowNewPost(false);
    };

    return (
        <div className="min-h-screen bg-green-50 p-4 font-sans pb-24">
            <div className="max-w-md mx-auto space-y-4">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/">
                            <Button variant="ghost" size="icon" className="hover:bg-green-100">
                                <ArrowLeft className="w-5 h-5 text-green-700" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-green-800">
                                {language === 'en' ? 'Kisan Forum' : 'किसान चर्चा'}
                            </h1>
                            <p className="text-xs text-green-600">
                                {language === 'en' ? 'Community for Farmers' : 'किसानों का समुदाय'}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLanguage(language === "en" ? "hi" : "en")}
                        className="bg-white text-green-700 border-green-200"
                    >
                        {language === "en" ? "हिंदी" : "English"}
                    </Button>
                </div>

                {/* Create Post Button */}
                {!showNewPost ? (
                    <Card
                        className="border-green-200 bg-white cursor-pointer hover:shadow-md transition-all"
                        onClick={() => setShowNewPost(true)}
                    >
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <User className="w-6 h-6" />
                            </div>
                            <div className="flex-1 bg-gray-100 rounded-full h-10 flex items-center px-4 text-gray-500 text-sm">
                                {language === 'en' ? 'Ask a question or share a tip...' : 'एक सवाल पूछें या टिप साझा करें...'}
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="border-green-200 shadow-md animate-in slide-in-from-top-2">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base text-green-800">New Post</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Input
                                placeholder="Title (e.g., Best crop for June?)"
                                value={newPostTitle}
                                onChange={(e) => setNewPostTitle(e.target.value)}
                            />
                            <Textarea
                                placeholder="Describe your question..."
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                            />
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" onClick={() => setShowNewPost(false)}>Cancel</Button>
                                <Button className="bg-green-600 hover:bg-green-700" onClick={handleCreatePost}>Post</Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Posts Feed */}
                <div className="space-y-4">
                    {posts.map((post) => (
                        <Card key={post.id} className="border-green-100 shadow-sm">
                            <CardContent className="p-4">
                                {/* Post Header */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                                            {post.author[0]}
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-gray-800">{post.author}</div>
                                            <div className="text-xs text-gray-500">{post.timestamp}</div>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-100">
                                        {post.tag}
                                    </Badge>
                                </div>

                                {/* Post Content */}
                                <h3 className="font-bold text-gray-900 mb-1">{post.title}</h3>
                                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                    {post.content}
                                </p>

                                {/* Actions */}
                                <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                                    <button
                                        onClick={() => handleLike(post.id)}
                                        className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-green-600 transition-colors"
                                    >
                                        <ThumbsUp className={`w-4 h-4 ${post.likes > 0 ? 'fill-green-100 text-green-600' : ''}`} />
                                        <span>{post.likes}</span>
                                    </button>
                                    <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-green-600 transition-colors">
                                        <MessageSquare className="w-4 h-4" />
                                        <span>{post.comments.length}</span>
                                    </button>
                                </div>

                                {/* Comments Preview */}
                                {post.comments.length > 0 && (
                                    <div className="mt-3 bg-gray-50 p-3 rounded-lg text-xs space-y-2">
                                        {post.comments.map(c => (
                                            <div key={c.id}>
                                                <span className="font-semibold text-gray-700">{c.author}: </span>
                                                <span className="text-gray-600">{c.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

            </div>
        </div>
    );
}
