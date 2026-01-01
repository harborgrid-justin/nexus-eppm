
import React, { useState, useMemo } from 'react';
import { RefreshCw, Play, Plus, X, Search, Terminal, AlertTriangle, CheckCircle, Database, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { GlobalChangeRule } from '../../types';

const GlobalChangeWorkbench: React.FC = () => {
    const theme = useTheme();
    const { state, dispatch } = useData();

    const [rules, setRules] = useState<GlobalChangeRule[]>([
        { id: '1', field: 'Activity Status', operator: 'is', value: 'Delayed', thenField: 'Priority', thenValue: 'Critical' }
    ]);
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationResult, setSimulationResult] = useState<{ affectedTasks: number; affectedProjects: number } | null>(null);

    const addRule = () => {
        setRules([...rules, { 
            id: Date.now().toString(), 
            field: 'Discipline', 
            operator: 'contains', 
            value: 'Civil', 
            thenField: 'Cost Account', 
            thenValue: '10.Civil.5' 
        }]);
    };

    const removeRule = (id: string) => {
        setRules(rules.filter(r => r.id !== id));
    };

    const handleSimulate = () => {
        setIsSimulating(true);
        // Mock simulation engine scanning the EPS
        setTimeout(() => {
            setIsSimulating(false);
            setSimulationResult({ affectedTasks: 142, affectedProjects: 8 });
        }, 1500);
    };

    const handleCommit = () => {
        if (!simulationResult) return;
        if (confirm(`WARNING: This will modify ${simulationResult.affectedTasks} tasks across ${simulationResult.affectedProjects} projects. This action cannot be undone. Continue?`)) {
            dispatch({ type: 'UPDATE_GLOBAL_CHANGE_RULES', payload: rules });
            alert("Global Change Committed. Audit log updated.");
            setSimulationResult(null);
        }
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Terminal className="text-nexus-600" size={20}/> Global Change Engine
                    </h3>
                    <p className="text-sm text-slate-500">Automated project-wide updates based on relational logic across the entire EPS.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                     <button 
                        onClick={handleSimulate}
                        disabled={isSimulating}
                        className="flex-1 md:flex-none px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                     >
                        {isSimulating ? <RefreshCw className="animate-spin" size={16}/> : <Search size={16} />}
                        Simulate Impact
                     </button>
                     <button 
                        onClick={handleCommit}
                        disabled={!simulationResult || isSimulating}
                        className={`flex-1 md:flex-none px-4 py-2 ${theme.colors.primary} text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${theme.colors.primaryHover} shadow-sm disabled:opacity-50`}
                     >
                        <Play size={16} /> Commit Changes
                     </button>
                </div>
            </div>

            {simulationResult ? (
                <div className={`${theme.colors.semantic.info.bg} ${theme.colors.semantic.info.text} p-6 rounded-2xl shadow-xl border ${theme.colors.semantic.info.border} flex flex-col sm:flex-row items-center justify-between animate-in zoom-in-95 gap-6`}>
                    <div className="flex items-center gap-6">
                        <div className={`p-3 ${theme.colors.surface} rounded-xl`}>
                            <CheckCircle size={32} className={theme.colors.semantic.info.icon}/>
                        </div>
                        <div>
                            <h4 className="text-xl font-bold">Simulation Complete</h4>
                            <p className="text-sm">Rules validated against active data pool.</p>
                        </div>
                    </div>
                    <div className={`flex gap-8 border-l-0 sm:border-l border-t sm:border-t-0 ${theme.colors.semantic.info.border} pl-0 sm:pl-8 pt-4 sm:pt-0 w-full sm:w-auto justify-around sm:justify-end`}>
                        <div className="text-center">
                            <p className={`text-[10px] uppercase font-bold`}>Affected Tasks</p>
                            <p className="text-2xl font-black">{simulationResult.affectedTasks}</p>
                        </div>
                        <div className="text-center">
                            <p className={`text-[10px] uppercase font-bold`}>Affected Projects</p>
                            <p className="text-2xl font-black">{simulationResult.affectedProjects}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={`${theme.colors.semantic.warning.bg} border ${theme.colors.semantic.warning.border} p-4 rounded-xl flex gap-3 items-start`}>
                    <AlertTriangle className={`${theme.colors.semantic.warning.icon} shrink-0 mt-0.5`} size={18}/>
                    <p className={`text-xs ${theme.colors.semantic.warning.text} leading-relaxed font-medium`}>
                        <strong>Precaution:</strong> Committing a global change modifies hundreds of activities simultaneously. It is highly recommended to <strong>Capture a Baseline</strong> before executing any transformation rules.
                    </p>
                </div>
            )}

            <div className={`flex-1 ${theme.colors.background} rounded-2xl p-4 md:p-8 overflow-y-auto space-y-4 shadow-inner border ${theme.colors.border}`}>
                {rules.map((rule, idx) => (
                    <div key={rule.id} className={`flex flex-col md:flex-row flex-wrap items-center gap-4 ${theme.colors.surface} p-6 rounded-xl border ${theme.colors.border} relative group animate-in slide-in-from-left-4 duration-300 shadow-sm`}>
                        <button 
                            onClick={() => removeRule(rule.id)}
                            className={`absolute -top-2 -right-2 ${theme.colors.semantic.danger.bg} ${theme.colors.text.inverted} rounded-full p-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-lg`}
                        >
                            <X size={12}/>
                        </button>
                        
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <span className="text-xs font-black text-nexus-400 uppercase tracking-widest w-8 md:w-auto">IF</span>
                            <select className={`flex-1 ${theme.colors.surface} ${theme.colors.text.primary} text-sm ${theme.colors.border} border rounded-md py-1.5 focus:ring-nexus-500 font-mono outline-none`}>
                                <option>Activity Status</option>
                                <option>Discipline</option>
                                <option>Resource ID</option>
                                <option>Float</option>
                                <option>Finish Date</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                             <select className={`flex-1 ${theme.colors.surface} ${theme.colors.text.secondary} text-sm ${theme.colors.border} border rounded-md py-1.5 font-mono outline-none`}>
                                <option>Equals</option>
                                <option>Contains</option>
                                <option>Is Empty</option>
                                <option>Greater Than</option>
                            </select>
                            <input 
                                type="text" 
                                className={`flex-1 ${theme.colors.surface} ${theme.colors.text.primary} text-sm border ${theme.colors.border} rounded-md py-1.5 px-3 w-full md:w-32 focus:border-nexus-500 font-mono outline-none`} 
                                value={rule.value}
                                onChange={(e) => {
                                    const newRules = [...rules];
                                    newRules[idx].value = e.target.value;
                                    setRules(newRules);
                                }}
                            />
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <span className={`text-xs font-black ${theme.colors.semantic.success.text} uppercase tracking-widest w-20 md:w-auto`}>THEN SET</span>
                             <select className={`flex-1 ${theme.colors.surface} ${theme.colors.text.primary} text-sm border ${theme.colors.border} rounded-md py-1.5 focus:ring-nexus-500 font-mono outline-none`}>
                                <option>Priority</option>
                                <option>Cost Account</option>
                                <option>Duration</option>
                                <option>Activity Code</option>
                                <option>Owner</option>
                            </select>
                             <span className={theme.colors.text.tertiary}>=</span>
                            <input 
                                type="text" 
                                className={`flex-1 ${theme.colors.surface} ${theme.colors.text.primary} text-sm border ${theme.colors.border} rounded-md py-1.5 px-3 w-full md:w-32 focus:border-nexus-500 font-mono outline-none`} 
                                value={rule.thenValue}
                                onChange={(e) => {
                                    const newRules = [...rules];
                                    newRules[idx].thenValue = e.target.value;
                                    setRules(newRules);
                                }}
                            />
                        </div>
                    </div>
                ))}

                <button onClick={addRule} className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 font-bold text-sm hover:border-nexus-400 hover:text-nexus-600 hover:bg-white transition-all flex items-center justify-center gap-2">
                    <Plus size={18}/> Add Logic Rule
                </button>
            </div>
            <div className={`p-4 border-t ${theme.colors.border} rounded-b-xl flex justify-between items-center ${theme.colors.background}`}>
                <div className={`flex items-center gap-2 text-xs ${theme.colors.text.secondary}`}>
                    <Database size={14}/> 
                    Target Pool: <strong>14 Active Projects</strong>
                </div>
                <div className={`text-xs ${theme.colors.text.tertiary} italic`}>
                    Rules are applied sequentially from top to bottom.
                </div>
            </div>
        </div>
    );
};

export default GlobalChangeWorkbench;
