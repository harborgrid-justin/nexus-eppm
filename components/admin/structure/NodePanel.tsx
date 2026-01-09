
import React, { useState, useEffect } from 'react';
import { EPSNode, OBSNode, Resource } from '../../../types';
import { SidePanel } from '../../ui/SidePanel';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Save } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface NodePanelProps {
    isOpen: boolean;
    onClose: () => void;
    editingNode: Partial<EPSNode | OBSNode>;
    type: 'EPS' | 'OBS';
    resources: Resource[];
    onSave: (node: Partial<EPSNode | OBSNode>) => void;
}

export const NodePanel: React.FC<NodePanelProps> = ({ isOpen, onClose, editingNode, type, resources, onSave }) => {
    const [formData, setFormData] = useState<Partial<EPSNode | OBSNode>>({});
    const theme = useTheme();

    useEffect(() => {
        if(isOpen) setFormData(editingNode);
    }, [editingNode, isOpen]);

    return (
        <SidePanel
            isOpen={isOpen}
            onClose={onClose}
            title={formData.id ? `Edit ${type} Node` : `Add ${type} Node`}
            footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={() => onSave(formData)} icon={Save}>Save Node</Button></>}
        >
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                    <Input value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Infrastructure Division" />
                </div>
                {type === 'EPS' && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Code</label>
                        <Input value={(formData as EPSNode).code || ''} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="e.g. INFRA" />
                    </div>
                )}
                {type === 'OBS' && (
                        <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Responsible Manager</label>
                        <select 
                            className={`w-full p-2 border ${theme.colors.border} rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500`}
                            value={(formData as OBSNode).managerId || ''}
                            onChange={e => setFormData({...formData, managerId: e.target.value})}
                        >
                            <option value="">Select Manager...</option>
                            {resources.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                    </div>
                )}
            </div>
        </SidePanel>
    );
};
