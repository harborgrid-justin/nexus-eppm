
import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { Project, Task, WBSNode } from '../types';
import GanttToolbar from './scheduling/GanttToolbar';
import ResourceUsageProfile from './scheduling/ResourceUsageProfile';
import { List, X } from 'lucide-react';
import { useGantt, DAY_WIDTH } from '../hooks/useGantt';
import { GanttTaskList } from './scheduling/gantt/GanttTaskList';
import { GanttTimeline } from './scheduling/gantt/GanttTimeline';

interface ProjectGanttProps {
  project: Project;
}
const ROW_HEIGHT = 44;

const ProjectGantt: React.FC<ProjectGanttProps> = ({ project: initialProject }) => {
  const {
      project, viewMode, setViewMode, selectedTask, setSelectedTask, isTraceLogicOpen,
      setIsTraceLogicOpen, showCriticalPath, setShowCriticalPath, activeBaselineId,
      setActiveBaselineId, showResources, setShowResources, ganttContainerRef,
      expandedNodes, toggleNode, timelineHeaders, projectStart, projectEnd,
      getStatusColor, handleMouseDown, taskFilter, setTaskFilter
  } = useGantt(initialProject);

  const [showTaskList, setShowTaskList] = useState(true);

  const flatRenderList = useMemo(() => {
    const list: any[] = [];
    const traverse = (nodes: WBSNode[], level: number) => {
        nodes.forEach(node => {
            list.push({ type: 'wbs', node, level });
            if (expandedNodes.has(node.id)) {
                project.tasks.filter(t => t.wbsCode.startsWith(node.wbsCode) || t.wbsCode === node.wbsCode)
                  .forEach(task => { if(!list.some(i => i.type === 'task' && i.task.id === task.id)) list.push({ type: 'task', task, level: level + 1 }); });
                traverse(node.children, level + 1);
            }
        });
    };
    traverse(project.wbs || [], 0);
    return list;
  }, [project.wbs, project.tasks, expandedNodes]);

  const taskRowMap = useMemo(() => {
      const map = new Map<string, number>();
      flatRenderList.forEach((item, index) => { if (item.type === 'task') map.set(item.task.id, index); });
      return map;
  }, [flatRenderList]);

  const baselineMap = useMemo(() => {
      if (!activeBaselineId || !project.baselines) return null;
      return project.baselines.find(b => b.id === activeBaselineId)?.taskBaselines || null;
  }, [activeBaselineId, project.baselines]);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden relative border border-slate-200 shadow-sm flex-1">
      <GanttToolbar 
        project={project} viewMode={viewMode} setViewMode={setViewMode} showCriticalPath={showCriticalPath}
        setShowCriticalPath={setShowCriticalPath} activeBaselineId={activeBaselineId} setActiveBaselineId={setActiveBaselineId}
        showResources={showResources} setShowResources={setShowResources} onTraceLogic={() => setIsTraceLogicOpen(true)}
        isTaskSelected={!!selectedTask} taskFilter={taskFilter} setTaskFilter={setTaskFilter}
      />
      <button className="md:hidden absolute bottom-20 left-4 z-30 p-3 bg-nexus-600 text-white rounded-full shadow-lg" onClick={() => setShowTaskList(!showTaskList)}>
        {showTaskList ? <X size={20} /> : <List size={20} />}
      </button>

      <div className="flex flex-1 overflow-hidden relative flex-col">
        <div className="flex flex-1 overflow-hidden relative">
            <GanttTaskList 
                renderList={flatRenderList} showTaskList={showTaskList} expandedNodes={expandedNodes}
                selectedTask={selectedTask} toggleNode={toggleNode} setSelectedTask={setSelectedTask}
            />
            <GanttTimeline 
                timelineHeaders={timelineHeaders} renderList={flatRenderList} taskRowMap={taskRowMap}
                projectStart={projectStart} projectEnd={projectEnd} dayWidth={DAY_WIDTH} rowHeight={ROW_HEIGHT}
                showCriticalPath={showCriticalPath} baselineMap={baselineMap} selectedTask={selectedTask}
                projectTasks={project.tasks} calendar={project.calendar} ganttContainerRef={ganttContainerRef}
                getStatusColor={getStatusColor} handleMouseDown={handleMouseDown} setSelectedTask={setSelectedTask}
            />
        </div>
        {showResources && <ResourceUsageProfile project={project} startDate={projectStart} endDate={projectEnd} />}
      </div>
    </div>
  );
};
export default ProjectGantt;
