
import React from 'react';
import { Project, AIAnalysisResult } from '../types/index';
import { Sparkles, Send, X, AlertTriangle, Lightbulb, FileText, Loader2 } from 'lucide-react';
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

  if (!isOpen) return null;

  return (
    <div 
      className={`h-full w-full ${theme.colors.surface} flex flex-col relative`}
      role="dialog"
      aria-label="AI Project Assistant"
      aria-modal="true"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-nexus-900 to-slate-900 text-white">
        <div className="flex items-center gap-2">
          <Sparkles className="text-yellow-400" size={20} aria-hidden="true" />
          <h2 className="font-bold">Nexus AI Consultant</h2>
        </div>
        <button 
          onClick={onClose} 
          className="text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white rounded p-1" 
          aria-label="Close AI Assistant"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className={`flex-1 overflow-y-auto p-6 space-y-6 ${theme.colors.background}`} ref={scrollRef}>
        
        {/* Analysis Card */}
        <div className={`${theme.components.card} overflow-hidden`}>
          <div className={`p-4 border-b ${theme.colors.border} flex justify-between items-center ${theme.colors.background}`}>
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <FileText size={16} className="text-nexus-600" />
              Project Analysis: {project.name}
            </h3>
            {isLoading ? (
               <Loader2 className="animate-spin text-nexus-500" size={16} />
            ) : (
              <button 
                onClick={handleAnalyze} 
                className="text-xs text-nexus-600 hover:underline focus:outline-none focus:ring-2 focus:ring-nexus-500 rounded"
              >
                Refresh
              </button>
            )}
          </div>
          
          <div aria-live="polite">
            {analysis ? (
              <div className="p-4 space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed">{analysis.summary}</p>
                
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1">
                    <AlertTriangle size={12} /> Risks Detected
                  </div>
                  <ul className="text-sm space-y-1">
                    {analysis.risks.map((risk, i) => (
                      <li key={i} className="flex gap-2 items-start text-slate-700">
                        <span className="text-red-400 mt-1" aria-hidden="true">•</span>
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                   <div className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1">
                    <Lightbulb size={12} /> Recommendations
                  </div>
                  <ul className="text-sm space-y-1">
                    {analysis.recommendations.map((rec, i) => (
                      <li key={i} className="flex gap-2 items-start text-slate-700">
                         <span className="text-amber-400 mt-1" aria-hidden="true">•</span>
                         {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-sm">
                 {isLoading ? "Analyzing project schedule and budget..." : "Ready to analyze."}
              </div>
            )}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="space-y-4 pb-4" role="log" aria-label="Chat History">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-xs font-medium text-slate-400">Ask a Question</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-lg p-3 text-sm ${
                msg.role === 'user' 
                  ? 'bg-nexus-600 text-white rounded-br-none' 
                  : `${theme.colors.surface} border ${theme.colors.border} ${theme.colors.text.primary} rounded-bl-none shadow-sm`
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Input Area */}
      <div className={`p-4 ${theme.colors.surface} border-t ${theme.colors.border}`}>
        <div className="relative">
          <label htmlFor="ai-chat-input" className="sr-only">Ask about project details</label>
          <input
            id="ai-chat-input"
            type="text"
            className={`w-full pl-4 pr-12 py-3 ${theme.colors.background} border ${theme.colors.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-nexus-500 text-sm`}
            placeholder="Ask about schedule delays, budget..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
          />
          <button 
            onClick={handleSendChat}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-nexus-600 text-white rounded-md hover:bg-nexus-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-nexus-500"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
