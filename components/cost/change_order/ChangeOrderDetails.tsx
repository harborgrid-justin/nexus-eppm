
import React from 'react';
import { ChangeOrder } from '../../../types';
import { useTheme } from '../../../context/ThemeContext';

interface ChangeOrderDetailsProps {
    co: ChangeOrder;
    isReadOnly: boolean;
    onChange: (field: keyof ChangeOrder, value: any) => void;
}

export const ChangeOrderDetails: React.FC<ChangeOrderDetailsProps> = ({ co, isReadOnly, onChange }) => {
    const theme = useTheme();
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Description of Change</label>
                    <textarea 
                        value={co.description}
                        disabled={isReadOnly}
                        onChange={(e) => onChange('description', e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg text-sm h-32 focus:ring-nexus-500"
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                    <div className={`${theme.components.card} p-4`}>
                        <h3 className="font-bold text-slate-800 mb-4 text-sm">Classification</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-500 block mb-1">Category</label>
                                <select 
                                    value={co.category || 'Client Request'} 
                                    onChange={(e) => onChange('category', e.target.value)}
                                    disabled={isReadOnly}
                                    className="w-full p-2 border border-slate-300 rounded-md text-sm"
                                >
                                    <option>Client Request</option>
                                    <option>Design Error</option>
                                    <option>Unforeseen Condition</option>
                                    <option>Regulatory</option>
                                    <option>Value Engineering</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 block mb-1">Priority</label>
                                <div className="flex gap-2">
                                    {['Low', 'Medium', 'High', 'Critical'].map(p => (
                                        <button
                                            key={p}
                                            onClick={() => onChange('priority', p)}
                                            disabled={isReadOnly}
                                            className={`px-3 py-1.5 rounded-md text-xs font-medium border ${
                                                co.priority === p 
                                                ? `${theme.colors.semantic.info.bg} ${theme.colors.semantic.info.border} ${theme.colors.semantic.info.text}` 
                                                : `${theme.colors.surface} ${theme.colors.border} ${theme.colors.text.secondary} hover:${theme.colors.background}`
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`${theme.components.card} p-4`}>
                        <h3 className="font-bold text-slate-800 mb-4 text-sm">Justification</h3>
                        <textarea 
                            value={co.justification || ''}
                            onChange={(e) => onChange('justification', e.target.value)}
                            disabled={isReadOnly}
                            placeholder="Reason for change..."
                            className="w-full p-3 border border-slate-300 rounded-lg text-sm h-32 resize-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
