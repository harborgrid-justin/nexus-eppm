import { Project, WBSNode, Task, TaskStatus, Risk, BudgetLogItem, ChangeOrder } from '../types';
import { findAndModifyNode, findAndReparentNode, findAndRemoveNode } from './treeUtils';

// --- WBS Logic ---

export const addWbsNodeToProject = (project: Project, parentId: string | null, newNode: WBSNode): Project => {
  if (!project.wbs) return project;
  
  let newWbs = [...project.wbs];
  if (parentId) {
    newWbs = findAndModifyNode(newWbs, parentId, node => ({
      ...node,
      children: [...node.children, newNode]
    }));
  } else {
    newWbs.push(newNode);
  }

  // Auto-create summary task
  const newSummaryTask: Task = {
    id: `T-${newNode.id}`,
    wbsCode: newNode.wbsCode,
    name: newNode.name,
    startDate: project.startDate,
    endDate: project.endDate,
    duration: 0,
    status: TaskStatus.NOT_STARTED,
    progress: 0,
    dependencies: [],
    critical: false,
    type: 'Summary',
    effortType: 'Fixed Duration',
    resourceRequirements: [],
    assignments: []
  };

  return { 
    ...project, 
    wbs: newWbs, 
    tasks: [...project.tasks, newSummaryTask] 
  };
};

export const reparentWbsNodeInProject = (project: Project, nodeId: string, newParentId: string | null): { project: Project, error?: string } => {
  if (!project.wbs) return { project };
  
  const result = findAndReparentNode(project.wbs, nodeId, newParentId);
  
  if (result.error) {
    return { project, error: result.error };
  }
  
  return { 
    project: { ...project, wbs: result.newNodes } 
  };
};

// --- Change Order Logic ---

export const approveChangeOrderInState = (
  projects: Project[], 
  changeOrders: ChangeOrder[], 
  projectId: string, 
  changeOrderId: string
): { updatedProjects: Project[], updatedChangeOrders: ChangeOrder[] } => {
  
  const co = changeOrders.find(c => c.id === changeOrderId);
  if (!co) return { updatedProjects: projects, updatedChangeOrders: changeOrders };

  const updatedChangeOrders = changeOrders.map(c => 
    c.id === changeOrderId ? { ...c, status: 'Approved' as const } : c
  );

  const newLogItem: BudgetLogItem = {
    id: `BLI-${Date.now()}`,
    projectId,
    date: new Date().toISOString().split('T')[0],
    description: `Approved Change Order: ${co.title}`,
    amount: co.amount,
    status: 'Approved',
    submittedBy: 'System',
    source: 'Change Order',
  };

  const updatedProjects = projects.map(p => {
    if (p.id !== projectId) return p;
    return {
      ...p,
      budget: p.budget + co.amount,
      budgetLog: [...(p.budgetLog || []), newLogItem]
    };
  });

  return { updatedProjects, updatedChangeOrders };
};

// --- Risk Logic ---

export const calculateRiskScore = (risk: Risk): number => {
  return risk.probabilityValue * risk.impactValue;
};
