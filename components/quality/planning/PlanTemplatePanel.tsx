
import React, { useState } from 'react';
import { SidePanel } from '../../ui/SidePanel';
import { Button } from '../../ui/Button';
import { Copy, AlertTriangle } from 'lucide-react';

interface PlanTemplatePanelProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (id: string | null) => void;
}

export const PlanTemplatePanel: React.FC<PlanTemplatePanelProps> = ({ isOpen, onClose, onApply }) => {
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const templates = [
        { id: 'iso_9001', name: 'ISO 9001:2015 Compliant', description: 'Standard QMS structure with rigorous documentation.' },
        { id: 'lean_six_sigma', name: 'Lean / Six Sigma', description: 'Focus on defect reduction and process capability.' },
        { id: 'usace_cqc', name: 'USACE CQC Plan', description: 'Contractor Quality Control for federal projects.' }
    ];

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
                </div>
            </div>
        </SidePanel>
    );
};
