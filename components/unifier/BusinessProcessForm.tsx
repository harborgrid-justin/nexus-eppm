
import React, { useState } from 'react';
import { BPDefinition, BPRecord, BPLineItem } from '../../types/unifier';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { FormSections } from './form/FormSections';
import { FormActions } from './form/FormActions';
import { generateId } from '../../utils/formatters';
import { FileText, GitPullRequest, Info } from 'lucide-react';

interface BusinessProcessFormProps {
    definition: BPDefinition; record?: BPRecord; projectId: string;
    onClose: () => void; onSave: (record: BPRecord, action: string) => void;
}

const BusinessProcessForm: React.FC<BusinessProcessFormProps> = ({ definition, record, projectId, onClose, onSave }) => {
    const theme = useTheme();
    const { t } = useI18n();
    const [formData, setFormData] = useState<Record<string, any>>(record?.data || {});
    const [title, setTitle] = useState(record?.title || '');
    const [lineItems, setLineItems] = useState<BPLineItem[]>(record?.lineItems || []);

    const currentStatus = record?.status || 'Draft';
    const currentStep = definition.workflow.find(s => s.name === currentStatus) || definition.workflow[0];

    const handleAction = (action: string) => {
        if (!title) return alert(t('unifier.title_required', 'Title is mandatory for record creation.'));
        const newRecord: BPRecord = {
            id: record?.id || generateId(definition.prefix),
            bpDefId: definition.id, projectId, status: currentStatus,
            title, data: formData, lineItems,
            auditTrail: record?.auditTrail || [], workflowHistory: record?.workflowHistory || []
        };
        onSave(newRecord, action);
    };

    return (
        <div className="h-full flex flex-col bg-white overflow-hidden animate-nexus-in">
            <div className={`p-6 border-b bg-slate-900 text-white flex justify-between items-center shadow-xl`}>
                <div className="flex items-center gap-5">
                    <div className="p-3 bg-white/10 rounded-2xl border border-white/10 shadow-inner">
                        <FileText size={24} className="text-nexus-400"/>
                    </div>
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tighter">{definition.name}</h2>
                        <div className="flex items-center gap-3 mt-1">
                             <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Token: {record?.id || 'NEW_RECORD'}</span>
                             <div className="w-1.5 h-1.5 bg-slate-700 rounded-full"></div>
                             <span className="text-[10px] font-black uppercase tracking-widest text-nexus-400">Node: {projectId}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Workflow Stage</p>
                        <p className="text-xs font-black uppercase tracking-widest">{currentStatus}</p>
                    </div>
                    <Badge variant="neutral" className="bg-white/10 text-white border-white/20 h-8 px-4 font-black">{currentStatus}</Badge>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 bg-slate-50/30 scrollbar-thin">
                <div className="max-w-5xl mx-auto space-y-12">
                    <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl flex items-start gap-4 shadow-sm">
                        <Info size={20} className="text-blue-600 mt-0.5 shrink-0"/>
                        <p className="text-xs text-blue-800 leading-relaxed font-bold uppercase tracking-tight">
                            Record data is subject to organizational governance rules. All field modifications are cryptographically signed and archived in the permanent audit ledger.
                        </p>
                    </div>
                    
                    <FormSections 
                        definition={definition} formData={formData} setFormData={setFormData}
                        title={title} setTitle={setTitle} lineItems={lineItems} setLineItems={setLineItems}
                        currentStep={currentStep} isDraft={currentStatus === 'Draft'}
                    />
                </div>
            </div>
            
            <div className="p-4 bg-slate-900/5 border-t border-slate-100 flex items-center justify-between px-10">
                 <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                     <GitPullRequest size={16} className="text-slate-300"/>
                     <span>Logic Handshake: Authorized for current tenant</span>
                 </div>
                 <FormActions currentStep={currentStep} onAction={handleAction} onCancel={onClose} />
            </div>
        </div>
    );
};
export default BusinessProcessForm;
