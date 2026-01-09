
import React, { useState } from 'react';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ReportDefinition } from '../../types/analytics';
import { Save } from 'lucide-react';
import { generateId } from '../../utils/formatters';

interface ReportBuilderProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (report: ReportDefinition) => void;
}

export const ReportBuilder: React.FC<ReportBuilderProps> = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<ReportDefinition>>({
        title: '',
        category: 'General',
        description: '',
        icon: 'FileText',
        type: 'Custom'
    });

    const handleSave = () => {
        if (!formData.title) return;
        const newReport: ReportDefinition = {
            id: generateId('RPT'),
            title: formData.title,
            category: formData.category || 'General',
            description: formData.description || '',
            icon: formData.icon || 'FileText',
            type: 'Custom',
            config: {} // Placeholder for advanced config
        };
        onSave(newReport);
    };

    return (
        <SidePanel
            isOpen={isOpen}
            onClose={onClose}
            title="Create Custom Report"
            footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={handleSave} icon={Save}>Save Definition</Button></>}
        >
            <div className="space-y-6">
                <Input label="Report Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                    <div>
                         <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                         <select className="w-full p-2.5 border rounded-lg text-sm" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                             <option>General</option><option>Financial</option><option>Risk</option><option>Performance</option><option>Resource</option>
                         </select>
                    </div>
                    <div>
                         <label className="block text-sm font-bold text-slate-700 mb-1">Icon</label>
                         <select className="w-full p-2.5 border rounded-lg text-sm" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})}>
                             <option value="FileText">File Text</option><option value="Table">Table</option><option value="Activity">Activity</option><option value="TrendingUp">Trending</option>
                         </select>
                    </div>
                </div>
                <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                     <textarea className="w-full p-3 border rounded-lg text-sm h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500 italic text-center">
                    Advanced column selection and data source mapping would be configured here in the full version.
                </div>
            </div>
        </SidePanel>
    );
};
