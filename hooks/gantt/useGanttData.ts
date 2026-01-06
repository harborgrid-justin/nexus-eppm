import { useMemo } from 'react';
import { Project, Task, WBSNode } from '../../types/index';

export const useGanttData = (project: Project, expandedNodes: Set<string>) => {
  const flatRenderList = useMemo(() => {
    if (!project || !project.wbs) return [];
    
    const list: ({ type: 'wbs', node: WBSNode, level: number } | { type: 'task', task: Task, level: number })[] = [];
    
    const traverse = (nodes: WBSNode[], level: number) => {
      nodes.forEach(node => {
        list.push({ type: 'wbs', node, level });
        if (expandedNodes.has(node.id)) {
          // Pull child tasks for this specific WBS node
          const childTasks = (project.tasks || []).filter(t => {
            const lastDotIndex = t.wbsCode.lastIndexOf('.');
            const parentCode = lastDotIndex === -1 ? '' : t.wbsCode.substring(0, lastDotIndex);
            return parentCode === node.wbsCode || t.wbsCode === node.wbsCode; // Handle direct children
          });
          
          childTasks.forEach(task => {
              if (!list.find(item => item.type === 'task' && item.task.id === task.id)) {
                  list.push({ type: 'task', task, level: level + 1 });
              }
          });
          
          if (node.children && node.children.length > 0) {
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