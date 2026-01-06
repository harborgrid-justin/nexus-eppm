
import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import { ChartPlaceholder } from '../charts/ChartPlaceholder';
import { Calendar, Map, Share2, Printer, Filter, ZoomIn, ZoomOut, Maximize2, MoreHorizontal, Layers, ChevronRight, Download, Link, AlertTriangle, Diamond, CalendarDays, Check, LayoutGrid, FileText, Globe, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useData } from '../../context/DataContext';
import { EmptyState } from '../common/EmptyState';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getDaysDiff } from '../../utils/dateUtils';

const TemplateHeader = ({ number, title, subtitle }: { number: string, title: string, subtitle?: string }) => (
    <div className="flex items-start gap-4 mb-8">
        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono text-lg font-bold shadow-lg shadow-slate-200 shrink-0">
            {number}
        </div>
        <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
            {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
        </div>
    </div>
);

export const GanttTimelineTmpl: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    const project = state.projects[0]; // Use first project for demo data
    const [zoomLevel, setZoomLevel] = useState<'Day' | 'Week' | 'Month'>('Week');
    const [filterText, setFilterText] = useState('');

    const mockTasks = project?.tasks || [];

    if (!project) return (
        <div className={`h-full flex items-center justify-center ${theme.colors.background}`}>
             <EmptyState title="No Projects Available" description="Create a project to view the Gantt timeline template." icon={Calendar} />
        </div>
    );

    return (
        <div className="h-full flex flex-col bg-white overflow-hidden">
             <div className="px-6 pt-6">
                <TemplateHeader number="16" title="Gantt Timeline" subtitle={`Interactive schedule for ${project.name}`} />
             </div>

            <div className={`h-14 border-y ${theme.colors.border} flex items-center px-4 justify-between bg-slate-50 flex-shrink-0`}>
                <div className="flex items-center gap-4">
                    <div className="flex bg-white border border-slate-300 rounded-lg p-0.5 shadow-sm">
                        {['Day', 'Week', 'Month'].map(lvl => (
                            <button 
                                key={lvl}
                                onClick={() => setZoomLevel(lvl as any)}
                                className={`px-4 py-1 text-xs font-bold rounded transition-all ${zoomLevel === lvl ? 'text-nexus-700 bg-nexus-50 shadow-sm border border-nexus-200' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                {lvl}
                            </button>
                        ))}
                    </div>
                    <div className="h-6 w-px bg-slate-300"></div>
                    <div className="flex gap-1">
                        <button className="p-1.5 text-slate-500 hover:bg-white rounded hover:shadow-sm transition-all"><ZoomIn size={16}/></button>
                        <button className="p-1.5 text-slate-500 hover:bg-white rounded hover:shadow-sm transition-all"><ZoomOut size={16}/></button>
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <input 
                        className="px-2 py-1 text-xs border rounded" 
                        placeholder="Filter tasks..." 
                        value={filterText}
                        onChange={e => setFilterText(e.target.value)}
                    />
                    <Button size="sm" icon={Calendar}>Today</Button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                <div className="w-96 border-r border-slate-200 bg-white flex flex-col flex-shrink-0 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.1)] z-10">
                    <div className="h-10 border-b border-slate-200 bg-slate-50 flex items-center px-4">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">WBS Hierarchy</span>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {mockTasks.map(t => (
                            <div key={t.id} className={`flex items-center h-10 border-b border-slate-100 hover:bg-nexus-50/30 text-sm px-4 gap-2 cursor-pointer group ${t.type === 'Summary' ? 'bg-slate-50' : ''}`} style={{ paddingLeft: `${16 + (t.wbsCode.split('.').length - 1) * 16}px`}}>
                                <span className={`flex-1 truncate ${t.type === 'Summary' ? 'font-bold text-slate-800' : 'text-slate-600 font-medium'}`}>
                                    {t.name}
                                </span>
                                <span className="text-xs text-slate-400 font-mono">{t.duration}d</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 bg-slate-50/50 relative overflow-auto flex flex-col">
                    <div className="h-10 bg-white border-b border-slate-200 sticky top-0 flex items-end shadow-sm z-10">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="flex-1 border-r border-slate-200 text-center pb-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                {zoomLevel} {i + 1}
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex-1 relative min-h-[500px]">
                        <div className="absolute inset-0 flex pointer-events-none">
                             {[...Array(12)].map((_, i) => (
                                <div key={i} className="flex-1 border-r border-slate-200/50 h-full"></div>
                             ))}
                        </div>

                        {mockTasks.map((t, i) => (
                            <div key={t.id} className="h-10 flex items-center relative px-2 border-b border-slate-100/50">
                                <div 
                                    className={`h-5 rounded shadow-sm border border-white/20 relative group cursor-pointer transition-all hover:shadow-md hover:-translate-y-px ${
                                        t.type === 'Summary' ? 'bg-slate-800' : t.critical ? 'bg-red-500' : 'bg-blue-500'
                                    }`}
                                    style={{ 
                                        width: `${Math.max(20, t.duration * 10)}px`, 
                                        marginLeft: `${(new Date(t.startDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 3600 * 24) * 2}px` 
                                    }}
                                >
                                    <div className="absolute top-0 bottom-0 left-0 bg-black/10 w-[60%] rounded-l"></div>
                                    <span className="absolute left-full ml-2 text-xs font-bold text-slate-600 opacity-0 group-hover:opacity-100 whitespace-nowrap bg-white px-2 py-0.5 rounded shadow-sm border border-slate-200 z-20">
                                        Dur: {t.duration}d
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const StrategicRoadmapTmpl: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    const [hiddenLanes, setHiddenLanes] = useState<string[]>([]);
    const [timescale, setTimescale] = useState<'Quarters' | 'Months'>('Quarters');

    // Use Programs as Lanes
    const lanes = useMemo(() => {
        if (state.programs.length > 0) return state.programs;
        // Fallback if no programs
        return [{ id: 'default', name: 'Strategic Portfolio', managerId: 'PMO' }];
    }, [state.programs]);

    const items = useMemo(() => {
        return state.projects.map(p => ({
            id: p.id,
            laneId: p.programId || 'default',
            name: p.name,
            start: p.startDate,
            end: p.endDate,
            status: p.health,
            owner: p.managerId
        }));
    }, [state.projects]);

    const toggleLane = (laneId: string) => {
        setHiddenLanes(prev => prev.includes(laneId) ? prev.filter(l => l !== laneId) : [...prev, laneId]);
    };
    
    const timelineHeaders = timescale === 'Quarters' 
        ? ['Q1', 'Q2', 'Q3', 'Q4']
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div className={`h-full overflow-hidden flex flex-col ${theme.layout.pagePadding} bg-slate-50`}>
            <div className="flex justify-between items-start mb-6">
                 <TemplateHeader number="17" title="Strategic Roadmap" subtitle="Long-Range Initiative Plan" />
                <div className="flex items-center gap-4">
                    <div className="flex bg-white border border-slate-300 rounded-lg p-1 shadow-sm">
                        {['Quarters', 'Months'].map(t => (
                            <button key={t} onClick={() => setTimescale(t as any)} className={`px-4 py-1 text-xs font-bold rounded transition-colors ${timescale === t ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{t}</button>
                        ))}
                    </div>
                    <Button variant="outline" size="sm" icon={CalendarDays}>Today</Button>
                </div>
            </div>

            <div className="flex-1 overflow-auto scrollbar-thin rounded-xl shadow-lg border border-slate-200 bg-white">
              {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400">
                      <Map size={48} className="mb-4 opacity-20"/>
                      <p>No roadmap items found. Create projects to populate.</p>
                  </div>
              ) : (
                  <div className="min-w-[1200px] flex flex-col bg-white h-full">
                    {/* Timeline Header */}
                    <div className="flex h-12 border-b border-slate-200 bg-slate-100/50 sticky top-0 z-40">
                        <div className="w-64 border-r border-slate-200 p-3 font-black text-slate-500 text-[10px] uppercase tracking-widest flex items-center bg-slate-50">Work Stream</div>
                        <div className="flex-1 flex text-center items-center relative">
                            {timelineHeaders.map((q, i) => (
                                <div key={q} className="flex-1 border-r border-slate-200 h-full flex items-center justify-center text-sm font-bold text-slate-700">{q}</div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Swimlanes */}
                    <div className="flex-1 flex flex-col divide-y divide-slate-200 bg-slate-50/30">
                        {lanes.filter(l => !hiddenLanes.includes(l.id)).map(lane => (
                            <div key={lane.id} className="flex-1 flex min-h-[160px]">
                                <div className="w-64 border-r border-slate-200 p-4 bg-white sticky left-0 z-30">
                                    <h4 className="font-bold text-slate-900 text-sm">{lane.name}</h4>
                                    <p className="text-xs text-slate-500 mt-1 font-medium uppercase tracking-wide">Owner: {(lane as any).managerId}</p>
                                </div>
                                <div className="flex-1 relative p-4">
                                    {/* Vertical Grid Lines */}
                                    <div className="absolute inset-0 flex pointer-events-none">
                                        {timelineHeaders.map((_, i) => <div key={i} className="flex-1 border-r border-dashed border-slate-200/70"></div>)}
                                    </div>

                                    {/* Roadmap Items */}
                                    {items.filter(i => i.laneId === lane.id || (!i.laneId && lane.id === 'default')).map((item, idx) => (
                                        <div 
                                            key={item.id} 
                                            className={`absolute h-8 rounded-lg shadow-md border flex items-center px-3 text-white text-xs font-bold cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl hover:z-30 group ${
                                                item.status === 'Critical' ? 'bg-red-500 border-red-600' :
                                                item.status === 'Warning' ? 'bg-amber-500 border-amber-600' :
                                                'bg-nexus-600 border-nexus-700'
                                            }`}
                                            style={{ 
                                                left: `${(idx * 15) % 80}%`, // Mock positioning for demo
                                                width: '18%', 
                                                top: `${24 + (idx * 40)}px` 
                                            }}
                                        >
                                            <span className="truncate">{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                  </div>
              )}
            </div>
        </div>
    );
};

export const NetworkDiagramTmpl: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    const project = state.projects[0];

    // Mock layout logic for real tasks
    const nodes = useMemo(() => {
        if (!project) return [];
        return project.tasks.map((t, i) => ({
            id: t.id,
            label: t.name,
            type: t.type === 'Milestone' ? 'end' : 'task',
            x: 100 + (i * 180),
            y: 200 + (i % 2 === 0 ? -50 : 50),
            dur: t.duration,
            critical: t.critical
        }));
    }, [project]);
    
    // Simple sequential path for visual
    const paths = useMemo(() => {
        if (nodes.length < 2) return [];
        const p = [];
        for(let i=0; i<nodes.length-1; i++) {
            p.push({
                from: {x: nodes[i].x + 64, y: nodes[i].y + 40}, // Center approximate
                to: {x: nodes[i+1].x - 64, y: nodes[i+1].y + 40},
                critical: nodes[i].critical && nodes[i+1].critical
            });
        }
        return p;
    }, [nodes]);

    if (!project) return (
        <div className={`h-full flex items-center justify-center ${theme.layout.pagePadding}`}>
            <EmptyState title="No Project Selected" description="Create a project to visualize the network diagram." icon={Share2}/>
        </div>
    );

    return (
        <div className={`h-full flex flex-col ${theme.layout.pagePadding}`}>
            <TemplateHeader number="18" title="Network Diagram (PERT)" subtitle={`Logic flow for ${project.name}`} />
            <div className={`flex-1 bg-slate-50 border ${theme.colors.border} rounded-xl relative overflow-auto shadow-inner`}>
                {/* Background Grid */}
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px', minWidth: `${nodes.length * 200}px` }}></div>
                
                {/* Nodes */}
                {nodes.map(node => (
                    <div 
                        key={node.id} 
                        className={`absolute w-32 h-20 rounded-lg shadow-md border-2 bg-white flex flex-col items-center justify-center p-2 z-10 hover:scale-105 transition-transform cursor-grab active:cursor-grabbing ${node.critical ? 'border-red-500 shadow-red-100' : 'border-slate-300'}`}
                        style={{ left: node.x, top: node.y }}
                    >
                        <span className={`font-bold text-xs text-center line-clamp-2 ${node.type === 'start' ? 'text-green-600' : 'text-slate-700'}`}>{node.label}</span>
                        {node.type !== 'start' && node.type !== 'end' && (
                            <span className="text-[10px] text-slate-500 mt-1">Dur: {node.dur}d</span>
                        )}
                    </div>
                ))}

                {/* SVG Connections (Overlay) */}
                <svg className="absolute inset-0 pointer-events-none" style={{ minWidth: `${nodes.length * 200}px`, height: '100%' }}>
                    <defs>
                        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                            <path d="M0,0 L0,6 L9,3 z" fill="#94a3b8" />
                        </marker>
                        <marker id="arrow-crit" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                            <path d="M0,0 L0,6 L9,3 z" fill="#ef4444" />
                        </marker>
                    </defs>
                    {paths.map((p, i) => (
                        <path 
                            key={i} 
                            d={`M ${p.from.x} ${p.from.y} C ${p.from.x + 50} ${p.from.y}, ${p.to.x - 50} ${p.to.y}, ${p.to.x} ${p.to.y}`} 
                            stroke={p.critical ? '#ef4444' : '#94a3b8'} 
                            strokeWidth={p.critical ? 3 : 1.5} 
                            fill="none" 
                            markerEnd={`url(#arrow${p.critical ? '-crit' : ''})`}
                        />
                    ))}
                </svg>
            </div>
            <div className="flex gap-4 mt-4 justify-center">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase"><div className="w-4 h-1 bg-red-500"></div> Critical Path</div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase"><div className="w-4 h-1 bg-slate-400"></div> Non-Critical</div>
            </div>
        </div>
    );
};

export const GeospatialMapTmpl: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    const locations = state.locations;

    if (locations.length === 0) return (
        <div className={`h-full flex items-center justify-center ${theme.layout.pagePadding}`}>
             <EmptyState title="No Locations" description="Define locations in Admin Settings to populate the map." icon={Map}/>
        </div>
    );

    return (
        <div className={`h-full flex flex-col ${theme.layout.pagePadding}`}>
            <TemplateHeader number="19" title="Geospatial Project Map" subtitle="Global asset distribution" />
            <div className={`flex-1 flex overflow-hidden rounded-xl border ${theme.colors.border} shadow-lg relative`}>
                {/* Map Layer */}
                <div className="absolute inset-0 bg-slate-200">
                    <div className="absolute inset-0 opacity-50 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center"></div>
                    
                    {/* Live Pins */}
                    {locations.map((loc, i) => {
                        // Mock projection for demo: Lat/Lng to % (very rough approximation for visual)
                        const x = ((loc.coordinates?.lng || 0) + 180) * (100 / 360);
                        const y = ((-1 * (loc.coordinates?.lat || 0)) + 90) * (100 / 180);
                        
                        return (
                            <div key={loc.id} className="absolute group" style={{ left: `${x}%`, top: `${y}%` }}>
                                <div className={`w-4 h-4 rounded-full border-2 border-white shadow-md cursor-pointer animate-pulse bg-nexus-600`}></div>
                                <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold whitespace-nowrap z-20 pointer-events-none text-slate-800">
                                    {loc.name}
                                    <div className="text-[9px] text-slate-500 font-normal">{loc.city}, {loc.country}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Sidebar Overlay */}
                <div className="w-80 bg-white/95 backdrop-blur shadow-2xl z-10 flex flex-col border-r border-slate-200">
                    <div className="p-4 border-b border-slate-200">
                        <div className="relative">
                            <input className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm" placeholder="Search locations..." />
                            <Map className="absolute left-3 top-2.5 text-slate-400" size={16}/>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {locations.map(loc => (
                            <div key={loc.id} className="p-3 border border-slate-200 rounded-lg hover:border-nexus-500 cursor-pointer bg-white transition-colors group">
                                <h4 className="font-bold text-sm text-slate-800">{loc.name}</h4>
                                <p className="text-xs text-slate-500 mt-1">{loc.city}, {loc.country}</p>
                                <div className="flex gap-2 mt-2">
                                    <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded font-bold border border-green-100">Active</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AnalyticsReportTmpl: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    const project = state.projects[0];
    
    if (!project) return <div className="p-12 text-center text-slate-400">No project data available for report generation.</div>;

    const cpi = project.spent > 0 ? (project.budget * 0.5) / project.spent : 1; // Mock EV calculation
    const variance = project.budget - project.spent;

    return (
        <div className="h-full overflow-y-auto bg-slate-100 flex justify-center py-8">
            <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl p-[20mm] flex flex-col text-slate-900">
                {/* Report Header */}
                <div className="flex justify-between items-end border-b-2 border-slate-900 pb-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight">Performance Report</h1>
                        <p className="text-slate-500 font-medium mt-1">{new Date().toLocaleDateString()} • {project.name}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-black text-xl text-nexus-700">NEXUS PPM</p>
                        <p className="text-xs text-slate-400 uppercase tracking-widest">Confidential</p>
                    </div>
                </div>

                {/* Executive Summary */}
                <div className="mb-8">
                    <h3 className="font-bold text-sm uppercase tracking-widest border-b border-slate-200 pb-1 mb-3 text-slate-500">Executive Summary</h3>
                    <p className="text-sm leading-relaxed text-justify">
                        {project.name} ({project.code}) is currently in the <strong>{project.status}</strong> phase with a health status of <strong>{project.health}</strong>.
                        Budget utilization stands at {((project.spent / project.budget) * 100).toFixed(1)}%. 
                        {cpi < 1 ? " Cost efficiency is currently below baseline." : " Cost efficiency is tracking to baseline."}
                    </p>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="p-4 border border-slate-200 rounded text-center bg-slate-50">
                        <p className="text-xs font-bold text-slate-500 uppercase">Cost Perf. Index</p>
                        <p className={`text-3xl font-black mt-2 ${cpi < 0.9 ? 'text-red-600' : 'text-green-600'}`}>{cpi.toFixed(2)}</p>
                    </div>
                    <div className="p-4 border border-slate-200 rounded text-center bg-slate-50">
                        <p className="text-xs font-bold text-slate-500 uppercase">Schedule Perf. Index</p>
                        <p className="text-3xl font-black text-yellow-600 mt-2">0.98</p>
                    </div>
                    <div className="p-4 border border-slate-200 rounded text-center bg-slate-50">
                        <p className="text-xs font-bold text-slate-500 uppercase">Risk Score</p>
                        <p className="text-3xl font-black text-slate-800 mt-2">{project.riskScore}</p>
                    </div>
                </div>

                {/* Chart Mock */}
                <div className="flex-1 mb-8">
                    <h3 className="font-bold text-sm uppercase tracking-widest border-b border-slate-200 pb-1 mb-3 text-slate-500">Earned Value Trend</h3>
                    <div className="h-64 border border-slate-200 rounded p-4">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[{name:'Planned', A: project.budget}, {name:'Actual', A: project.spent}]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{fontSize: 10}} />
                                <YAxis tick={{fontSize: 10}} />
                                <Bar dataKey="A" fill="#0ea5e9" barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-auto border-t border-slate-200 pt-4 flex justify-between text-xs text-slate-400">
                    <span>Generated by Nexus System</span>
                    <span>Page 1 of 1</span>
                </div>
            </div>
            
            {/* Print Action */}
            <div className="fixed bottom-8 right-8">
                <Button className="shadow-xl" icon={Printer} size="lg" onClick={() => window.print()}>Print Report</Button>
            </div>
        </div>
    );
};
