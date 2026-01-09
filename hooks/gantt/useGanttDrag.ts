
import React, { useRef, useCallback, useEffect } from 'react';
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

        if (rafId.current) cancelAnimationFrame(rafId.current);

        rafId.current = requestAnimationFrame(() => {
            const { targetElement, type, currentDeltaX } = dragState.current;
            if (!targetElement) return;

            if (type === 'move') {
                targetElement.style.transform = `translateX(${currentDeltaX}px)`;
            } else if (type === 'resize-end') {
                const currentWidth = targetElement.offsetWidth;
                targetElement.style.width = `${Math.max(dayWidth, currentWidth + currentDeltaX)}px`;
            }
        });
    }, [dayWidth]);

    const handleMouseUp = useCallback((e: MouseEvent) => {
        if (!dragState.current.task) return;

        if (rafId.current) cancelAnimationFrame(rafId.current);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'default';

        const deltaX = e.clientX - dragState.current.startX;
        const deltaDays = Math.round(deltaX / dayWidth);
        const { task, type, originalStart, originalEnd, targetElement } = dragState.current;

        if (targetElement) {
            targetElement.style.transform = '';
            targetElement.style.width = '';
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

        dragState.current = {
            task: null, type: 'move', startX: 0, originalStart: new Date(), originalEnd: new Date(), originalProgress: 0, currentDeltaX: 0, targetElement: null
        };
    }, [dispatch, project.id, dayWidth, handleMouseMove]);

    // CRITICAL FIX: Purge window listeners on unmount to prevent memory leaks
    useEffect(() => {
        return () => {
            if (rafId.current) cancelAnimationFrame(rafId.current);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    const handleMouseDown = useCallback((e: React.MouseEvent, task: Task, type: 'move' | 'resize-start' | 'resize-end' | 'progress') => {
        e.preventDefault();
        e.stopPropagation();
        
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
