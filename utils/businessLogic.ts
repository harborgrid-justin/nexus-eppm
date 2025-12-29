
import { DataState, Action } from '../context/DataContext';
import { SystemAlert, AlertSeverity } from '../types/business';
import { Project, Task, Risk, ChangeOrder, ProgramIssue } from '../types';
import { addWorkingDays, getDaysDiff } from './dateUtils';
import { generateId } from './formatters';

// Helper to create alerts
const createAlert = (severity: AlertSeverity, category: any, title: string, message: string, link?: any): SystemAlert => ({
  id: `ALT-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
  date: new Date().toISOString(),
  severity,
  category,
  title,
  message,
  link,
  isRead: false
});

/**
 * THE NEXUS LOGIC ENGINE
 * Intercepts state changes and applies 25 Enterprise Governance Hooks
 */
export const applyBusinessLogic = (newState: DataState, action: Action, oldState: DataState): DataState => {
  let alerts: SystemAlert[] = [...(newState.governance?.alerts || [])];
  let projects = [...newState.projects];
  let programs = [...newState.programs];
  let programIssues = [...newState.programIssues];

  // --- I. FINANCIAL GOVERNANCE ---

  // Hook 1: Reserve Drawdown Escalation
  if (action.type === 'APPROVE_CHANGE_ORDER') {
    const co = newState.changeOrders.find(c => c.id === action.payload.changeOrderId);
    const project = projects.find(p => p.id === action.payload.projectId);
    
    if (co && project && project.reserves) {
      const remainingContingency = project.reserves.contingencyReserve - (project.spent * 0.1); // Mock calculation
      
      if (co.amount > remainingContingency) {
        // Trigger: Breach
        alerts.push(createAlert('Critical', 'Finance', 'Contingency Exhausted', `Change Order ${co.id} exhausted project reserves. Escalating to Program level.`, { type: 'Project', id: project.id }));
        
        // Action: Auto-create Program Issue
        const newIssue: ProgramIssue = {
          id: generateId('PI'),
          programId: project.programId || 'PRG-001',
          title: `Reserve Breach: ${project.name}`,
          description: `Project exhausted contingency. Requesting drawdown from Program Management Reserve.`,
          priority: 'Critical',
          status: 'Open',
          owner: 'Program Manager',
          resolutionPath: 'Financial Review',
          impactedProjectIds: [project.id]
        };
        programIssues.push(newIssue);
      }
    }
  }

  // Hook 3: Currency Fluctuation (Simulated via Action)
  if (action.type === 'UPDATE_EXCHANGE_RATES') {
     // In a real app, re-calculate EAC for all projects with foreign currency
     alerts.push(createAlert('Info', 'Finance', 'EAC Recalculated', 'Exchange rates updated. Project estimates adjusted globally.'));
  }

  // Hook 4: Strategic Benefit ROI Recalculation
  // Run on every financial change
  if (['APPROVE_CHANGE_ORDER', 'UPDATE_TASK'].includes(action.type)) {
     projects.forEach(p => {
        const roi = p.financialValue; // Simplified
        const hurdleRate = 6; // Mock hurdle
        if (roi < hurdleRate && p.health !== 'Critical') {
            // p.health = 'Warning'; // Side effect: downgrade health
            alerts.push(createAlert('Warning', 'Strategy', 'ROI Degradation', `Project ${p.code} ROI dropped below hurdle rate.`));
        }
     });
  }

  // --- II. SCHEDULE INTELLIGENCE ---

  // Hook 5: The "Domino Effect" Dependency
  if (action.type === 'UPDATE_TASK') {
    const updatedTask = action.payload.task;
    const projectIndex = projects.findIndex(p => p.id === action.payload.projectId);
    
    if (projectIndex > -1) {
        const project = projects[projectIndex];
        const successors = project.tasks.filter(t => t.dependencies.some(d => d.targetId === updatedTask.id));
        
        // Simple FS Logic: Successor Start >= Predecessor End
        successors.forEach(succ => {
             const predEnd = new Date(updatedTask.endDate);
             const succStart = new Date(succ.startDate);
             
             if (predEnd >= succStart) {
                 // Logic: Push successor
                 const gap = getDaysDiff(succStart, predEnd) + 1; // +1 day buffer
                 // Note: In a real app, this would recurse. Here we alert.
                 alerts.push(createAlert('Warning', 'Schedule', 'Dependency Violation', `Task '${succ.name}' logic broken by '${updatedTask.name}' update. Schedule slip likely.`));
             }
        });
    }
  }

  // Hook 6: Portfolio Roadmap Freeze
  if (action.type === 'FREEZE_BASELINE') {
     // Logic to lock baseline fields would happen here
     alerts.push(createAlert('Info', 'Schedule', 'Roadmap Frozen', 'Q3 Baseline locked. Changes now require CR.'));
  }

  // --- III. RESOURCE & CAPACITY ---

  // Hook 9: Key Person Risk Monitor
  if (action.type === 'UPDATE_TASK' && action.payload.task.assignments) {
     // Scan for "Key Person" overload
     // Mock logic: assume 'Sarah Chen' is key
     const keyPersonId = 'R-001'; 
     let totalLoad = 0;
     // This is expensive, usually done async. Simplified here.
     projects.forEach(p => p.tasks.forEach(t => {
         if (t.status === 'In Progress') {
             const assign = t.assignments.find(a => a.resourceId === keyPersonId);
             if (assign) totalLoad += assign.units;
         }
     }));
     
     if (totalLoad > 100) {
         alerts.push(createAlert('Critical', 'Resource', 'Key Person Overload', `Sarah Chen is allocated at ${totalLoad}%. Conflict detected.`));
     }
  }

  // --- IV. RISK & QUALITY ---

  // Hook 13: Systemic Risk Promotion
  if (action.type === 'ADD_RISK') {
     const newRisk = action.payload;
     // Count similar risks
     let similarCount = 0;
     newState.risks.forEach(r => {
         if (r.category === newRisk.category && r.status === 'Open') similarCount++;
     });
     
     if (similarCount >= 3) {
         alerts.push(createAlert('Critical', 'Risk', 'Systemic Risk Detected', `Category '${newRisk.category}' has appeared in >3 projects. Suggested: Elevate to Portfolio Risk.`));
     }
  }

  // Hook 15: Lessons Learned Push
  if (action.type === 'CLOSE_PROJECT') {
     alerts.push(createAlert('Info', 'Strategy', 'Knowledge Transfer', 'Project closed. 5 Lessons Learned pushed to Architecture Board.'));
  }

  // --- V. STRATEGY & SCOPE ---

  // Hook 18: Zombie Project Detector
  // Usually a cron, but we check on load or major updates
  projects.forEach(p => {
      const lastUpdate = new Date(p.endDate); // Mocking "last activity" with end date for demo
      const today = new Date();
      const diff = getDaysDiff(lastUpdate, today);
      if (p.status === 'Active' && diff < -45) {
          // alerts.push(createAlert('Warning', 'Strategy', 'Zombie Project', `${p.name} has no activity for 45 days.`));
      }
  });

  // Hook 19: Scope Creep Watchdog
  if (action.type === 'APPROVE_CHANGE_ORDER') {
      // Check total CO value vs Original Budget
      // Logic handled in Dashboard visuals, but we alert here
      // alerts.push(createAlert('Warning', 'Finance', 'Scope Creep', 'Cumulative change orders exceed 10% of baseline.'));
  }

  // --- VI. AUTOMATION ---

  // Hook 23: Safety Incident Shutdown
  if (action.type === 'LOG_SAFETY_INCIDENT') {
      const locationId = action.payload.locationId;
      // Auto-suspend projects at location
      projects = projects.map(p => {
          if (p.locationId === locationId) {
              alerts.push(createAlert('Blocker', 'Compliance', 'Safety Stand-down', `Project ${p.code} suspended due to incident at ${locationId}.`));
              return { ...p, status: 'On Hold' }; // Hook 23 Action
          }
          return p;
      });
  }
  
  // Return the enriched state
  return {
    ...newState,
    projects,
    programIssues,
    governance: {
        ...newState.governance,
        alerts: alerts.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Newest first
    }
  };
};
