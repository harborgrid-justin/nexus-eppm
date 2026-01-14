import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';
import { Cpu, Activity, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '../ui/Button';

const SystemConfig: React.FC = () => {
  const { state, dispatch } = useData();
  const theme = useTheme();
  const { t } = useI18n();
  const [config, setConfig] = useState(state.governance.scheduling);
  const [resConfig, setResConfig] = useState(state.governance.resourceDefaults);

  const handleSave = () => {
    dispatch({ type: 'UPDATE_SYSTEM_SCHEDULING', payload: config });
    alert(t('admin.config_saved', 'System parameters committed globally.'));
  };

  return (
    <div className={`h-full flex flex-col space-y-8 animate-nexus-in`}>
        <div className={`p-6 rounded-2xl border ${theme.colors.border} ${theme.colors.surface} shadow-sm`}>
            <div className="flex items-center gap-3 mb-6 pb-2 border-b">
                <Cpu size={20} className="text-nexus-600"/>
                <h3 className="font-black uppercase text-xs tracking-widest text-slate-800">{t('admin.scheduling_logic', 'CPM Scheduling Engine')}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className={`flex items-center justify-between p-4 ${theme.colors.background} rounded-xl border ${theme.colors.border}`}>
                    <div>
                        <p className="text-sm font-bold text-slate-800">{t('admin.retained_logic', 'Use Retained Logic')}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{t('admin.retained_logic_desc', 'Honor network dependencies.')}</p>
                    </div>
                    <button onClick={() => setConfig({...config, retainedLogic: !config.retainedLogic})} className="text-nexus-600">
                        {config.retainedLogic ? <ToggleRight size={32}/> : <ToggleLeft size={32} className="text-slate-300"/>}
                    </button>
                </div>
            </div>
        </div>

        <div className={`p-6 rounded-2xl border ${theme.colors.border} ${theme.colors.surface} shadow-sm`}>
            <div className="flex items-center gap-3 mb-6 pb-2 border-b">
                <Activity size={20} className="text-blue-600"/>
                <h3 className="font-black uppercase text-xs tracking-widest text-slate-800">{t('admin.resource_defaults', 'Resource Defaults')}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{t('res.std_day', 'Standard Work Day (Hours)')}</label>
                    <input type="number" className={`w-full p-2.5 border ${theme.colors.border} rounded-lg text-sm bg-slate-50 font-mono`} value={resConfig.defaultWorkHoursPerDay} onChange={e => setResConfig({...resConfig, defaultWorkHoursPerDay: parseInt(e.target.value)})} />
                </div>
            </div>
        </div>

        <div className="flex justify-end gap-3 pb-20">
            <Button variant="secondary">{t('common.reset', 'Reset Defaults')}</Button>
            <Button onClick={handleSave} icon={Save}>{t('admin.save_config', 'Commit System Configuration')}</Button>
        </div>
    </div>
  );
};
export default SystemConfig;