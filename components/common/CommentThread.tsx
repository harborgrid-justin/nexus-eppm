
import React, { useState, useMemo } from 'react';
import { MessageSquare, Send, User, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ActivityItem } from '../../types/index';
import { generateId } from '../../utils/formatters';

interface CommentThreadProps {
    contextId?: string; // e.g. Task ID or Risk ID
}

export const CommentThread: React.FC<CommentThreadProps> = ({ contextId }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const { state, dispatch } = useData();
  const [input, setInput] = useState('');

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
          action: 'committed a strategic observation',
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
      <div className={`flex flex-col h-full bg-white rounded-[2.5rem] border ${theme.colors.border} shadow-xl overflow-hidden group hover:border-nexus-300 transition-all`}>
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shadow-inner">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
                <MessageSquare size={16} className="text-nexus-600"/> Tactical Discourse Ledger
            </h4>
            <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full text-[9px] font-black text-slate-400 shadow-sm">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                LIVE STREAM
            </div>
          </div>
          
          <div className="flex-1 space-y-6 overflow-y-auto p-8 scrollbar-thin bg-white">
              {comments.length > 0 ? comments.map(c => (
                  <div key={c.id} className="flex gap-4 animate-nexus-in group/row">
                      <div className="shrink-0 pt-1">
                          {c.userAvatar ? (
                              <img src={c.userAvatar} alt={c.userName} className="w-9 h-9 rounded-xl border-2 border-white shadow-md group-hover/row:scale-110 transition-transform" />
                          ) : (
                              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 shadow-inner group-hover/row:bg-nexus-50 transition-colors">
                                  <User size={18}/>
                              </div>
                          )}
                      </div>
                      <div className="flex-1 min-w-0">
                          <div className="bg-slate-50/80 p-4 rounded-3xl rounded-tl-none border border-slate-100 shadow-sm group-hover/row:bg-white group-hover/row:border-nexus-100 transition-all">
                              <div className="flex justify-between items-center mb-1.5">
                                  <span className="font-black text-xs text-slate-900 uppercase tracking-tight">{c.userName}</span>
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter bg-white px-2 py-0.5 rounded-lg border border-slate-100 shadow-inner">
                                    {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                              </div>
                              <p className="text-sm text-slate-600 leading-relaxed font-medium">{c.content}</p>
                          </div>
                      </div>
                  </div>
              )) : (
                  <div className="h-full nexus-empty-pattern rounded-3xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 p-10 text-center">
                      <MessageSquare size={48} className="mb-4 opacity-5" strokeWidth={1}/>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Discussion Buffer Dormant</p>
                      <p className="text-xs mt-2 text-slate-400/60 leading-relaxed">Synthesize team feedback or document tactical pivots here.</p>
                  </div>
              )}
          </div>

          <div className="p-6 bg-slate-50/50 border-t border-slate-100">
              <div className="flex gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-inner focus-within:ring-8 focus-within:ring-nexus-500/5 focus-within:border-nexus-300 transition-all group/input">
                  <input 
                    className="flex-1 px-4 py-2 bg-transparent text-sm font-bold text-slate-800 outline-none placeholder:text-slate-300 uppercase tracking-tight" 
                    placeholder="Input strategic observation..." 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && post()}
                  />
                  <button 
                    onClick={post} 
                    disabled={!input.trim()}
                    className="p-3 bg-nexus-900 text-white rounded-xl hover:bg-black transition-all active:scale-90 disabled:opacity-20 disabled:grayscale shadow-xl shadow-slate-900/10 flex items-center justify-center"
                  >
                      <Send size={18} className="rotate-3 group-hover/input:rotate-0 transition-transform" />
                  </button>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] opacity-60">
                 <ShieldCheck size={10} className="text-nexus-500"/> Content archived for project discovery audit
              </div>
          </div>
      </div>
  );
};
