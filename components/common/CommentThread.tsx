
import React, { useState, useMemo } from 'react';
import { MessageSquare, Send, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ActivityItem } from '../../types';
import { generateId } from '../../utils/formatters';

interface CommentThreadProps {
    contextId?: string; // e.g. Task ID or Risk ID
}

export const CommentThread: React.FC<CommentThreadProps> = ({ contextId }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const { state, dispatch } = useData();
  const [input, setInput] = useState('');

  // Filter global activities for this specific context or general if none
  const comments = useMemo(() => {
    return state.activities.filter(a => a.type === 'post' && (!contextId || a.target === contextId));
  }, [state.activities, contextId]);

  const post = () => {
      if(!input.trim() || !user) return;
      
      const newComment: ActivityItem = {
          id: generateId('ACT'),
          userId: user.id,
          userName: user.name,
          userAvatar: user.avatar,
          action: 'added a comment',
          target: contextId || 'General',
          type: 'post',
          content: input.trim(),
          timestamp: new Date().toISOString(),
          likes: 0,
          comments: 0
      };

      dispatch({ type: 'ADD_ACTIVITY', payload: newComment });
      setInput('');
  };

  return (
      <div className={`flex flex-col h-full bg-white rounded-2xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
          <div className="p-4 border-b bg-slate-50/50 flex justify-between items-center">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <MessageSquare size={14} className="text-nexus-600"/> Discussion Ledger
            </h4>
            <span className="text-[10px] font-mono text-slate-400">{comments.length} Entries</span>
          </div>
          
          <div className="flex-1 space-y-4 overflow-y-auto p-5 scrollbar-thin">
              {comments.length > 0 ? comments.map(c => (
                  <div key={c.id} className="flex gap-3 animate-nexus-in">
                      <div className="shrink-0">
                          {c.userAvatar ? (
                              <img src={c.userAvatar} alt={c.userName} className="w-8 h-8 rounded-lg border border-slate-200 shadow-sm" />
                          ) : (
                              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 shadow-inner">
                                  <User size={16}/>
                              </div>
                          )}
                      </div>
                      <div className="flex-1 min-w-0">
                          <div className="bg-slate-50 p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                              <div className="flex justify-between items-center mb-1">
                                  <span className="font-black text-xs text-slate-900 uppercase tracking-tight">{c.userName}</span>
                                  <span className="text-[9px] font-bold text-slate-400 uppercase">{new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <p className="text-sm text-slate-600 leading-relaxed">{c.content}</p>
                          </div>
                      </div>
                  </div>
              )) : (
                  <div className="h-40 nexus-empty-pattern rounded-xl border border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300">
                      <MessageSquare size={24} className="mb-2 opacity-20"/>
                      <p className="text-[10px] font-black uppercase tracking-widest">No active discussion threads</p>
                  </div>
              )}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200">
              <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-inner focus-within:ring-2 focus-within:ring-nexus-500/20 transition-all">
                  <input 
                    className="flex-1 p-2 bg-transparent text-sm font-medium outline-none placeholder:text-slate-300" 
                    placeholder="Input strategic commentary..." 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && post()}
                  />
                  <button 
                    onClick={post} 
                    disabled={!input.trim()}
                    className="p-2.5 bg-nexus-600 text-white rounded-lg hover:bg-nexus-700 transition-all active:scale-90 disabled:opacity-30 disabled:grayscale shadow-md"
                  >
                      <Send size={16}/>
                  </button>
              </div>
          </div>
      </div>
  );
};
