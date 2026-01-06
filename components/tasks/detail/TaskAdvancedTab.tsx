
import React from 'react';
import { Task, UserDefinedField, ActivityCode } from '../../../types';
import { Edit3, Tag, Receipt, AlertTriangle, ShieldAlert, Plus } from 'lucide-react';
import { Input } from '../../ui/Input';
import { useTheme } from '../../../context/ThemeContext';

interface TaskAdvancedTabProps {
  task: Task;
  isReadOnly: boolean;
  udfs: UserDefinedField[];
  codes: ActivityCode[];
  linkedIssues: any[];
  linkedRisks: any[];
  linkedExpenses: any[];
  onUpdate: (field: string, value: any) => void;
}

export const TaskAdvancedTab: React.FC<TaskAdvancedTabProps> = ({ 
    task, isReadOnly, udfs, codes, linkedIssues, linkedRisks, linkedExpenses, onUpdate 
}) => {
  const theme = useTheme();

  return (
    <div className="space-y-6">
         {/* Section: User-Defined Fields - Always visible in production interface */}
         <section>
            <h3 className={`${theme.typography.label} mb-3 flex items-center gap-2`}><Edit3 size={16} className="text-nexus-500"/> User-Defined Fields</h3>
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 ${theme.colors.surface} border ${theme.colors.border} rounded-xl shadow-sm`}>
                {udfs.length > 0 ? udfs.map(udf => (
                    <div key={udf.id}>
                        <label className={`${theme.typography.label} mb-1 block`}>{udf.title}</label>
                        {udf.dataType === 'List' ? (
                            <select 
                                value={task.udfValues?.[udf.id] || ''} 
                                onChange={e => {
                                    const newVal = { ...(task.udfValues || {}), [udf.id]: e.target.value };
                                    onUpdate('udfValues', newVal);
                                }}
                                disabled={isReadOnly}
                                className={`w-full p-2 text-sm border ${theme.colors.border} rounded-md ${theme.colors.background} ${theme.colors.text.primary} disabled:opacity-70`}
                            >
                                <option value="">-- Select --</option>
                                {udf.listValues?.map(val => <option key={val} value={val}>{val}</option>)}
                            </select>
                        ) : (
                            <Input 
                                value={task.udfValues?.[udf.id] || ''} 
                                onChange={e => {
                                    const newVal = { ...(task.udfValues || {}), [udf.id]: e.target.value };
                                    onUpdate('udfValues', newVal);
                                }}
                                disabled={isReadOnly}
                            />
                        )}
                    </div>
                )) : (
                    <div className="col-span-2 h-10 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-between px-4 text-xs font-medium text-slate-400 italic group">
                        No custom metadata fields defined for tasks.
                        {!isReadOnly && <button className="p-1 hover:bg-white rounded border border-transparent hover:border-slate-200 text-slate-300 hover:text-nexus-600 transition-all opacity-0 group-hover:opacity-100" title="Define New Field"><Plus size={14}/></button>}
                    </div>
                )}
            </div>
         </section>

         {/* Section: Activity Codes - Always visible in production interface */}
         <section>
            <h3 className={`${theme.typography.label} mb-3 flex items-center gap-2`}><Tag size={16} className="text-nexus-500"/> Activity Codes</h3>
            <div className={`space-y-3 p-4 ${theme.colors.background} border ${theme.colors.border} rounded-lg`}>
                {codes.length > 0 ? codes.map(code => (
                    <div key={code.id} className="grid grid-cols-1 sm:grid-cols-[150px_1fr] items-center gap-2 sm:gap-0">
                        <label className={`text-sm font-medium ${theme.colors.text.secondary}`}>{code.name}</label>
                        <select
                            value={task.activityCodeAssignments?.[code.id] || ''}
                            disabled={isReadOnly}
                            onChange={(e) => {
                                const newMap = { ...task.activityCodeAssignments };
                                if (e.target.value) newMap[code.id] = e.target.value; else delete newMap[code.id];
                                onUpdate('activityCodeAssignments', newMap);
                            }}
                            className={`w-full mt-1 p-2 text-sm border ${theme.colors.border} rounded-md ${theme.colors.surface} ${theme.colors.text.primary} disabled:opacity-70`}
                        >
                            <option value="">-- Not Assigned --</option>
                            {code.values.map(val => <option key={val.id} value={val.id}>{val.value}</option>)}
                        </select>
                    </div>
                )) : (
                    <div className="h-10 bg-slate-100 border border-slate-200 rounded-lg flex items-center px-4 text-xs font-medium text-slate-400 italic">
                        No activity codes available in global dictionary.
                    </div>
                )}
            </div>
         </section>

         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="bg-orange-50 border border-orange-100 rounded-lg p-3">
                 <h3 className="text-xs font-bold text-orange-800 uppercase mb-2 flex items-center gap-2"><AlertTriangle size={14}/> Risks</h3>
                 {linkedRisks.length > 0 ? (
                    <p className="text-sm text-orange-900">{linkedRisks.length} associated risks</p>
                 ) : (
                    <div className="h-8 bg-slate-100/50 border border-slate-200/50 rounded flex items-center justify-between px-3 text-[10px] font-bold text-slate-400 uppercase italic group">
                        No Linked Risks
                        {!isReadOnly && <button className="p-1 hover:bg-white rounded border border-transparent hover:border-slate-200 text-slate-300 hover:text-orange-600 transition-all opacity-0 group-hover:opacity-100"><Plus size={10}/></button>}
                    </div>
                 )}
             </div>
             <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                 <h3 className="text-xs font-bold text-yellow-800 uppercase mb-2 flex items-center gap-2"><ShieldAlert size={14}/> Issues</h3>
                 {linkedIssues.length > 0 ? (
                    <p className="text-sm text-yellow-900">{linkedIssues.length} active issues</p>
                 ) : (
                    <div className="h-8 bg-slate-100/50 border border-slate-200/50 rounded flex items-center justify-between px-3 text-[10px] font-bold text-slate-400 uppercase italic group">
                        No Active Issues
                        {!isReadOnly && <button className="p-1 hover:bg-white rounded border border-transparent hover:border-slate-200 text-slate-300 hover:text-yellow-600 transition-all opacity-0 group-hover:opacity-100"><Plus size={10}/></button>}
                    </div>
                 )}
             </div>
         </div>

         {/* Section: Direct Expenses - Always visible in production interface */}
         <section>
            <h3 className={`${theme.typography.label} mb-3 flex items-center gap-2`}><Receipt size={16} className="text-nexus-500"/> Direct Expenses</h3>
            <div className={`p-4 border ${theme.colors.border} rounded-xl ${theme.colors.surface}`}>
                {linkedExpenses.length > 0 ? (
                    <p className="text-sm text-slate-700 font-medium">{linkedExpenses.length} expense items logged to this activity.</p>
                ) : (
                    <div className="h-10 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-between px-4 text-xs font-medium text-slate-400 italic group">
                        No direct expenses recorded.
                        {!isReadOnly && <button className="p-1 hover:bg-white rounded border border-transparent hover:border-slate-200 text-slate-300 hover:text-nexus-600 transition-all opacity-0 group-hover:opacity-100" title="Charge Expense"><Plus size={14}/></button>}
                    </div>
                )}
            </div>
         </section>
    </div>
  );
};
