
import React, { useState, useEffect } from 'react';
import { KnowledgeArticle } from '../../types/business';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Save } from 'lucide-react';

interface ArticleEditorProps {
    isOpen: boolean;
    onClose: () => void;
    article: KnowledgeArticle | null;
    onSave: (article: KnowledgeArticle) => void;
}

export const ArticleEditor: React.FC<ArticleEditorProps> = ({ isOpen, onClose, article, onSave }) => {
    const [formData, setFormData] = useState<Partial<KnowledgeArticle>>({});

    useEffect(() => {
        if (article) setFormData(article);
    }, [article, isOpen]);

    const handleSave = () => {
        if (formData.title && formData.content) {
            onSave(formData as KnowledgeArticle);
        }
    };

    return (
        <SidePanel
            isOpen={isOpen}
            onClose={onClose}
            title={article?.id ? 'Edit Article' : 'New Knowledge Article'}
            width="md:w-[800px]"
            footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={handleSave} icon={Save}>Save Article</Button></>}
        >
            <div className="space-y-6">
                <Input label="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Article Title" />
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                        <select 
                            className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value})}
                        >
                            <option>General</option>
                            <option>Finance</option>
                            <option>Engineering</option>
                            <option>Safety</option>
                            <option>Compliance</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Tags (comma separated)</label>
                        <Input 
                            value={formData.tags?.join(', ')} 
                            onChange={e => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim())})} 
                            placeholder="e.g. Policy, SOP"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Content (HTML)</label>
                    <textarea 
                        className="w-full p-4 border border-slate-300 rounded-lg text-sm h-96 font-mono focus:ring-2 focus:ring-nexus-500 outline-none"
                        value={formData.content}
                        onChange={e => setFormData({...formData, content: e.target.value})}
                        placeholder="<p>Article content goes here...</p>"
                    />
                </div>
            </div>
        </SidePanel>
    );
};
