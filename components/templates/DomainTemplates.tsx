
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { AlertTriangle, FileText, Download, Calendar as CalIcon, ChevronLeft, ChevronRight, MessageSquare, Send, Search, User, Plus } from 'lucide-react';
import { Badge } from '../ui/Badge';

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
 * 21. Risk Matrix View
 * Specialized 5x5 Grid Layout
 */
export const RiskMatrixTmpl: React.FC = () => {
    const theme = useTheme();
    const [selectedRisk, setSelectedRisk] = useState<string | null>(null);

    const handleRiskClick = (riskId: string) => {
        setSelectedRisk(riskId === selectedRisk ? null : riskId);
    };

    return (
        <div className={`h-full p-8 overflow-auto flex flex-col items-center ${theme.colors.background}`}>
            <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-8">
                    <h2 className={theme.typography.h2}>Enterprise Risk Heatmap</h2>
                    <div className="flex gap-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded"></div> Critical</span>
                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-400 rounded"></div> Major</span>
                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-400 rounded"></div> Low</span>
                    </div>
                </div>
                
                <div className="flex gap-4 justify-center">
                    <div className="flex flex-col justify-center items-center">
                        <span className="font-bold text-slate-400 uppercase tracking-[0.2em] -rotate-90 whitespace-nowrap">Probability</span>
                    </div>
                    <div>
                        <div className="grid grid-cols-5 gap-1.5 mb-2">
                            {[5,4,3,2,1].map(row => 
                                [1,2,3,4,5].map(col => {
                                    const score = row * col;
                                    const color = score >= 15 ? 'bg-red-500' : score >= 8 ? 'bg-yellow-400' : 'bg-green-400';
                                    const hasRisk = score === 25 || score === 12;
                                    
                                    return (
                                        <div 
                                            key={`${row}-${col}`} 
                                            onClick={() => hasRisk && handleRiskClick(`${row}-${col}`)}
                                            className={`w-28 h-28 ${color} rounded-lg bg-opacity-90 hover:bg-opacity-100 hover:scale-105 transition-all relative cursor-pointer group shadow-sm flex items-center justify-center`}
                                        >
                                            <span className="absolute top-2 right-2 text-[10px] font-black text-white/50">{score}</span>
                                            {/* Mock Content */}
                                            {hasRisk && (
                                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-xs text-slate-800 shadow-md transform group-hover:-translate-y-1 transition-transform">
                                                    {score === 25 ? '3' : '1'}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })
                            )}
                        </div>
                        <div className="text-center font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Impact</div>
                    </div>
                </div>
                
                {selectedRisk && (
                    <div className="mt-8 p-4 border border-slate-200 rounded-xl bg-slate-50 animate-in slide-in-from-top-2">
                         <h4 className="font-bold text-slate-800 mb-2">Risks in Selected Zone</h4>
                         <ul className="space-y-2 text-sm">
                             <li className="flex justify-between bg-white p-3 rounded border border-slate-200">
                                 <span>Supply Chain Failure</span>
                                 <Badge variant="danger">Critical</Badge>
                             </li>
                         </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * 22. Document Viewer
 * Preview Pane + Sidebar Metadata
 */
export const DocumentViewerTmpl: React.FC = () => {
    const theme = useTheme();
    const [page, setPage] = useState(1);
    
    return (
        <div className="h-full flex bg-slate-900 overflow-hidden">
            {/* Viewer Canvas */}
            <div className="flex-1 flex items-center justify-center p-8 bg-black/20 backdrop-blur-sm relative">
                <div className="bg-white w-full max-w-3xl aspect-[8.5/11] shadow-2xl flex flex-col items-center justify-center text-slate-300 animate-in zoom-in-95 duration-300 relative">
                    <FileText size={80} className="mb-4 text-slate-200"/>
                    <p className="font-medium text-slate-400">PDF Preview - Page {page}</p>
                    <div className="absolute top-4 right-4 text-xs font-mono text-slate-300">CONFIDENTIAL</div>
                </div>
                
                {/* Floating Controls */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-full shadow-lg flex gap-4 text-sm font-bold border border-slate-700 select-none">
                    <button onClick={() => setPage(p => Math.max(1, p-1))} className="hover:text-nexus-400 disabled:opacity-30" disabled={page===1}>Prev</button>
                    <span className="text-slate-500">|</span>
                    <span>Page {page} / 12</span>
                    <span className="text-slate-500">|</span>
                    <button onClick={() => setPage(p => Math.min(12, p+1))} className="hover:text-nexus-400 disabled:opacity-30" disabled={page===12}>Next</button>
                </div>
            </div>

            {/* Meta Sidebar */}
            <div className="w-96 bg-white border-l border-slate-200 flex flex-col shadow-xl z-10">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-start gap-3">
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg"><FileText size={24}/></div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-900 leading-tight">Project_Charter_v2.pdf</h3>
                            <p className="text-xs text-slate-500 mt-1">Updated 2h ago by Mike Ross</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Description</label>
                        <p className="text-sm text-slate-600 leading-relaxed">Signed charter for Phase 1 construction initiation. Includes scope statement and authorized budget limits.</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Version</label>
                            <p className="text-sm font-mono font-bold text-slate-800">2.0 (Draft)</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Size</label>
                            <p className="text-sm font-mono font-bold text-slate-800">4.2 MB</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Tags</label>
                        <div className="flex flex-wrap gap-2">
                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium border border-slate-200">Contract</span>
                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium border border-slate-200">Legal</span>
                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium border border-slate-200">Phase 1</span>
                        </div>
                    </div>
                    
                    <div className="pt-6 border-t border-slate-100">
                        <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Approvals</h4>
                        <div className="flex items-center justify-between text-sm p-2 bg-green-50 text-green-700 rounded border border-green-100">
                            <span className="font-bold">Project Manager</span>
                            <span>Signed ✓</span>
                        </div>
                    </div>
                </div>
                
                <div className="p-6 border-t border-slate-200 bg-slate-50">
                    <Button className="w-full" icon={Download}>Download Original</Button>
                </div>
            </div>
        </div>
    );
};

/**
 * 23. Comparison View
 * Split screen for Baseline vs Actuals
 */
export const ComparisonTmpl: React.FC = () => {
    const theme = useTheme();
    const [mode, setMode] = useState<'Side' | 'Overlay'>('Side');

    return (
        <div className="h-full flex flex-col bg-slate-100">
            <div className="p-4 border-b bg-white flex justify-between items-center gap-8 shadow-sm z-10 sticky top-0">
                <div className="flex items-center gap-8">
                    <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Baseline 1</p>
                        <p className="font-bold text-slate-800">Jan 01, 2024</p>
                    </div>
                    <div className="bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-500">VS</div>
                    <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Forecast</p>
                        <p className="font-bold text-nexus-600">Live Data</p>
                    </div>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button onClick={() => setMode('Side')} className={`px-3 py-1 rounded text-xs font-bold ${mode === 'Side' ? 'bg-white shadow' : 'text-slate-500'}`}>Side-by-Side</button>
                    <button onClick={() => setMode('Overlay')} className={`px-3 py-1 rounded text-xs font-bold ${mode === 'Overlay' ? 'bg-white shadow' : 'text-slate-500'}`}>Overlay</button>
                </div>
            </div>
            
            <div className={`flex-1 flex overflow-hidden p-6 gap-6 ${mode === 'Overlay' ? 'items-center justify-center' : ''}`}>
                {/* Left Card */}
                <div className={`flex-1 flex flex-col transition-all ${mode === 'Overlay' ? 'absolute w-2/3 h-2/3 z-0 translate-x-4 translate-y-4 opacity-50' : ''}`}>
                     <Card className="flex-1 p-0 overflow-hidden border-dashed border-2">
                        <div className="bg-slate-50 p-4 border-b border-slate-200 font-bold text-slate-600 text-sm">Original Plan</div>
                        <div className="p-6 space-y-6">
                            <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                                <span className="text-sm text-slate-500">Total Budget</span>
                                <span className="text-xl font-mono font-bold text-slate-700">$500,000</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                                <span className="text-sm text-slate-500">Finish Date</span>
                                <span className="text-xl font-mono font-bold text-slate-700">Dec 15</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                                <span className="text-sm text-slate-500">Duration</span>
                                <span className="text-xl font-mono font-bold text-slate-700">240 Days</span>
                            </div>
                        </div>
                     </Card>
                </div>

                {/* Right Card */}
                <div className={`flex-1 flex flex-col transition-all ${mode === 'Overlay' ? 'absolute w-2/3 h-2/3 z-10 -translate-x-4 -translate-y-4 shadow-2xl' : ''}`}>
                    <Card className="flex-1 p-0 overflow-hidden border-nexus-200 shadow-md ring-1 ring-nexus-500/10">
                        <div className="bg-nexus-50 p-4 border-b border-nexus-100 font-bold text-nexus-800 text-sm">Current Trajectory</div>
                        <div className="p-6 space-y-6">
                            <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                                <span className="text-sm text-slate-500">Forecast Cost (EAC)</span>
                                <span className="text-xl font-mono font-bold text-red-600">$550,000</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                                <span className="text-sm text-slate-500">Forecast Finish</span>
                                <span className="text-xl font-mono font-bold text-green-600">Dec 10</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                                <span className="text-sm text-slate-500">Remaining Duration</span>
                                <span className="text-xl font-mono font-bold text-slate-800">180 Days</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            
            <div className="p-4 text-center text-xs text-slate-500 italic">
                Delta: <span className="text-red-600 font-bold">+$50k Cost</span>, <span className="text-green-600 font-bold">-5 Days Schedule</span>
            </div>
        </div>
    );
};

/**
 * 24. Calendar Schedule
 * Month/Week View
 */
export const CalendarScheduleTmpl: React.FC = () => {
    const theme = useTheme();
    const [currentMonth, setCurrentMonth] = useState('October');

    return (
        <div className={`h-full flex flex-col ${theme.layout.pagePadding}`}>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className={theme.typography.h2}>Team Availability</h2>
                    <p className="text-sm text-slate-500">Resource allocation and blackout dates.</p>
                </div>
                <div className="flex gap-4 items-center bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                    <Button variant="ghost" size="sm" onClick={() => setCurrentMonth('September')}><ChevronLeft size={16}/></Button>
                    <span className="font-bold text-sm min-w-[120px] text-center">{currentMonth} 2024</span>
                    <Button variant="ghost" size="sm" onClick={() => setCurrentMonth('November')}><ChevronRight size={16}/></Button>
                </div>
            </div>
            
            <Card className="flex-1 overflow-hidden flex flex-col border-slate-300 shadow-md">
                <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 divide-x divide-slate-200">
                    {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                        <div key={d} className="p-3 text-center text-xs font-black text-slate-400 uppercase tracking-widest">{d}</div>
                    ))}
                </div>
                <div className="flex-1 grid grid-cols-7 grid-rows-5 divide-x divide-slate-200 divide-y bg-white">
                    {[...Array(35)].map((_, i) => (
                        <div key={i} className="p-2 relative group hover:bg-slate-50 transition-colors min-h-[100px]">
                            <span className={`text-xs font-bold ${i < 30 ? 'text-slate-700' : 'text-slate-300'}`}>{i < 30 ? i + 1 : i - 29}</span>
                            
                            {/* Mock Events */}
                            {i === 12 && (
                                <div className="mt-2 text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded border border-blue-200 truncate font-medium cursor-pointer hover:bg-blue-200">
                                    Steering Comm
                                </div>
                            )}
                            {i === 14 && (
                                <div className="mt-2 text-[10px] bg-red-100 text-red-700 px-2 py-1 rounded border border-red-200 truncate font-medium cursor-pointer hover:bg-red-200">
                                    Code Freeze
                                </div>
                            )}
                            {(i === 18 || i === 19) && (
                                <div className="mt-2 text-[10px] bg-yellow-50 text-yellow-700 px-2 py-1 rounded border border-yellow-200 truncate font-medium">
                                    Mike: PTO
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

/**
 * 25. Collaboration / Chat
 * Slack-like interface
 */
export const ChatTmpl: React.FC = () => {
    const theme = useTheme();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, user: 'Justin Saadein', time: '10:42 AM', text: 'Has the budget baseline been approved by the steering committee yet?', initial: 'JS', color: 'blue' },
        { id: 2, user: 'Mike Ross', time: '10:45 AM', text: 'Yes, just received the signed minutes. I\'ll upload them to the Document module now.', initial: 'MR', color: 'purple', isMe: true }
    ]);

    const sendMessage = () => {
        if (!input.trim()) return;
        setMessages([...messages, { 
            id: Date.now(), 
            user: 'Mike Ross', 
            time: 'Just now', 
            text: input, 
            initial: 'MR', 
            color: 'purple',
            isMe: true 
        }]);
        setInput('');
    };

    return (
        <div className="h-full flex bg-white border border-slate-200 rounded-xl overflow-hidden m-4 shadow-lg">
            {/* Sidebar */}
            <div className="w-72 bg-slate-50 border-r border-slate-200 flex flex-col">
                <div className="p-4 border-b border-slate-200">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                        <input className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:border-nexus-500" placeholder="Find channel..."/>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-3 space-y-6">
                    <div>
                        <h4 className="px-3 text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Projects</h4>
                        <div className="space-y-1">
                            <div className="px-3 py-2 bg-nexus-100 text-nexus-800 rounded-lg text-sm font-bold cursor-pointer"># project-alpha</div>
                            <div className="px-3 py-2 hover:bg-slate-100 text-slate-600 rounded-lg text-sm font-medium cursor-pointer"># smart-city</div>
                        </div>
                    </div>
                    <div>
                        <h4 className="px-3 text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Direct Messages</h4>
                        <div className="space-y-1">
                            <div className="px-3 py-2 hover:bg-slate-100 text-slate-600 rounded-lg text-sm font-medium cursor-pointer flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div> Jessica Pearson
                            </div>
                            <div className="px-3 py-2 hover:bg-slate-100 text-slate-600 rounded-lg text-sm font-medium cursor-pointer flex items-center gap-2">
                                <div className="w-2 h-2 bg-slate-300 rounded-full"></div> Mike Ross
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center shadow-sm z-10">
                    <div>
                        <h3 className="font-bold text-slate-800"># project-alpha</h3>
                        <p className="text-xs text-slate-500">General discussion for Project Alpha initiative.</p>
                    </div>
                    <div className="flex -space-x-2">
                        {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">U{i}</div>)}
                    </div>
                </div>
                
                <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-slate-50/30">
                    <div className="flex justify-center">
                        <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Today</span>
                    </div>

                    {messages.map(msg => (
                        <div key={msg.id} className={`flex gap-4 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-${msg.color}-700 font-bold shrink-0 bg-${msg.color}-100`}>
                                {msg.initial}
                            </div>
                            <div className={`${msg.isMe ? 'text-right' : ''}`}>
                                <div className={`flex items-baseline gap-2 ${msg.isMe ? 'justify-end' : ''}`}>
                                    <span className="text-sm font-bold text-slate-900">{msg.user}</span>
                                    <span className="text-[10px] text-slate-400">{msg.time}</span>
                                </div>
                                <div className={`text-sm p-3 rounded-2xl shadow-sm border border-slate-100 mt-1 ${msg.isMe ? 'bg-nexus-600 text-white rounded-tr-none text-left' : 'bg-white text-slate-700 rounded-tl-none'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="p-4 bg-white border-t border-slate-200">
                    <div className="flex gap-2">
                        <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"><Plus size={20}/></button>
                        <Input 
                            value={input} 
                            onChange={e => setInput(e.target.value)} 
                            onKeyDown={e => e.key === 'Enter' && sendMessage()}
                            placeholder="Message #project-alpha..." 
                            className="border-slate-200 bg-slate-50 focus:bg-white" 
                        />
                        <Button icon={Send} onClick={sendMessage}></Button>
                    </div>
                </div>
            </div>
        </div>
    );
};