
import { DataState, Action } from '../../types/index';
import { SystemAlert } from '../../types/business';
import { createAlert } from './common';
import { TaskStatus } from '../../types/project';

export const applyProgramRules = (state: DataState, action: Action, alerts: SystemAlert[]) => {
  let programs = [...state.programs];

  // Hook: Cross-Project Dependency Break
  // Handle task payload whether it's a single object or an array of objects
  if (action.type === 'TASK_UPDATE') {
      const taskArray = Array.isArray(action.payload.task) ? action.payload.task : [action.payload.task];
      taskArray.forEach(task => {
          if (task.status === TaskStatus.DELAYED) {
              // Mock check: In real app, check DB for external dependencies
              if (task.wbsCode === '1.2') { 
                  alerts.push(createAlert('Critical', 'Schedule', 'Program Interlock Broken', 
                    `Delay in ${task.name} impacts downstream Project P1002.`, { type: 'Program', id: 'PRG-001' }));
              }
          }
      });
  }

  // Hook: Program Budget Cap Breach
  programs.forEach(prog => {
      const childProjects = state.projects.filter(p => p.programId === prog.id);
      const totalAllocated = childProjects.reduce((sum, p) => sum + p.budget, 0);
      
      if (totalAllocated > prog.budget) {
           if(!alerts.some(a => a.title === 'Program Budget Breach' && a.link?.id === prog.id))
            alerts.push(createAlert('Blocker', 'Finance', 'Program Budget Breach', 
              `Child projects total $${totalAllocated} exceeds Program budget $${prog.budget}.`, { type: 'Program', id: prog.id }));
      }
  });

  // Hook: Portfolio Imbalance (Innovation < 20%)
  const innovationProjects = state.projects.filter(p => p.category === 'Innovation & Growth');
  if (state.projects.length > 0 && (innovationProjects.length / state.projects.length) < 0.2) {
       if(!alerts.some(a => a.title === 'Strategic Imbalance'))
        alerts.push(createAlert('Warning', 'Strategy', 'Strategic Imbalance', 'Innovation initiatives have dropped below 20% of portfolio composition.'));
  }

  // Hook: Whale Risk (>20% Concentration)
  const totalPortfolioValue = state.projects.reduce((s, p) => s + p.budget, 0);
  state.projects.forEach(p => {
      if (p.budget > totalPortfolioValue * 0.2) {
          if(!alerts.some(a => a.title === 'Whale Risk' && a.link?.id === p.id))
            alerts.push(createAlert('Warning', 'Portfolio', 'Whale Risk', 
              `Project ${p.code} represents >20% of total portfolio exposure.`, { type: 'Project', id: p.id }));
      }
  });

  return { programs };
};
