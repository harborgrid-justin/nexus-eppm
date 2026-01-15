
import React from 'react';
import { Task, UserDefinedField, ActivityCode } from '../../../types';
import { Edit3, Tag, Receipt, AlertTriangle, ShieldAlert, Plus, Layers } from 'lucide-react';
import { Input } from '../../ui/Input';
import { useTheme } from '../../../context/ThemeContext';
import { EmptyGrid } from '../../common/EmptyGrid';

interface TaskAdvancedTabProps {
  task: Task;
  isReadOnly: boolean;
  udfs: UserDefinedField[];
  activityCodes: ActivityCode[];
  onUpdate: (field: string, value: any) => void;
}

export const TaskAdvancedTab: React.FC<TaskAdvancedTabProps> = ({ 
  task, isReadOnly, udfs, activityCodes, onUpdate 
}) => {
  const theme = useTheme();

  const handleUdfChange = (udfId: string, value: any) => {
    const currentValues = task.udfValues || {};
    onUpdate('udfValues', { ...currentValues, [udfId]: value });
  };

  const handleCodeChange = (codeId: string, valueId: string) => {
    const currentAssignments = task.activityCodeAssignments || {};
    onUpdate('activityCodeAssignments', { ...currentAssignments, [codeId]: valueId });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {/* Activity Codes Section */}
        <section className={`${theme.colors.surface} p-6 rounded-2xl border ${theme.colors.border} shadow-sm`}>
            <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme.colors.text.tertiary} mb-6 flex items-center gap-2 border-b ${theme.colors.border} pb-2`}>
                <Tag size={14} className="text-nexus-600"/> Activity Classification (Codes)
            </h3>
            
            {activityCodes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activityCodes.map(code => (
                        <div key={code.id}>
                            <label className={`block text-[10px] font-bold ${theme.colors.text.secondary} uppercase mb-1.5`}>{code.name}</label>
                            <select 
                                disabled={isReadOnly}
                                value={task.activityCodeAssignments?.[code.id] || ''}
                                onChange={(e) => handleCodeChange(code.id, e.target.value)}
                                className={`w-full p-2.5 border ${theme.colors.border} rounded-xl text-sm font-medium bg-slate-50 focus:bg-white focus:ring-2 focus:ring-nexus-500 outline-none transition-all`}
                            >
                                <option value="">-- Unassigned --</option>
                                {code.values.map(val => (
                                    <option key={val.id} value={val.id}>{val.value}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                    <Layers size={24} className="text-slate-300 mb-2"/>
                    <p className="text-xs text-slate-400 font-medium">No global activity codes defined.</p>
                </div>
            )}
        </section>

        {/* User Defined Fields Section */}
        <section className={`${theme.colors.surface} p-6 rounded-2xl border ${theme.colors.border} shadow-sm`}>
            <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme.colors.text.tertiary} mb-6 flex items-center gap-2 border-b ${theme.colors.border} pb-2`}>
                <Edit3 size={14} className="text-blue-500"/> User Defined Fields (UDFs)
            </h3>

            {udfs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {udfs.map(udf => (
                        <div key={udf.id}>
                            <label className={`block text-[10px] font-bold ${theme.colors.text.secondary} uppercase mb-1.5`}>{udf.title}</label>
                            {udf.dataType === 'List' && udf.listValues ? (
                                <select
                                    disabled={isReadOnly}
                                    value={task.udfValues?.[udf.id] || ''}
                                    onChange={(e) => handleUdfChange(udf.id, e.target.value)}
                                    className={`w-full p-2.5 border ${theme.colors.border} rounded-xl text-sm font-medium bg-slate-50 focus:bg-white focus:ring-2 focus:ring-nexus-500 outline-none`}
                                >
                                    <option value="">-- Select --</option>
                                    {udf.listValues.map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                            ) : (
                                <Input 
                                    type={udf.dataType === 'Number' ? 'number' : udf.dataType === 'Date' ? 'date' : 'text'}
                                    disabled={isReadOnly}
                                    value={task.udfValues?.[udf.id] || ''}
                                    onChange={(e) => handleUdfChange(udf.id, e.target.value)}
                                    placeholder={`Enter ${udf.dataType.toLowerCase()}...`}
                                    className="bg-slate-50"
                                />
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                    <Edit3 size={24} className="text-slate-300 mb-2"/>
                    <p className="text-xs text-slate-400 font-medium">No custom fields configured for Tasks.</p>
                </div>
            )}
        </section>
        
        <div className={`p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-start gap-3`}>
            <ShieldAlert size={18} className="text-orange-600 mt-0.5 shrink-0"/>
            <p className="text-xs text-orange-800 leading-relaxed font-medium">
                <strong>Data Governance Note:</strong> Modifications to Activity Codes and UDFs are audited. Ensure alignment with the project's data dictionary before committing changes.
            </p>
        </div>
    </div>
  );
};
