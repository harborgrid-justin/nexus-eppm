
import React, { useState } from 'react';
import { Project } from '../types/index';
import { Sparkles, Send, X, FileText, Loader2, RefreshCw, Mic } from 'lucide-react';
import { useAiAssistant } from '../hooks/useAiAssistant';
import { useTheme } from '../context/ThemeContext';
import { AiChatView } from './ai/AiChatView';

interface AiAssistantProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ project, isOpen, onClose }) => {
  const {
    analysis, isLoading, chatInput, setChatInput, chatHistory, scrollRef, handleAnalyze, handleSendChat
  } = useAiAssistant(project, isOpen);
  const theme = useTheme();

  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Speech recognition not supported."); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    setIsListening(true);
    recognition.onresult = (event: any) => { setChatInput(event.results[0][0].transcript); setIsListening(false); };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  if (!isOpen) return null;

  return (
    <div className={`h-full w-full ${theme.colors.surface} flex flex-col relative`} role="dialog" aria-label="AI Project Assistant">
      {/* Header */}
      <div className={`p-4 border-b ${theme.colors.border} flex justify-between items-center bg-gradient-to-r from-slate-900 to-nexus-900 text-white shadow-lg`}>
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-md border border-white/10"><Sparkles className="text-yellow-400" size={18} /></div>
          <div className="flex flex-col"><h2 className="font-black text-sm uppercase tracking-widest leading-none">Nexus AI Analyst</h2><span className="text-[9px] text-slate-400 mt-1 uppercase font-bold opacity-70">Project Context: {project.code}</span></div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white rounded-full p-1.5 transition-all hover:bg-white/10"><X size={20} /></button>
      </div>

      {/* Content */}
      <div className={`flex-1 overflow-y-auto p-6 space-y-8 ${theme.colors.background}/50 scrollbar-thin`} ref={scrollRef}>
        <div className={`${theme.colors.surface} border ${theme.colors.border} rounded-2xl overflow-hidden shadow-sm`}>
          <div className={`p-4 border-b ${theme.colors.border} flex justify-between items-center ${theme.colors.background}`}>
            <h3 className={`font-black text-[10px] uppercase tracking-widest ${theme.colors.text.tertiary} flex items-center gap-2`}><FileText size={14} className="text-nexus-600" /> Automated Schedule Review</h3>
            {isLoading ? <Loader2 className="animate-spin text-nexus-500" size={14} /> : <button onClick={handleAnalyze} className="text-[10px] font-black text-nexus-600 uppercase tracking-widest hover:underline flex items-center gap-1"><RefreshCw size={10}/> Refresh</button>}
          </div>
          <div aria-live="polite" className="p-5 text-sm">{analysis?.summary || (isLoading ? "Consulting Knowledge Graph..." : "Analysis Engine Ready.")}</div>
        </div>
        <AiChatView chatHistory={chatHistory} />
      </div>

      {/* Input */}
      <div className={`p-4 ${theme.colors.surface} border-t ${theme.colors.border} shadow-2xl`}>
        <div className="relative">
          <input type="text" className={`w-full pl-4 pr-24 py-3.5 ${theme.colors.background} border ${theme.colors.border} rounded-2xl outline-none focus:ring-4 focus:ring-nexus-500/10 focus:border-nexus-500 text-sm font-medium transition-all`} placeholder="Ask about schedule drift..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendChat()} />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <button onClick={startListening} className={`p-2 rounded-xl transition-all ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-slate-400 hover:text-nexus-600 hover:bg-slate-100'}`}><Mic size={16} /></button>
              <button onClick={handleSendChat} className={`p-2 ${theme.colors.primary} text-white rounded-xl hover:brightness-110 transition-all shadow-md active:scale-90`}><Send size={16} /></button>
          </div>
        </div>
        <p className="text-[9px] text-center mt-3 text-slate-400 font-bold uppercase tracking-widest opacity-60">AI can generate incorrect data. Review all findings.</p>
      </div>
    </div>
  );
};

export default AiAssistant;
