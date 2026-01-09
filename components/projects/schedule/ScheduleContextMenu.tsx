
import React from 'react';
import { Plus, Edit3, ShieldAlert, AlertCircle, UserPlus, Trash2 } from 'lucide-react';
import { Task } from '../../../types';

interface ScheduleContextMenuProps {
    contextMenu: { x: number; y: number; task: Task | null };
    onClose: () => void;
    onAddActivity: () => void;
    onSelectTask: (task: Task) => void;
    onAddRisk: () => void;
    onAddIssue: () => void;
    onDeleteTask: () => void;
}

export const ScheduleContextMenu: React.FC<ScheduleContextMenuProps> = ({
    contextMenu, onClose, onAddActivity, onSelectTask, onAddRisk, onAddIssue, onDeleteTask
}) => {
    return (
        <div 
            className="fixed z-[100] bg-white border border-slate-200 rounded-xl shadow-2xl w-56 py-2 overflow-hidden animate-in zoom-in-95 duration-100"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="px-4 py-2 border-b border-slate-100 mb-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {contextMenu.task ? contextMenu.task.wbsCode : 'Schedule Actions'}
                </p>
                <p className="text-xs font-bold text-slate-700 truncate">
                    {contextMenu.task ? contextMenu.task.name : 'New Element'}
                </p>
            </div>
            
            <button onClick={onAddActivity} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-nexus-50 hover:text-nexus-700 flex items-center gap-3 transition-colors">
                <Plus size={14}/> Add Activity
            </button>
            
            {contextMenu.task && (
                <>
                    <button onClick={() => { onSelectTask(contextMenu.task!); onClose(); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-nexus-50 hover:text-nexus-700 flex items-center gap-3 transition-colors">
                        <Edit3 size={14}/> Activity Detail
                    </button>
                    <div className="h-px bg-slate-100 my-1 mx-2"></div>
                    <button onClick={onAddRisk} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-nexus-50 hover:text-nexus-700 flex items-center gap-3 transition-colors">
                        <ShieldAlert size={14} className="text-orange-500"/> Assign Risk Link
                    </button>
                    <button onClick={onAddIssue} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-nexus-50 hover:text-nexus-700 flex items-center gap-3 transition-colors">
                        <AlertCircle size={14} className="text-yellow-500"/> Log Issue Link
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-nexus-50 hover:text-nexus-700 flex items-center gap-3 transition-colors">
                        <UserPlus size={14}/> Assign Resource
                    </button>
                    <div className="h-px bg-slate-100 my-1 mx-2"></div>
                    <button onClick={onDeleteTask} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors">
                        <Trash2 size={14}/> Delete Activity
                    </button>
                </>
            )}
        </div>
    );
};
