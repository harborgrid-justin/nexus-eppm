
import React, { useState, useEffect } from 'react';
import { FundingSource } from '../../../types';
import { SidePanel } from '../../ui/SidePanel';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Banknote } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface FundingSourcePanelProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (source: FundingSource) => void;
    editingSource: Partial<FundingSource> | null;
}

export const FundingSourcePanel: React.FC<FundingSourcePanelProps> = ({ isOpen, onClose, onSave, editingSource }) => {
    const theme = useTheme();
    const [formData, setFormData] = useState<Partial<FundingSource>>({
        name: '',
        type: 'Internal',
        totalAuthorized: 0,
        description: ''
    });

    useEffect(() => {
        if (editingSource) {
            setFormData(editingSource);
        } else {
             setFormData({ name: '', type: 'Internal', totalAuthorized: 0, description: '' });
        }
    }, [editingSource, isOpen]);

    const handleSubmit = () => {
        if (formData.name && formData.totalAuthorized !== undefined) {
            onSave(formData as FundingSource);
        }
    };

    return (
        <SidePanel
            isOpen={isOpen}
            onClose={onClose}
            title={editingSource?.id ? "Edit Funding Source" : "New Funding Source"}
            width="md:w-[500px]"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} icon={Banknote}>{editingSource?.id ? "Update Source" : "Register Source"}</Button>
                </>
            }
        >
            <div className="space-y-6">
                <div>
                    <label className={theme.typography.label + " block mb-1"}>Source Name</label>
                    <Input 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        placeholder="e.g. FY24 Capital Bond" 
                    />
                </div>
                <div>
                    <label className={theme.typography.label + " block mb-1"}>Source Type</label>
                    <select 
                        className={`w-full p-2.5 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface} ${theme.colors.text.primary} focus:ring-2 focus:ring-nexus-500 outline-none`}
                        value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value as any})}
                    >
                        <option value="Internal">Internal (CapEx/OpEx)</option>
                        <option value="Grant">Grant / External Aid</option>
                        <option value="Bond">Municipal Bond</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label className={theme.typography.label + " block mb-1"}>Total Authorization ($)</label>
                    <Input 
                        type="number" 
                        value={formData.totalAuthorized} 
                        onChange={e => setFormData({...formData, totalAuthorized: parseFloat(e.target.value)})} 
                    />
                </div>
                <div>
                    <label className={theme.typography.label + " block mb-1"}>Description & Restrictions</label>
                    <textarea 
                        className={`w-full p-3 border ${theme.colors.border} rounded-lg text-sm h-32 focus:ring-2 focus:ring-nexus-500 outline-none ${theme.colors.surface} ${theme.colors.text.primary} placeholder:${theme.colors.text.tertiary}`}
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        placeholder="Details about funding terms, expiration, and allowed usage..."
                    />
                </div>
            </div>
        </SidePanel>
    );
};
