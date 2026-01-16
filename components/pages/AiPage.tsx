
import React from 'react';
import AiAssistant from '../AiAssistant';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { PageLayout } from '../layout/standard/PageLayout';
import { PanelContainer } from '../layout/standard/PanelContainer';
import { Button } from '../ui/Button';

const AiPage: React.FC = () => {
    const { state } = useData();
    const navigate = useNavigate();
    // Default to first project for context if none selected, or a general context
    const project = state.projects[0]; 

    return (
        <PageLayout
            title="Nexus AI Advisor"
            subtitle="Predictive intelligence and conversational analysis."
            icon={Sparkles}
            actions={<Button variant="ghost" icon={ArrowLeft} onClick={() => navigate(-1)}>Back</Button>}
        >
            <PanelContainer>
                 {/* Reusing AiAssistant component but adapting it for full page by ensuring it's mounted 'open' */}
                 <div className="flex-1 flex justify-center h-full relative">
                     {/* Forcing a centered layout for the 'assistant' feel on a dedicated page */}
                     <div className="w-full h-full relative transform-none">
                         <AiAssistant project={project} isOpen={true} onClose={() => navigate(-1)} />
                     </div>
                 </div>
            </PanelContainer>
        </PageLayout>
    );
};

export default AiPage;
