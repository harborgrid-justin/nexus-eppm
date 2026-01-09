
import React from 'react';
import { 
    Plus, Edit3, ShieldAlert, AlertCircle, UserPlus, Trash2, 
    Copy, Scissors, Clipboard, ArrowRight, ArrowLeft, 
    ArrowUp, ArrowDown, Link, Unlink, Percent, 
    CheckSquare, Flag, ZoomIn, FileText, Layers, RefreshCw
} from 'lucide-react';
import { Task } from '../../../types';
import { useTheme } from '../../../context/ThemeContext';

export type ScheduleAction = 
    | 'add' | 'edit' | 'delete' 
    | 'cut' | 'copy' | 'paste' | 'duplicate'
    | 'indent' | 'outdent' | 'moveUp' | 'moveDown'
    | 'link' | 'unlink' | 'convertMilestone'
    | 'progress0' | 'progress50' | 'progress100'
    | 'assignResource' | 'levelResource'
    | 'addRisk' | 'addIssue' | 'addChange'
    | 'zoom' | 'details';

interface ScheduleContextMenuProps {
    contextMenu: { x: number; y: number; task: Task | null };
    onClose: () => void;
    onAction: (action: ScheduleAction, task: Task | null) => void;
    hasClipboard: boolean;
}

export const ScheduleContextMenu: React.FC<ScheduleContextMenuProps> = ({
    contextMenu, onClose, onAction, hasClipboard
}) => {
    const theme = useTheme();
    const { x, y, task } = contextMenu;

    // Adjust position to stay in viewport
    const style = {
        top: Math.min(y, window.innerHeight - 400),
        left: Math.min(x, window.innerWidth - 250),
        maxHeight: '80vh'
    };

    const MenuItem = ({ 
        label, icon: Icon, action, shortcut, disabled = false, danger = false 
    }: { 
        label: string; icon: any; action: ScheduleAction; shortcut?: string; disabled?: boolean; danger?: boolean 
    }) => (
        <button 
            onClick={(e) => { e.stopPropagation(); onAction(action, task); onClose(); }}
            disabled={disabled}
            className={`w-full text-left px-4 py-1.5 text-xs flex items-center gap-3 transition-colors group
                ${disabled ? 'opacity-50 cursor-not-allowed' : danger ? 'hover:bg-red-50 hover:text-red-600 text-slate-700' : 'hover:bg-nexus-50 hover:text-nexus-700 text-slate-700'}
            `}
        >
            <Icon size={14} className={danger ? 'text-red-500' : 'text-slate-400 group-hover:text-nexus-600'} />
            <span className="flex-1">{label}</span>
            {shortcut && <span className="text-[10px] text-slate-400 font-mono">{shortcut}</span>}
        </button>
    );

    const MenuHeader = ({ label }: { label: string }) => (
        <div className="px-4 py-1.5 mt-1 bg-slate-50 border-y border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest first:mt-0 first:border-t-0">
            {label}
        </div>
    );

    return (
        <div 
            className="fixed z-[100] bg-white border border-slate-200 rounded-lg shadow-2xl w-64 overflow-y-auto animate-in zoom-in-95 duration-100 py-1"
            style={style}
            onClick={(e) => e.stopPropagation()}
        >
            {/* --- GENERAL SECTION --- */}
            {!task && (
                <>
                    <MenuItem label="Add New Activity" icon={Plus} action="add" shortcut="INS" />
                    {hasClipboard && <MenuItem label="Paste Activity" icon={Clipboard} action="paste" shortcut="Ctrl+V" />}
                </>
            )}

            {task && (
                <>
                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                        <p className="text-[10px] font-black text-nexus-600 uppercase tracking-widest">
                            {task.wbsCode}
                        </p>
                        <p className="text-xs font-bold text-slate-800 truncate" title={task.name}>
                            {task.name}
                        </p>
                    </div>

                    <MenuItem label="Edit Details" icon={Edit3} action="edit" />
                    <MenuItem label="Zoom to Task" icon={ZoomIn} action="zoom" />
                    
                    {/* --- CLIPBOARD --- */}
                    <MenuHeader label="Clipboard" />
                    <MenuItem label="Cut" icon={Scissors} action="cut" shortcut="Ctrl+X" />
                    <MenuItem label="Copy" icon={Copy} action="copy" shortcut="Ctrl+C" />
                    <MenuItem label="Paste Below" icon={Clipboard} action="paste" shortcut="Ctrl+V" disabled={!hasClipboard} />
                    <MenuItem label="Duplicate" icon={Layers} action="duplicate" shortcut="Ctrl+D" />

                    {/* --- STRUCTURE --- */}
                    <MenuHeader label="WBS Structure" />
                    <MenuItem label="Indent" icon={ArrowRight} action="indent" shortcut="Tab" />
                    <MenuItem label="Outdent" icon={ArrowLeft} action="outdent" shortcut="Shift+Tab" />
                    <MenuItem label="Move Up" icon={ArrowUp} action="moveUp" shortcut="Alt+↑" />
                    <MenuItem label="Move Down" icon={ArrowDown} action="moveDown" shortcut="Alt+↓" />

                    {/* --- SCHEDULING --- */}
                    <MenuHeader label="Logic & Progress" />
                    <MenuItem label="Link Predecessor" icon={Link} action="link" />
                    <MenuItem label="Unlink All" icon={Unlink} action="unlink" />
                    <MenuItem label="Convert to Milestone" icon={Flag} action="convertMilestone" />
                    <div className="flex border-t border-slate-100 mt-1 pt-1 px-2 gap-1">
                        <button title="0%" onClick={() => { onAction('progress0', task); onClose(); }} className="flex-1 py-1 text-[10px] border rounded hover:bg-slate-50 text-slate-600">0%</button>
                        <button title="50%" onClick={() => { onAction('progress50', task); onClose(); }} className="flex-1 py-1 text-[10px] border rounded hover:bg-slate-50 text-slate-600">50%</button>
                        <button title="100%" onClick={() => { onAction('progress100', task); onClose(); }} className="flex-1 py-1 text-[10px] border rounded hover:bg-green-50 text-green-600 font-bold">100%</button>
                    </div>

                    {/* --- RESOURCES --- */}
                    <MenuHeader label="Resources" />
                    <MenuItem label="Assign Resource" icon={UserPlus} action="assignResource" />
                    <MenuItem label="Level Resource" icon={RefreshCw} action="levelResource" />

                    {/* --- INTEGRATION --- */}
                    <MenuHeader label="Controls" />
                    <MenuItem label="Add Risk" icon={ShieldAlert} action="addRisk" />
                    <MenuItem label="Log Issue" icon={AlertCircle} action="addIssue" />
                    <MenuItem label="Create Change Order" icon={FileText} action="addChange" />

                    <div className="h-px bg-slate-100 my-1"></div>
                    <MenuItem label="Delete Activity" icon={Trash2} action="delete" shortcut="Del" danger />
                </>
            )}
        </div>
    );
};
