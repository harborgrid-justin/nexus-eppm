
import React from 'react';
import { BookOpen, Calendar, User, Share2, ThumbsUp, Eye } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { Badge } from '../ui/Badge';

export const KnowledgeBaseArticle: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    const article = state.knowledgeBase[0]; // Display first for demo

    if (!article) return <div className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl m-6">No articles available in Knowledge Base.</div>;

    const authorName = state.users.find(u => u.id === article.authorId)?.name || article.authorId;

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} bg-slate-50 flex justify-center`}>
            <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Main Article */}
                <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="h-48 bg-gradient-to-r from-nexus-800 to-slate-900 relative">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <div className="absolute bottom-6 left-8 text-white">
                            <Badge variant="info" className="mb-3 bg-white/20 text-white border-white/20 backdrop-blur-sm">{article.sopNumber || article.id}</Badge>
                            <h1 className="text-3xl font-black tracking-tight mb-2">{article.title}</h1>
                            <p className="text-slate-300 text-sm">{article.category} Guidelines</p>
                        </div>
                    </div>
                    
                    <div className="p-8 md:p-12 prose prose-slate max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: article.content }} />
                    </div>
                    
                    <div className="p-8 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div className="flex gap-4">
                            <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-nexus-600 transition-colors"><ThumbsUp size={16}/> Helpful (42)</button>
                            <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-nexus-600 transition-colors"><Share2 size={16}/> Share</button>
                        </div>
                        <div className="text-xs text-slate-400">
                            Last edited: {article.lastUpdated}
                        </div>
                    </div>
                </div>

                {/* Sidebar Metadata */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">Meta Data</h4>
                        <div className="space-y-4 text-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><User size={16}/></div>
                                <div>
                                    <p className="font-bold text-slate-700">{authorName}</p>
                                    <p className="text-xs text-slate-500">Author</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><Calendar size={16}/></div>
                                <div>
                                    <p className="font-bold text-slate-700">{article.lastUpdated}</p>
                                    <p className="text-xs text-slate-500">Published</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><Eye size={16}/></div>
                                <div>
                                    <p className="font-bold text-slate-700">{article.views.toLocaleString()}</p>
                                    <p className="text-xs text-slate-500">Views</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-slate-100">
                             <h4 className="font-bold text-slate-800 mb-2 text-xs uppercase tracking-wider">Tags</h4>
                             <div className="flex flex-wrap gap-2">
                                 {article.tags.map(tag => (
                                     <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium hover:bg-slate-200 cursor-pointer transition-colors border border-slate-200">{tag}</span>
                                 ))}
                             </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">Related Articles</h4>
                        <ul className="space-y-3">
                            <li className="text-sm text-nexus-600 hover:underline cursor-pointer flex items-center gap-2"><BookOpen size={14}/> Budget Transfer Policy</li>
                            <li className="text-sm text-nexus-600 hover:underline cursor-pointer flex items-center gap-2"><BookOpen size={14}/> WBS Coding Standards</li>
                            <li className="text-sm text-nexus-600 hover:underline cursor-pointer flex items-center gap-2"><BookOpen size={14}/> Vendor Onboarding Guide</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
