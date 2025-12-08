import React from 'react';
import { Task, Project } from '../types';
import { useData } from '../context/DataContext';
import { X, Calendar, User, FileText, AlertTriangle, Paperclip, CheckSquare } from 'lucide-react';

interface TaskDetailModalProps {
  task: Task;
  project: Project;
  onClose: () => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, project, onClose }) => {
  const { state } = useData();
  
  // Find full resource objects
  const assignedResources = state.resources.filter(r => task.assignedResources.includes(r.id));
  
  // Find linked risks (mock linkage logic for scaffold)
  const linkedRisks = state.risks.filter(r => r.projectId === project.id && (r.category === 'Schedule' || r.category === 'Technical'));

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-200 flex justify-between items-start bg-slate-50">
             <div>
                <div className="flex items-center gap-2 mb-1">
                   <span className="px-2 py-0.5 bg-nexus-100 text-nexus-700 text-xs font-mono font-bold rounded">
                      {task.wbsCode}
                   </span>
                   <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      task.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                   }`}>
                      {task.status}
                   </span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{task.name}</h2>
                <p className="text-sm text-slate-500 mt-1">Project: {project.name}</p>
             </div>
             <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-full border border-slate-200 shadow-sm hover:shadow">
                <X size={20} />
             </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
             <div className="grid grid-cols-3 gap-6">
                
                {/* Main Content */}
                <div className="col-span-2 space-y-6">
                   <section>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                         <FileText size={16} className="text-nexus-500"/> Description
                      </h3>
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm text-slate-700 leading-relaxed min-h-[100px]">
                         {task.description || "No description provided for this task. Ensure all requirements are documented before proceeding with execution phase."}
                      </div>
                   </section>

                   <section>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                         <CheckSquare size={16} className="text-nexus-500"/> Steps
                      </h3>
                      <div className="space-y-2">
                         {['Review specifications', 'Draft initial design', 'Internal review', 'Submit for approval'].map((step, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer group">
                               <div className="w-5 h-5 rounded border border-slate-300 flex items-center justify-center group-hover:border-nexus-500">
                                  {i < 2 && <div className="w-3 h-3 bg-nexus-500 rounded-sm"></div>}
                               </div>
                               <span className={`text-sm ${i < 2 ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{step}</span>
                            </div>
                         ))}
                      </div>
                   </section>

                   <section>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                         <Paperclip size={16} className="text-nexus-500"/> Documents
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                         <div className="p-3 border border-slate-200 rounded-lg flex items-center gap-3 hover:border-nexus-300 hover:shadow-sm cursor-pointer bg-white">
                            <div className="w-8 h-8 bg-red-100 text-red-600 rounded flex items-center justify-center text-xs font-bold">PDF</div>
                            <div className="overflow-hidden">
                               <div className="text-sm font-medium truncate">Technical_Specs_v2.pdf</div>
                               <div className="text-xs text-slate-500">2.4 MB • Updated yesterday</div>
                            </div>
                         </div>
                         <div className="p-3 border border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-400 text-sm hover:bg-slate-50 cursor-pointer">
                            + Upload File
                         </div>
                      </div>
                   </section>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                   <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                      <div className="flex items-center gap-3">
                         <Calendar className="text-slate-400" size={18} />
                         <div>
                            <div className="text-xs text-slate-500">Duration</div>
                            <div className="text-sm font-semibold">{task.startDate} — {task.endDate}</div>
                         </div>
                      </div>
                      <div className="h-px bg-slate-100"></div>
                      <div>
                         <div className="text-xs text-slate-500 mb-2">Assigned Resources</div>
                         <div className="space-y-2">
                            {assignedResources.length > 0 ? assignedResources.map(r => (
                               <div key={r.id} className="flex items-center gap-2 text-sm">
                                  <div className="w-6 h-6 rounded-full bg-nexus-100 text-nexus-700 flex items-center justify-center text-xs font-bold">
                                     {r.name.charAt(0)}
                                  </div>
                                  <span>{r.name}</span>
                               </div>
                            )) : <span className="text-sm text-slate-400 italic">Unassigned</span>}
                         </div>
                      </div>
                   </div>

                   {/* Risk Integration */}
                   <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                      <h4 className="text-red-800 text-sm font-bold flex items-center gap-2 mb-3">
                         <AlertTriangle size={16} /> Potential Risks
                      </h4>
                      {linkedRisks.length > 0 ? (
                         <div className="space-y-2">
                            {linkedRisks.map(risk => (
                               <div key={risk.id} className="bg-white p-2 rounded border border-red-100 text-xs text-red-900 shadow-sm">
                                  {risk.description}
                               </div>
                            ))}
                         </div>
                      ) : (
                         <p className="text-xs text-red-600/70">No direct risks linked to this task.</p>
                      )}
                   </div>
                </div>
             </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
             <button onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
             <button className="px-4 py-2 bg-nexus-600 rounded-lg text-sm font-medium text-white hover:bg-nexus-700 shadow-sm">Save Changes</button>
          </div>
       </div>
    </div>
  );
};

export default TaskDetailModal;
