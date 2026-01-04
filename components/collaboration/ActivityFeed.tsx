
import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Share2, MoreHorizontal, CheckCircle, FileText, AlertTriangle, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ActivityItem } from '../../types';

// Simple time-ago formatter if date-fns isn't available
const timeAgo = (dateStr: string) => {
    try {
        const date = new Date(dateStr);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (seconds < 60) return 'just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    } catch {
        return dateStr;
    }
};

export const ActivityFeed: React.FC = () => {
    const theme = useTheme();
    const { state, dispatch } = useData();
    const { user } = useAuth();
    const [input, setInput] = useState('');

    const activities = state.activities || [];

    const handlePost = () => {
        if (!input.trim() || !user) return;
        const newPost: ActivityItem = {
            id: Date.now(),
            userId: user.id,
            userName: user.name,
            userAvatar: user.avatar,
            action: 'posted an update',
            target: '',
            type: 'post',
            content: input,
            timestamp: new Date().toISOString(),
            likes: 0,
            comments: 0
        };
        dispatch({ type: 'ADD_ACTIVITY', payload: newPost });
        setInput('');
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'approval': return <CheckCircle size={16} className="text-green-500" />;
            case 'alert': return <AlertTriangle size={16} className="text-red-500" />;
            case 'upload': return <FileText size={16} className="text-blue-500" />;
            default: return <MessageSquare size={16} className="text-slate-400" />;
        }
    };

    return (
        <div className={`h-full flex flex-col ${theme.colors.background}`}>
            {/* Input Area */}
            <div className={`p-4 border-b ${theme.colors.border} ${theme.colors.surface}`}>
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 overflow-hidden">
                         <img src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Me"} alt="Me" />
                    </div>
                    <div className="flex-1">
                        <textarea 
                            className={`w-full p-3 border ${theme.colors.border} rounded-xl resize-none focus:ring-2 focus:ring-nexus-500 outline-none text-sm min-h-[80px]`}
                            placeholder="Share an update, ask a question, or log a decision..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <div className="flex justify-end mt-2">
                            <Button size="sm" onClick={handlePost} disabled={!input.trim()}>Post Update</Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {activities.map((item) => (
                    <Card key={item.id} className="p-5 flex gap-4">
                        <div className="flex-shrink-0">
                            {item.userAvatar ? (
                                <img src={item.userAvatar} alt={item.userName} className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                                    <User size={20}/>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <div className="text-sm">
                                    <span className="font-bold text-slate-900">{item.userName}</span>
                                    <span className="text-slate-500 mx-1">{item.action}</span>
                                    <span className="font-medium text-nexus-700">{item.target}</span>
                                </div>
                                <span className="text-xs text-slate-400 whitespace-nowrap">{timeAgo(item.timestamp)}</span>
                            </div>

                            {item.content && (
                                <div className="mt-2 text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    {item.content}
                                </div>
                            )}

                            <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 font-medium">
                                <button className="flex items-center gap-1.5 hover:text-nexus-600 transition-colors">
                                    <ThumbsUp size={14}/> {item.likes} Likes
                                </button>
                                <button className="flex items-center gap-1.5 hover:text-nexus-600 transition-colors">
                                    <MessageSquare size={14}/> {item.comments} Comments
                                </button>
                                <button className="flex items-center gap-1.5 hover:text-nexus-600 transition-colors ml-auto">
                                    <Share2 size={14}/> Share
                                </button>
                            </div>
                        </div>
                        <div className="text-slate-300">
                            {getTypeIcon(item.type)}
                        </div>
                    </Card>
                ))}
                
                <div className="text-center py-6 text-slate-400 text-xs uppercase tracking-widest font-bold">
                    End of Stream
                </div>
            </div>
        </div>
    );
};
