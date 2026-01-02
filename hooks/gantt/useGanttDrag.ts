
import React, { useRef, useCallback } from 'react';
import { Project, Task } from '../../types';
import { Action } from '../../types/actions';
import { getDaysDiff } from '../../utils/dateUtils';

export const useGanttDrag = (dispatch: React.Dispatch<Action>, project: Project, dayWidth: number) => {
    const ganttContainerRef = useRef<HTMLDivElement>(null);
    const rafId = useRef<number | null>(null);
    
    // Store drag state in a ref to avoid re-renders during 60fps operations
    const dragState = useRef<{
        task: Task | null;
        type: 'move' | 'resize-start' | 'resize-end' | 'progress';
        startX: number;
        originalStart: Date;
        originalEnd: Date;
        originalProgress: number;
        currentDeltaX: number;
        targetElement: HTMLElement | null;
    }>({
        task: null,
        type: 'move',
        startX: 0,
        originalStart: new Date(),
        originalEnd: new Date(),
        originalProgress: 0,
        currentDeltaX: 0,
        targetElement: null
    });

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!dragState.current.task || !dragState.current.targetElement) return;

        const deltaX = e.clientX - dragState.current.startX;
        dragState.current.currentDeltaX = deltaX;

        // Principle 11: Frame-Budget-Aware Animation
        // Use RAF to coalesce mouse events and update DOM only once per frame
        if (rafId.current) cancelAnimationFrame(rafId.current);

        rafId.current = requestAnimationFrame(() => {
            const { targetElement, type, currentDeltaX } = dragState.current;
            if (!targetElement) return;

            // Direct DOM manipulation for 60fps perf, bypass React Render Cycle
            if (type === 'move') {
                targetElement.style.transform = `translateX(${currentDeltaX}px)`;
                // Optional: Add snapping visual guide here if needed
            } else if (type === 'resize-end') {
                const currentWidth = targetElement.offsetWidth; // This forces reflow, cache if possible
                // Visual resize logic (simplified: usually needs a ghost element or direct width manip)
                 targetElement.style.width = `${Math.max(dayWidth, currentWidth + currentDeltaX)}px`;
            }
        });
    }, [dayWidth]);

    const handleMouseUp = useCallback((e: MouseEvent) => {
        if (!dragState.current.task) return;

        // Cleanup
        if (rafId.current) cancelAnimationFrame(rafId.current);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'default';

        // Calculate Final Changes
        const deltaX = e.clientX - dragState.current.startX;
        const deltaDays = Math.round(deltaX / dayWidth);
        const { task, type, originalStart, originalEnd, targetElement } = dragState.current;

        // Reset DOM Styles before React Update
        if (targetElement) {
            targetElement.style.transform = '';
            targetElement.style.width = ''; // Reset to let React control width again
        }

        if (deltaDays !== 0) {
            let updates: Partial<Task> = {};

            if (type === 'move') {
                const newStart = new Date(originalStart);
                newStart.setDate(newStart.getDate() + deltaDays);
                const newEnd = new Date(originalEnd);
                newEnd.setDate(newEnd.getDate() + deltaDays);
                
                updates = {
                    startDate: newStart.toISOString().split('T')[0],
                    endDate: newEnd.toISOString().split('T')[0]
                };
            } else if (type === 'resize-end') {
                const newEnd = new Date(originalEnd);
                newEnd.setDate(newEnd.getDate() + deltaDays);
                 // Ensure duration >= 1 day
                 if (newEnd > new Date(task.startDate)) {
                    updates = {
                        endDate: newEnd.toISOString().split('T')[0],
                        duration: getDaysDiff(task.startDate, newEnd.toISOString().split('T')[0])
                    };
                 }
            }

            // Commit to State (Principle 8: Optimistic/Deterministic)
            if (Object.keys(updates).length > 0) {
                dispatch({ 
                    type: 'TASK_UPDATE', 
                    payload: { projectId: project.id, task: { ...task, ...updates } } 
                });
            }
        }

        // Reset Refs
        dragState.current = {
            task: null, type: 'move', startX: 0, originalStart: new Date(), originalEnd: new Date(), originalProgress: 0, currentDeltaX: 0, targetElement: null
        };
    }, [dispatch, project.id, dayWidth, handleMouseMove]);

    const handleMouseDown = useCallback((e: React.MouseEvent, task: Task, type: 'move' | 'resize-start' | 'resize-end' | 'progress') => {
        // Prevent default browser drag behavior
        e.preventDefault();
        e.stopPropagation();
        
        // Find the draggable element (Task Bar)
        // We assume the event target or its parent is the bar
        const target = (e.currentTarget as HTMLElement);
        
        dragState.current = {
            task,
            type,
            startX: e.clientX,
            originalStart: new Date(task.startDate),
            originalEnd: new Date(task.endDate),
            originalProgress: task.progress,
            currentDeltaX: 0,
            targetElement: target
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
