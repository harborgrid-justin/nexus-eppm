
import React, { useState } from 'react';
import { SidePanel } from '../../ui/SidePanel';
import { Button } from '../../ui/Button';
import { Copy, AlertTriangle } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useTheme } from '../../../context/ThemeContext';

interface CostPlanTemplatePanelProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (id: string | null) => void;
}

export const CostPlanTemplatePanel: React.FC<CostPlanTemplatePanelProps> = ({ isOpen, onClose, onApply }) => {
    const { state } = useData();
    const theme = useTheme();
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    
    // Filter for Cost templates
    const templates = state.standardTemplates.filter(t => t.category === 'Cost');

    return (
        <SidePanel
            isOpen={isOpen}
            onClose={onClose}
            title="Strategy Template Library"
            width="md:w-[500px]"
            footer={<>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button onClick={() => onApply(selectedTemplate)} disabled={!selectedTemplate} icon={Copy}>Apply Policy</Button>
            </>}
        >
            <div className="space-y-6">
                <div className={`p-4 ${theme.colors.semantic.warning.bg} border ${theme.colors.semantic.warning.border} rounded-2xl flex items-start gap-3`}>
                    <AlertTriangle className={`${theme.colors.semantic.warning.icon} shrink-0`} size={18}/>
                    <span className={`text-xs ${theme.colors.semantic.warning.text} leading-relaxed font-medium`}>Applying a template will overwrite current strategy text.</span>
                </div>
                <div className="space-y-4">
                    {templates.map(t => (
                        <div key={t.id} onClick={() => setSelectedTemplate(t.id)} className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${selectedTemplate === t.id ? 'bg-nexus-50 border-nexus-500' : 'bg-white border-slate-100 hover:border-nexus-300'}`}>
                            <h4 className="font-black text-slate-900 text-base">{t.name}</h4>
                            <p className="text-sm font-medium text-slate-500">{t.description}</p>
                        </div>
                    ))}
                    {templates.length === 0 && <div className="text-center text-slate-400 p-8 italic">No Cost Strategy templates defined.</div>}
                </div>
            </div>
        </SidePanel>
    );
};
