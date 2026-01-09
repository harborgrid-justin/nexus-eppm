
import React, { useState } from 'react';
import { ScrollText, Edit2, Check, Plus, X } from 'lucide-react';
import { Project } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { usePermissions } from '../../hooks/usePermissions';
import { useData } from '../../context/DataContext';

interface TeamCharterProps {
    project: Project | undefined;
}

const TeamCharter: React.FC<TeamCharterProps> = ({ project }) => {
    const theme = useTheme();
    const { canEditProject } = usePermissions();
    const { dispatch } = useData();
    const [isEditing, setIsEditing] = useState(false);
    
    // Local state for editing
    const [values, setValues] = useState<string[]>(project?.teamCharter?.values || []);
    const [comms, setComms] = useState(project?.teamCharter?.communicationGuidelines || '');
    const [decision, setDecision] = useState(project?.teamCharter?.decisionMakingProcess || '');
    const [conflict, setConflict] = useState(project?.teamCharter?.conflictResolutionProcess || '');
    const [newValue, setNewValue] = useState('');

    const handleSave = () => {
        if (!project) return;
        
        const updatedCharter = {
            values,
            communicationGuidelines: comms,
            decisionMakingProcess: decision,
            conflictResolutionProcess: conflict
        };

        dispatch({
            type: 'PROJECT_UPDATE',
            payload: {
                projectId: project.id,
                updatedData: { teamCharter: updatedCharter }
            }
        });
        setIsEditing(false);
    };

    const addValue = () => {
        if (newValue.trim()) {
            setValues([...values, newValue.trim()]);
            setNewValue('');
        }
    };

    const removeValue = (index: number) => {
        setValues(values.filter((_, i) => i !== index));
    };

    if (!project) return null;

    return (
        <div className={`p-6 ${theme.colors.surface} rounded-xl shadow-sm border ${theme.colors.border} h-full overflow-y-auto`}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <ScrollText className="text-nexus-600"/> Team Charter
                </h2>
                {canEditProject() && (
                    <button 
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${isEditing ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                    >
                        {isEditing ? <Check size={16}/> : <Edit2 size={16}/>}
                        {isEditing ? 'Save Charter' : 'Edit Charter'}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-5 rounded-xl border ${theme.colors.border} ${isEditing ? 'bg-white ring-2 ring-nexus-100' : 'bg-slate-50'}`}>
                    <h3 className="font-bold text-slate-700 mb-3 flex justify-between items-center">
                        Core Values
                        {isEditing && <span className="text-[10px] uppercase font-normal text-slate-400">Editable</span>}
                    </h3>
                    <ul className="space-y-2 mb-3">
                        {values.map((v, i) => (
                            <li key={i} className="flex items-center justify-between bg-white p-2 rounded border border-slate-200 text-sm text-slate-700 shadow-sm">
                                {v}
                                {isEditing && (
                                    <button onClick={() => removeValue(i)} className="text-slate-400 hover:text-red-500">
                                        <X size={14}/>
                                    </button>
                                )}
                            </li>
                        ))}
                        {values.length === 0 && !isEditing && <li className="text-slate-400 text-sm italic">No values defined.</li>}
                    </ul>
                    {isEditing && (
                        <div className="flex gap-2">
                            <input 
                                className="flex-1 p-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-nexus-500"
                                placeholder="Add value..."
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addValue()}
                            />
                            <button onClick={addValue} className="p-2 bg-nexus-100 text-nexus-700 rounded-md hover:bg-nexus-200">
                                <Plus size={16}/>
                            </button>
                        </div>
                    )}
                </div>

                <div className={`p-5 rounded-xl border ${theme.colors.border} ${isEditing ? 'bg-white ring-2 ring-nexus-100' : 'bg-slate-50'}`}>
                    <h3 className="font-bold text-slate-700 mb-3">Communication Guidelines</h3>
                    {isEditing ? (
                        <textarea 
                            className="w-full h-32 p-3 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-nexus-500 outline-none resize-none"
                            value={comms}
                            onChange={(e) => setComms(e.target.value)}
                            placeholder="e.g. Daily standups at 9am, weekly status reports..."
                        />
                    ) : (
                        <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{comms || 'None defined.'}</p>
                    )}
                </div>

                <div className={`p-5 rounded-xl border ${theme.colors.border} ${isEditing ? 'bg-white ring-2 ring-nexus-100' : 'bg-slate-50'}`}>
                    <h3 className="font-bold text-slate-700 mb-3">Decision-Making Process</h3>
                    {isEditing ? (
                        <textarea 
                            className="w-full h-32 p-3 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-nexus-500 outline-none resize-none"
                            value={decision}
                            onChange={(e) => setDecision(e.target.value)}
                            placeholder="e.g. Consensus driven, PM tie-breaker..."
                        />
                    ) : (
                        <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{decision || 'None defined.'}</p>
                    )}
                </div>

                <div className={`p-5 rounded-xl border ${theme.colors.border} ${isEditing ? 'bg-white ring-2 ring-nexus-100' : 'bg-slate-50'}`}>
                    <h3 className="font-bold text-slate-700 mb-3">Conflict Resolution</h3>
                    {isEditing ? (
                        <textarea 
                            className="w-full h-32 p-3 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-nexus-500 outline-none resize-none"
                            value={conflict}
                            onChange={(e) => setConflict(e.target.value)}
                            placeholder="e.g. Escalate to Sponsor if unresolved after 3 days..."
                        />
                    ) : (
                        <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{conflict || 'None defined.'}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamCharter;
