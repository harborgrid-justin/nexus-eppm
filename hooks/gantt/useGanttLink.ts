import React, { useState, useRef, useCallback } from 'react';
import { Task, Project } from '../../types';
import { useData } from '../../context/DataContext';
import { getWorkingDaysDiff } from '../../utils/dateUtils';
import { detectCircularDependency } from '../../utils/treeUtils'; // Reusing existing util or implementing graph check

export interface DraftLinkState {
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    sourceTask: Task;
    targetTask: Task | null;
    isValid: boolean;
}

export const useGanttLink = (
    project: Project,
    projectStart: Date,
    dayWidth: number,
    rowHeight: number,
    taskRowMap: Map<string, number>,
    ganttContainerRef: React.RefObject<HTMLDivElement>
) => {
    const { dispatch } = useData();
    const [draftLink, setDraftLink] = useState<DraftLinkState | null>(null);

    // Calculate anchor position based on Task and Side
    const getAnchorPosition = useCallback((task: Task, side: 'start' | 'end') => {
        const rowIdx = taskRowMap.get(task.id);
        if (rowIdx === undefined) return null;

        // X Coordinate
        const date = side === 'start' ? new Date(task.startDate) : new Date(task.endDate);
        const days = getWorkingDaysDiff(projectStart, date, { workingDays: [1,2,3,4,5], holidays: [] }); // Use standard cal for now
        let x = days * dayWidth;
        
        // Add duration width if 'end'
        // Note: getWorkingDaysDiff accounts for dates, but visual width adds duration
        if (side === 'end') {
             x += (Math.max(task.duration, 1) * dayWidth);
        }

        // Y Coordinate (Center of bar)
        // Header is usually 56px, plus Top margin of task bar (10px) inside row
        // Row center = rowIdx * rowHeight + (rowHeight / 2)
        const y = (rowIdx * rowHeight) + (rowHeight / 2) + 10;

        return { x, y };
    }, [taskRowMap, projectStart, dayWidth, rowHeight]);

    const handleLinkStart = useCallback((e: React.MouseEvent, task: Task, side: 'start' | 'end') => {
        // Prevent drag from starting selection
        e.preventDefault();
        e.stopPropagation();

        const pos = getAnchorPosition(task, side);
        if (!pos) return;

        setDraftLink({
            startX: pos.x,
            startY: pos.y,
            currentX: pos.x,
            currentY: pos.y,
            sourceTask: task,
            targetTask: null,
            isValid: true
        });

        // Add global listeners
        document.addEventListener('mousemove', handleLinkMove);
        document.addEventListener('mouseup', handleLinkEnd);
    }, [getAnchorPosition]);

    const handleLinkMove = useCallback((e: MouseEvent) => {
        if (!ganttContainerRef.current) return;
        
        const rect = ganttContainerRef.current.getBoundingClientRect();
        // Calculate relative X/Y inside scrollable area
        // We need to account for scrollLeft/scrollTop if the container scrolls
        const scrollLeft = ganttContainerRef.current.scrollLeft;
        const scrollTop = ganttContainerRef.current.scrollTop;
        
        const relX = e.clientX - rect.left + scrollLeft;
        const relY = e.clientY - rect.top + scrollTop - 56; // -56 for header height adjustment

        setDraftLink(prev => prev ? { ...prev, currentX: relX, currentY: relY } : null);
    }, []);

    const handleLinkHoverTask = useCallback((targetTask: Task) => {
        setDraftLink(prev => {
            if (!prev) return null;
            
            // Validation Logic
            const isSelf = prev.sourceTask.id === targetTask.id;
            const exists = prev.sourceTask.dependencies.some(d => d.targetId === targetTask.id);
            // Simple cycle check: is source already a successor of target? (Deep check omitted for perf in this snippet)
            
            return {
                ...prev,
                targetTask,
                isValid: !isSelf && !exists 
            };
        });
    }, []);

    const handleLinkEnd = useCallback(() => {
        setDraftLink(prev => {
            if (prev && prev.isValid && prev.targetTask) {
                // Create Dependency: Target (Predecessor) -> Source (Successor)
                // In dragging UI, we usually drag FROM predecessor TO successor
                // So if I drag from A(End) to B(Start), A is Pred, B is Succ.
                
                // Dispatch update
                dispatch({
                    type: 'TASK_UPDATE',
                    payload: {
                        projectId: project.id,
                        task: {
                            ...prev.targetTask,
                            dependencies: [
                                ...prev.targetTask.dependencies,
                                { targetId: prev.sourceTask.id, type: 'FS', lag: 0 }
                            ]
                        }
                    }
                });
            }
            return null;
        });

        document.removeEventListener('mousemove', handleLinkMove);
        document.removeEventListener('mouseup', handleLinkEnd);
    }, [dispatch, project]);

    return {
        draftLink,
        handleLinkStart,
        handleLinkHoverTask,
        handleLinkEnd // Clean up if needed
    };
};
