
import React from 'react';
import { Project, Task, WBSNode } from '../types';
import TaskDetailModal from './TaskDetailModal';
import TraceLogic from './scheduling/TraceLogic';
import GanttToolbar from './scheduling/GanttToolbar';
import ResourceUsageView from './scheduling/ResourceUsageView';
import { getWorkingDaysDiff } from '../utils/dateUtils';
import { Diamond, ChevronRight, ChevronDown } from 'lucide-react';
import { useGantt, DAY_WIDTH } from '../hooks/useGantt';

interface ProjectGanttProps {
  project: Project;
}

const ROW_HEIGHT = 44;

// Hierarchical Row Renderer
const WbsGanttRow: React.FC<{
  node: WBSNode;
  project: Project;
  level: number;
  expandedNodes: Set<string>;
  toggleNode: (id: string) => void;
  onSelectTask: (task: Task) => void;
  showCriticalPath: boolean;
}> = ({ node, project, level, expandedNodes, toggleNode, onSelectTask, showCriticalPath }) => {
  const isExpanded = expandedNodes.has(node.id);
  const tasksForNode = project.tasks.filter(t => t.wbsCode === node.wbsCode);

  return (
    <>
      {/* WBS Node Row */}
      <div 
        className="group h-[44px] flex items-center px-4 border-b border-slate-200 hover:bg-slate-50 text-sm cursor-pointer font-bold bg-slate-50/70"
        style={{ paddingLeft: `${level * 20 + 16}px` }}
        onClick={() => toggleNode(node.id)}
      >
        <div className="flex-1 text-slate-800 truncate pr-2 flex items-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); toggleNode(node.id); }} className="p-1 -ml-6 mr-1">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          <span className="font-mono text-xs text-slate-500 w-16">{node.wbsCode}</span>
          {node.name}
        </div>
      </div>
      
      {/* Child Rows (Tasks and Sub-WBS) */}
      {isExpanded && (
        <>
          {tasksForNode.map(task => (
            <div 
              key={task.id}
              onClick={() => onSelectTask(task)}
              className="group h-[44px] flex items-center px-4 border-b border-slate-100 hover:bg-slate-50 text-sm cursor-pointer"
              style={{ paddingLeft: `${(level + 1) * 20 + 16 + 24}px` }}
            >
              <div className="flex-1 font-medium text-slate-700 truncate pr-2 flex items-center gap-2 group-hover:text-nexus-600 transition-colors">
                 {task.type === 'Milestone' ? <Diamond size={10} className="text-nexus-600 fill-current" /> : (showCriticalPath && task.critical) && <span className="w-1.5 h-1.5 rounded-full bg-red-500" title="Critical Path"></span>}
                <span className="font-mono text-xs text-slate-500 w-16">{task.wbsCode}</span>
                {task.name}
              </div>
              <div className="w-20 text-center text-slate-500">{task.duration > 0 ? `${task.duration}d` : '-'}</div>
            </div>
          ))}

          {node.children.map(childNode => (
            <WbsGanttRow
              key={childNode.id}
              node={childNode}
              project={project}
              level={level + 1}
              expandedNodes={expandedNodes}
              toggleNode={toggleNode}
              onSelectTask={onSelectTask}
              showCriticalPath={showCriticalPath}
            />
          ))}
        </>
      )}
    </>
  );
};


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
      handleMouseDown
  } = useGantt(initialProject);

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
        onTraceLogic={() => setIsTraceLogicOpen(true)}
        isTaskSelected={!!selectedTask}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[450px] flex-shrink-0 border-r border-slate-200 flex flex-col bg-white overflow-y-auto z-10">
          <div className="sticky top-0 z-20 bg-slate-100 border-b border-slate-200 h-[50px] flex items-center px-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">
            <div className="flex-1">Task Name</div>
            <div className="w-20 text-center">Duration</div>
          </div>
          {project.wbs?.map(node => (
             <WbsGanttRow
                key={node.id}
                node={node}
                project={project}
                level={0}
                expandedNodes={expandedNodes}
                toggleNode={toggleNode}
                onSelectTask={setSelectedTask}
                showCriticalPath={showCriticalPath}
             />
          ))}
        </div>

        <div className="flex-1 overflow-auto relative bg-white" id="gantt-timeline" ref={ganttContainerRef}>
           <div className="sticky top-0 left-0 z-10 bg-slate-100 border-b border-slate-200 h-[50px] whitespace-nowrap" style={{ width: `${timelineHeaders.days.length * DAY_WIDTH}px` }}>
             {Array.from(timelineHeaders.months.entries()).map(([monthYear, {start, width}]) => (
                <div key={monthYear} className="absolute top-0 text-center font-bold text-slate-700 border-r border-b border-slate-200" style={{left: `${start}px`, width: `${width}px`}}>{monthYear}</div>
             ))}
             {timelineHeaders.days.map(({date, isWorking}, i) => (
               <div key={i} className={`absolute top-6 bottom-0 border-l ${isWorking ? 'border-slate-200' : 'bg-slate-200/50 border-slate-300'} px-2 pt-0.5 text-xs text-center font-semibold text-slate-500`} style={{ left: `${i * DAY_WIDTH}px`, width: `${DAY_WIDTH}px`}}>
                 {date.getDate()}
               </div>
             ))}
           </div>
          
           <svg className="absolute top-[50px] left-0 w-full h-full pointer-events-none z-10" style={{ width: `${timelineHeaders.days.length * DAY_WIDTH}px` }}>
               {/* Dependency Lines could be rendered here */}
           </svg>


           <div className="relative pt-0" style={{ width: `${timelineHeaders.days.length * DAY_WIDTH}px`, height: `${project.tasks.length * ROW_HEIGHT}px` }}>
              {/* Grid Lines */}
              {timelineHeaders.days.map(({date, isWorking}, i) => <div key={`grid-${i}`} className={`absolute top-0 bottom-0 border-l ${isWorking ? 'border-slate-100' : 'bg-slate-100/70 border-slate-200'}`} style={{ left: `${i * DAY_WIDTH}px` }} />)}

              {project.tasks.map((task, idx) => {
                if (!project.calendar) return null;
                const offsetDays = getWorkingDaysDiff(projectStart, new Date(task.startDate), project.calendar);
                const width = task.type === 'Milestone' ? DAY_WIDTH : Math.max(task.duration * DAY_WIDTH, 2);
                
                return (
                  <div key={`bar-${task.id}`} className="h-[44px] flex items-center absolute w-full" style={{ top: `${idx * ROW_HEIGHT}px` }}>
                    <div
                      onMouseDown={(e) => handleMouseDown(e, task, 'move')}
                      onClick={() => setSelectedTask(task)}
                      className={`h-6 rounded-sm border shadow-sm relative group cursor-grab transition-all ${getStatusColor(task.status)} ${showCriticalPath && task.critical ? 'ring-2 ring-offset-1 ring-red-500' : ''}`}
                      style={{ left: `${offsetDays * DAY_WIDTH}px`, width: `${width}px` }}
                    >
                      <div className="absolute h-full w-full left-0 top-0 flex items-center">
                        <div className="h-full bg-black/20 rounded-l-sm" style={{ width: `${task.progress}%` }} />
                      </div>
                      <span className="text-white text-xs font-medium absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none truncate pr-2">{task.name}</span>
                       {task.type === 'Milestone' && <Diamond size={16} className="absolute -right-2 top-1/2 -translate-y-1/2 text-white fill-slate-800" />}
                    </div>
                  </div>
                );
              })}
           </div>
        </div>
      </div>
      
      {showResources && project.calendar && <ResourceUsageView project={project} dayWidth={DAY_WIDTH} projectStartDate={projectStart} />}
      
      {selectedTask && !isTraceLogicOpen && <TaskDetailModal task={selectedTask} project={project} onClose={() => setSelectedTask(null)} />}
      {isTraceLogicOpen && selectedTask && <TraceLogic startTask={selectedTask} project={project} onClose={() => setIsTraceLogicOpen(false)} />}
    </div>
  );
};

export default ProjectGantt;
