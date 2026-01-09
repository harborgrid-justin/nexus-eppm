
import { useState, useMemo, useDeferredValue } from 'react';
import { useData } from '../../context/DataContext';
import { KnowledgeArticle } from '../../types/business';
import { useAuth } from '../../context/AuthContext';
import { generateId } from '../../utils/formatters';

export const useKnowledgeBaseLogic = () => {
    const { state, dispatch } = useData();
    const { user } = useAuth();
    
    const [searchTerm, setSearchTerm] = useState('');
    const deferredSearchTerm = useDeferredValue(searchTerm);
    const [selectedCategory, setSelectedCategory] = useState('All');
    
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<KnowledgeArticle | null>(null);

    const articles = state.knowledgeBase;
    const categories = useMemo(() => ['All', ...Array.from(new Set(articles.map(a => a.category)))], [articles]);

    const filteredArticles = useMemo(() => {
        return articles.filter(a => {
            const matchesSearch = a.title.toLowerCase().includes(deferredSearchTerm.toLowerCase()) || 
                                  a.content.toLowerCase().includes(deferredSearchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || a.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [articles, deferredSearchTerm, selectedCategory]);

    const handleCreate = () => {
        setEditingArticle({
            id: '',
            title: '',
            category: 'General',
            content: '',
            authorId: user?.id || 'Unknown',
            lastUpdated: new Date().toISOString().split('T')[0],
            views: 0,
            tags: []
        });
        setIsEditorOpen(true);
    };

    const handleEdit = (article: KnowledgeArticle) => {
        setEditingArticle({ ...article });
        setIsEditorOpen(true);
    };

    const handleSave = (article: KnowledgeArticle) => {
        if (!article.title) return;
        const payload = {
            ...article,
            id: article.id || generateId('KB'),
            lastUpdated: new Date().toISOString().split('T')[0]
        };
        
        if (article.id) {
            dispatch({ type: 'UPDATE_ARTICLE', payload });
        } else {
            dispatch({ type: 'ADD_ARTICLE', payload });
        }
        setIsEditorOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm("Delete this article?")) {
            dispatch({ type: 'DELETE_ARTICLE', payload: id });
        }
    };

    return {
        articles: filteredArticles,
        categories,
        selectedCategory,
        setSelectedCategory,
        searchTerm,
        setSearchTerm,
        isEditorOpen,
        setIsEditorOpen,
        editingArticle,
        handleCreate,
        handleEdit,
        handleSave,
        handleDelete
    };
};
