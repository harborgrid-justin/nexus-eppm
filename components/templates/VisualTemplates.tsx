
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

export const GanttTimelineTmpl: React.FC = () => {
    const theme = useTheme();
    const [zoomLevel, setZoomLevel] = useState<'Day' | 'Week' | 'Month'>('Week');
    const [filterText, setFilterText] = useState('');

    const mockTasks = [
        { id: 1, name: 'Phase 1: Mobilization', duration: 12, start: 0, level: 0 },
        { id: 2, name: 'Site Secure', duration: 5, start: 0, level: 1 },
        { id: 3, name: 'Equipment Setup', duration: 7, start: 5, level: 1 },
        { id: 4, name: 'Phase 2: Foundation', duration: 20, start: 12, level: 0 },
        { id: 5, name: 'Excavation', duration: 10, start: 12, level: 1 },
        { id: 6, name: 'Rebar Install', duration: 5, start: 22, level: 1 },
        { id: 7, name: 'Pour Concrete', duration: 5, start: 27, level: 1 },
    ];

    return (
        <div className="h-full flex flex-col bg-white overflow-hidden">
             <div className="px-6 pt-6">
                <TemplateHeader number="16" title="Gantt Timeline" subtitle="Interactive schedule waterfall" />
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
                            <div key={t.id} className={`flex items-center h-10 border-b border-slate-100 hover:bg-nexus-50/30 text-sm px-4 gap-2 cursor-pointer group ${t.level === 0 ? 'bg-slate-50' : ''}`} style={{ paddingLeft: `${16 + t.level * 16}px`}}>
                                {t.level === 0 ? <ChevronRight size={14} className="text-slate-400"/> : <div className="w-[14px]"></div>}
                                <span className={`flex-1 truncate ${t.level === 0 ? 'font-bold text-slate-800' : 'text-slate-600 font-medium'}`}>
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
                                        t.level === 0 ? 'bg-slate-800' : 'bg-blue-500'
                                    }`}
                                    style={{ 
                                        width: `${t.duration * 10}px`, 
                                        marginLeft: `${t.start * 10}px` 
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

// ... (Rest of file unchanged: mockRoadmapData, StrategicRoadmapTmpl, TemplatePlaceholder, etc.)
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
                <div className="flex h-12 border-b border-slate-200 bg-slate-100/50 sticky top-0 z-40">
                    <div className="w-64 border-r border-slate-200 p-3 font-black text-slate-500 text-[10px] uppercase tracking-widest flex items-center bg-slate-50">Work Stream</div>
                    <div className="flex-1 flex text-center items-center relative">
                        {timelineHeaders.map((q, i) => (
                            <div key={q} className="flex-1 border-r border-slate-200 h-full flex items-center justify-center text-sm font-bold text-slate-700">{q}</div>
                        ))}
                        <div className="absolute top-0 bottom-0 border-l-2 border-dashed border-red-500 z-30" style={{ left: `${todayPosition}%` }}>
                            <div className="absolute -top-2 -translate-x-1/2 text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full shadow">TODAY</div>
                        </div>
                    </div>
                </div>
                
                <div className="flex-1 flex flex-col divide-y divide-slate-200 bg-slate-50/30">
                    {mockRoadmapData.filter(l => !hiddenLanes.includes(l.id)).map(lane => (
                        <div key={lane.id} className="flex-1 flex min-h-[160px]">
                            <div className="w-64 border-r border-slate-200 p-4 bg-white">
                                <h4 className="font-bold text-slate-900 text-sm">{lane.title}</h4>
                                <p className="text-xs text-slate-500 mt-1 font-medium uppercase tracking-wide">{lane.owner}</p>
                            </div>
                            <div className="flex-1 relative p-4">
                                <div className="absolute inset-0 flex pointer-events-none">
                                    {timelineHeaders.map((_, i) => <div key={i} className="flex-1 border-r border-dashed border-slate-200/70"></div>)}
                                </div>
                                <div className="absolute top-0 bottom-0 border-l-2 border-dashed border-red-500/50 z-0" style={{ left: `${todayPosition}%` }}></div>

                                {lane.items.map(item => (
                                    <div 
                                        key={item.id} 
                                        className={`absolute h-8 rounded-lg shadow-md border flex items-center px-3 text-white text-xs font-bold cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl hover:z-30 group ${getItemColor(item.type)}`}
                                        style={{ left: `${getPosition(item.start)}%`, width: `${getWidth(item.start, item.end)}%`, top: item.type === 'product' ? '24px' : '72px' }}
                                    >
                                        <span className="truncate">{item.name}</span>
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

const TemplatePlaceholder: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex items-center justify-center h-full bg-slate-50 text-slate-400">
        <div className="text-center">
            <h3 className="font-bold text-slate-600">{title}</h3>
            <p className="text-xs">Component not implemented.</p>
        </div>
    </div>
);

export const NetworkDiagramTmpl: React.FC = () => <TemplatePlaceholder title="Network Diagram"/>;
export const GeospatialMapTmpl: React.FC = () => <TemplatePlaceholder title="Geospatial Map"/>;
export const AnalyticsReportTmpl: React.FC = () => <TemplatePlaceholder title="Analytics Report"/>;
