
import React from 'react';
import { Sparkles, X } from 'lucide-react';

interface AiAdvisorProps {
    advice: string;
    onClear: () => void;
}

export const AiAdvisor: React.FC<AiAdvisorProps> = ({ advice, onClear }) => {
    return (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 shadow-sm animate-in zoom-in-95 relative">
            <button onClick={onClear} className="absolute top-4 right-4 text-indigo-300 hover:text-indigo-500">
                <X size={16}/>
            </button>
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                    <Sparkles size={20}/>
                </div>
                <h3 className="font-bold text-indigo-900">AI Portfolio Advisor</h3>
            </div>
            <div className="prose prose-sm text-indigo-900 leading-relaxed max-w-none">
                {advice.split('\n').map((line, i) => (
                    <p key={i} className="mb-2 last:mb-0">{line}</p>
                ))}
            </div>
        </div>
    );
};
