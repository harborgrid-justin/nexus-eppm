
import { useState, useRef, useCallback, useEffect } from 'react';
// FIX: AIAnalysisResult is defined in types/common.ts, use the barrel file instead
import { Project, AIAnalysisResult } from '../types/index';
import { analyzeProjectRisks, chatWithProjectData } from '../services/geminiService';

export const useAiAssistant = (project: Project, isOpen: boolean) => {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'model', text: string}[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!project) return;
    setIsLoading(true);
    try {
      const result = await analyzeProjectRisks(project);
      if (isMounted.current) {
        setAnalysis(result);
      }
    } catch (e) {
      console.error("AI Analysis Error:", e);
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, [project]);

  useEffect(() => {
    if (isOpen && !analysis && project.id !== 'UNSET') {
      handleAnalyze();
    }
  }, [isOpen, project.id, analysis, handleAnalyze]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatHistory]);

  const handleSendChat = useCallback(async () => {
    if (!chatInput.trim() || !project) return;
    
    const userMsg = chatInput;
    setChatInput("");
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);

    try {
      const response = await chatWithProjectData(project, userMsg);
      if (isMounted.current) {
        setChatHistory(prev => [...prev, { role: 'model', text: response }]);
      }
    } catch (e) {
      if (isMounted.current) {
        setChatHistory(prev => [...prev, { role: 'model', text: "The AI engine encountered a temporary disconnect. Please retry." }]);
      }
    }
  }, [chatInput, project]);

  return {
    analysis,
    isLoading,
    chatInput,
    setChatInput,
    chatHistory,
    scrollRef,
    handleAnalyze,
    handleSendChat
  };
};
