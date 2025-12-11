
import React, { useMemo, useCallback } from 'react';
import { Project, Task, WBSNode } from '../types';
import TaskDetailModal from './TaskDetailModal';
import TraceLogic from './scheduling/TraceLogic';
import GanttToolbar from './scheduling/GanttToolbar';
import ResourceUsageView from './scheduling/ResourceUsageView';
import GanttTaskBar from './scheduling/GanttTaskBar';
import DependencyLines from './scheduling/DependencyLines';
import { getWorkingDaysDiff } from '../utils/dateUtils';
import { Diamond, ChevronRight, ChevronDown } from 'lucide-react';
import { useGantt, DAY_WIDTH } from '../hooks/useGantt';

interface ProjectGanttProps {
  project: Project;
}

const ROW_HEIGHT = 44;

const GanttGridLines = React.memo(({ days, height }: { days: any[], height: number }) => (
  <div className="absolute top-0 left-0 pointer-events-none" style={{ width: `${days.length * DAY_WIDTH}px`, height: `${height}px` }}>
    {days.map((_, i) => (
      <div 
        key={`grid-${i}`} 
        className={`absolute top-0 bottom-0 border-l ${days[i].isWorking ? 'border-slate-100' : 'bg-slate-100/70 border-slate-200'}`} 
        style={{ left: `${i * DAY_WIDTH}px` }} 
      />
    ))}
  </div>
));

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
      getStatusColor,
      handleMouseDown,
      taskFilter,
      setTaskFilter
  } = useGantt(initialProject);

  const flatRenderList = useMemo(() => {
    const list: ({ type: 'wbs', node: WBSNode, level: number } | { type: 'task', task: Task, level: number })[] = [];
    const traverse = (nodes: WBSNode[], level: number) => {
        nodes.forEach(node => {
            list.push({ type: 'wbs', node, level });
            if (expandedNodes.has(node.id)) {
                project.tasks
                  .filter(t => t.wbsCode === node.wbsCode)
                  .forEach(task => {
                    list.push({ type: 'task', task, level: level + 1 });
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

  // Stable handlers to prevent inline arrow functions in render
  const handleTraceLogicOpen = useCallback(() => setIsTraceLogicOpen(true), [setIsTraceLogicOpen]);
  const handleTraceLogicClose = useCallback(() => setIsTraceLogicOpen(false), [setIsTraceLogicOpen]);
  const handleTaskDetailClose = useCallback(() => setSelectedTask(null), [setSelectedTask]);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden relative">
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

      <div className="flex flex-1 overflow-hidden">
        {/* Task List (Left Panel) */}
        <div className="w-[450px] flex-shrink-0 border-r border-slate-200 flex flex-col bg-white overflow-y-auto z-10" role="treegrid">
          <div className="sticky top-0 z-20 bg-slate-100 border-b border-slate-200 h-[50px] flex items-center px-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">
            <div className="flex-1">Task Name</div>
            <div className="w-20 text-center">Duration</div>
          </div>
          {flatRenderList.map((item, idx) => {
            if (item.type === 'wbs') {
                return (
                    <button 
                        key={item.node.id}
                        className="group h-[44px] w-full flex items-center px-4 border-b border-slate-200 hover:bg-slate-50 text-sm text-left font-bold bg-slate-50/70 focus:outline-none focus:bg-slate-100"
                        style={{ paddingLeft: `${item.level * 20 + 16}px` }}
                        onClick={() => toggleNode(item.node.id)}
                        aria-expanded={expandedNodes.has(item.node.id)}
                    >
                        <div className="flex-1 text-slate-800 truncate pr-2 flex items-center gap-2">
                            <span className="p-1 -ml-6 mr-1" aria-hidden="true">
                                {expandedNodes.has(item.node.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </span>
                            <span className="font-mono text-xs text-slate-500 w-16">{item.node.wbsCode}</span>
                            {item.node.name}
                        </div>
                    </button>
                );
            } else {
                const task = item.task;
                return (
                    <button 
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className={`group h-[44px] w-full flex items-center px-4 border-b border-slate-100 hover:bg-slate-50 text-sm text-left focus:outline-none focus:ring-inset focus:ring-2 focus:ring-nexus-500 ${selectedTask?.id === task.id ? 'bg-blue-50' : ''}`}
                      style={{ paddingLeft: `${item.level * 20 + 24}px` }}
                    >
                      <div className="flex-1 font-medium text-slate-700 truncate pr-2 flex items-center gap-2 group-hover:text-nexus-600 transition-colors">
                         {task.type === 'Milestone' ? <Diamond size={10} className="text-nexus-600 fill-current" /> : (showCriticalPath && task.critical) && <span className="w-1.5 h-1.5 rounded-full bg-red-500" title="Critical Path"></span>}
                        <span className="font-mono text-xs text-slate-500 w-16">{task.wbsCode}</span>
                        {task.name}
                      </div>
                      <div className="w-20 text-center text-slate-500">{task.duration > 0 ? `${task.duration}d` : '-'}</div>
                    </button>
                );
            }
          })}
        </div>

        {/* Timeline (Right Panel) */}
        <div className="flex-1 overflow-auto relative bg-white" id="gantt-timeline" ref={ganttContainerRef}>
           <div className="sticky top-0 left-0 z-10 bg-slate-100 border-b border-slate-200 h-[50px] whitespace-nowrap" style={{ width: `${timelineHeaders.days.length * DAY_WIDTH}px` }}>
             {Array.from(timelineHeaders.months.entries()).map(([monthYear, {start, width}]) => (
                <div key={monthYear} className="absolute top-0 text-center font-bold text-slate-700 border-r border-b border-slate-200 text-xs py-1" style={{left: `${start}px`, width: `${width}px`}}>{monthYear}</div>
             ))}
             {timelineHeaders.days.map(({date, isWorking}, i) => (
               <div key={i} className={`absolute top-6 bottom-0 border-l ${isWorking ? 'border-slate-200' : 'bg-slate-200/50 border-slate-300'} px-2 pt-0.5 text-[10px] text-center font-semibold text-slate-500`} style={{ left: `${i * DAY_WIDTH}px`, width: `${DAY_WIDTH}px`}}>
                 {date.getDate()}
               </div>
             ))}
           </div>
          
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

           <div className="relative pt-0" style={{ width: `${timelineHeaders.days.length * DAY_WIDTH}px`, height: `${flatRenderList.length * ROW_HEIGHT}px` }}>
              <GanttGridLines days={timelineHeaders.days} height={flatRenderList.length * ROW_HEIGHT} />

              {flatRenderList.map((item, idx) => {
                  if (item.type !== 'task' || !project.calendar) return <div key={idx} className="h-[44px] pointer-events-none"></div>;
                  const task = item.task;
                  const offsetDays = getWorkingDaysDiff(projectStart, new Date(task.startDate), project.calendar);
                  const width = task.type === 'Milestone' ? DAY_WIDTH : Math.max(task.duration * DAY_WIDTH, 2);
                  
                  return (
                    <GanttTaskBar
                      key={task.id}
                      task={task}
                      rowIndex={idx}
                      offsetDays={offsetDays}
                      width={width}
                      dayWidth={DAY_WIDTH}
                      rowHeight={ROW_HEIGHT}
                      showCriticalPath={showCriticalPath}
                      getStatusColor={getStatusColor}
                      onMouseDown={handleMouseDown}
                      onSelect={setSelectedTask}
                      isSelected={selectedTask?.id === task.id}
                    />
                  );
              })}
           </div>
        </div>
      </div>
      
      {showResources && project.calendar && <ResourceUsageView project={project} dayWidth={DAY_WIDTH} projectStartDate={projectStart} />}
      
      {selectedTask && !isTraceLogicOpen && <TaskDetailModal task={selectedTask} project={project} onClose={handleTaskDetailClose} />}
      {isTraceLogicOpen && selectedTask && <TraceLogic startTask={selectedTask} project={project} onClose={handleTraceLogicClose} />}
    </div>
  );
};

export default React.memo(ProjectGantt);
