
import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { TemplateHeader } from '../TemplateHeader';

export const SimpleFormTmpl: React.FC = () => {
    const theme = useTheme();
    const [name, setName] = useState('');
    
    return (
        <div className={`h-full flex flex-col items-center justify-center ${theme.colors.background} ${theme.layout.pagePadding} overflow-y-auto`}>
            <div className="w-full max-w-md mb-6">
                 <TemplateHeader number="11" title="Simple Form" subtitle="Modal-style input capture" />
            </div>
            <Card className="w-full max-w-md p-0 overflow-hidden shadow-2xl border-0 ring-1 ring-slate-900/5">
                <div className={`p-6 border-b border-slate-100 bg-white`}>
                    <h2 className="text-lg font-bold text-slate-900">Create New Record</h2>
                    <p className="text-xs text-slate-500 mt-1">Enter basic details to initialize item.</p>
                </div>
                <div className={`${theme.layout.cardPadding} ${theme.layout.sectionSpacing} bg-white`}>
                    <div>
                        <label className={`${theme.typography.label} block mb-2`}>Record Name</label>
                        <Input placeholder="e.g. Phase 1 Audit" autoFocus className="bg-slate-50" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div>
                        <label className={`${theme.typography.label} block mb-2`}>Category</label>
                        <select className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-nexus-500 outline-none transition-all cursor-pointer font-medium text-slate-700">
                            <option>Compliance</option>
                            <option>Financial</option>
                            <option>Operational</option>
                        </select>
                    </div>
                    <div>
                        <label className={`${theme.typography.label} block mb-2`}>Description</label>
                        <textarea className="w-full border border-slate-200 rounded-lg p-3 text-sm h-32 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-nexus-500 outline-none resize-none transition-all" placeholder="Add context..."></textarea>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                    <Button variant="ghost">Cancel</Button>
                    <Button onClick={() => alert('Saved: ' + name)}>Create Record</Button>
                </div>
            </Card>
        </div>
    );
};
