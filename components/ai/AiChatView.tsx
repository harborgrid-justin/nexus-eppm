
import React, { useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface AiChatViewProps {
    chatHistory: { role: 'user' | 'model'; text: string }[];
}

export const AiChatView: React.FC<AiChatViewProps> = ({ chatHistory }) => {
    const theme = useTheme();
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    return (
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
            <div ref={bottomRef} />
        </div>
    );
};
