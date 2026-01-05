import React, { useState, useCallback } from 'react';
import { useData } from '../../context/DataContext';

export const useExcelSyncLogic = () => {
    const { state, dispatch } = useData();
    
    const [data, setData] = useState<string[][]>([
        ['ID', 'Task Name', 'Duration', 'Start Date', 'Finish Date', 'Resource', 'Cost'],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
    ]);
    const [selectedCell, setSelectedCell] = useState<{r: number, c: number} | null>(null);
    const [selectedProjectId, setSelectedProjectId] = useState<string>('');

    const loadTemplate = useCallback(() => {
        setData([
            ['ID', 'Task Name', 'Duration', 'Start Date', 'Finish Date', 'Resource', 'Cost'],
            ['T-100', 'Site Prep', '10', '2024-01-01', '2024-01-10', 'Excavator', '5000'],
            ['T-101', 'Foundation', '25', '2024-01-11', '2024-02-05', 'Concrete Crew', '12000'],
            ['T-102', 'Framing', '15', '2024-02-06', '2024-02-21', 'Steel Team', '8500'],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
        ]);
    }, []);

    const handleLoadProject = useCallback(() => {
        if (!selectedProjectId) return;
        const project = state.projects.find(p => p.id === selectedProjectId);
        if (!project) return;

        const header = ['ID', 'Task Name', 'Duration', 'Start Date', 'Finish Date', 'Resource', 'Cost'];
        const rows = project.tasks.map(t => [
            t.id,
            t.name,
            String(t.duration),
            t.startDate,
            t.endDate,
            t.assignments[0]?.resourceId || '',
            String((t.work || 0) * 100)
        ]);

        const emptyRows = Array(Math.max(0, 20 - rows.length)).fill(['', '', '', '', '', '', '']);
        setData([header, ...rows, ...emptyRows]);
    }, [selectedProjectId, state.projects]);

    const handlePaste = useCallback((e: React.ClipboardEvent) => {
        e.preventDefault();
        const clipboardData = e.clipboardData.getData('text');
        const rows = clipboardData.split('\n').map(row => row.split('\t'));
        
        const startR = selectedCell?.r || 1;
        const startC = selectedCell?.c || 0;
        
        const newData = [...data];
        rows.forEach((row, rIdx) => {
            if (!row[0] && row.length === 1) return; 
            const targetRow = startR + rIdx;
            if (!newData[targetRow]) newData[targetRow] = Array(7).fill('');
            
            row.forEach((cell, cIdx) => {
                const targetCol = startC + cIdx;
                if (targetCol < 7) {
                    newData[targetRow][targetCol] = cell.trim();
                }
            });
        });
        setData(newData);
    }, [data, selectedCell]);

    const handleChange = useCallback((r: number, c: number, value: string) => {
        const newData = [...data];
        newData[r][c] = value;
        setData(newData);
    }, [data]);

    const handleUpload = useCallback(() => {
        const headers = data[0];
        const rows = data.slice(1).filter(r => r.some(c => c !== ''));
        if (rows.length === 0) {
            return { error: "Grid is empty. Paste data or load a template." };
        }

        const objectData = rows.map(row => {
             const obj: any = {};
             headers.forEach((h, i) => {
                 obj[h] = row[i];
             });
             return obj;
        });

        const mappedData = objectData.map(o => ({
            ID: o['ID'],
            Name: o['Task Name'],
            Budget: o['Cost'],
            Status: 'Planned',
            Duration: o['Duration'],
            Start: o['Start Date'],
            Finish: o['Finish Date']
        }));

        dispatch({ type: 'STAGING_INIT', payload: { type: 'Task', data: mappedData } });
        return { success: true };
    }, [data, dispatch]);

    const hasData = data.slice(1).some(r => r.some(c => c !== ''));

    return {
        data,
        selectedCell,
        selectedProjectId,
        hasData,
        projects: state.projects,
        setSelectedCell,
        setSelectedProjectId,
        loadTemplate,
        handleLoadProject,
        handlePaste,
        handleChange,
        handleUpload
    };
};