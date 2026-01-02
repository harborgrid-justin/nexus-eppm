
import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { Project, Task, WBSNode } from '../types/index';
import GanttToolbar from './scheduling/GanttToolbar';
import ResourceUsageProfile from './scheduling/ResourceUsageProfile';
import { List, X } from 'lucide-react';
import { useGantt, DAY_WIDTH } from '../hooks/useGantt';
import { GanttTaskList } from './scheduling/gantt/GanttTaskList';
import { GanttTimeline } from './scheduling/gantt/GanttTimeline';
import { useTheme } from '../context/ThemeContext';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
import { useVirtualScroll } from '../hooks/useVirtualScroll';

const ROW_HEIGHT = 44;

const ProjectGantt: React.FC = () => {
  const { project: initialProject } = useProjectWorkspace();
  const theme = useTheme();
  
  const {
      project, viewMode, setViewMode, selectedTask, setSelectedTask, isTraceLogicOpen,
      setIsTraceLogicOpen, showCriticalPath, setShowCriticalPath, activeBaselineId,
      setActiveBaselineId, showResources, setShowResources, ganttContainerRef,
      expandedNodes, toggleNode, timelineHeaders, projectStart, projectEnd,
      getStatusColor, handleMouseDown, taskFilter, setTaskFilter
  } = useGantt(initialProject);

  const [showTaskList, setShowTaskList] = useState(true);

  // Flatten WBS and Tasks for virtualization
  const flatRenderList = useMemo(() => {
    const list: ({ type: 'wbs', node: WBSNode, level: number } | { type: 'task', task: Task, level: number })[] = [];
    const traverse = (nodes: WBSNode[], level: number) => {
        nodes.forEach(node => {
            list.push({ type: 'wbs', node, level });
            if (expandedNodes.has(node.id)) {
                project.tasks.filter(t => t.wbsCode.startsWith(node.wbsCode) || t.wbsCode === node.wbsCode)
                  .forEach(task => list.push({ type: 'task', task, level: level + 1 }));
                traverse(node.children, level + 1);
            }
        });
    };
    if (project.wbs) {
        traverse(project.wbs, 0);
    }
    return list;
  }, [project.wbs, project.tasks, expandedNodes]);

  const taskRowMap = useMemo(() => {
      const map = new Map<string, number>();
      flatRenderList.forEach((item, index) => { if (item.type === 'task') map.set(item.task.id, index); });
      return map;
  }, [flatRenderList]);

  // Baseline Comparison Map
  const baselineMap = useMemo(() => {
      if (!activeBaselineId || !project.baselines) return null;
      return project.baselines.find(b => b.id === activeBaselineId)?.taskBaselines || null;
  }, [activeBaselineId, project.baselines]);

  // --- Virtualization Logic ---
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(600); 
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Refs for sync scrolling
  const listRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      if (containerRef.current) {
          setContainerHeight(containerRef.current.clientHeight);
      }
      const handleResize = () => {
          if (containerRef.current) setContainerHeight(containerRef.current.clientHeight);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { virtualItems, totalHeight, onScroll } = useVirtualScroll(scrollTop, {
      totalItems: flatRenderList.length,
      itemHeight: ROW_HEIGHT,
      containerHeight
  });

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
      const top = e.currentTarget.scrollTop;
      
      // Update virtual state (which debounces internally)
      onScroll(top);
      setScrollTop(top);

      // Immediate visual sync
      if (e.target === listRef.current && timelineRef.current) {
          timelineRef.current.scrollTop = top;
      } else if (e.target === timelineRef.current && listRef.current) {
          listRef.current.scrollTop = top;
      }
  }, [onScroll]);

  return (
    <div className={`flex flex-col h-full ${theme.colors.surface} rounded-lg overflow-hidden relative border ${theme.colors.border} shadow-sm flex-1`}>
      <GanttToolbar 
        project={project} viewMode={viewMode} setViewMode={setViewMode} showCriticalPath={showCriticalPath}
        setShowCriticalPath={setShowCriticalPath} activeBaselineId={activeBaselineId} setActiveBaselineId={setActiveBaselineId}
        showResources={showResources} setShowResources={setShowResources} onTraceLogic={() => setIsTraceLogicOpen(true)}
        isTaskSelected={!!selectedTask}
        taskFilter={taskFilter}
        setTaskFilter={setTaskFilter}
      />
      
      <button className={`md:hidden absolute bottom-20 left-4 z-30 p-3 ${theme.colors.primary} text-white rounded-full shadow-lg`} onClick={() => setShowTaskList(!showTaskList)}>
        {showTaskList ? <X size={20} /> : <List size={20} />}
      </button>

      <div className="flex flex-1 overflow-hidden relative flex-col">
        <div ref={containerRef} className="flex flex-1 overflow-hidden relative">
            <GanttTaskList 
                ref={listRef}
                renderList={flatRenderList} 
                showTaskList={showTaskList} 
                expandedNodes={expandedNodes}
                selectedTask={selectedTask} 
                toggleNode={toggleNode} 
                setSelectedTask={setSelectedTask}
                virtualItems={virtualItems}
                totalHeight={totalHeight}
                rowHeight={ROW_HEIGHT}
                onScroll={handleScroll}
            />
            <GanttTimeline 
                ref={timelineRef}
                timelineHeaders={timelineHeaders} 
                renderList={flatRenderList} 
                taskRowMap={taskRowMap}
                projectStart={projectStart} 
                projectEnd={projectEnd} 
                dayWidth={DAY_WIDTH} 
                rowHeight={ROW_HEIGHT}
                showCriticalPath={showCriticalPath} 
                baselineMap={baselineMap} 
                selectedTask={selectedTask}
                projectTasks={project.tasks} 
                calendar={(project as any).calendar} 
                ganttContainerRef={ganttContainerRef}
                getStatusColor={getStatusColor} 
                handleMouseDown={handleMouseDown} 
                setSelectedTask={setSelectedTask}
                virtualItems={virtualItems}
                totalHeight={totalHeight}
                onScroll={handleScroll}
            />
        </div>
        {showResources && <ResourceUsageProfile project={project} startDate={projectStart} endDate={projectEnd} />}
      </div>
    </div>
  );
};
export default ProjectGantt;
