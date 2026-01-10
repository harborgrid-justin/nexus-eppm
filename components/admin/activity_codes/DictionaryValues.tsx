
import React, { useState } from 'react';
import { Badge } from '../../ui/Badge';
import { Plus, Trash2, X } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { ActivityCode } from '../../../types';
import { useTheme } from '../../../context/ThemeContext';

interface Props {
    code: ActivityCode;
    onUpdateCode?: (code: ActivityCode) => void;
}

export const DictionaryValues: React.FC<Props> = ({ code, onUpdateCode }) => {
    const theme = useTheme();
    const [isAdding, setIsAdding] = useState(false);
    const [newValue, setNewValue] = useState({ value: '', description: '', color: '#3b82f6' });

    const handleAdd = () => {
        if (!newValue.value || !onUpdateCode) return;
        const newEntry = { 
            id: `${code.id}-V${Date.now()}`, 
            value: newValue.value, 
            description: newValue.description, 
            color: newValue.color 
        };
        const updatedCode = { ...code, values: [...code.values, newEntry] };
        onUpdateCode(updatedCode);
        setNewValue({ value: '', description: '', color: '#3b82f6' });
        setIsAdding(false);
    };

    const handleDelete = (valId: string) => {
        if (!onUpdateCode) return;
        const updatedCode = { ...code, values: code.values.filter(v => v.id !== valId) };
        onUpdateCode(updatedCode);
    };

    return (
        <div className="p-8 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">{code.name}</h2>
                    <p className="text-sm text-slate-500">{code.scope} Dictionary</p>
                </div>
                <Button size="sm" variant="outline" icon={Plus} onClick={() => setIsAdding(true)}>Add Value</Button>
            </div>
            
            {isAdding && (
                <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl animate-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                         <Input label="Value" value={newValue.value} onChange={e => setNewValue({...newValue, value: e.target.value})} placeholder="e.g. Critical" autoFocus />
                         <Input label="Description" value={newValue.description} onChange={e => setNewValue({...newValue, description: e.target.value})} placeholder="Description" />
                         <div>
                             <label className="block text-sm font-bold text-slate-700 mb-1">Color</label>
                             <input type="color" className="w-full h-10 p-1 rounded border border-slate-300 cursor-pointer" value={newValue.color} onChange={e => setNewValue({...newValue, color: e.target.value})} />
                         </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>Cancel</Button>
                        <Button size="sm" onClick={handleAdd} disabled={!newValue.value}>Add to Dictionary</Button>
                    </div>
                </div>
            )}

            <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                {code.values.length === 0 && <div className="text-center text-slate-400 italic p-8">No values defined for this code.</div>}
                {code.values.map((v) => (
                    <div key={v.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-nexus-300 transition-all group shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-lg shadow-sm border border-slate-100 flex items-center justify-center" style={{ backgroundColor: v.color || '#eee' }}>
                                <span className="text-[10px] font-bold text-white opacity-90 drop-shadow-sm">Aa</span>
                            </div>
                            <div>
                                <div className="font-bold text-sm text-slate-900">{v.value}</div>
                                <div className="text-xs text-slate-500">{v.description || 'No description'}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Badge variant="neutral">Active</Badge>
                            <button onClick={() => handleDelete(v.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
