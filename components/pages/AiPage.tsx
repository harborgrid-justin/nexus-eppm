
import React from 'react';
import AiAssistant from '../AiAssistant';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const AiPage: React.FC = () => {
    const { state } = useData();
    const navigate = useNavigate();
    // Default to first project for context if none selected, or a general context
    const project = state.projects[0]; 

    return (
        <div className="h-full flex flex-col bg-slate-50 relative">
             <div className="absolute top-4 left-4 z-50">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                >
                    <ChevronLeft size={16}/> Back
                </button>
             </div>
             {/* Reusing AiAssistant component but adapting it for full page by ensuring it's mounted 'open' */}
             <div className="flex-1 flex justify-center h-full pt-16 pb-8">
                 {/* Forcing a centered layout for the 'assistant' feel on a dedicated page */}
                 <div className="w-full max-w-4xl h-full shadow-2xl rounded-2xl overflow-hidden border border-slate-200 relative transform-none">
                     <AiAssistant project={project} isOpen={true} onClose={() => navigate(-1)} />
                 </div>
             </div>
        </div>
    );
};

export default AiPage;
