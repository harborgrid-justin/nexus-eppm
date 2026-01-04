
import React, { useState } from 'react';
import { Upload, CheckCircle, Grid, FilePlus, ArrowDownCircle } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useData } from '../../../context/DataContext';
import { Button } from '../../ui/Button';

export const ExcelSync: React.FC = () => {
    const theme = useTheme();
    const { state, dispatch } = useData();
    
    // Empty state init - Clean slate (Phase 2 requirement)
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

    const loadTemplate = () => {
        setData([
            ['ID', 'Task Name', 'Duration', 'Start Date', 'Finish Date', 'Resource', 'Cost'],
            ['T-100', 'Site Prep', '10', '2024-01-01', '2024-01-10', 'Excavator', '5000'],
            ['T-101', 'Foundation', '25', '2024-01-11', '2024-02-05', 'Concrete Crew', '12000'],
            ['T-102', 'Framing', '15', '2024-02-06', '2024-02-21', 'Steel Team', '8500'],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
        ]);
    };

    const handleLoadProject = () => {
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
            String((t.work || 0) * 100) // Mock cost logic
        ]);

        // Pad with empty rows
        const emptyRows = Array(Math.max(0, 20 - rows.length)).fill(['', '', '', '', '', '', '']);
        setData([header, ...rows, ...emptyRows]);
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const clipboardData = e.clipboardData.getData('text');
        const rows = clipboardData.split('\n').map(row => row.split('\t'));
        
        const startR = selectedCell?.r || 1;
        const startC = selectedCell?.c || 0;
        
        const newData = [...data];
        rows.forEach((row, rIdx) => {
            if (!row[0] && row.length === 1) return; 
            const targetRow = startR + rIdx;
            // Extend grid if needed
            if (!newData[targetRow]) newData[targetRow] = Array(7).fill('');
            
            row.forEach((cell, cIdx) => {
                const targetCol = startC + cIdx;
                if (targetCol < 7) {
                    newData[targetRow][targetCol] = cell.trim();
                }
            });
        });
        setData(newData);
    };

    const handleChange = (r: number, c: number, value: string) => {
        const newData = [...data];
        newData[r][c] = value;
        setData(newData);
    };

    const handleUpload = () => {
        // Convert grid to object array
        const headers = data[0];
        const rows = data.slice(1).filter(r => r.some(c => c !== ''));
        if (rows.length === 0) {
            alert("Grid is empty. Paste data or load a template.");
            return;
        }

        const objectData = rows.map(row => {
             const obj: any = {};
             headers.forEach((h, i) => {
                 obj[h] = row[i];
             });
             return obj;
        });

        // Use standard Staging Action
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
        alert("Data pushed to Import Staging Area. Please switch to 'Data Import' tab to review and commit.");
    };

    const hasData = data.slice(1).some(r => r.some(c => c !== ''));

    return (
        <div className="h-full flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="p-3 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center bg-slate-50 gap-3">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-green-700 font-bold">
                        <Grid size={18} />
                        <span>Excel Sync Adapter</span>
                    </div>
                    <div className="h-6 w-px bg-slate-300 hidden md:block"></div>
                    
                    <div className="flex items-center gap-2">
                        <select 
                            className="text-xs border border-slate-300 rounded-md py-1 px-2 w-40"
                            value={selectedProjectId}
                            onChange={(e) => setSelectedProjectId(e.target.value)}
                        >
                            <option value="">Load from Project...</option>
                            {state.projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <button 
                            onClick={handleLoadProject}
                            disabled={!selectedProjectId}
                            className="p-1 text-slate-500 hover:text-nexus-600 disabled:opacity-30"
                            title="Load Project Data"
                        >
                            <ArrowDownCircle size={16}/>
                        </button>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" icon={FilePlus} onClick={loadTemplate}>Load Template</Button>
                    <Button size="sm" icon={Upload} onClick={handleUpload} disabled={!hasData}>Push to Staging</Button>
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-auto relative bg-slate-50/10">
                <div className="min-w-[800px]" onPaste={handlePaste}>
                    <div className="flex">
                        {/* Row Numbers */}
                        <div className="w-10 flex-shrink-0 bg-slate-100 border-r border-slate-300 pt-8 select-none shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] z-10">
                            {data.map((_, i) => (
                                <div key={i} className="h-8 flex items-center justify-center text-xs text-slate-500 font-medium border-b border-slate-200 bg-slate-50">
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                        
                        <div className="flex-1">
                            {/* Column Headers */}
                            <div className="flex h-8 bg-slate-100 border-b border-slate-300 sticky top-0 z-20">
                                {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((col, i) => (
                                    <div key={col} className="flex-1 min-w-[100px] flex items-center justify-center text-xs font-bold text-slate-600 border-r border-slate-200 relative">
                                        {col}
                                        <div className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-nexus-500"></div>
                                    </div>
                                ))}
                            </div>

                            {/* Cells */}
                            {data.map((row, r) => (
                                <div key={r} className="flex h-8 border-b border-slate-200">
                                    {row.map((cell, c) => (
                                        <input
                                            key={`${r}-${c}`}
                                            className={`flex-1 min-w-[100px] px-2 text-sm border-r border-slate-100 outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 focus:bg-green-50 transition-colors ${r === 0 ? 'font-bold bg-slate-50 text-slate-700' : 'text-slate-800 bg-white'}`}
                                            value={cell}
                                            readOnly={r === 0}
                                            onClick={() => setSelectedCell({r, c})}
                                            onChange={(e) => handleChange(r, c, e.target.value)}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Bar */}
            <div className="h-8 bg-slate-50 border-t border-slate-200 flex items-center px-4 justify-between text-xs text-slate-500 select-none">
                <span>{selectedCell ? `Cell: ${String.fromCharCode(65 + selectedCell.c)}${selectedCell.r + 1}` : 'Ready'}</span>
                <div className="flex gap-4">
                    <span>Rows: {data.length - 1}</span>
                    <span className="text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle size={10}/> Validation: {hasData ? 'Active' : 'Waiting for Data'}
                    </span>
                </div>
            </div>
        </div>
    );
};
