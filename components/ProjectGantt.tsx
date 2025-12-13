
import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { Project, Task, WBSNode } from '../types';
import GanttToolbar from './scheduling/GanttToolbar';
import GanttTaskBar from './scheduling/GanttTaskBar';
import DependencyLines from './scheduling/DependencyLines';
import ResourceUsageProfile from './scheduling/ResourceUsageProfile';
import { List, X } from 'lucide-react';
import { useGantt, DAY_WIDTH } from '../hooks/useGantt';
import { getDaysDiff } from '../utils/dateUtils';

interface ProjectGanttProps {
  project: Project;
}

const ROW_HEIGHT = 44;

const ProjectGantt: React.FC<ProjectGanttProps> = ({ project: initialProject }) => {
  const {
      project,
      viewMode,
      setViewMode,
      selectedTask,
      setSelectedTask,
      isTraceLogicOpen,
      setIsTraceLogicOpen,
      showCriticalPath,
      setShowCriticalPath,
      activeBaselineId,
      setActiveBaselineId,
      showResources,
      setShowResources,
      ganttContainerRef,
      expandedNodes,
      toggleNode,
      timelineHeaders,
      projectStart,
      projectEnd,
      getStatusColor,
      handleMouseDown,
      taskFilter,
      setTaskFilter
  } = useGantt(initialProject);

  const [showTaskList, setShowTaskList] = useState(true);
  const [scrollX, setScrollX] = useState(0);

  const flatRenderList = useMemo(() => {
    const list: ({ type: 'wbs', node: WBSNode, level: number } | { type: 'task', task: Task, level: number })[] = [];
    const traverse = (nodes: WBSNode[], level: number) => {
        nodes.forEach(node => {
            list.push({ type: 'wbs', node, level });
            if (expandedNodes.has(node.id)) {
                project.tasks
                  .filter(t => t.wbsCode.startsWith(node.wbsCode) || t.wbsCode === node.wbsCode)
                  .forEach(task => {
                    if(!list.some(i => i.type === 'task' && i.task.id === task.id)) {
                        list.push({ type: 'task', task, level: level + 1 });
                    }
                });
                traverse(node.children, level + 1);
            }
        });
    };
    traverse(project.wbs || [], 0);
    return list;
  }, [project.wbs, project.tasks, expandedNodes]);

  const taskRowMap = useMemo(() => {
      const map = new Map<string, number>();
      flatRenderList.forEach((item, index) => {
          if (item.type === 'task') {
              map.set(item.task.id, index);
          }
      });
      return map;
  }, [flatRenderList]);

  // Baseline Map Calculation
  const baselineMap = useMemo(() => {
      if (!activeBaselineId || !project.baselines) return null;
      const baseline = project.baselines.find(b => b.id === activeBaselineId);
      return baseline ? baseline.taskBaselines : null;
  }, [activeBaselineId, project.baselines]);

  useEffect(() => {
    const el = ganttContainerRef.current;
    if (!el) return;
    
    const handleScroll = () => setScrollX(el.scrollLeft);
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTraceLogicOpen = useCallback(() => setIsTraceLogicOpen(true), [setIsTraceLogicOpen]);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden relative border border-slate-200 shadow-sm flex-1">
      <GanttToolbar 
        project={project}
        viewMode={viewMode}
        setViewMode={setViewMode}
        showCriticalPath={showCriticalPath}
        setShowCriticalPath={setShowCriticalPath}
        activeBaselineId={activeBaselineId}
        setActiveBaselineId={setActiveBaselineId}
        showResources={showResources}
        setShowResources={setShowResources}
        onTraceLogic={handleTraceLogicOpen}
        isTaskSelected={!!selectedTask}
        taskFilter={taskFilter}
        setTaskFilter={setTaskFilter}
      />

      <button 
        className="md:hidden absolute bottom-20 left-4 z-30 p-3 bg-nexus-600 text-white rounded-full shadow-lg"
        onClick={() => setShowTaskList(!showTaskList)}
      >
        {showTaskList ? <X size={20} /> : <List size={20} />}
      </button>

      {/* Main Split View */}
      <div className="flex flex-1 overflow-hidden relative flex-col">
        <div className="flex flex-1 overflow-hidden relative">
            {/* Task List (Left Pane) */}
            <div 
                className={`
                    flex-shrink-0 border-r border-slate-200 flex flex-col bg-white overflow-y-auto z-20
                    absolute inset-y-0 left-0 w-3/4 shadow-xl transform transition-transform duration-300 md:relative md:w-[400px] md:shadow-none md:translate-x-0
                    ${showTaskList ? 'translate-x-0' : '-translate-x-full'}
                `} 
                role="treegrid"
            >
            <div className="sticky top-0 z-20 bg-slate-50 border-b border-slate-200 h-[50px] flex items-center px-4 font-bold text-xs text-slate-500 uppercase tracking-wider">
                <div className="flex-1">Task Name</div>
                <div className="w-16 text-center">Dur.</div>
            </div>
            {flatRenderList.map((item, idx) => {
                if (item.type === 'wbs') {
                    return (
                        <button 
                            key={item.node.id}
                            className="group h-[44px] w-full flex items-center px-4 border-b border-slate-100 hover:bg-slate-50 text-sm text-left font-bold bg-slate-50/50 focus:outline-none"
                            style={{ paddingLeft: `${item.level * 20 + 16}px` }}
                            onClick={() => toggleNode(item.node.id)}
                        >
                            <span className="mr-2 text-slate-400">{expandedNodes.has(item.node.id) ? '▼' : '▶'}</span>
                            <span className="truncate">{item.node.name}</span>
                        </button>
                    );
                } else {
                    return (
                        <div 
                            key={item.task.id}
                            onClick={() => setSelectedTask(item.task)}
                            className={`h-[44px] w-full flex items-center px-4 border-b border-slate-100 text-sm text-left cursor-pointer ${selectedTask?.id === item.task.id ? 'bg-nexus-50' : 'hover:bg-white'}`}
                            style={{ paddingLeft: `${item.level * 20 + 36}px` }}
                        >
                            <div className="flex-1 truncate">{item.task.name}</div>
                            <div className="w-16 text-center text-xs text-slate-500 font-mono">{item.task.duration}d</div>
                        </div>
                    );
                }
            })}
            </div>

            {/* Timeline (Right Pane) */}
            <div ref={ganttContainerRef} className="flex-1 overflow-auto bg-slate-50 relative">
            <div style={{ width: `${timelineHeaders.days.length * DAY_WIDTH}px`, height: `${flatRenderList.length * ROW_HEIGHT + 50}px` }}>
                
                {/* Header */}
                <div className="sticky top-0 z-10 bg-white border-b border-slate-200 h-[50px] flex">
                    {Array.from(timelineHeaders.months.entries()).map(([key, data]) => (
                        <div key={key} className="absolute top-0 border-r border-slate-200 text-xs font-bold text-slate-500 px-2 py-1 truncate bg-white" style={{ left: `${data.start}px`, width: `${data.width}px` }}>
                            {key}
                        </div>
                    ))}
                    <div className="flex pt-6">
                        {timelineHeaders.days.map((day, i) => (
                            <div key={i} className={`flex-shrink-0 flex items-center justify-center text-[10px] text-slate-400 border-r border-slate-100 ${day.isWorking ? 'bg-white' : 'bg-slate-50'}`} style={{ width: `${DAY_WIDTH}px` }}>
                                {day.date.getDate()}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Grid Body */}
                <div className="relative">
                    {/* Vertical Grid Lines */}
                    {timelineHeaders.days.map((day, i) => (
                        <div key={`grid-${i}`} className={`absolute top-0 bottom-0 border-r border-slate-100 ${day.isWorking ? '' : 'bg-slate-100/30'}`} style={{ left: `${(i + 1) * DAY_WIDTH}px`, height: '100%' }} />
                    ))}

                    {/* Tasks */}
                    {flatRenderList.map((item, index) => {
                        if (item.type !== 'task') return null;
                        const offsetDays = getDaysDiff(projectStart, new Date(item.task.startDate));
                        const duration = item.task.duration || 1;
                        const width = duration * DAY_WIDTH;
                        
                        const baselineData = baselineMap ? baselineMap[item.task.id] : null;

                        return (
                            <GanttTaskBar
                                key={item.task.id}
                                task={item.task}
                                rowIndex={index}
                                offsetDays={offsetDays}
                                width={width}
                                dayWidth={DAY_WIDTH}
                                rowHeight={ROW_HEIGHT}
                                showCriticalPath={showCriticalPath}
                                getStatusColor={getStatusColor}
                                onMouseDown={handleMouseDown}
                                onSelect={setSelectedTask}
                                isSelected={selectedTask?.id === item.task.id}
                                baselineStart={baselineData?.baselineStartDate}
                                baselineEnd={baselineData?.baselineEndDate}
                                projectStart={projectStart}
                            />
                        );
                    })}

                    <DependencyLines 
                        renderList={flatRenderList}
                        taskRowMap={taskRowMap}
                        projectTasks={project.tasks}
                        projectStart={projectStart}
                        calendar={project.calendar}
                        timelineWidth={timelineHeaders.days.length * DAY_WIDTH}
                        dayWidth={DAY_WIDTH}
                        rowHeight={ROW_HEIGHT}
                    />
                </div>
            </div>
            </div>
        </div>

        {/* Resource Usage Profile Panel */}
        {showResources && (
            <ResourceUsageProfile 
                project={project}
                startDate={projectStart}
                endDate={projectEnd}
            />
        )}
      </div>
    </div>
  );
};

export default ProjectGantt;
