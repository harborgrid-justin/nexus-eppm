
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BarChart3, Activity, PieChart as PieIcon, TrendingUp, Target, Grid } from 'lucide-react';
import { 
  AreaChart, Area, ResponsiveContainer, PieChart, Pie, Cell, 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  ComposedChart, ScatterChart, Scatter, Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Treemap, ReferenceLine
} from 'recharts';
import { SectionHeading, DemoContainer, ComponentLabel } from './DesignHelpers';

const DATA_SMALL = [
  { n: '1', v: 10, v2: 20 }, { n: '2', v: 15, v2: 18 }, { n: '3', v: 8, v2: 25 },
  { n: '4', v: 22, v2: 15 }, { n: '5', v: 18, v2: 30 }, { n: '6', v: 35, v2: 20 },
  { n: '7', v: 30, v2: 40 }
];

const DATA_NEG = [
  { n: '1', v: 10 }, { n: '2', v: -5 }, { n: '3', v: 15 },
  { n: '4', v: -10 }, { n: '5', v: 20 }, { n: '6', v: 5 }
];

const DATA_PIE = [
  { name: 'A', value: 400 }, { name: 'B', value: 300 },
  { name: 'C', value: 300 }, { name: 'D', value: 200 }
];

const DATA_RADAR = [
  { subject: 'Math', A: 120, fullMark: 150 },
  { subject: 'Chinese', A: 98, fullMark: 150 },
  { subject: 'English', A: 86, fullMark: 150 },
  { subject: 'Geography', A: 99, fullMark: 150 },
  { subject: 'Physics', A: 85, fullMark: 150 },
  { subject: 'History', A: 65, fullMark: 150 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const DesignVisualizations = () => {
  const theme = useTheme();

  return (
    <div className="space-y-12 animate-fade-in pb-20">
        
        {/* --- MICRO CHARTS & SPARKLINES --- */}
        <SectionHeading title="Micro Charts & Sparklines" icon={Activity} count="VZ-01 to VZ-12" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <DemoContainer>
                <ComponentLabel id="VZ-01" name="Area Spark (Blue)" />
                <div className="h-12 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={DATA_SMALL}>
                            <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} fill="#dbeafe" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="VZ-02" name="Line Spark (Green)" />
                <div className="h-12 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={DATA_SMALL}>
                            <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="VZ-03" name="Line Spark (Red)" />
                <div className="h-12 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={DATA_SMALL}>
                            <Line type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="VZ-04" name="Bar Spark (Sm)" />
                <div className="h-12 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={DATA_SMALL}>
                            <Bar dataKey="v" fill="#64748b" radius={[2,2,0,0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="VZ-05" name="Win/Loss" />
                <div className="h-12 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={DATA_NEG}>
                            <ReferenceLine y={0} stroke="#cbd5e1" />
                            <Bar dataKey="v" fill="#3b82f6">
                                {DATA_NEG.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.v > 0 ? '#10b981' : '#ef4444'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="VZ-06" name="Step Line" />
                <div className="h-12 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={DATA_SMALL}>
                            <Line type="step" dataKey="v" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="VZ-07" name="Comparison Line" />
                <div className="h-12 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={DATA_SMALL}>
                            <Line type="monotone" dataKey="v" stroke="#94a3b8" strokeWidth={1} dot={false} />
                            <Line type="monotone" dataKey="v2" stroke="#3b82f6" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </DemoContainer>

             <DemoContainer>
                <ComponentLabel id="VZ-08" name="Stacked Bar Spark" />
                <div className="h-12 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={DATA_SMALL}>
                            <Bar dataKey="v" stackId="a" fill="#3b82f6" />
                            <Bar dataKey="v2" stackId="a" fill="#93c5fd" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="VZ-09" name="Scatter Spark" />
                <div className="h-12 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart>
                            <Scatter data={DATA_SMALL} fill="#f59e0b" />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="VZ-10" name="Discrete Dots" />
                <div className="h-12 w-full flex items-end justify-between px-1">
                    {DATA_SMALL.map((d,i) => (
                        <div key={i} className="w-2 rounded-full bg-slate-300" style={{height: `${d.v * 2}%`}}></div>
                    ))}
                </div>
            </DemoContainer>

             <DemoContainer>
                <ComponentLabel id="VZ-11" name="CSS Equalizer" />
                <div className="h-12 w-full flex items-center justify-center gap-1">
                     {[1,2,3,4,5].map(i => (
                         <div key={i} className="w-1.5 bg-blue-500 rounded-sm animate-pulse" style={{height: `${Math.random() * 100}%`, animationDuration: `${0.5 + Math.random()}s`}}></div>
                     ))}
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="VZ-12" name="Trend Pill" />
                <div className="flex items-center justify-center h-12">
                     <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-200">
                        <TrendingUp size={12}/> +12.5%
                     </span>
                </div>
            </DemoContainer>
        </div>

        {/* --- BAR & COLUMN CHARTS --- */}
        <SectionHeading title="Bar & Column Variants" icon={BarChart3} count="VZ-13 to VZ-24" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DemoContainer>
                <ComponentLabel id="VZ-13" name="Standard Column" />
                <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={DATA_SMALL}>
                            <Bar dataKey="v" fill="#3b82f6" radius={[4,4,0,0]} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="VZ-14" name="Grouped Column" />
                <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={DATA_SMALL}>
                            <Bar dataKey="v" fill="#3b82f6" radius={[2,2,0,0]} />
                            <Bar dataKey="v2" fill="#94a3b8" radius={[2,2,0,0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </DemoContainer>

             <DemoContainer>
                <ComponentLabel id="VZ-15" name="Stacked Column" />
                <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={DATA_SMALL}>
                            <Bar dataKey="v" stackId="a" fill="#3b82f6" />
                            <Bar dataKey="v2" stackId="a" fill="#e2e8f0" radius={[4,4,0,0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="VZ-16" name="100% Stacked" />
                <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={DATA_SMALL} stackOffset="expand">
                            <Bar dataKey="v" stackId="a" fill="#8b5cf6" />
                            <Bar dataKey="v2" stackId="a" fill="#f1f5f9" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="VZ-17" name="Horizontal Bar" />
                <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={DATA_SMALL} layout="vertical">
                            <XAxis type="number" hide />
                            <YAxis dataKey="n" type="category" width={20} tickLine={false} axisLine={false} />
                            <Bar dataKey="v" fill="#10b981" radius={[0,4,4,0]} barSize={10} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="VZ-18" name="Bi-Directional Bar" />
                <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={DATA_NEG} layout="vertical">
                            <XAxis type="number" hide />
                            <YAxis dataKey="n" type="category" width={20} tickLine={false} />
                            <ReferenceLine x={0} stroke="#e2e8f0" />
                            <Bar dataKey="v" fill="#3b82f6" barSize={12}>
                                {DATA_NEG.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.v > 0 ? '#3b82f6' : '#ef4444'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="VZ-19" name="Rounded Bar (Full)" />
                <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={DATA_SMALL}>
                            <Bar dataKey="v" fill="#f59e0b" radius={[10,10,10,10]} barSize={8} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </DemoContainer>

             <DemoContainer>
                <ComponentLabel id="VZ-20" name="Pattern Bar" />
                <div className="h-32 w-full">
                     <svg width="0" height="0">
                        <defs>
                            <pattern id="pattern-stripe" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                                <rect width="4" height="8" transform="translate(0,0)" fill="#3b82f6"></rect>
                            </pattern>
                        </defs>
                    </svg>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={DATA_SMALL}>
                            <Bar dataKey="v" fill="url(#pattern-stripe)" radius={[4,4,0,0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </DemoContainer>
            
            <DemoContainer>
                <ComponentLabel id="VZ-21" name="Thin Column" />
                <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={DATA_SMALL}>
                             <Bar dataKey="v" fill="#64748b" barSize={4} radius={[2,2,0,0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="VZ-22" name="Labelled Column" />
                <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={DATA_SMALL}>
                             <Bar dataKey="v" fill="#3b82f6" label={{ position: 'top', fontSize: 10, fill: '#64748b' }} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="VZ-23" name="Background Bar" />
                <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={DATA_SMALL}>
                             <Bar dataKey="v" fill="#10b981" radius={[4,4,4,4]} background={{ fill: '#f1f5f9', radius: 4 }} barSize={10} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </DemoContainer>
            
            <DemoContainer>
                <ComponentLabel id="VZ-24" name="Waterfall (Proxy)" />
                <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                            { n: 'Start', v: [0, 100], c: '#64748b' },
                            { n: 'Add', v: [100, 120], c: '#10b981' },
                            { n: 'Sub', v: [110, 120], c: '#ef4444' },
                            { n: 'End', v: [0, 110], c: '#3b82f6' }
                        ]}>
                             <Bar dataKey="v" fill="#8884d8">
                                {[{c:'#64748b'},{c:'#10b981'},{c:'#ef4444'},{c:'#3b82f6'}].map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.c} />
                                ))}
                             </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </DemoContainer>
        </div>

        {/* --- CIRCULAR & RADIAL --- */}
        <SectionHeading title="Circular & Radial" icon={PieIcon} count="VZ-25 to VZ-32" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             <DemoContainer>
                <ComponentLabel id="VZ-25" name="Simple Pie" />
                <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={DATA_PIE} dataKey="value" cx="50%" cy="50%" outerRadius={50}>
                                {DATA_PIE.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="VZ-26" name="Donut Chart" />
                <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={DATA_PIE} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={2}>
                                {DATA_PIE.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="VZ-27" name="Half Donut" />
                <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={DATA_PIE} dataKey="value" cx="50%" cy="100%" startAngle={180} endAngle={0} innerRadius={30} outerRadius={60}>
                                {DATA_PIE.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="VZ-28" name="Active Slice" />
                <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={DATA_PIE} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={50}>
                                {DATA_PIE.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={index===0 ? theme.colors.surface : 'none'} strokeWidth={index===0 ? 4 : 0} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="VZ-29" name="Radar (Filled)" />
                <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={DATA_RADAR}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" tick={{fontSize: 0}} />
                            <Radar name="Mike" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="VZ-30" name="Radar (Line)" />
                <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={DATA_RADAR}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" tick={{fontSize: 0}} />
                            <Radar name="Mike" dataKey="A" stroke="#ef4444" fill="none" strokeWidth={2} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="VZ-31" name="Radial Bar" />
                <div className="h-32 w-full flex items-center justify-center relative">
                     <svg viewBox="0 0 36 36" className="w-20 h-20 text-blue-500">
                        <path className="text-blue-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                        <path className="text-current" strokeDasharray="75, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                     </svg>
                     <span className="absolute text-xs font-bold text-slate-700">75%</span>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="VZ-32" name="Concentric Rings" />
                <div className="h-32 w-full flex items-center justify-center relative">
                     <div className="relative w-20 h-20">
                         <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
                         <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent -rotate-45"></div>
                         
                         <div className="absolute inset-2 rounded-full border-4 border-green-100"></div>
                         <div className="absolute inset-2 rounded-full border-4 border-green-500 border-l-transparent rotate-90"></div>
                     </div>
                </div>
            </DemoContainer>
        </div>

        {/* --- KPI & STATUS --- */}
        <SectionHeading title="KPI & Status Widgets" icon={Target} count="VZ-33 to VZ-45" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <DemoContainer>
                <ComponentLabel id="VZ-33" name="Bullet Chart (CSS)" />
                <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-500">
                        <span>Revenue</span>
                        <span>$120k / $150k</span>
                    </div>
                    <div className="w-full h-4 bg-slate-200 rounded-sm relative">
                        <div className="absolute top-0 left-0 h-full bg-slate-300 w-[80%]"></div> {/* Qualitative Range */}
                        <div className="absolute top-1 left-0 h-2 bg-slate-800 w-[65%]"></div> {/* Actual */}
                        <div className="absolute top-0 bottom-0 w-1 bg-red-500 left-[75%]"></div> {/* Target */}
                    </div>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="VZ-34" name="Progress Strip" />
                <div className="flex h-4 w-full rounded overflow-hidden">
                    <div className="bg-green-500 flex-1"></div>
                    <div className="bg-green-500 w-1 ml-0.5"></div>
                    <div className="bg-green-500 w-1 ml-0.5"></div>
                    <div className="bg-slate-200 w-1/4 ml-0.5"></div>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="VZ-35" name="Multi-Segment Bar" />
                <div className="w-full h-3 rounded-full flex overflow-hidden">
                    <div className="bg-green-500 w-[40%]"></div>
                    <div className="bg-yellow-400 w-[20%]"></div>
                    <div className="bg-red-500 w-[10%]"></div>
                    <div className="bg-slate-200 flex-1"></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Good</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-400"></div> Fair</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Poor</span>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="VZ-36" name="Traffic Light" />
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-500 shadow-md border-2 border-white ring-1 ring-slate-200"></div>
                    <div className="w-8 h-8 rounded-full bg-yellow-400 opacity-30"></div>
                    <div className="w-8 h-8 rounded-full bg-red-500 opacity-30"></div>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="VZ-37" name="Status Pill Group" />
                <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => (
                        <div key={i} className={`h-2 flex-1 rounded-sm ${i < 4 ? 'bg-blue-500' : 'bg-slate-200'}`}></div>
                    ))}
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="VZ-38" name="Simple Gauge (CSS)" />
                <div className="relative w-32 h-16 overflow-hidden mx-auto">
                    <div className="w-32 h-32 rounded-full border-[12px] border-slate-200 border-b-0 border-l-0 border-r-0 absolute top-0 left-0"></div>
                    <div className="w-32 h-32 rounded-full border-[12px] border-nexus-600 border-b-transparent border-r-transparent absolute top-0 left-0 rotate-45 transform origin-center"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-lg font-bold text-slate-700">75%</div>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="VZ-39" name="Thermometer" />
                <div className="flex items-center gap-3">
                    <div className="h-24 w-4 bg-slate-200 rounded-full relative border border-slate-300">
                        <div className="absolute bottom-0 left-0 right-0 bg-red-500 rounded-b-full w-full h-[70%] rounded-t-sm transition-all"></div>
                    </div>
                    <div className="flex flex-col justify-between h-24 py-1 text-[10px] text-slate-400 font-mono">
                        <span>100</span>
                        <span>50</span>
                        <span>0</span>
                    </div>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="VZ-40" name="Completion Ring" />
                 <div className="flex items-center justify-center">
                     <svg className="w-20 h-20 transform -rotate-90">
                         <circle cx="40" cy="40" r="36" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                         <circle cx="40" cy="40" r="36" stroke="#8b5cf6" strokeWidth="8" fill="transparent" strokeDasharray="226" strokeDashoffset="56" strokeLinecap="round" />
                     </svg>
                     <div className="absolute text-sm font-bold text-purple-700">75%</div>
                 </div>
            </DemoContainer>
        </div>

        {/* --- ADVANCED & HEATMAPS --- */}
        <SectionHeading title="Advanced & Heatmaps" icon={Grid} count="VZ-46 to VZ-53" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <DemoContainer>
                <ComponentLabel id="VZ-46" name="Calendar Heatmap (Github Style)" />
                <div className="flex gap-1 flex-wrap">
                    {[...Array(52)].map((_, i) => {
                        const level = Math.random();
                        let bg = 'bg-slate-100';
                        if (level > 0.8) bg = 'bg-green-700';
                        else if (level > 0.6) bg = 'bg-green-500';
                        else if (level > 0.4) bg = 'bg-green-300';
                        else if (level > 0.2) bg = 'bg-green-100';
                        return <div key={i} className={`w-3 h-3 rounded-sm ${bg}`} title={`Week ${i}`}></div>
                    })}
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="VZ-47" name="Combo Chart" />
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={DATA_SMALL}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} />
                             <XAxis dataKey="n" />
                             <Bar dataKey="v" barSize={20} fill="#cbd5e1" />
                             <Line type="monotone" dataKey="v2" stroke="#ef4444" strokeWidth={2} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="VZ-48" name="Treemap (Flat)" />
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <Treemap data={[{name: 'A', size: 100}, {name: 'B', size: 50}, {name: 'C', size: 50}, {name: 'D', size: 25}]} dataKey="size" aspectRatio={4/3} stroke="#fff" fill="#3b82f6" />
                    </ResponsiveContainer>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="VZ-49" name="Funnel (CSS)" />
                <div className="flex flex-col items-center gap-1 w-full max-w-xs mx-auto">
                    <div className="w-full bg-blue-600 h-8 rounded text-white flex items-center justify-center text-xs font-bold">Leads (1000)</div>
                    <div className="w-[80%] bg-blue-500 h-8 rounded text-white flex items-center justify-center text-xs font-bold">Qualified (800)</div>
                    <div className="w-[60%] bg-blue-400 h-8 rounded text-white flex items-center justify-center text-xs font-bold">Prop (600)</div>
                    <div className="w-[40%] bg-blue-300 h-8 rounded text-white flex items-center justify-center text-xs font-bold">Neg (400)</div>
                    <div className="w-[20%] bg-green-500 h-8 rounded text-white flex items-center justify-center text-xs font-bold shadow-lg">Won (200)</div>
                </div>
            </DemoContainer>
            
            <DemoContainer>
                 <ComponentLabel id="VZ-50" name="Candlestick (Mock)" />
                 <div className="h-32 w-full flex items-end justify-around px-4 bg-slate-50 border border-slate-100 rounded">
                      {[1,2,3,4,5,6].map((_, i) => {
                          const h = 20 + Math.random() * 60;
                          const isUp = Math.random() > 0.5;
                          return (
                              <div key={i} className="flex flex-col items-center justify-end h-full w-4 relative group">
                                  <div className={`w-0.5 h-full absolute ${isUp ? 'bg-green-600' : 'bg-red-600'} opacity-50`}></div>
                                  <div className={`w-full ${isUp ? 'bg-green-500' : 'bg-red-500'} relative z-10`} style={{height: `${h}%`, marginBottom: `${Math.random()*20}%`}}></div>
                              </div>
                          )
                      })}
                 </div>
            </DemoContainer>
            
            <DemoContainer>
                 <ComponentLabel id="VZ-51" name="Scatter Plot" />
                 <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{top: 10, right: 10, bottom: 10, left: 0}}>
                            <CartesianGrid />
                            <XAxis type="number" dataKey="v" name="stature" unit="cm" />
                            <YAxis type="number" dataKey="v2" name="weight" unit="kg" />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Scatter name="A school" data={DATA_SMALL} fill="#8884d8" />
                        </ScatterChart>
                    </ResponsiveContainer>
                 </div>
            </DemoContainer>

            <DemoContainer>
                 <ComponentLabel id="VZ-52" name="Waterfall Bridge (CSS)" />
                 <div className="h-32 w-full relative bg-slate-50 border border-slate-200 rounded flex items-end px-4 gap-1">
                     <div className="w-8 bg-slate-400 h-[20%] rounded-t-sm"></div> {/* Start */}
                     <div className="w-8 bg-green-500 h-[15%] mb-[20%] rounded-sm"></div> {/* Add */}
                     <div className="w-8 bg-green-500 h-[10%] mb-[35%] rounded-sm"></div> {/* Add */}
                     <div className="w-8 bg-red-500 h-[15%] mb-[30%] rounded-sm"></div> {/* Sub */}
                     <div className="w-8 bg-blue-600 h-[30%] rounded-t-sm"></div> {/* End */}
                     
                     {/* Connectors */}
                     <div className="absolute left-[40px] bottom-[20%] w-9 border-t border-slate-300 border-dashed"></div>
                     <div className="absolute left-[76px] bottom-[35%] w-9 border-t border-slate-300 border-dashed"></div>
                     <div className="absolute left-[112px] bottom-[45%] w-9 border-t border-slate-300 border-dashed"></div>
                 </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="VZ-53" name="Stacked Area" />
                 <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={DATA_SMALL}>
                            <Area type="monotone" dataKey="v" stackId="1" stroke="#8884d8" fill="#8884d8" />
                            <Area type="monotone" dataKey="v2" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                        </AreaChart>
                    </ResponsiveContainer>
                 </div>
            </DemoContainer>

        </div>
    </div>
  );
};
