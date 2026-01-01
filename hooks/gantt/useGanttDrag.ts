
import React, { useRef, useCallback } from 'react';
import { Project, Task } from '../../types';
import { Action } from '../../types/actions';
import { getDaysDiff } from '../../utils/dateUtils';

export const useGanttDrag = (dispatch: React.Dispatch<Action>, project: Project, dayWidth: number) => {
    const ganttContainerRef = useRef<HTMLDivElement>(null);
    const dragState = useRef<{
        task: Task | null;
        type: 'move' | 'resize-start' | 'resize-end' | 'progress';
        startX: number;
        originalStart: Date;
        originalEnd: Date;
        originalProgress: number;
    }>({
        task: null,
        type: 'move',
        startX: 0,
        originalStart: new Date(),
        originalEnd: new Date(),
        originalProgress: 0
    });

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!dragState.current.task || !ganttContainerRef.current) return;
        // Logic for visual feedback during drag could go here
    }, []);

    const handleMouseUp = useCallback((e: MouseEvent) => {
        if (!dragState.current.task) return;

        const deltaX = e.clientX - dragState.current.startX;
        const deltaDays = Math.round(deltaX / dayWidth);
        
        if (deltaDays !== 0) {
            const task = dragState.current.task;
            let updates: Partial<Task> = {};

            if (dragState.current.type === 'move') {
                const newStart = new Date(dragState.current.originalStart);
                newStart.setDate(newStart.getDate() + deltaDays);
                const newEnd = new Date(dragState.current.originalEnd);
                newEnd.setDate(newEnd.getDate() + deltaDays);
                
                updates = {
                    startDate: newStart.toISOString().split('T')[0],
                    endDate: newEnd.toISOString().split('T')[0]
                };
            } else if (dragState.current.type === 'resize-end') {
                const newEnd = new Date(dragState.current.originalEnd);
                newEnd.setDate(newEnd.getDate() + deltaDays);
                 // Ensure duration >= 1 day
                 if (newEnd > new Date(task.startDate)) {
                    updates = {
                        endDate: newEnd.toISOString().split('T')[0],
                        duration: getDaysDiff(task.startDate, newEnd.toISOString().split('T')[0])
                    };
                 }
            }

            if (Object.keys(updates).length > 0) {
                dispatch({ 
                    type: 'TASK_UPDATE', 
                    payload: { projectId: project.id, task: { ...task, ...updates } } 
                });
            }
        }

        dragState.current.task = null;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'default';
    }, [dispatch, project.id, dayWidth, handleMouseMove]);

    const handleMouseDown = useCallback((e: React.MouseEvent, task: Task, type: 'move' | 'resize-start' | 'resize-end' | 'progress') => {
        e.preventDefault();
        e.stopPropagation();
        
        dragState.current = {
            task,
            type,
            startX: e.clientX,
            originalStart: new Date(task.startDate),
            originalEnd: new Date(task.endDate),
            originalProgress: task.progress
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = type === 'move' ? 'grabbing' : 'col-resize';
    }, [handleMouseMove, handleMouseUp]);

    return {
        ganttContainerRef,
        handleMouseDown
    };
};
