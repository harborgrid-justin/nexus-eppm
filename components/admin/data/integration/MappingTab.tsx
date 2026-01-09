
import React from 'react';
import { Database, Layers, X, Plus } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';
import { EtlMapping } from '../../../../types';

interface MappingTabProps {
    mappings: EtlMapping[];
    availableTargets: string[];
    targetEntity: string;
    onSourceChange: (id: number, val: string) => void;
    onTransformChange: (id: number, val: string) => void;
    onTargetChange: (id: number, val: string) => void;
    onRemove: (id: number) => void;
    onAdd: () => void;
}

export const MappingTab: React.FC<MappingTabProps> = ({
    mappings, availableTargets, targetEntity, onSourceChange, onTransformChange, onTargetChange, onRemove, onAdd
}) => {
    const theme = useTheme();

    return (
        <div className={`flex-1 flex flex-col ${theme.colors.surface} border ${theme.colors.border} rounded-xl shadow-sm overflow-hidden`}>
            <div className={`p-4 ${theme.colors.background} border-b ${theme.colors.border} grid grid-cols-[1fr_120px_1fr_50px] gap-4 text-xs font-bold ${theme.colors.text.secondary} uppercase tracking-widest`}>
                <div className="pl-4">Source Field</div>
                <div className="text-center">Transform</div>
                <div>Target Field ({targetEntity})</div>
                <div className="text-center">Action</div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {mappings.map((map) => (
                    <div key={map.id} className={`grid grid-cols-[1fr_120px_1fr_50px] gap-4 items-center p-3 rounded-lg border border-transparent hover:${theme.colors.border} hover:shadow-md transition-all group ${theme.colors.surface}`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-1.5 ${theme.colors.background} rounded ${theme.colors.text.tertiary}`}><Database size={14}/></div>
                            <input 
                                className={`w-full bg-transparent font-mono text-sm ${theme.colors.text.primary} font-bold outline-none border-b border-transparent focus:border-nexus-500`}
                                value={map.source}
                                onChange={(e) => onSourceChange(map.id, e.target.value)}
                                placeholder="SOURCE_COLUMN"
                            />
                        </div>
                        <div className="flex justify-center relative">
                            <select 
                                className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-1 rounded border border-purple-100 uppercase tracking-tight shadow-sm z-10 whitespace-nowrap outline-none cursor-pointer"
                                value={map.transform}
                                onChange={(e) => onTransformChange(map.id, e.target.value)}
                            >
                                <option>Direct</option><option>Trim Whitespace</option><option>Currency(USD)</option><option>Date(ISO8601)</option><option>Uppercase</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-nexus-50 rounded text-nexus-600"><Layers size={14}/></div>
                            <select 
                                className="w-full bg-transparent font-mono text-sm text-nexus-700 font-bold outline-none cursor-pointer"
                                value={map.target}
                                onChange={(e) => onTargetChange(map.id, e.target.value)}
                            >
                                {availableTargets.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="flex justify-center">
                            <button onClick={() => onRemove(map.id)} className="text-slate-300 hover:text-red-500 transition-colors"><X size={16}/></button>
                        </div>
                    </div>
                ))}
                <button onClick={onAdd} className={`w-full py-3 border-2 border-dashed ${theme.colors.border} rounded-lg ${theme.colors.text.tertiary} font-bold text-sm hover:border-nexus-400 hover:text-nexus-600 hover:${theme.colors.surface} transition-all flex items-center justify-center gap-2`}>
                    <Plus size={16}/> Add Field Map
                </button>
            </div>
        </div>
    );
};
