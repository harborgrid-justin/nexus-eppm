
import React, { useState } from 'react';
import { SidePanel } from '../../ui/SidePanel';
import { Button } from '../../ui/Button';
import { Copy, AlertTriangle } from 'lucide-react';
import { useData } from '../../../context/DataContext';

interface PlanTemplatePanelProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (id: string | null) => void;
}

export const PlanTemplatePanel: React.FC<PlanTemplatePanelProps> = ({ isOpen, onClose, onApply }) => {
    const { state } = useData();
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    
    // Filter for Quality templates
    const templates = state.standardTemplates.filter(t => t.category === 'Quality');

    return (
        <SidePanel
            isOpen={isOpen}
            onClose={onClose}
            title="Quality Plan Templates"
            width="md:w-[500px]"
            footer={<>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button onClick={() => onApply(selectedTemplate)} disabled={!selectedTemplate} icon={Copy}>Apply Template</Button>
            </>}
        >
            <div className="space-y-6">
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
                    <AlertTriangle className="text-amber-600 shrink-0" size={18}/>
                    <span className="text-xs text-amber-900 leading-relaxed font-medium">Applying a template will overwrite current QMP sections.</span>
                </div>
                <div className="space-y-4">
                    {templates.map(t => (
                        <div key={t.id} onClick={() => setSelectedTemplate(t.id)} className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${selectedTemplate === t.id ? 'bg-nexus-50 border-nexus-500' : 'bg-white border-slate-100 hover:border-nexus-300'}`}>
                            <h4 className="font-black text-slate-900 text-base">{t.name}</h4>
                            <p className="text-sm font-medium text-slate-500">{t.description}</p>
                        </div>
                    ))}
                    {templates.length === 0 && <div className="text-center text-slate-400 p-8 italic">No Quality Plan templates defined.</div>}
                </div>
            </div>
        </SidePanel>
    );
};
