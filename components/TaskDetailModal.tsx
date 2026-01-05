



import React, { useMemo, useState } from 'react';
// FIX: Corrected import path to use the barrel file to resolve module ambiguity.
import { Task, Project } from '../types/index';
import { ShieldAlert, FileText, Calendar, Database, ListChecks } from 'lucide-react';
import { Button } from './ui/Button';
import { useTaskForm } from '../hooks/useTaskForm';
import { useData } from '../context/DataContext';
import { checkOpenRFIsForTask } from '../utils/integrationUtils';
import { usePermissions } from '../hooks/usePermissions';
import { SidePanel } from './ui/SidePanel';
import { TaskGeneralTab } from './tasks/detail/TaskGeneralTab';
import { TaskScheduleTab } from './tasks/detail/TaskScheduleTab';
import { TaskAdvancedTab } from './tasks/detail/TaskAdvancedTab';
import { TaskStepsTab } from './tasks/detail/TaskStepsTab';
import { checkMaterialAvailability } from '../utils/integrations/resource';

interface TaskDetailModalProps {
  task: Task;
  project: Project;
  onClose: () => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, project, onClose }) => {
  const { state } = useData();
  const { canEditProject } = usePermissions();
  const isReadOnly = !canEditProject();
  const [activeTab, setActiveTab] = useState<'general' | 'schedule' | 'steps' | 'advanced'>('general');

  const {
    localTask, updateField, handleStatusChange, saveChanges, applicableCodes, linkedIssues, linkedExpenses, linkedRisks, canComplete, blockingNCRs
  } = useTaskForm(task, project, onClose);

  const taskUdfs = useMemo(() => state.userDefinedFields.filter(udf => udf.subjectArea === 'Tasks'), [state.userDefinedFields]);
  const materialCheck = checkMaterialAvailability(localTask, state.purchaseOrders);
  const rfiCheck = checkOpenRFIsForTask(localTask.id, state.communicationLogs);

  return (
    <SidePanel isOpen={true} onClose={onClose} width="md:w-[800px]"
       title={
         <div className="flex flex-col">
            <span className="text-xs font-mono text-slate-500">{localTask.wbsCode}</span>
            <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-slate-900">{localTask.name}</span>
                {!canComplete && <span className="text-xs font-bold text-red-600 flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded border border-red-200"><ShieldAlert size={12}/> QC Block</span>}
            </div>
         </div>
       }
       footer={<><Button variant="secondary" onClick={onClose}>{isReadOnly ? 'Close' : 'Cancel'}</Button>{!isReadOnly && <Button variant="primary" onClick={saveChanges}>Save Changes</Button>}</>}
    >
       <div className="space-y-6">
          <div className="flex border-b border-slate-200" role="tablist">
              {[ 
                  { id: 'general', label: 'General', icon: FileText }, 
                  { id: 'schedule', label: 'Schedule', icon: Calendar }, 
                  { id: 'steps', label: 'Steps', icon: ListChecks },
                  { id: 'advanced', label: 'Advanced', icon: Database } 
              ].map((tab) => (
                  <button 
                    key={tab.id} 
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id as any)} 
                    className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-nexus-500 rounded-t ${activeTab === tab.id ? 'border-nexus-600 text-nexus-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                  >
                      <tab.icon size={14}/> {tab.label}
                  </button>
              ))}
          </div>

          <div className="pt-2" role="tabpanel">
             {activeTab === 'general' && (
                 <TaskGeneralTab 
                    task={localTask} isReadOnly={isReadOnly} canComplete={canComplete} rfiCheck={rfiCheck} 
                    materialCheck={materialCheck} blockingNCRs={blockingNCRs} onUpdate={updateField} onStatusChange={handleStatusChange} 
                 />
             )}
             {activeTab === 'schedule' && (
                 <TaskScheduleTab task={localTask} project={project} isReadOnly={isReadOnly} onUpdate={updateField} />
             )}
             {activeTab === 'steps' && (
                 <TaskStepsTab task={localTask} isReadOnly={isReadOnly} onUpdate={updateField} />
             )}
             {activeTab === 'advanced' && (
                 <TaskAdvancedTab 
                    task={localTask} isReadOnly={isReadOnly} udfs={taskUdfs} codes={applicableCodes}
                    linkedIssues={linkedIssues} linkedRisks={linkedRisks} linkedExpenses={linkedExpenses} onUpdate={updateField}
                 />
             )}
          </div>
       </div>
    </SidePanel>
  );
};

export default TaskDetailModal;