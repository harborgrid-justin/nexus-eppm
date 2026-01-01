

import { useState, useRef, useCallback, useEffect } from 'react';
import { Project } from '../types';
import { AIAnalysisResult } from '../types';
import { analyzeProjectRisks, chatWithProjectData } from '../services/geminiService';
import { sanitizeInput } from '../utils/security';

export const useAiAssistant = (project: Project, isOpen: boolean) => {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleAnalyze = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await analyzeProjectRisks(project);
      setAnalysis(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [project]);

  // Trigger analysis on open if not present
  useEffect(() => {
    if (isOpen && !analysis) {
      handleAnalyze();
    }
  }, [isOpen, project.id, analysis, handleAnalyze]);

  const handleSendChat = useCallback(async () => {
    if (!chatInput.trim()) return;
    
    // SECURITY: Sanitize input
    const safeInput = sanitizeInput(chatInput);
    if (!safeInput) return;

    setChatInput("");
    setChatHistory(prev => [...prev, { role: 'user', text: safeInput }]);

    try {
      // Optimistic UI handled, now fetch
      const response = await chatWithProjectData(project, safeInput);
      setChatHistory(prev => [...prev, { role: 'model', text: response }]);
    } catch (e) {
      setChatHistory(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error." }]);
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