
import React from 'react';
import { Task, TaskStatus } from '../../../types';
import { AlertTriangle, MessageCircle, Truck } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface TaskGeneralTabProps {
  task: Task;
  isReadOnly: boolean;
  canComplete: boolean;
  rfiCheck: { blocked: boolean, count: number };
  materialCheck: { hasShortfall: boolean, delayDays: number };
  blockingNCRs: any[];
  onUpdate: (field: string, value: any) => void;
  onStatusChange: (status: TaskStatus) => void;
}

export const TaskGeneralTab: React.FC<TaskGeneralTabProps> = ({ 
    task, isReadOnly, canComplete, rfiCheck, materialCheck, blockingNCRs, onUpdate, onStatusChange 
}) => {
  const theme = useTheme();

  return (
    <div className="space-y-6">
        <div className="space-y-3">
        {!canComplete && (
            <div className={`${theme.colors.semantic.danger.bg} ${theme.colors.semantic.danger.border} border rounded-lg p-4 flex items-start gap-3`}>
                <AlertTriangle className={`${theme.colors.semantic.danger.icon} shrink-0 mt-0.5`} size={20} />
                <div>
                    <h4 className={`text-sm font-bold ${theme.colors.semantic.danger.text}`}>Completion Blocked by Quality Control</h4>
                    <ul className="mt-2 space-y-1">{blockingNCRs.map(ncr => <li key={ncr.id} className={`text-xs font-medium ${theme.colors.semantic.danger.text} flex items-center gap-2`}><span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>{ncr.id}: {ncr.description}</li>)}</ul>
                </div>
            </div>
        )}
        {materialCheck.hasShortfall && (
            <div className={`${theme.colors.semantic.warning.bg} ${theme.colors.semantic.warning.border} border rounded-lg p-4 flex items-start gap-3`}>
                <Truck className={`${theme.colors.semantic.warning.icon} shrink-0 mt-0.5`} size={20} />
                <div><h4 className={`text-sm font-bold ${theme.colors.semantic.warning.text}`}>Supply Chain Constraint</h4><p className={`text-sm ${theme.colors.semantic.warning.text} mt-1`}>Material delivery delayed by {materialCheck.delayDays} days.</p></div>
            </div>
        )}
        {rfiCheck.blocked && (
            <div className={`${theme.colors.semantic.info.bg} ${theme.colors.semantic.info.border} border rounded-lg p-4 flex items-start gap-3`}>
                <MessageCircle className={`${theme.colors.semantic.info.icon} shrink-0 mt-0.5`} size={20} />
                <div><h4 className={`text-sm font-bold ${theme.colors.semantic.info.text}`}>Pending RFIs</h4><p className={`text-sm ${theme.colors.semantic.info.text} mt-1`}>{rfiCheck.count} open RFIs linked.</p></div>
            </div>
        )}
        </div>

        <section>
            <h3 className={`${theme.typography.label} mb-3`}>Description</h3>
            <textarea
            value={task.description || ''}
            onChange={(e) => onUpdate('description', e.target.value)}
            disabled={isReadOnly}
            className={`w-full ${theme.colors.background} ${theme.colors.text.primary} p-4 rounded-lg border ${theme.colors.border} text-sm min-h-[120px] focus:outline-none focus:ring-1 focus:ring-nexus-500 disabled:opacity-70`}
            placeholder="Add a detailed description..."
            />
        </section>

        <div className={`${theme.colors.surface} p-4 rounded-xl border ${theme.colors.border} shadow-sm`}>
            <label className={`${theme.typography.label} mb-1 block`}>Task Status</label>
            <select 
                value={task.status}
                disabled={isReadOnly}
                onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
                className={`w-full p-2 text-sm border rounded-md font-semibold ${theme.colors.background} ${theme.colors.text.primary} ${(!canComplete || rfiCheck.blocked) && task.status !== TaskStatus.COMPLETED ? 'border-orange-300 focus:ring-orange-500' : `${theme.colors.border} focus:ring-nexus-500`} disabled:opacity-70`}
            >
                <option value={TaskStatus.NOT_STARTED}>Not Started</option>
                <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                <option value={TaskStatus.COMPLETED} disabled={!canComplete || rfiCheck.blocked}>Completed</option>
                <option value={TaskStatus.DELAYED}>Delayed</option>
            </select>
        </div>
    </div>
  );
};
