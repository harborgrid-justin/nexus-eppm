import { Project, WBSNode, Task, TaskStatus, ChangeOrder, BudgetLogItem } from '../types';
import { findAndModifyNode, findAndReparentNode } from './treeUtils';

// --- WBS Logic ---

/**
 * Adds a new WBS node to a project's WBS tree.
 * Also creates an associated summary task.
 */
export const addWbsNodeToProject = (project: Project, parentId: string | null, newNode: WBSNode): Project => {
  if (!project.wbs) return { ...project, wbs: [newNode] };
  
  let newWbs = [...project.wbs];
  if (parentId) {
    newWbs = findAndModifyNode(newWbs, parentId, node => ({
      ...node,
      children: [...node.children, newNode]
    }));
  } else {
    newWbs.push(newNode);
  }

  // Auto-create summary task (if it doesn't already exist from a previous operation)
  const taskExists = project.tasks.some(t => t.id === `T-${newNode.id}`);
  if (taskExists) {
      return { ...project, wbs: newWbs };
  }

  const newSummaryTask: Task = {
    id: `T-${newNode.id}`,
    wbsCode: newNode.wbsCode,
    name: newNode.name,
    startDate: project.startDate, // Should be calculated based on children later
    endDate: project.endDate, // Should be calculated based on children later
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

/**
 * Moves a WBS node to a new parent within a project's WBS tree.
 */
export const reparentWbsNodeInProject = (project: Project, nodeId: string, newParentId: string | null): { project: Project, error?: string } => {
  if (!project.wbs) return { project, error: "Project has no WBS tree." };
  
  const { newNodes, error } = findAndReparentNode(project.wbs, nodeId, newParentId);
  
  if (error) {
    return { project, error };
  }
  
  // Note: WBS code recalculation would happen here in a real system.
  return { 
    project: { ...project, wbs: newNodes } 
  };
};

// --- Change Order Logic ---

/**
 * Approves a change order and updates the corresponding project budget and log.
 */
export const approveChangeOrderInState = (
  projects: Project[], 
  changeOrders: ChangeOrder[], 
  projectId: string, 
  changeOrderId: string
): { updatedProjects: Project[], updatedChangeOrders: ChangeOrder[] } => {
  
  const co = changeOrders.find(c => c.id === changeOrderId && c.projectId === projectId);
  if (!co || co.status !== 'Pending Approval') {
    // Return original state if CO not found or not in a state to be approved
    return { updatedProjects: projects, updatedChangeOrders: changeOrders };
  }

  // Update the status of the specific change order
  const updatedChangeOrders = changeOrders.map(c => 
    c.id === changeOrderId ? { ...c, status: 'Approved' as const } : c
  );

  // Create a corresponding budget log item for the audit trail
  const newLogItem: BudgetLogItem = {
    id: `BLI-${Date.now()}`,
    projectId,
    date: new Date().toISOString().split('T')[0],
    description: `Approved Change Order: ${co.title}`,
    amount: co.amount,
    status: 'Approved',
    submittedBy: 'System', // Or could be a user from context
    source: 'Change Order',
    linkedChangeOrderId: co.id,
  };

  // Update the budget and log for the specific project
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
