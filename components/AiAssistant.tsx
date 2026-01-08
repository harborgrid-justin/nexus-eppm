
import React, { useState, useEffect } from 'react';
import { Project, AIAnalysisResult } from '../types/index';
import { Sparkles, Send, X, AlertTriangle, Lightbulb, FileText, Loader2, RefreshCw, Mic } from 'lucide-react';
import { useAiAssistant } from '../hooks/useAiAssistant';
import { useTheme } from '../context/ThemeContext';

interface AiAssistantProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ project, isOpen, onClose }) => {
  const {
    analysis,
    isLoading,
    chatInput,
    setChatInput,
    chatHistory,
    scrollRef,
    handleAnalyze,
    handleSendChat
  } = useAiAssistant(project, isOpen);
  const theme = useTheme();

  const [isListening, setIsListening] = useState(false);

  // Optimization: Web Speech API
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Speech recognition not supported in this browser.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    setIsListening(true);

    recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setChatInput(transcript);
        setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`h-full w-full ${theme.colors.surface} flex flex-col relative`}
      role="dialog"
      aria-label="AI Project Assistant"
      aria-modal="true"
    >
      {/* Header */}
      <div className={`p-4 border-b ${theme.colors.border} flex justify-between items-center bg-gradient-to-r from-slate-900 to-nexus-900 text-white shadow-lg`}>
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-md border border-white/10">
            <Sparkles className="text-yellow-400" size={18} aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <h2 className="font-black text-sm uppercase tracking-widest leading-none">Nexus AI Analyst</h2>
            <span className="text-[9px] text-slate-400 mt-1 uppercase font-bold opacity-70">Project Context: {project.code}</span>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white rounded-full p-1.5 transition-all hover:bg-white/10" 
          aria-label="Close AI Assistant"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className={`flex-1 overflow-y-auto p-6 space-y-8 ${theme.colors.background}/50 scrollbar-thin`} ref={scrollRef}>
        
        {/* Analysis Card */}
        <div className={`${theme.colors.surface} border ${theme.colors.border} rounded-2xl overflow-hidden shadow-sm`}>
          <div className={`p-4 border-b ${theme.colors.border} flex justify-between items-center ${theme.colors.background}`}>
            <h3 className={`font-black text-[10px] uppercase tracking-widest ${theme.colors.text.tertiary} flex items-center gap-2`}>
              <FileText size={14} className="text-nexus-600" />
              Automated Schedule Review
            </h3>
            {isLoading ? (
               <Loader2 className="animate-spin text-nexus-500" size={14} />
            ) : (
              <button 
                onClick={handleAnalyze} 
                className="text-[10px] font-black text-nexus-600 uppercase tracking-widest hover:underline flex items-center gap-1"
              >
                <RefreshCw size={10}/> Refresh Analysis
              </button>
            )}
          </div>
          
          <div aria-live="polite">
            {analysis ? (
              <div className="p-5 space-y-6">
                <p className={`text-sm ${theme.colors.text.primary} leading-relaxed font-medium`}>{String(analysis.summary)}</p>
                
                <div className="space-y-3">
                  <div className={`text-[10px] font-black uppercase tracking-widest ${theme.colors.semantic.danger.text} flex items-center gap-1.5`}>
                    <AlertTriangle size={12} /> Critical Threats
                  </div>
                  <ul className="space-y-2">
                    {analysis.risks.map((risk, i) => (
                      <li key={i} className={`flex gap-3 items-start text-sm ${theme.colors.text.secondary} p-3 ${theme.colors.semantic.danger.bg}/30 border border-red-100 rounded-xl`}>
                        <span className="text-red-500 font-bold" aria-hidden="true">!</span>
                        {String(risk)}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                   <div className={`text-[10px] font-black uppercase tracking-widest ${theme.colors.semantic.warning.text} flex items-center gap-1.5`}>
                    <Lightbulb size={12} /> Strategic Guidance
                  </div>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((rec, i) => (
                      <li key={i} className={`flex gap-3 items-start text-sm ${theme.colors.text.secondary} p-3 ${theme.colors.semantic.warning.bg}/30 border border-amber-100 rounded-xl`}>
                         <span className="text-amber-600 font-bold" aria-hidden="true">•</span>
                         {String(rec)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className={`p-12 text-center ${theme.colors.text.tertiary} text-xs uppercase font-bold tracking-widest`}>
                 {isLoading ? "Consulting Knowledge Graph..." : "Analysis Engine Ready."}
              </div>
            )}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="space-y-6 pb-6" role="log" aria-label="Chat History">
          <div className="flex items-center gap-3 opacity-40">
            <div className={`h-px ${theme.colors.border} flex-1`}></div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${theme.colors.text.tertiary}`}>Session Log</span>
            <div className={`h-px ${theme.colors.border} flex-1`}></div>
          </div>

          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-nexus-in`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                msg.role === 'user' 
                  ? `${theme.colors.primary} text-white rounded-br-none` 
                  : `${theme.colors.surface} border ${theme.colors.border} ${theme.colors.text.primary} rounded-bl-none`
              }`}>
                {String(msg.text)}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Input Area */}
      <div className={`p-4 ${theme.colors.surface} border-t ${theme.colors.border} shadow-2xl`}>
        <div className="relative">
          <label htmlFor="ai-chat-input" className="sr-only">Query assistant</label>
          <input
            id="ai-chat-input"
            type="text"
            className={`w-full pl-4 pr-24 py-3.5 ${theme.colors.background} border ${theme.colors.border} rounded-2xl outline-none focus:ring-4 focus:ring-nexus-500/10 focus:border-nexus-500 text-sm font-medium transition-all`}
            placeholder="Ask about schedule drift, budget logic..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <button
                onClick={startListening}
                className={`p-2 rounded-xl transition-all ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-slate-400 hover:text-nexus-600 hover:bg-slate-100'}`}
                title="Voice Input"
              >
                  <Mic size={16} />
              </button>
              <button 
                onClick={handleSendChat}
                className={`p-2 ${theme.colors.primary} text-white rounded-xl hover:brightness-110 transition-all shadow-md active:scale-90`}
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
          </div>
        </div>
        <p className="text-[9px] text-center mt-3 text-slate-400 font-bold uppercase tracking-widest opacity-60">AI can generate incorrect data. Review all findings.</p>
      </div>
    </div>
  );
};

export default AiAssistant;
