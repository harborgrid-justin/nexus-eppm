import { useMemo } from 'react';
import { Project, Task, WBSNode } from '../../types/index';

export const useGanttData = (project: Project, expandedNodes: Set<string>) => {
  const flatRenderList = useMemo(() => {
    if (!project || !project.wbs || !project.tasks) return [];
    
    const list: ({ type: 'wbs', node: WBSNode, level: number } | { type: 'task', task: Task, level: number })[] = [];
    const taskMap = new Map<string, Task[]>();
    
    // Index tasks by parent code for O(1) lookup during traversal
    project.tasks.forEach(t => {
        const lastDot = t.wbsCode.lastIndexOf('.');
        const parentCode = lastDot === -1 ? t.wbsCode : t.wbsCode.substring(0, lastDot);
        const group = taskMap.get(parentCode) || [];
        group.push(t);
        taskMap.set(parentCode, group);
    });

    const traverse = (nodes: WBSNode[], level: number) => {
      nodes.forEach(node => {
        list.push({ type: 'wbs', node, level });
        if (expandedNodes.has(node.id)) {
          // Add child tasks
          const childTasks = taskMap.get(node.wbsCode) || [];
          childTasks.forEach(task => {
              list.push({ type: 'task', task, level: level + 1 });
          });
          // Add child WBS nodes
          if (node.children?.length) {
              traverse(node.children, level + 1);
          }
        }
      });
    };
    
    traverse(project.wbs, 0);
    return list;
  }, [project, expandedNodes]);

  const taskRowMap = useMemo(() => {
    const map = new Map<string, number>();
    flatRenderList.forEach((item, index) => { 
        if (item.type === 'task') map.set(item.task.id, index); 
    });
    return map;
  }, [flatRenderList]);

  return { flatRenderList, taskRowMap };
};