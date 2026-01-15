
import { DataState, Action, TaskStatus } from '../../types/index';
import { SystemAlert } from '../../types/business';
import { createAlert } from './common';

export const applyProjectRules = (state: DataState, action: Action, alerts: SystemAlert[]) => {
  const projects = [...state.projects];

  // Run on relevant actions
  if (action.type.startsWith('PROJECT_') || action.type.startsWith('TASK_') || action.type === 'WBS_UPDATE_NODE') {
      
      state.projects.forEach(p => {
          // Rule 1: Start Date > End Date
          if (new Date(p.startDate) > new Date(p.endDate)) {
              alerts.push(createAlert('Critical', 'Schedule', 'Negative Duration', 
                  `Project ${p.code} ends before it starts.`, { type: 'Project', id: p.id }));
          }

          // Rule 2: Orphaned Tasks (No Predecessors/Successors)
          // Exception: First and Last tasks
          const tasks = p.tasks || [];
          const orphans = tasks.filter(t => 
              t.type !== 'Summary' && 
              t.dependencies.length === 0 && 
              !tasks.some(other => other.dependencies.some(d => d.targetId === t.id))
          );
          if (orphans.length > 2) {
              alerts.push(createAlert('Warning', 'Schedule', 'Open Ended Logic', 
                  `${orphans.length} tasks in ${p.code} have no logic links (DCMA Violation).`, { type: 'Project', id: p.id }));
          }

          // Rule 3: High Float
          const highFloatTasks = tasks.filter(t => (t.totalFloat || 0) > 44); // > 2 months
          if (highFloatTasks.length > (tasks.length * 0.2)) {
              alerts.push(createAlert('Info', 'Schedule', 'Loose Network', 
                  `>20% of tasks in ${p.code} have high float. Schedule may be unstable.`, { type: 'Project', id: p.id }));
          }

          // Rule 4: Constraint Abuse
          const constrainedTasks = tasks.filter(t => !!t.primaryConstraint);
          if (constrainedTasks.length > (tasks.length * 0.1)) {
              alerts.push(createAlert('Warning', 'Schedule', 'Constraint Overload', 
                  `Too many hard constraints in ${p.code} reduce CPM flexibility.`, { type: 'Project', id: p.id }));
          }

          // Rule 5: Status Inconsistency
          const parentStarted = p.status === 'Active';
          if (!parentStarted && tasks.some(t => t.status === TaskStatus.IN_PROGRESS)) {
               alerts.push(createAlert('Blocker', 'Compliance', 'Ghost Work', 
                  `Tasks are active in ${p.code} but Project is not Active.`, { type: 'Project', id: p.id }));
          }

          // Rule 6: Missing WBS Assignment
          const unmappedTasks = tasks.filter(t => !t.wbsCode);
          if (unmappedTasks.length > 0) {
              alerts.push(createAlert('Critical', 'Schedule', 'WBS Gap', 
                  `${unmappedTasks.length} tasks in ${p.code} are not assigned to WBS.`, { type: 'Project', id: p.id }));
          }

          // Rule 7: Project Manager Missing
          if (!p.managerId || p.managerId === 'Unassigned') {
              alerts.push(createAlert('Critical', 'Governance', 'No PM Assigned', 
                  `Project ${p.code} has no accountability owner.`, { type: 'Project', id: p.id }));
          }

          // Rule 8: Long Duration Tasks
          const longTasks = tasks.filter(t => t.duration > 44 && t.type !== 'Summary');
          if (longTasks.length > 0) {
               alerts.push(createAlert('Info', 'Schedule', 'Detail Level Low', 
                  `Tasks with >44d duration detected in ${p.code}. Consider breaking down.`, { type: 'Project', id: p.id }));
          }
      });
  }

  return { projects };
};
