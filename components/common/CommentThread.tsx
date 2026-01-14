
import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

interface Comment {
    id: number;
    user: string;
    text: string;
    time: string;
}

export const CommentThread: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([
      { id: 1, user: 'System', text: 'Thread started.', time: 'Just now' }
  ]);
  const [input, setInput] = useState('');

  const post = () => {
      if(!input) return;
      setComments([...comments, { id: Date.now(), user: user?.name || 'Me', text: input, time: 'Just now' }]);
      setInput('');
  };

  return (
      <div className={`${theme.colors.background} border ${theme.colors.border} rounded-xl p-4 flex flex-col h-full`}>
          <h4 className={`${theme.typography.label} mb-4 flex items-center gap-2`}><MessageSquare size={14}/> Discussion</h4>
          <div className="flex-1 space-y-3 overflow-y-auto mb-4 pr-2 max-h-60 scrollbar-thin">
              {comments.map(c => (
                  <div key={c.id} className={`${theme.colors.surface} p-3 rounded-lg border ${theme.colors.border} shadow-sm text-sm`}>
                      <div className="flex justify-between mb-1">
                          <span className={`font-bold ${theme.colors.text.primary}`}>{c.user}</span>
                          <span className={`${theme.typography.small}`}>{c.time}</span>
                      </div>
                      <p className={theme.colors.text.secondary}>{c.text}</p>
                  </div>
              ))}
          </div>
          <div className="flex gap-2">
              <input 
                className={`flex-1 p-2 ${theme.colors.surface} border ${theme.colors.border} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-nexus-500`} 
                placeholder="Add a comment..." 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && post()}
              />
              <Button size="sm" icon={Send} onClick={post} className="px-3"></Button>
          </div>
      </div>
  );
};
