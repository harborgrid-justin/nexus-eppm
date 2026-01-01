
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import { ChartPlaceholder } from '../charts/ChartPlaceholder';
import { Calendar, Map, Share2, Printer, Filter, ZoomIn, ZoomOut, Maximize2, MoreHorizontal, Layers, ChevronRight, Download, Link, AlertTriangle, Diamond, CalendarDays, Check } from 'lucide-react';
import { Button } from '../ui/Button';

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

/**
 * 16. Gantt Chart View
 */
export const GanttTimelineTmpl: React.FC = () => {
    const theme = useTheme();
    const [zoomLevel, setZoomLevel] = useState<'Day' | 'Week' | 'Month'>('Week');
    const [filterText, setFilterText] = useState('');

    const tasks = [1, 2, 3, 4, 5, 6, 7];

    return (
        <div className="h-full flex flex-col bg-white overflow-hidden">
             <div className="px-6 pt-6">
                <TemplateHeader number="16" title="Gantt Timeline" subtitle="Interactive schedule waterfall" />
             </div>

            {/* Toolbar */}
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
                {/* Task List */}
                <div className="w-96 border-r border-slate-200 bg-white flex flex-col flex-shrink-0 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.1)] z-10">
                    <div className="h-10 border-b border-slate-200 bg-slate-50 flex items-center px-4">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">WBS Hierarchy</span>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {tasks.map(i => (
                            <div key={i} className={`flex items-center h-10 border-b border-slate-100 hover:bg-nexus-50/30 text-sm px-4 gap-2 cursor-pointer group ${i % 3 === 0 ? 'bg-slate-50' : ''}`}>
                                <ChevronRight size={14} className="text-slate-400"/>
                                <span className={`flex-1 truncate ${i % 3 === 0 ? 'font-bold text-slate-800' : 'text-slate-600 font-medium'}`}>
                                    {i % 3 === 0 ? `Phase ${i}` : `Task Item ${i}.0`}
                                </span>
                                <span className="text-xs text-slate-400 font-mono">12d</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Timeline Canvas */}
                <div className="flex-1 bg-slate-50/50 relative overflow-auto flex flex-col">
                    {/* Time Header */}
                    <div className="h-10 bg-white border-b border-slate-200 sticky top-0 flex items-end shadow-sm z-10">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="flex-1 border-r border-slate-200 text-center pb-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                {zoomLevel} {i + 1}
                            </div>
                        ))}
                    </div>
                    
                    {/* Grid */}
                    <div className="flex-1 relative min-h-[500px]">
                        {/* Grid Lines */}
                        <div className="absolute inset-0 flex pointer-events-none">
                             {[...Array(12)].map((_, i) => (
                                <div key={i} className="flex-1 border-r border-slate-200/50 h-full"></div>
                             ))}
                        </div>

                        {/* Bars */}
                        {tasks.map((_, i) => (
                            <div key={i} className="h-10 flex items-center relative px-2 border-b border-slate-100/50">
                                <div 
                                    className={`h-5 rounded shadow-sm border border-white/20 relative group cursor-pointer transition-all hover:shadow-md hover:-translate-y-px ${
                                        i % 3 === 0 ? 'bg-slate-800' : i === 2 ? 'bg-red-500' : 'bg-blue-500'
                                    }`}
                                    style={{ 
                                        width: `${Math.random() * 200 + 50}px`, 
                                        marginLeft: `${i * 30}px` 
                                    }}
                                >
                                    <div className="absolute top-0 bottom-0 left-0 bg-black/10 w-[60%] rounded-l"></div>
                                    <span className="absolute left-full ml-2 text-xs font-bold text-slate-600 opacity-0 group-hover:opacity-100 whitespace-nowrap bg-white px-2 py-0.5 rounded shadow-sm border border-slate-200 z-20">Jan 12 - Feb 01</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * 17. Strategic Roadmap
 */
const mockRoadmapData = [
    {
        id: 'lane1', title: 'Market Expansion', owner: 'Sales & Marketing',
        items: [
            { id: 'item1', name: 'APAC Launch Campaign', start: '2024-02-15', end: '2024-05-30', type: 'product', status: 'On Track', owner: 'J. Doe' },
            { id: 'item2', name: 'LATAM Market Research', start: '2024-01-10', end: '2024-03-20', type: 'strategic', status: 'Complete', owner: 'S. Smith' },
            { id: 'item3', name: 'EU Partnership Finalized', start: '2024-07-01', end: '2024-09-15', type: 'strategic', status: 'At Risk', owner: 'A. Wong' },
        ],
        milestones: [ { id: 'm1', name: 'Go/No-Go Decision', date: '2024-04-01', type: 'decision' } ]
    },
    {
        id: 'lane2', title: 'Operational Efficiency', owner: 'Operations',
        items: [
            { id: 'item4', name: 'Automated Reporting System', start: '2024-03-01', end: '2024-08-30', type: 'platform', status: 'On Track', owner: 'M. Ross' },
            { id: 'item5', name: 'Warehouse Logistics Upgrade', start: '2024-09-01', end: '2024-12-20', type: 'platform', status: 'Planned', owner: 'L. Litt' },
        ],
        milestones: [ { id: 'm2', name: 'System Go-Live', date: '2024-08-25', type: 'release' } ]
    },
    {
        id: 'lane3', title: 'Digital Transformation', owner: 'IT & Engineering',
        items: [
            { id: 'item6', name: 'Cloud Migration Phase 2', start: '2024-05-10', end: '2024-11-15', type: 'tech', status: 'On Track', owner: 'C. Build' },
            { id: 'item7', name: 'Mobile App Rearchitecture', start: '2024-01-20', end: '2024-06-10', type: 'product', status: 'Complete', owner: 'D. Staff' },
        ],
        milestones: []
    }
];

const ROADMAP_START = new Date('2024-01-01');
const ROADMAP_END = new Date('2024-12-31');
const TOTAL_DAYS = (ROADMAP_END.getTime() - ROADMAP_START.getTime()) / (1000 * 60 * 60 * 24);

const getPosition = (dateStr: string) => {
    const date = new Date(dateStr);
    const diff = (date.getTime() - ROADMAP_START.getTime()) / (1000 * 60 * 60 * 24);
    return (diff / TOTAL_DAYS) * 100;
};
const getWidth = (startStr: string, endStr: string) => {
    const start = new Date(startStr);
    const end = new Date(endStr);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return (diff / TOTAL_DAYS) * 100;
};
const getItemColor = (type: string) => {
    switch (type) {
        case 'product': return 'bg-nexus-600 border-nexus-700';
        case 'strategic': return 'bg-emerald-600 border-emerald-700';
        case 'platform': return 'bg-purple-600 border-purple-700';
        case 'tech': return 'bg-slate-700 border-slate-800';
        default: return 'bg-slate-500 border-slate-600';
    }
};

export const StrategicRoadmapTmpl: React.FC = () => {
    const theme = useTheme();
    const [hiddenLanes, setHiddenLanes] = useState<string[]>([]);
    const [timescale, setTimescale] = useState<'Quarters' | 'Months'>('Quarters');
    const [todayPosition, setTodayPosition] = useState(0);

    useEffect(() => {
        setTodayPosition(getPosition(new Date().toISOString()));
    }, []);

    const toggleLane = (laneId: string) => {
        // FIX: 'lId' is not defined. Use 'laneId' from the function parameter instead.
        setHiddenLanes(prev => prev.includes(laneId) ? prev.filter(l => l !== laneId) : [...prev, laneId]);
    };
    
    const timelineHeaders = timescale === 'Quarters' 
        ? ['Q1', 'Q2', 'Q3', 'Q4']
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div className={`h-full overflow-hidden flex flex-col ${theme.layout.pagePadding} bg-slate-50`}>
            <div className="flex justify-between items-start mb-6">
                 <TemplateHeader number="17" title="Strategic Roadmap" subtitle="FY2024 Long-Range Initiative Plan" />
                <div className="flex items-center gap-4">
                    <div className="flex bg-white border border-slate-300 rounded-lg p-1 shadow-sm">
                        {['Quarters', 'Months'].map(t => (
                            <button key={t} onClick={() => setTimescale(t as any)} className={`px-4 py-1 text-xs font-bold rounded transition-colors ${timescale === t ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{t}</button>
                        ))}
                    </div>
                    <Button variant="outline" size="sm" icon={CalendarDays}>Today</Button>
                    <div className="relative group">
                        <Button size="sm" variant="outline" icon={Filter}>Lanes ({mockRoadmapData.length - hiddenLanes.length})</Button>
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 shadow-xl rounded-lg p-2 hidden group-hover:block z-50">
                            {mockRoadmapData.map(l => (
                                <label key={l.id} className="flex items-center gap-3 p-2.5 hover:bg-slate-100 rounded-md cursor-pointer text-sm">
                                    <input type="checkbox" checked={!hiddenLanes.includes(l.id)} onChange={() => toggleLane(l.id)} className="w-4 h-4 rounded text-nexus-600 focus:ring-nexus-500"/>
                                    <span className="font-medium text-slate-800">{l.title}</span>
                                    {!hiddenLanes.includes(l.id) && <Check size={14} className="ml-auto text-nexus-500"/>}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-auto scrollbar-thin rounded-xl shadow-lg border border-slate-200">
              <div className="min-w-[1200px] flex flex-col bg-white">
                {/* Timeline Header */}
                <div className="flex h-12 border-b border-slate-200 bg-slate-100/50 sticky top-0 z-40">
                    <div className="w-64 border-r border-slate-200 p-3 font-black text-slate-500 text-[10px] uppercase tracking-widest flex items-center bg-slate-50">Work Stream</div>
                    <div className="flex-1 flex text-center items-center relative">
                        {timelineHeaders.map((q, i) => (
                            <div key={q} className="flex-1 border-r border-slate-200 h-full flex items-center justify-center text-sm font-bold text-slate-700">{q}</div>
                        ))}
                        {/* Today Marker Line (in header) */}
                        <div className="absolute top-0 bottom-0 border-l-2 border-dashed border-red-500 z-30" style={{ left: `${todayPosition}%` }}>
                            <div className="absolute -top-2 -translate-x-1/2 text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full shadow">TODAY</div>
                        </div>
                    </div>
                </div>
                
                {/* Swimlanes */}
                <div className="flex-1 flex flex-col divide-y divide-slate-200 bg-slate-50/30">
                    {mockRoadmapData.filter(l => !hiddenLanes.includes(l.id)).map(lane => (
                        <div key={lane.id} className="flex-1 flex min-h-[160px]">
                            <div className="w-64 border-r border-slate-200 p-4 bg-white">
                                <h4 className="font-bold text-slate-900 text-sm">{lane.title}</h4>
                                <p className="text-xs text-slate-500 mt-1 font-medium uppercase tracking-wide">{lane.owner}</p>
                            </div>
                            <div className="flex-1 relative p-4">
                                {/* Vertical Grid Lines */}
                                <div className="absolute inset-0 flex pointer-events-none">
                                    {timelineHeaders.map((_, i) => <div key={i} className="flex-1 border-r border-dashed border-slate-200/70"></div>)}
                                </div>
                                {/* Today Marker Line (in body) */}
                                <div className="absolute top-0 bottom-0 border-l-2 border-dashed border-red-500/50 z-0" style={{ left: `${todayPosition}%` }}></div>

                                {/* Roadmap Items */}
                                {lane.items.map(item => (
                                    <div 
                                        key={item.id} 
                                        className={`absolute h-8 rounded-lg shadow-md border flex items-center px-3 text-white text-xs font-bold cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl hover:z-30 group ${getItemColor(item.type)}`}
                                        style={{ left: `${getPosition(item.start)}%`, width: `${getWidth(item.start, item.end)}%`, top: item.type === 'product' ? '24px' : '72px' }}
                                    >
                                        <span className="truncate">{item.name}</span>
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-900 text-white text-xs p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                                            <h5 className="font-black text-sm mb-2">{item.name}</h5>
                                            <p className="font-normal normal-case"><strong className="text-slate-400">Dates:</strong> {item.start} to {item.end}</p>
                                            <p className="font-normal normal-case"><strong className="text-slate-400">Owner:</strong> {item.owner}</p>
                                            <p className="font-normal normal-case flex items-center gap-2"><strong className="text-slate-400">Status:</strong> 
                                                <span className={`w-2 h-2 rounded-full ${item.status === 'Complete' ? 'bg-green-400' : item.status === 'At Risk' ? 'bg-red-400' : 'bg-blue-400'}`}></span>
                                                {item.status}
                                            </p>
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900"></div>
                                        </div>
                                    </div>
                                ))}
                                
                                {/* Milestones */}
                                {lane.milestones.map(m => (
                                    <div 
                                        key={m.id}
                                        className="absolute -top-1.5 z-20 group"
                                        style={{ left: `${getPosition(m.date)}%` }}
                                    >
                                        <Diamond className="text-purple-600 fill-white" />
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-purple-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                                            {m.name} ({m.date})
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-purple-900"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
              </div>
            </div>
        </div>
    );
};

/**
 * 18. Network Diagram
 */
export const NetworkDiagramTmpl: React.FC = () => {
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
    };
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setOffset(prev => ({ x: prev.x + e.movementX, y: prev.y + e.movementY }));
        }
    };

    return (
        <div 
            className="h-full bg-slate-900 relative overflow-hidden flex flex-col cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUp}
        >
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-20" style={{ backgroundPosition: `${offset.x}px ${offset.y}px` }}></div>
            
            <div className="p-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur z-20 flex justify-between items-center text-white pointer-events-none">
                <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-nexus-600 text-white flex items-center justify-center font-mono text-lg font-bold shadow-lg shadow-nexus-500/20">18</div>
                     <h3 className="font-bold flex items-center gap-2 text-xl tracking-tight">Logic Network</h3>
                </div>
                <div className="flex gap-4 text-xs font-mono text-slate-400 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 pointer-events-auto">
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div> Critical Path</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-slate-500 rounded-full"></div> Non-Critical</span>
                </div>
            </div>

            <div className="flex-1 relative flex items-center justify-center overflow-visible p-20 pointer-events-none">
                <div className="flex gap-20 items-center transform scale-100" style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}>
                    {/* Node 1 */}
                    <div className="w-48 bg-slate-800 border-2 border-slate-600 rounded-lg shadow-2xl relative group hover:border-nexus-500 transition-colors pointer-events-auto cursor-pointer">
                        <div className="h-1.5 w-full bg-slate-600 rounded-t-sm group-hover:bg-nexus-500 transition-colors"></div>
                        <div className="p-4">
                             <div className="text-xs text-slate-400 font-mono mb-1 font-bold">TASK-101</div>
                             <div className="text-sm font-bold text-white mb-3">Requirements</div>
                             <div className="flex justify-between text-[10px] text-slate-500 font-mono border-t border-slate-700 pt-2">
                                 <span>Dur: 10d</span>
                                 <span>Float: 0</span>
                             </div>
                        </div>
                        {/* Port */}
                        <div className="absolute right-[-6px] top-1/2 w-3 h-3 bg-slate-400 rounded-full border-2 border-slate-900 group-hover:bg-nexus-500 transition-colors"></div>
                    </div>

                    {/* Arrow */}
                    <div className="w-20 h-0.5 bg-slate-600 relative">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-slate-600 transform rotate-45"></div>
                    </div>

                    {/* Node 2 */}
                    <div className="w-48 bg-slate-800 border-2 border-red-500 rounded-lg shadow-[0_0_20px_rgba(239,68,68,0.2)] relative group hover:scale-105 transition-transform pointer-events-auto cursor-pointer">
                        <div className="h-1.5 w-full bg-red-500 rounded-t-sm"></div>
                        <div className="p-4">
                             <div className="text-xs text-red-400 font-mono mb-1 font-bold">TASK-102</div>
                             <div className="text-sm font-bold text-white mb-3">Design Phase</div>
                             <div className="flex justify-between text-[10px] text-slate-500 font-mono border-t border-slate-700 pt-2">
                                 <span>Dur: 25d</span>
                                 <span className="text-red-400 font-bold">Float: 0</span>
                             </div>
                        </div>
                         <div className="absolute left-[-6px] top-1/2 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900"></div>
                    </div>
                </div>
            </div>
            
            <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20 pointer-events-auto">
                <button className="p-3 bg-slate-800 border border-slate-700 text-white rounded-xl hover:bg-slate-700 shadow-xl transition-all hover:scale-105"><Maximize2 size={20}/></button>
            </div>
        </div>
    );
};

/**
 * 19. Geospatial Map View
 */
export const GeospatialMapTmpl: React.FC = () => {
    const [selectedPin, setSelectedPin] = useState<string | null>(null);
    const theme = useTheme();

    return (
        <div className="h-full relative bg-slate-200 overflow-hidden">
            {/* Mock Map Background */}
            <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover opacity-10 mix-blend-multiply"></div>
            
            {/* Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                <div className="bg-white p-1 rounded-xl shadow-xl border border-slate-200">
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"><ZoomIn size={20}/></button>
                    <div className="h-px bg-slate-200 my-0.5"></div>
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"><ZoomOut size={20}/></button>
                </div>
                <div className="bg-white p-2 rounded-xl shadow-xl border border-slate-200 cursor-pointer hover:bg-slate-50 text-nexus-600">
                    <Layers size={20}/>
                </div>
            </div>

            {/* Overlay Sidebar */}
            <div className="absolute top-4 left-4 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/40 z-10 flex flex-col max-h-[calc(100%-2rem)] overflow-hidden animate-in slide-in-from-left-4 duration-300">
                <div className={`p-5 border-b ${theme.colors.border}`}>
                     <TemplateHeader number="19" title="Asset Map" />
                    <p className="text-xs text-slate-500 font-medium">Live Telemetry Feed • 4 Active Sites</p>
                </div>
                <div className="p-3 bg-slate-50 border-b border-slate-200">
                    <input className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-nexus-500" placeholder="Search locations..."/>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {[
                        { id: '1', name: 'North America HQ', status: 'Active', color: 'bg-green-500' },
                        { id: '2', name: 'London Data Center', status: 'Warning', color: 'bg-yellow-500' },
                        { id: '3', name: 'Singapore Hub', status: 'Active', color: 'bg-green-500' },
                        { id: '4', name: 'Berlin Logistics', status: 'Maintenance', color: 'bg-slate-400' },
                    ].map((loc, i) => (
                        <div 
                            key={loc.id} 
                            onClick={() => setSelectedPin(loc.id)}
                            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border group ${selectedPin === loc.id ? 'bg-nexus-50 border-nexus-200' : 'hover:bg-slate-50 border-transparent hover:border-slate-200'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${loc.color} shadow-sm ring-2 ring-white`}></div>
                                <span className="text-sm font-bold text-slate-700 group-hover:text-nexus-700">{loc.name}</span>
                            </div>
                            <ChevronRight size={14} className="text-slate-300 group-hover:text-nexus-500"/>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pins */}
            <div 
                className="absolute top-[35%] left-[25%] group cursor-pointer"
                onClick={() => setSelectedPin(selectedPin === '1' ? null : '1')}
            >
                 <div className={`w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-xl ${selectedPin === '1' ? 'scale-125' : 'animate-pulse'}`}></div>
                 {(selectedPin === '1') && (
                     <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl z-20">
                         NA HQ: Operating Normal
                         <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                     </div>
                 )}
            </div>
        </div>
    );
};

/**
 * 20. Analytics Report
 */
export const AnalyticsReportTmpl: React.FC = () => {
    const theme = useTheme();
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="h-full overflow-y-auto bg-slate-200 p-8 flex justify-center">
            {/* A4 Page Container */}
            <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl p-12 flex flex-col relative animate-in fade-in slide-in-from-bottom-4 duration-500 ring-1 ring-slate-900/5 print:w-full print:shadow-none print:m-0">
                
                {/* Header */}
                <div className="flex justify-between items-end border-b-4 border-slate-900 pb-6 mb-10">
                    <div>
                         <div className="flex items-center gap-4 mb-4">
                             <div className="w-12 h-12 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-xl">20</div>
                             <div className="text-nexus-600 font-black text-3xl tracking-tight">NEXUS PPM</div>
                         </div>
                        <h1 className="text-4xl font-light text-slate-900 tracking-tight">Monthly Performance Report</h1>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold text-slate-800">October 2024</p>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Confidential</p>
                    </div>
                </div>

                {/* Executive Summary */}
                <div className="mb-12">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">01. Executive Summary</h4>
                    <p className="text-sm leading-relaxed text-slate-700 text-justify columns-2 gap-12 font-serif">
                        The portfolio is currently tracking green with a CPI of 1.02, indicating high cost efficiency across the primary workstreams. 
                        However, schedule performance (SPI) has dipped slightly to 0.98 due to supply chain delays in the EMEA region. 
                        Key risks in the supply chain sector have been mitigated via early procurement release, reducing exposure by $2.5M. 
                        Recommendation to release $2M from management reserve for Phase 2 acceleration to recover schedule float before Q4.
                        Stakeholder engagement remains high, with 95% of monthly governance decisions executed within 5 business days.
                    </p>
                </div>

                {/* Key Metrics */}
                <div className="mb-12">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">02. Key Performance Indicators</h4>
                    <div className={`grid grid-cols-4 ${theme.layout.gridGap}`}>
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center">
                            <p className="text-[10px] text-slate-500 font-black uppercase mb-2 tracking-widest">Portfolio Value</p>
                            <p className="text-3xl font-black text-slate-900 tracking-tight">$142M</p>
                        </div>
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center">
                            <p className="text-[10px] text-slate-500 font-black uppercase mb-2 tracking-widest">Earned Value</p>
                            <p className="text-3xl font-black text-green-600 tracking-tight">$85M</p>
                        </div>
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center">
                            <p className="text-[10px] text-slate-500 font-black uppercase mb-2 tracking-widest">Cost Variance</p>
                            <p className="text-3xl font-black text-green-600 tracking-tight">+$1.2M</p>
                        </div>
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center">
                            <p className="text-[10px] text-slate-500 font-black uppercase mb-2 tracking-widest">Active Risks</p>
                            <p className="text-3xl font-black text-red-500 tracking-tight">3</p>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className={`grid grid-cols-2 ${theme.layout.gridGap} mb-10 flex-1`}>
                    <div className={`border ${theme.colors.border} rounded-xl p-6 flex flex-col`}>
                        <h5 className="font-bold text-slate-700 text-sm mb-4 text-center uppercase tracking-wide">Cost Variance Trend (6 Mo)</h5>
                        <div className="flex-1 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300">
                           <ChartPlaceholder height={180} message="Trend Line Visualization"/>
                        </div>
                    </div>
                    <div className={`border ${theme.colors.border} rounded-xl p-6 flex flex-col`}>
                        <h5 className="font-bold text-slate-700 text-sm mb-4 text-center uppercase tracking-wide">Resource Utilization</h5>
                        <div className="flex-1 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300">
                           <ChartPlaceholder height={180} message="Heatmap Visualization"/>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-auto pt-6 border-t border-slate-200 flex justify-between text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                    <span>Nexus PPM Enterprise</span>
                    <span>Generated: {new Date().toLocaleDateString()}</span>
                    <span>Page 1 of 1</span>
                </div>
            </div>
            
            {/* Floating Action */}
            <button 
                onClick={handlePrint}
                className="fixed bottom-8 right-8 bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:bg-nexus-600 transition-all z-50 print:hidden"
            >
                <Printer size={24}/>
            </button>
        </div>
    );
};
