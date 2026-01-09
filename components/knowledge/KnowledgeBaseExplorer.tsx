
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BookOpen, Search, Plus, Tag, Eye, Edit2, Trash2 } from 'lucide-react';
import { useKnowledgeBaseLogic } from '../../hooks/domain/useKnowledgeBaseLogic';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ArticleEditor } from './ArticleEditor';
import { EmptyGrid } from '../common/EmptyGrid';

export const KnowledgeBaseExplorer: React.FC = () => {
    const theme = useTheme();
    const {
        articles, categories, selectedCategory, setSelectedCategory,
        searchTerm, setSearchTerm, isEditorOpen, setIsEditorOpen,
        editingArticle, handleCreate, handleEdit, handleSave, handleDelete
    } = useKnowledgeBaseLogic();

    return (
        <div className={`h-full flex flex-col ${theme.layout.pagePadding}`}>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className={theme.typography.h2}>Knowledge Base</h2>
                    <p className={theme.typography.small}>Centralized repository for SOPs and Best Practices.</p>
                </div>
                <Button icon={Plus} onClick={handleCreate}>New Article</Button>
            </div>

            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <Input 
                        className="pl-9" 
                        placeholder="Search articles..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 text-xs font-bold rounded transition-all ${selectedCategory === cat ? 'bg-white shadow text-nexus-700' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {articles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map(article => (
                            <div key={article.id} className={`${theme.components.card} p-5 hover:border-nexus-300 transition-all flex flex-col group`}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">{article.category}</span>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEdit(article)} className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-nexus-600"><Edit2 size={14}/></button>
                                        <button onClick={() => handleDelete(article.id)} className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-red-500"><Trash2 size={14}/></button>
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2">{article.title}</h3>
                                <p className="text-xs text-slate-500 line-clamp-3 mb-4 flex-1">{article.content.replace(/<[^>]*>?/gm, '')}</p>
                                
                                <div className="flex justify-between items-center pt-4 border-t border-slate-100 text-xs text-slate-400">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1"><Eye size={12}/> {article.views}</span>
                                        <span className="flex items-center gap-1"><Tag size={12}/> {article.tags.length}</span>
                                    </div>
                                    <span>{article.lastUpdated}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <EmptyGrid 
                            title="No Articles Found"
                            description="Create the first knowledge article for this category."
                            icon={BookOpen}
                            actionLabel="Write Article"
                            onAdd={handleCreate}
                        />
                    </div>
                )}
            </div>

            <ArticleEditor 
                isOpen={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                article={editingArticle}
                onSave={handleSave}
            />
        </div>
    );
};
