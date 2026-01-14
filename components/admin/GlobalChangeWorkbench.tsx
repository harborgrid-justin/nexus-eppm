import React, { useState } from 'react';
import { Terminal, RefreshCw, Play, Plus, X, AlertTriangle, Database } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';
import { useData } from '../../context/DataContext';
import { Button } from '../ui/Button';
import { EmptyGrid } from '../common/EmptyGrid';

const GlobalChangeWorkbench: React.FC = () => {
    const theme = useTheme();
    const { t } = useI18n();
    const { state, dispatch } = useData();
    const [rules, setRules] = useState(state.globalChangeRules || []);
    const [isSimulating, setIsSimulating] = useState(false);

    const addRule = () => {
        setRules([...rules, { id: Date.now().toString(), field: 'Status', operator: 'is', value: '', thenField: 'Priority', thenValue: '' }]);
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className={`p-6 rounded-2xl bg-slate-900 text-white flex justify-between items-center shadow-xl relative overflow-hidden`}>
                <div className="relative z-10">
                    <h3 className="text-xl font-black uppercase tracking-tighter">{t('admin.gc_engine', 'Global Change Engine')}</h3>
                    <p className="text-slate-400 text-sm mt-1">{t('admin.gc_subtitle', 'Automated project-wide updates across the EPS.')}</p>
                </div>
                <div className="flex gap-2 relative z-10">
                    <Button variant="ghost-white" onClick={() => setIsSimulating(true)} icon={RefreshCw} className={isSimulating ? 'animate-spin' : ''}>{t('admin.simulate', 'Simulate Impact')}</Button>
                    <Button className="bg-nexus-600 border-0" icon={Play}>{t('admin.commit_gc', 'Commit Changes')}</Button>
                </div>
                <Terminal size={140} className="absolute -right-8 -bottom-8 opacity-5 text-white pointer-events-none rotate-12" />
            </div>

            <div className={`flex-1 overflow-y-auto ${theme.colors.background} rounded-2xl border ${theme.colors.border} shadow-inner p-6 space-y-4`}>
                {rules.length > 0 ? (
                    rules.map((rule, idx) => (
                        <div key={rule.id} className={`flex items-center gap-4 bg-white p-4 rounded-xl border ${theme.colors.border} shadow-sm animate-nexus-in`}>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest w-8">IF</span>
                             <select className="flex-1 text-sm border rounded-md p-1.5 bg-slate-50 outline-none" value={rule.field}><option>Activity Status</option><option>Task Name</option></select>
                             <select className="w-24 text-sm border rounded-md p-1.5 bg-slate-50 outline-none" value={rule.operator}><option>is</option><option>contains</option></select>
                             <input type="text" className="flex-1 text-sm border rounded-md p-1.5 bg-white outline-none" defaultValue={rule.value} />
                             <span className="text-[10px] font-black text-green-600 uppercase tracking-widest w-20 text-center">THEN SET</span>
                             <input type="text" className="flex-1 text-sm border rounded-md p-1.5 bg-white outline-none" defaultValue={rule.thenValue} />
                             <button onClick={() => setRules(rules.filter(r => r.id !== rule.id))} className="text-slate-300 hover:text-red-500"><X size={16}/></button>
                        </div>
                    ))
                ) : (
                    <EmptyGrid title={t('admin.gc_empty', 'No Change Rules')} description={t('admin.gc_empty_desc', 'Define standardized transformation rules.')} icon={Terminal} onAdd={addRule} />
                )}
                {rules.length > 0 && <Button variant="ghost" icon={Plus} onClick={addRule}>{t('common.add_rule', 'Add Rule')}</Button>}
            </div>
            
            <div className={`p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 items-center shadow-sm`}>
                <AlertTriangle className="text-amber-600" size={20}/>
                <p className="text-xs text-amber-800 font-bold uppercase tracking-tight">{t('admin.gc_warning', 'WARNING: Changes apply globally to all matching entities in the warehouse.')}</p>
            </div>
        </div>
    );
};
export default GlobalChangeWorkbench;