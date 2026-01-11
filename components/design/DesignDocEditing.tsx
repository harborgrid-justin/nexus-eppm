
import React from 'react';
import { PenTool, Bold, Italic, Underline, List, ListOrdered, Link, Image, Code, Quote, MessageSquare, GripVertical, Check } from 'lucide-react';
import { SectionHeading, DemoContainer, ComponentLabel } from './DesignHelpers';

export const DesignDocEditing = () => {
  return (
    <div className="space-y-12 animate-fade-in pb-20">
        <SectionHeading title="Rich Text Editor" icon={PenTool} count="DE-01 to DE-50" />
        
        {/* --- TOOLBARS --- */}
        <div className="space-y-6">
             <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Editor Toolbars</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DemoContainer>
                    <ComponentLabel id="DE-01" name="Format Group" />
                    <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm w-fit items-center">
                        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition-all hover:text-blue-600"><Bold size={14}/></button>
                        <button className="p-1.5 bg-blue-50 text-blue-600 rounded shadow-inner transition-all"><Italic size={14}/></button>
                        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition-all hover:text-blue-600"><Underline size={14}/></button>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="DE-10" name="List Group" />
                    <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm w-fit items-center gap-1">
                        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600"><List size={14}/></button>
                        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600"><ListOrdered size={14}/></button>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="DE-11" name="Insert Group" />
                    <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm w-fit items-center gap-1">
                        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600"><Link size={14}/></button>
                        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600"><Image size={14}/></button>
                        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600"><Code size={14}/></button>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- CONTENT BLOCKS --- */}
        <div className="space-y-6">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Content Blocks</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DemoContainer>
                    <ComponentLabel id="DE-20" name="Block Quote" />
                    <div className="border-l-4 border-slate-300 pl-4 py-1 italic text-slate-600 text-sm">
                        "The scope baseline must be approved before execution begins."
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="DE-21" name="Code Block" />
                    <div className="bg-slate-900 rounded-lg p-3 text-xs font-mono text-slate-300 relative group">
                        <div className="absolute top-2 right-2 text-[9px] uppercase font-bold text-slate-500">JSON</div>
                        {`{ "status": "active" }`}
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="DE-22" name="Mention Pill" />
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-bold select-none cursor-pointer hover:bg-blue-200 transition-colors">@Sarah Chen</span>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="DE-23" name="Inline Comment Highlight" />
                    <span className="bg-yellow-200 cursor-pointer border-b-2 border-yellow-400">review this section</span>
                </DemoContainer>
            </div>
        </div>

        {/* --- INTERACTIVE ELEMENTS --- */}
        <div className="space-y-6">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Editor Interactions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DemoContainer>
                    <ComponentLabel id="DE-30" name="Slash Command Menu" />
                    <div className="border border-slate-200 rounded-lg shadow-lg bg-white overflow-hidden w-48">
                         <div className="px-3 py-2 bg-slate-50 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100">Basic Blocks</div>
                         <div className="p-1">
                             <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-blue-50 rounded cursor-pointer text-xs text-slate-700">
                                 <div className="w-5 h-5 bg-white border border-slate-200 rounded flex items-center justify-center text-slate-400 shadow-sm">T</div>
                                 Text
                             </div>
                             <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-blue-50 rounded cursor-pointer text-xs text-slate-700">
                                 <div className="w-5 h-5 bg-white border border-slate-200 rounded flex items-center justify-center text-slate-400 shadow-sm"><List size={10}/></div>
                                 List
                             </div>
                         </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="DE-31" name="Hover Toolbar" />
                    <div className="flex bg-slate-800 text-white rounded shadow-lg p-1 gap-1 w-fit absolute">
                        <button className="p-1 hover:bg-slate-700 rounded"><Bold size={12}/></button>
                        <button className="p-1 hover:bg-slate-700 rounded"><Italic size={12}/></button>
                        <div className="w-px h-3 bg-slate-600 mx-1 self-center"></div>
                        <button className="p-1 hover:bg-slate-700 rounded"><MessageSquare size={12}/></button>
                    </div>
                    <div className="h-8"></div> {/* Spacer for absolute element */}
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="DE-35" name="Draggable Block Handle" />
                    <div className="flex items-center gap-2 group">
                        <div className="opacity-40 group-hover:opacity-100 cursor-grab active:cursor-grabbing hover:bg-slate-100 rounded p-0.5">
                            <GripVertical size={14} className="text-slate-400"/>
                        </div>
                        <p className="text-sm text-slate-700">Hover to see handle.</p>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="DE-40" name="Checklist Item" />
                    <div className="flex items-center gap-3 group">
                        <div className="w-4 h-4 border-2 border-slate-300 rounded flex items-center justify-center cursor-pointer hover:border-nexus-500"></div>
                        <span className="text-sm text-slate-700">Pending task item</span>
                    </div>
                </DemoContainer>
                 
                <DemoContainer>
                    <ComponentLabel id="DE-41" name="Checklist Item (Done)" />
                    <div className="flex items-center gap-3 group opacity-60">
                        <div className="w-4 h-4 border-2 border-nexus-500 bg-nexus-500 rounded flex items-center justify-center cursor-pointer text-white">
                            <Check size={10}/>
                        </div>
                        <span className="text-sm text-slate-500 line-through">Completed item</span>
                    </div>
                </DemoContainer>
            </div>
        </div>
    </div>
  );
};
