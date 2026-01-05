
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Settings, ToggleLeft, ToggleRight, Server, Shield, Activity, Clock, Zap, Database, Cpu } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';

const SystemConfigPanel: React.FC = () => {
  const { state, dispatch } = useData();
  const theme = useTheme();
  const [config, setConfig] = useState(state.governance.scheduling);
  const [resConfig, setResConfig] = useState(state.governance.resourceDefaults);

  const handleSave = () => {
    dispatch({ type: 'UPDATE_SYSTEM_SCHEDULING', payload: { ...config } });
    alert("System configuration updated globally.");
  };

  return (
    <div className={`space-y-8 max-w-5xl mx-auto ${theme.layout.sectionSpacing}`}>
        {/* Scheduling Engine Logic (Oracle P6 Parity) */}
        <div className={`${theme.components.card} overflow-hidden`}>
            <div className={`p-4 ${theme.colors.background} border-b ${theme.colors.border} flex items-center gap-2`}>
                <Cpu size={20} className="text-nexus-600"/>
                <h3 className={`font-bold ${theme.colors.text.primary}`}>Scheduling Engine & CPM Logic</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className={`flex items-center justify-between p-3 ${theme.colors.background} rounded-lg border ${theme.colors.border}`}>
                        <div>
                            <p className={`text-sm font-bold ${theme.colors.text.primary}`}>Use Retained Logic</p>
                            <p className={`text-xs ${theme.colors.text.secondary}`}>Honor network dependencies for out-of-sequence work.</p>
                        </div>
                        <button 
                            onClick={() => setConfig({...config, retainedLogic: !config.retainedLogic})} 
                            className="text-nexus-600 focus:outline-none focus:ring-2 focus:ring-nexus-500 rounded-full"
                        >
                            {config.retainedLogic ? <ToggleRight size={32}/> : <ToggleLeft size={32} className={theme.colors.text.tertiary}/>}
                        </button>
                    </div>
                    <div>
                        <label className={`${theme.typography.label} block mb-1`}>Critical Path Method (CPM)</label>
                        <select 
                            className={`w-full p-2 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface} ${theme.colors.text.primary} focus:ring-2 focus:ring-nexus-500 outline-none`}
                            value={config.calculateCriticalPathUsing}
                            onChange={e => setConfig({...config, calculateCriticalPathUsing: e.target.value as any})}
                        >
                            <option>Total Float</option>
                            <option>Longest Path</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className={`flex items-center justify-between p-3 ${theme.colors.background} rounded-lg border ${theme.colors.border}`}>
                        <div>
                            <p className={`text-sm font-bold ${theme.colors.text.primary}`}>Compute Multiple Float Paths</p>
                            <p className={`text-xs ${theme.colors.text.secondary}`}>Enable advanced network tracing (DCMA metric).</p>
                        </div>
                        <button 
                            onClick={() => setConfig({...config, computeMultipleFloatPaths: !config.computeMultipleFloatPaths})} 
                            className="text-nexus-600 focus:outline-none focus:ring-2 focus:ring-nexus-500 rounded-full"
                        >
                            {config.computeMultipleFloatPaths ? <ToggleRight size={32}/> : <ToggleLeft size={32} className={theme.colors.text.tertiary}/>}
                        </button>
                    </div>
                    <div>
                        <label className={`${theme.typography.label} block mb-1`}>Default Task Type</label>
                        <select 
                            className={`w-full p-2 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface} ${theme.colors.text.primary} focus:ring-2 focus:ring-nexus-500 outline-none`}
                            value={config.defaultTaskType}
                            onChange={e => setConfig({...config, defaultTaskType: e.target.value as any})}
                        >
                            <option>Fixed Duration</option>
                            <option>Fixed Units</option>
                            <option>Fixed Units/Time</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        {/* Global Resource Defaults */}
        <div className={`${theme.components.card} overflow-hidden`}>
            <div className={`p-4 ${theme.colors.background} border-b ${theme.colors.border} flex items-center gap-2`}>
                <Activity size={20} className="text-blue-600"/>
                <h3 className={`font-bold ${theme.colors.text.primary}`}>Global Resource Defaults</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div>
                        <label className={`${theme.typography.label} block mb-1`}>Standard Work Day (Hours)</label>
                        <input 
                            type="number" 
                            className={`w-full p-2 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface} ${theme.colors.text.primary} focus:ring-2 focus:ring-nexus-500 outline-none`} 
                            value={resConfig.defaultWorkHoursPerDay} 
                            onChange={e => setResConfig({...resConfig, defaultWorkHoursPerDay: parseInt(e.target.value)})} 
                        />
                    </div>
                    <div className={`flex items-center justify-between p-3 ${theme.colors.background} rounded-lg border ${theme.colors.border}`}>
                        <div>
                            <p className={`text-sm font-bold ${theme.colors.text.primary}`}>Calculate Cost from Units</p>
                            <p className={`text-xs ${theme.colors.text.secondary}`}>Auto-compute labor costs based on units assigned.</p>
                        </div>
                        <button 
                            onClick={() => setResConfig({...resConfig, usePricePerUnitForCost: !resConfig.usePricePerUnitForCost})} 
                            className="text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                        >
                            {resConfig.usePricePerUnitForCost ? <ToggleRight size={32}/> : <ToggleLeft size={32} className={theme.colors.text.tertiary}/>}
                        </button>
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className={`${theme.typography.label} block mb-1`}>Auto-Leveling Sensitivity (%)</label>
                        <input 
                            type="number" 
                            className={`w-full p-2 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface} ${theme.colors.text.primary} focus:ring-2 focus:ring-nexus-500 outline-none`} 
                            value={resConfig.autoLevelingThreshold} 
                            onChange={e => setResConfig({...resConfig, autoLevelingThreshold: parseInt(e.target.value)})} 
                        />
                    </div>
                    <div className={`flex items-center justify-between p-3 ${theme.colors.background} rounded-lg border ${theme.colors.border}`}>
                        <div>
                            <p className={`text-sm font-bold ${theme.colors.text.primary}`}>Allow Overtime in Plan</p>
                            <p className={`text-xs ${theme.colors.text.secondary}`}>Enable OT calculations in resource profiles.</p>
                        </div>
                        <button 
                            onClick={() => setResConfig({...resConfig, allowOvertimeInPlanning: !resConfig.allowOvertimeInPlanning})} 
                            className="text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                        >
                            {resConfig.allowOvertimeInPlanning ? <ToggleRight size={32}/> : <ToggleLeft size={32} className={theme.colors.text.tertiary}/>}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex justify-end gap-3 pb-20">
            <Button variant="secondary">Reset to Defaults</Button>
            <Button onClick={handleSave}>Save System Configuration</Button>
        </div>
    </div>
  );
};

export default SystemConfigPanel;
