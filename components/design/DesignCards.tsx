import React, { useState } from 'react';
import { 
  Box, User, FileText, Download, TrendingUp, MoreVertical, Star, 
  MessageSquare, Activity, AlertCircle, Archive, ArrowRight, BarChart2, 
  Bell, Calendar, Check, CheckCircle, ChevronDown, ChevronRight, Clock, 
  Cloud, Code, Copy, CreditCard, Database, Edit, ExternalLink, Eye, File, 
  Filter, Folder, Grid, HardDrive, Heart, Image, Info, Layers, Layout, 
  Link, List, Lock, Mail, MapPin, Menu, MoreHorizontal, Paperclip, 
  PenTool, Phone, PieChart, Play, Plus, RefreshCw, Save, Search, Settings, 
  Share2, Shield, Terminal, Trash2, UploadCloud, UserPlus, Users, Video, 
  Wifi, X, Zap
} from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';
import { SectionHeading, DemoContainer, ComponentLabel } from './DesignHelpers';
import { Badge } from '../common/Badge';

export const DesignCards = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [checked, setChecked] = useState(false);

  return (
    <div className="space-y-12 animate-fade-in pb-20">
        <SectionHeading title="Cards & Containers" icon={Box} count="CD-01 to CD-60" />
        
        {/* --- BASIC CARDS --- */}
        <h4 className="text-lg font-bold text-slate-900 border-b pb-2 mb-6">Basic Containers</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <DemoContainer>
                <ComponentLabel id="CD-01" name="Standard Card" />
                <div className="border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer bg-white">
                    <div className="font-bold text-sm mb-1 text-slate-900">Card Title</div>
                    <div className="text-xs text-slate-500">Standard content area for cards. (Hover me)</div>
                </div>
            </DemoContainer>
            
            <DemoContainer>
                <ComponentLabel id="CD-02" name="User Profile" />
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-white hover:border-blue-300 transition-colors">
                    <UserAvatar name="Sarah J." size="md"/>
                    <div>
                        <div className="font-bold text-sm text-slate-900">Sarah J.</div>
                        <div className="text-xs text-slate-500">Paralegal</div>
                    </div>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="CD-03" name="File Attachment" />
                <div className="flex items-center border rounded-lg p-2 gap-2 bg-slate-50 hover:bg-slate-100 cursor-pointer group transition-colors">
                    <div className="bg-red-100 p-1.5 rounded-md group-hover:bg-red-200 transition-colors"><FileText size={16} className="text-red-500"/></div>
                    <div className="overflow-hidden flex-1">
                        <div className="text-xs font-bold truncate text-slate-700">contract_v1.pdf</div>
                        <div className="text-[10px] text-slate-400">2.4 MB</div>
                    </div>
                    <Download size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"/>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="CD-04" name="Card with Header" />
                <div className="border rounded-lg shadow-sm bg-white overflow-hidden">
                    <div className="bg-slate-50 border-b p-3">
                        <h4 className="font-bold text-sm text-slate-800">Header Title</h4>
                    </div>
                    <div className="p-3 text-xs text-slate-500">
                        Content goes here...
                    </div>
                    <div className="bg-slate-50 border-t p-2 text-right">
                        <button className="text-xs bg-white border rounded px-2 py-1 shadow-sm">Action</button>
                    </div>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="CD-05" name="Image Card" />
                <div className="border rounded-lg shadow-sm bg-white overflow-hidden group">
                    <div className="aspect-video bg-slate-200 overflow-hidden relative">
                        <img src="https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=400&h=225&fit=crop" className="group-hover:scale-105 transition-transform duration-300 object-cover w-full h-full"/>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs">View Image</div>
                    </div>
                    <div className="p-4">
                        <h4 className="font-bold text-sm">Image Card Title</h4>
                        <p className="text-xs text-slate-500 mt-1">Short description.</p>
                    </div>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="CD-06" name="Stat Card (Up)" />
                 <div className="p-4 rounded-lg border border-slate-200 bg-white hover:shadow-sm transition-all w-full group">
                    <div className="flex justify-between items-start mb-2">
                        <div className="text-[10px] text-slate-500 uppercase font-bold">Revenue</div>
                        <TrendingUp className="h-4 w-4 text-green-500"/>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">94.2%</div>
                    <div className="text-xs text-green-600 font-bold mt-1">+2.4% vs last month</div>
                </div>
            </DemoContainer>

             <DemoContainer>
                <ComponentLabel id="CD-07" name="Action Card" />
                <div className="border rounded-lg shadow-sm p-4 bg-white flex flex-col items-center text-center group cursor-pointer hover:bg-slate-50">
                     <div className="p-3 bg-blue-100 rounded-full mb-3 group-hover:scale-110 transition-transform">
                        <User size={20} className="text-blue-600"/>
                     </div>
                     <div className="font-bold text-sm text-slate-800">Manage Users</div>
                     <div className="text-xs text-slate-400 mt-1">Add, edit, or remove team members.</div>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="CD-08" name="Card (Selected)" />
                 <div className="border-2 rounded-lg p-4 bg-blue-50 border-blue-500 ring-4 ring-blue-500/10 shadow-lg">
                    <div className="font-bold text-sm text-blue-900">Selected Item</div>
                    <div className="text-xs text-blue-700">This card is in an active state.</div>
                </div>
            </DemoContainer>
            
            <DemoContainer>
                <ComponentLabel id="CD-09" name="Testimonial Card" />
                <div className="border rounded-lg shadow-sm p-4 bg-slate-800 text-white relative">
                    <div className="absolute -top-3 -left-3 text-6xl text-slate-700 font-serif">“</div>
                    <p className="text-sm italic text-slate-300 mb-4 z-10 relative">This is an amazing design system that helps us build faster.</p>
                    <div className="flex items-center gap-3">
                        <UserAvatar name="C.N." size="sm"/>
                        <div>
                            <div className="font-bold text-xs text-white">Charles Nolan</div>
                            <div className="text-[10px] text-slate-400">CEO, ExampleCo</div>
                        </div>
                    </div>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="CD-10" name="Product Feature" />
                <div className="border rounded-lg bg-white group hover:border-yellow-400 transition-colors">
                    <div className="p-4">
                        <Star className="text-slate-300 group-hover:text-yellow-400 group-hover:fill-yellow-400 mb-2 transition-colors"/>
                        <h4 className="font-bold text-slate-800">New Feature</h4>
                        <p className="text-xs text-slate-500 mt-1">Briefly explain the benefit of this new feature to the user.</p>
                    </div>
                    <div className="border-t p-2 bg-slate-50 group-hover:bg-yellow-50 transition-colors">
                        <button className="text-xs font-bold text-blue-600 hover:text-blue-800 w-full text-left p-1">Learn More</button>
                    </div>
                </div>
            </DemoContainer>
            
            <DemoContainer>
                <ComponentLabel id="CD-11" name="Comment Card" />
                <div className="p-3 bg-white border rounded-lg shadow-sm">
                    <div className="flex items-start gap-3">
                        <UserAvatar name="D.H." size="sm" className="mt-1 shrink-0"/>
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                 <span className="font-bold text-xs text-slate-800">David H.</span>
                                 <span className="text-[10px] text-slate-400">2h ago</span>
                            </div>
                            <p className="text-xs bg-slate-100 p-2 rounded-lg mt-1 text-slate-600 border border-slate-200">This looks great, but can we check the variance against the baseline?</p>
                        </div>
                    </div>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="CD-12" name="Stacked Card" />
                <div className="relative h-24">
                    <div className="absolute inset-0 border rounded-lg bg-white shadow-sm transform rotate-3 transition-transform group-hover:rotate-0"></div>
                    <div className="absolute inset-0 border rounded-lg bg-white shadow-sm transform -rotate-2 transition-transform group-hover:rotate-0"></div>
                    <div className="absolute inset-0 border rounded-lg bg-white shadow-sm flex items-center justify-center p-4 transition-transform group-hover:scale-105">
                         <div className="font-bold text-slate-700 text-center">Stacked Effect</div>
                    </div>
                </div>
            </DemoContainer>
        </div>

        {/* --- PROJECT & TASK MANAGEMENT --- */}
        <h4 className="text-lg font-bold text-slate-900 border-b pb-2 mb-6">Project & Tasks</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <DemoContainer>
                <ComponentLabel id="CD-13" name="Project Summary" />
                <div className="border border-slate-200 rounded-xl p-4 bg-white hover:border-blue-300 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Layers size={20}/></div>
                        <Badge variant="success">Active</Badge>
                    </div>
                    <h4 className="font-bold text-slate-900">Website Redesign</h4>
                    <p className="text-xs text-slate-500 mt-1 mb-4">Update branding and UX</p>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-600">
                            <span>Progress</span>
                            <span>65%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 w-[65%] rounded-full"></div>
                        </div>
                        <div className="flex -space-x-2 pt-2">
                            {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-600">U{i}</div>)}
                        </div>
                    </div>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="CD-14" name="Task List Card" />
                <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
                    <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                        <h4 className="text-xs font-bold uppercase text-slate-500">Today's Tasks</h4>
                        <span className="text-xs font-bold bg-slate-200 px-1.5 py-0.5 rounded text-slate-600">3</span>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {['Review PR', 'Client Call', 'Update Docs'].map((task, i) => (
                            <div key={i} className="p-3 flex items-center gap-3 hover:bg-slate-50 cursor-pointer">
                                <div className={`w-4 h-4 border-2 rounded ${i===0 ? 'bg-blue-500 border-blue-500' : 'border-slate-300'}`}>
                                    {i===0 && <Check size={12} className="text-white"/>}
                                </div>
                                <span className={`text-sm ${i===0 ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{task}</span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full py-2 text-xs font-bold text-blue-600 hover:bg-blue-50">+ Add Task</button>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="CD-30" name="Kanban Ticket (Detailed)" />
                <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-grab active:cursor-grabbing group relative">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">LIT-204</span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-slate-400 hover:text-blue-500"><Edit size={12}/></button>
                        </div>
                    </div>
                    <h5 className="text-sm font-semibold text-slate-800 mb-3 leading-snug">Review Production Set 2 for Privilege Log</h5>
                    <div className="flex flex-wrap gap-1 mb-3">
                        <span className="text-[9px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded border border-red-100">High Priority</span>
                        <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">Legal</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                        <div className="flex items-center text-[10px] text-slate-500">
                            <Clock size={10} className="mr-1"/> 2d left
                        </div>
                        <UserAvatar name="Mike R." size="sm" />
                    </div>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="CD-31" name="Resource Allocation" />
                <div className="border border-slate-200 rounded-xl bg-white p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <UserAvatar name="John D." size="md" />
                        <div>
                            <div className="font-bold text-sm text-slate-900">John Doe</div>
                            <div className="text-xs text-slate-500">Senior Architect</div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-500">Project Alpha</span>
                                <span className="font-bold text-slate-700">60%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full"><div className="w-[60%] bg-blue-500 h-full rounded-full"></div></div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-500">Project Beta</span>
                                <span className="font-bold text-slate-700">30%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full"><div className="w-[30%] bg-green-500 h-full rounded-full"></div></div>
                        </div>
                        <div className="pt-2 border-t border-slate-100 text-xs text-right">
                            <span className="text-slate-400 mr-2">Availability:</span>
                            <span className="font-bold text-green-600">10% Free</span>
                        </div>
                    </div>
                </div>
            </DemoContainer>
        </div>

        {/* --- SYSTEM & INFRASTRUCTURE --- */}
        <h4 className="text-lg font-bold text-slate-900 border-b pb-2 mb-6">System & Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
             <DemoContainer>
                <ComponentLabel id="CD-32" name="Server Health" />
                <div className="bg-slate-900 text-white rounded-xl p-4 shadow-lg border border-slate-800">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-slate-800 rounded-lg"><HardDrive size={20} className="text-green-400"/></div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs font-bold text-green-400">ONLINE</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs text-slate-400 mb-1"><span>CPU Load</span><span>42%</span></div>
                            <div className="w-full bg-slate-800 h-1 rounded-full"><div className="w-[42%] bg-blue-500 h-full rounded-full"></div></div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Memory</span><span>78%</span></div>
                            <div className="w-full bg-slate-800 h-1 rounded-full"><div className="w-[78%] bg-yellow-500 h-full rounded-full"></div></div>
                        </div>
                        <div className="pt-3 border-t border-slate-800 flex justify-between text-xs font-mono text-slate-500">
                            <span>us-east-1a</span>
                            <span>10.0.0.42</span>
                        </div>
                    </div>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="CD-15" name="Notification Stack" />
                <div className="relative">
                    <div className="border border-slate-200 bg-white rounded-lg p-3 shadow-sm absolute top-2 left-0 right-0 scale-95 -z-10 h-20 opacity-50"></div>
                    <div className="border border-slate-200 bg-white rounded-lg p-3 shadow-md z-10 relative">
                        <div className="flex gap-3">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 shrink-0"></div>
                            <div>
                                <h5 className="font-bold text-sm text-slate-800">Critical Alert</h5>
                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">Database latency exceeded threshold (500ms). Check logs immediately.</p>
                                <div className="mt-2 flex gap-2">
                                    <button className="text-[10px] font-bold text-blue-600 hover:underline">View Logs</button>
                                    <button className="text-[10px] font-bold text-slate-400 hover:text-slate-600">Dismiss</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="CD-36" name="Integration Connector" />
                <div className="border border-slate-200 rounded-xl bg-white p-4 flex flex-col items-center text-center relative group hover:border-nexus-300">
                    <div className="absolute top-2 right-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Cloud size={24} className="text-slate-600"/>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Salesforce</h4>
                    <p className="text-xs text-slate-500 mt-1 mb-3">Sync accounts & contacts</p>
                    <button className="text-xs border border-slate-200 rounded-full px-3 py-1 font-medium hover:bg-slate-50 text-slate-600">Configure</button>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="CD-37" name="API Key Secret" />
                <div className="border border-slate-200 rounded-lg bg-slate-50 p-3">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase">Client Secret</span>
                        <Badge variant="warning">Production</Badge>
                    </div>
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded p-2 mb-2">
                        <code className="text-xs font-mono text-slate-600 flex-1 truncate">sk_live_51Hz...92x</code>
                        <Copy size={14} className="text-slate-400 cursor-pointer hover:text-blue-500"/>
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock size={10}/> Last used 2m ago
                    </div>
                </div>
            </DemoContainer>
        </div>

        {/* --- CONTENT & EDITING --- */}
        <h4 className="text-lg font-bold text-slate-900 border-b pb-2 mb-6">Content & Editing</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
             <DemoContainer>
                <ComponentLabel id="CD-39" name="Markdown Preview" />
                <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                    <div className="bg-slate-50 border-b border-slate-200 p-2 flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="p-4 prose prose-sm prose-slate">
                        <h1 className="text-lg font-bold text-slate-900 m-0">Project Alpha</h1>
                        <p className="text-xs text-slate-600 mt-2">A *brief* overview of the **main goals**.</p>
                        <ul className="text-xs text-slate-600 pl-4 list-disc mt-2">
                            <li>Phase 1</li>
                            <li>Phase 2</li>
                        </ul>
                    </div>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="CD-38" name="Code Snippet" />
                <div className="bg-slate-900 rounded-lg overflow-hidden text-slate-300 font-mono text-xs shadow-md">
                    <div className="flex justify-between items-center p-2 bg-slate-800">
                        <span className="text-slate-400">config.json</span>
                        <Copy size={12} className="cursor-pointer hover:text-white"/>
                    </div>
                    <div className="p-3 overflow-x-auto">
                        <div className="text-purple-400">{"{"}</div>
                        <div className="pl-4">
                            <span className="text-blue-400">"env"</span>: <span className="text-green-400">"production"</span>,
                        </div>
                        <div className="pl-4">
                            <span className="text-blue-400">"retries"</span>: <span className="text-orange-400">3</span>
                        </div>
                        <div className="text-purple-400">{"}"}</div>
                    </div>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="CD-56" name="Chat Bubble (Me)" />
                <div className="flex flex-col items-end w-full gap-1">
                    <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none shadow-sm text-sm max-w-[90%]">
                        Can you review the latest PR?
                    </div>
                    <span className="text-[10px] text-slate-400 mr-1">10:42 AM • Read</span>
                </div>
                <div className="h-4"></div>
                <ComponentLabel id="CD-56b" name="Chat Bubble (Them)" />
                <div className="flex flex-col items-start w-full gap-1">
                    <div className="bg-slate-100 text-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-200 text-sm max-w-[90%]">
                        Sure thing, checking it now.
                    </div>
                    <span className="text-[10px] text-slate-400 ml-1">10:43 AM</span>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="CD-29" name="Comment Thread" />
                <div className="border border-slate-200 rounded-xl bg-white p-3">
                    <div className="flex gap-3">
                        <UserAvatar name="R.G." size="sm" className="mt-1"/>
                        <div className="flex-1">
                            <div className="bg-slate-50 p-2 rounded-lg text-xs text-slate-700 mb-1">
                                <span className="font-bold block text-slate-900 mb-0.5">Rachel Green</span>
                                I think we should increase the padding on the mobile view.
                            </div>
                            <div className="flex gap-3 text-[10px] text-slate-400 font-medium pl-1">
                                <span className="hover:text-blue-600 cursor-pointer">Reply</span>
                                <span className="hover:text-blue-600 cursor-pointer">Like</span>
                                <span>2h ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </DemoContainer>
        </div>

        {/* --- UTILITY & INTERACTIVE --- */}
        <h4 className="text-lg font-bold text-slate-900 border-b pb-2 mb-6">Utility & Interactive</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
             <DemoContainer>
                <ComponentLabel id="CD-35" name="File Upload Dropzone" />
                <div className="border-2 border-dashed border-blue-200 bg-blue-50 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-100 hover:border-blue-400 transition-all group h-40">
                    <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                        <UploadCloud size={24} className="text-blue-500"/>
                    </div>
                    <p className="text-sm font-bold text-blue-900">Click to upload</p>
                    <p className="text-xs text-blue-600 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="CD-46" name="Subscription Plan" />
                <div className="border border-slate-200 rounded-xl p-4 bg-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-nexus-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">POPULAR</div>
                    <h4 className="font-bold text-slate-900">Pro Plan</h4>
                    <div className="flex items-baseline gap-1 my-2">
                        <span className="text-2xl font-black text-slate-900">$29</span>
                        <span className="text-xs text-slate-500">/ month</span>
                    </div>
                    <ul className="space-y-1.5 mb-4">
                        {['Unlimited Projects', 'Adv. Analytics', 'Priority Support'].map(f => (
                            <li key={f} className="text-xs text-slate-600 flex items-center gap-2">
                                <CheckCircle size={12} className="text-green-500"/> {f}
                            </li>
                        ))}
                    </ul>
                    <button className="w-full py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800">Upgrade</button>
                </div>
            </DemoContainer>
            
            <DemoContainer>
                <ComponentLabel id="CD-16" name="Mini Auth Card" />
                <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm flex flex-col items-center">
                    <div className="w-10 h-10 bg-nexus-600 rounded-lg flex items-center justify-center text-white mb-4">
                        <Shield size={20}/>
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1">Welcome Back</h4>
                    <p className="text-xs text-slate-500 mb-4 text-center">Enter your password to access.</p>
                    <input type="password" placeholder="••••••••" className="w-full p-2 border rounded text-sm mb-2"/>
                    <button className="w-full bg-nexus-600 text-white rounded py-2 text-xs font-bold hover:bg-nexus-700">Unlock</button>
                </div>
            </DemoContainer>
            
            <DemoContainer>
                <ComponentLabel id="CD-42" name="Meeting Agenda" />
                <div className="border-l-4 border-l-purple-500 bg-white border border-slate-200 rounded-r-xl p-4 shadow-sm">
                    <div className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">10:00 AM - 11:00 AM</div>
                    <h4 className="font-bold text-slate-900">Product Sync</h4>
                    <div className="flex -space-x-2 mt-3 mb-3">
                         {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white"></div>)}
                         <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-500">+2</div>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex-1 py-1 text-xs border border-slate-200 rounded text-slate-600 hover:bg-slate-50">Reschedule</button>
                        <button className="flex-1 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700">Join</button>
                    </div>
                </div>
            </DemoContainer>
        </div>

        {/* --- MISC UI PATTERNS --- */}
        <h4 className="text-lg font-bold text-slate-900 border-b pb-2 mb-6">Miscellaneous</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DemoContainer>
                <ComponentLabel id="CD-43" name="Contact vCard" />
                <div className="border border-slate-200 rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                        <UserAvatar name="Alex M." size="md" className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white"/>
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm">Alex Morgan</h4>
                            <p className="text-xs text-slate-500">VP of Engineering</p>
                        </div>
                    </div>
                    <div className="space-y-2 text-xs text-slate-600">
                        <div className="flex items-center gap-2"><Mail size={12} className="text-slate-400"/> alex@nexus.com</div>
                        <div className="flex items-center gap-2"><Phone size={12} className="text-slate-400"/> +1 (555) 012-3456</div>
                        <div className="flex items-center gap-2"><MapPin size={12} className="text-slate-400"/> New York, NY</div>
                    </div>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="CD-48" name="Progress Step Card" />
                <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-nexus-600 flex items-center justify-center text-white font-bold text-xs shadow-md z-10">1</div>
                        <div className="w-0.5 flex-1 bg-slate-200 my-1"></div>
                    </div>
                    <div className="pb-6">
                        <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm">
                            <h4 className="font-bold text-sm text-slate-900">Account Setup</h4>
                            <p className="text-xs text-slate-500 mt-1">Configure your organization details.</p>
                            <button className="mt-2 text-xs font-bold text-nexus-600 hover:underline">Continue</button>
                        </div>
                    </div>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="CD-21" name="Skeleton Loading" />
                <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse"></div>
                        <div className="space-y-2 flex-1">
                            <div className="h-3 bg-slate-100 rounded w-2/3 animate-pulse"></div>
                            <div className="h-2 bg-slate-100 rounded w-1/3 animate-pulse"></div>
                        </div>
                    </div>
                    <div className="h-20 bg-slate-100 rounded animate-pulse"></div>
                    <div className="flex gap-2">
                        <div className="h-8 bg-slate-100 rounded w-1/3 animate-pulse"></div>
                        <div className="h-8 bg-slate-100 rounded w-1/3 animate-pulse"></div>
                    </div>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="CD-20" name="Empty State" />
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-slate-50 h-full">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-2">
                        <Search size={20}/>
                    </div>
                    <h4 className="font-bold text-slate-700 text-sm">No Results</h4>
                    <p className="text-[10px] text-slate-400 mt-1">Try adjusting your filters.</p>
                    <button className="mt-3 text-xs bg-white border border-slate-200 px-3 py-1 rounded shadow-sm hover:bg-slate-50">Clear Filters</button>
                </div>
            </DemoContainer>
        </div>
    </div>
  );
};
