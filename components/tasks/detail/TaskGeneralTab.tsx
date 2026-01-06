
import React from 'react';
import { Task, TaskStatus } from '../../../types';
import { AlertTriangle, MessageCircle, Truck } from 'lucide-react';

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
  return (
    <div className="space-y-6">
        <div className="space-y-3">
        {!canComplete && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
                <div>
                    <h4 className="text-sm font-bold text-red-800">Completion Blocked by Quality Control</h4>
                    <ul className="mt-2 space-y-1">{blockingNCRs.map(ncr => <li key={ncr.id} className="text-xs font-medium text-red-700 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>{ncr.id}: {ncr.description}</li>)}</ul>
                </div>
            </div>
        )}
        {materialCheck.hasShortfall && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                <Truck className="text-amber-600 shrink-0 mt-0.5" size={20} />
                <div><h4 className="text-sm font-bold text-amber-800">Supply Chain Constraint</h4><p className="text-sm text-amber-700 mt-1">Material delivery delayed by {materialCheck.delayDays} days.</p></div>
            </div>
        )}
        {rfiCheck.blocked && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <MessageCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
                <div><h4 className="text-sm font-bold text-blue-800">Pending RFIs</h4><p className="text-sm text-blue-700 mt-1">{rfiCheck.count} open RFIs linked.</p></div>
            </div>
        )}
        </div>

        <section>
            <h3 className="text-xs font-bold text-text-