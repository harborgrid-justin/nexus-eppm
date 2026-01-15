
import React, { useMemo, useState } from 'react';
import { Task, Project, TaskStatus, ActivityStep, NotebookEntry } from '../types/index';
import { ShieldAlert, FileText, Calendar, Database, ListChecks, Book, Plus, Clock, Trash2, CheckCircle, Circle, Users } from 'lucide-react';
import { Button } from './ui/Button';
import { useTaskForm } from '../hooks/useTaskForm';
import { useData } from '../context/DataContext';
import { usePermissions } from '../hooks/usePermissions';
import { SidePanel } from './ui/SidePanel';
import { Input } from './ui/Input';
import { Badge } from './ui/Badge';
import { FieldPlaceholder } from './common/FieldPlaceholder';
import { formatCurrency, generateId } from '../utils/formatters';
import { useTheme } from '../context/ThemeContext';

interface TaskDetailModalProps {
  task: Task;
  project: Project;
  onClose: () => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, project, onClose }) => {
  const { state, dispatch } = useData();
  const theme = useTheme();
  const { canEditProject } = usePermissions();
  const isReadOnly = !canEditProject();
  const [activeTab, setActiveTab] = useState<'general' | 'schedule' | 'steps' | 'notebook'>('general');

  const {
    localTask, updateField, handleStatusChange, saveChanges, applicableCodes, 
    linkedIssues, linkedRisks, canComplete, blockingNCRs
  } = useTaskForm(task, project, onClose);

  // --- CRUD Handlers for P6-parity features ---
  
  const handleAddStep = () => {
    const name = prompt("Enter Step Name:");
    if (!name) return;
    const newStep: ActivityStep = { id: generateId('STEP'), name, weight: 1, completed: false };
    updateField('steps', [...(localTask.steps || []), newStep]);
  };

  const toggleStep = (id: string) => {
    const updated = (localTask.steps || []).map(s => s.id === id ? { ...s, completed: !s.completed } : s);
    updateField('steps', updated);
  };

  const handleAddNotebook = () => {
    const topic = prompt("Enter Notebook Topic (e.g. Site Conditions):");
    if (!topic) return;
    const newEntry: NotebookEntry = { 
        id: generateId('NB'), topic, content: '', 
        lastUpdated: new Date().toISOString(), updatedBy: 'Current User' 
    };
    updateField('notebooks', [...(localTask.notebooks || []), newEntry]);
  };

  return (
    <SidePanel isOpen={true} onClose={onClose} width="max-w-4xl"
       title={
         <div className="flex flex-col">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">ID: {localTask.id} • WBS: {localTask.wbsCode}</span>
            <div className="flex items-center gap-3">
                <span className={`text-xl font-black ${theme.colors.text.primary} uppercase tracking-tighter`}>{localTask.name}</span>
                {localTask.critical && <Badge variant="danger">Critical Path</Badge>}
            </div>
         </div>
       }
       footer={<><Button variant="secondary" onClick={onClose}>{isReadOnly ? 'Close' : 'Cancel'}</Button>{!isReadOnly && <Button variant="primary" onClick={saveChanges}>Commit Changes</Button>}</>}
    >
       <div className="space-y-6">
          <div className={`flex border-b ${theme.colors.border} overflow-x-auto scrollbar-hide`} role="tablist">
              {[ 
                  { id: 'general', label: 'General', icon: FileText }, 
                  { id: 'schedule', label: 'Schedule', icon: Calendar }, 
                  { id: 'steps', label: 'Activity Steps', icon: ListChecks },
                  { id: 'notebook', label: 'Notebook', icon: Book }
              ].map((tab) => (
                  <button 
                    key={tab.id} 
                    onClick={() => setActiveTab(tab.id as any)} 
                    className={`py-3 px-4 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 focus:outline-none whitespace-nowrap ${activeTab === tab.id ? 'border-nexus-600 text-nexus-700 bg-nexus-50/30 shadow-sm' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                  >
                      <tab.icon size={14}/> {tab.label}
                  </button>
              ))}
          </div>

          <div className="pt-2 min-h-[450px]">
             {activeTab === 'general' && (
                <div className="space-y-8 animate-nexus-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Activity Narrative</label>
                                <textarea 
                                    className={`w-full h-32 p-3 border ${theme.colors.border} rounded-xl text-sm focus:ring-2 focus:ring-nexus-500 outline-none resize-none shadow-inner ${theme.colors.background}`}
                                    value={localTask.description || ''}
                                    disabled={isReadOnly}
                                    onChange={e => updateField('description', e.target.value)}
                                    placeholder="Enter physical scope description..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Effort Type</label>
                                    <select 
                                        className={`w-full p-2.5 border ${theme.colors.border} rounded-lg text-sm bg-slate-50 font-bold`}
                                        value={localTask.effortType}
                                        disabled={isReadOnly}
                                        onChange={e => updateField('effortType', e.target.value as any)}
                                    >
                                        <option>Fixed Duration</option><option>Fixed Work</option><option>Fixed Units/Time</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text--[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Status</label>
                                    <select 
                                        className={`w-full p-2.5 border ${theme.colors.border} rounded-lg text-sm bg-slate-50 font-bold`}
                                        value={localTask.status}
                                        disabled={isReadOnly}
                                        onChange={e => handleStatusChange(e.target.value as TaskStatus)}
                                    >
                                        {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calculated Progress</span>
                                    <span className="text-xl font-black text-nexus-700">{localTask.progress}%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-nexus-600 transition-all duration-500" style={{ width: `${localTask.progress}%` }}></div>
                                </div>
                                <p className="text-[9px] text-slate-400 font-bold uppercase mt-2 italic">Drives Earned Value (EV) calculation.</p>
                            </div>
                            
                            <div className={`${theme.colors.surface} p-4 rounded-xl border ${theme.colors.border}`}>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Resource Assignments</h4>
                                {localTask.assignments.length > 0 ? (
                                    <div className="space-y-2">
                                        {localTask.assignments.map(a => (
                                            <div key={a.resourceId} className={`flex justify-between items-center p-2 ${theme.colors.background} rounded border ${theme.colors.border} text-xs`}>
                                                <span className={`font-bold ${theme.colors.text.secondary}`}>{state.resources.find(r => r.id === a.resourceId)?.name || a.resourceId}</span>
                                                <span className={`font-mono ${theme.colors.surface} px-1.5 rounded border ${theme.colors.border}`}>{a.units}%</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <FieldPlaceholder label="No labor or non-labor resources assigned." placeholderLabel="Assign Resource" onAdd={() => {}} icon={Users} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
             )}

             {activeTab === 'schedule' && (
                <div className="space-y-8 animate-nexus-in">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className={`p-4 ${theme.colors.background} rounded-xl border ${theme.colors.border}`}>
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Early Start</label>
                            <p className="text-sm font-mono font-bold mt-1">{localTask.startDate}</p>
                        </div>
                        <div className={`p-4 ${theme.colors.background} rounded-xl border ${theme.colors.border}`}>
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Early Finish</label>
                            <p className="text-sm font-mono font-bold mt-1">{localTask.endDate}</p>
                        </div>
                        <div className={`p-4 ${theme.colors.background} rounded-xl border ${theme.colors.border}`}>
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Float</label>
                            <p className={`text-sm font-mono font-bold mt-1 ${localTask.totalFloat! <= 0 ? 'text-red-600' : 'text-green-600'}`}>{localTask.totalFloat || 0}d</p>
                        </div>
                        <div className={`p-4 ${theme.colors.background} rounded-xl border ${theme.colors.border}`}>
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Duration</label>
                            <p className="text-sm font-mono font-bold mt-1">{localTask.duration}d</p>
                        </div>
                    </div>
                    
                    <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} overflow-hidden shadow-sm`}>
                        <div className={`p-3 bg-slate-50 border-b ${theme.colors.border} font-bold text-[10px] text-slate-500 uppercase tracking-widest`}>Logical Relationships</div>
                        <table className="w-full text-xs">
                            <thead className={`${theme.colors.surface}`}>
                                <tr className="text-slate-400 border-b border-slate-100">
                                    <th className="p-3 text-left font-bold">Activity ID</th>
                                    <th className="p-3 text-left font-bold">Description</th>
                                    <th className="p-3 text-center font-bold">Type</th>
                                    <th className="p-3 text-center font-bold">Lag</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {localTask.dependencies.map(dep => {
                                    const pred = project.tasks.find(t => t.id === dep.targetId);
                                    return (
                                        <tr key={dep.targetId} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="p-3 font-mono font-bold text-slate-500">{dep.targetId}</td>
                                            <td className="p-3 font-bold text-slate-700">{pred?.name || 'Unknown Reference'}</td>
                                            <td className="p-3 text-center"><Badge variant="neutral">{dep.type}</Badge></td>
                                            <td className="p-3 text-center font-mono">{dep.lag}d</td>
                                        </tr>
                                    );
                                })}
                                {localTask.dependencies.length === 0 && (
                                    <tr><td colSpan={4} className="p-10 text-center text-slate-400 italic">No network relationships defined. (Open End Detected)</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
             )}

             {activeTab === 'steps' && (
                 <div className="space-y-6 animate-nexus-in">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Physical Progress Checklist</h3>
                        {!isReadOnly && <Button size="sm" variant="ghost" icon={Plus} onClick={handleAddStep}>Add Step</Button>}
                    </div>
                    {localTask.steps && localTask.steps.length > 0 ? (
                        <div className="space-y-3">
                            {localTask.steps.map(step => (
                                <div key={step.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${step.completed ? 'bg-green-50 border-green-200' : `${theme.colors.surface} ${theme.colors.border} shadow-sm`}`}>
                                    <div className="flex items-center gap-4">
                                        <button 
                                            onClick={() => toggleStep(step.id)} 
                                            disabled={isReadOnly}
                                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${step.completed ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-200' : 'bg-white border-slate-200 hover:border-nexus-400'}`}
                                        >
                                            {step.completed ? <CheckCircle size={14}/> : <Circle size={14} className="text-slate-200"/>}
                                        </button>
                                        <span className={`text-sm font-bold ${step.completed ? 'text-green-800 line-through opacity-70' : 'text-slate-800'}`}>{step.name}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <span className="text-[10px] font-black text-slate-400 uppercase block">Weight</span>
                                            <span className="text-sm font-mono font-black text-slate-700">{step.weight}</span>
                                        </div>
                                        {!isReadOnly && <button className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <FieldPlaceholder label="No steps defined to drive physical completion." placeholderLabel="Initialize Steps" onAdd={handleAddStep} icon={ListChecks} />
                    )}
                 </div>
             )}

             {activeTab === 'notebook' && (
                 <div className="space-y-6 animate-nexus-in">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Activity Journal & Narrative</h3>
                        {!isReadOnly && <Button size="sm" variant="ghost" icon={Plus} onClick={handleAddNotebook}>Add Topic</Button>}
                    </div>
                    {localTask.notebooks && localTask.notebooks.length > 0 ? (
                        <div className="space-y-6">
                            {localTask.notebooks.map((entry, idx) => (
                                <div key={entry.id} className={`p-6 ${theme.colors.surface} border ${theme.colors.border} rounded-2xl shadow-sm group hover:border-nexus-300 transition-all`}>
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-black text-slate-800 uppercase tracking-tight text-sm">{entry.topic}</h4>
                                        <div className="text-[9px] font-bold text-slate-400 uppercase">Last Sync: {entry.lastUpdated.split('T')[0]}</div>
                                    </div>
                                    <textarea 
                                        className={`w-full h-32 p-4 ${theme.colors.background} rounded-xl text-sm leading-relaxed focus:bg-white focus:ring-2 focus:ring-nexus-500 outline-none resize-none border border-slate-100 transition-all shadow-inner`}
                                        value={entry.content}
                                        disabled={isReadOnly}
                                        onChange={e => {
                                            const newNb = [...localTask.notebooks!];
                                            newNb[idx] = { ...newNb[idx], content: e.target.value, lastUpdated: new Date().toISOString() };
                                            updateField('notebooks', newNb);
                                        }}
                                        placeholder="Record narrative history or constraint description..."
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <FieldPlaceholder label="Activity notebooks are empty. Log site history or delays." placeholderLabel="Log Narrative" onAdd={handleAddNotebook} icon={Book} />
                    )}
                 </div>
             )}
          </div>
       </div>
    </SidePanel>
  );
};

export default TaskDetailModal;
