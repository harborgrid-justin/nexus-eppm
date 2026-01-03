
import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { FileText, Download, AlertTriangle, CheckCircle } from 'lucide-react';

interface ScheduleLogProps {
  isOpen: boolean;
  onClose: () => void;
  log: string;
  stats: {
    criticalTasksCount: number;
    criticalPathLength: number;
    openEnds: number;
  } | null;
}

const ScheduleLog: React.FC<ScheduleLogProps> = ({ isOpen, onClose, log, stats }) => {
  return (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Schedule Calculation Report (F9)"
        size="lg"
        footer={<Button onClick={onClose}>Close Report</Button>}
    >
        <div className="space-y-6">
            {stats && (
                <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg text-red-600 shadow-sm"><AlertTriangle size={20}/></div>
                        <div>
                            <p className="text-xs text-red-800 font-bold uppercase">Critical Activities</p>
                            <p className="text-2xl font-black text-red-900">{stats.criticalTasksCount}</p>
                        </div>
                    </div>
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm"><FileText size={20}/></div>
                        <div>
                            <p className="text-xs text-blue-800 font-bold uppercase">Open Ends</p>
                            <p className="text-2xl font-black text-blue-900">{stats.openEnds}</p>
                        </div>
                    </div>
                    <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg text-green-600 shadow-sm"><CheckCircle size={20}/></div>
                        <div>
                            <p className="text-xs text-green-800 font-bold uppercase">Project Duration</p>
                            <p className="text-2xl font-black text-green-900">{stats.criticalPathLength}d</p>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="bg-slate-900 rounded-xl border border-slate-700 shadow-inner overflow-hidden">
                <div className="flex justify-between items-center p-2 bg-slate-800 border-b border-slate-700">
                    <span className="text-xs font-mono text-slate-400 pl-2">sched_log.txt</span>
                    <button className="text-xs text-slate-300 hover:text-white flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-700 transition-colors">
                        <Download size={12}/> Save Log
                    </button>
                </div>
                <pre className="p-4 text-xs font-mono text-green-400 h-64 overflow-y-auto whitespace-pre-wrap">
                    {log || "No schedule log available. Run schedule to generate report."}
                </pre>
            </div>
        </div>
    </Modal>
  );
};

export default ScheduleLog;
