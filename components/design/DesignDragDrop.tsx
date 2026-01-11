
import React, { useState } from 'react';
import { Move, GripVertical, GripHorizontal, ArrowRightLeft, ArrowUpDown } from 'lucide-react';
import { SectionHeading, DemoContainer, ComponentLabel } from './DesignHelpers';

export const DesignDragDrop = () => {
  const [dropZoneStatus, setDropZoneStatus] = useState('idle');

  return (
    <div className="space-y-8 animate-fade-in">
        <SectionHeading title="Gestures & Drag" icon={Move} count="DD-01 to DD-40" />
        
        {/* --- BASIC DRAG --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DemoContainer>
                <ComponentLabel id="DD-01" name="Draggable List Item" />
                <div 
                    draggable
                    className="bg-white border border-slate-200 rounded p-2 flex items-center shadow-sm cursor-grab active:cursor-grabbing hover:bg-slate-50 transition-all hover:border-blue-300 active:scale-[0.98]"
                >
                    <GripVertical className="h-4 w-4 text-slate-400 mr-2"/>
                    <span className="text-sm text-slate-700 font-medium">Drag Me</span>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="DD-03" name="Drop Zone (Generic)" />
                <div 
                    className={`border-2 border-dashed rounded-lg p-4 flex items-center justify-center text-xs font-medium h-20 transition-all duration-200 ${
                        dropZoneStatus === 'hover' ? 'bg-blue-50 border-blue-400 text-blue-600 scale-[1.02]' :
                        'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setDropZoneStatus('hover'); }}
                    onDragLeave={() => setDropZoneStatus('idle')}
                    onDrop={(e) => { e.preventDefault(); setDropZoneStatus('idle'); }}
                >
                    Drop items here
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="DD-10" name="Sortable Handle" />
                <div className="flex flex-col gap-1">
                    {[1, 2].map(i => (
                        <div key={i} className="flex items-center p-2 bg-white border border-slate-200 rounded hover:shadow-sm">
                            <div className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 mr-2">
                                <GripVertical size={14}/>
                            </div>
                            <span className="text-xs text-slate-600">Item {i}</span>
                        </div>
                    ))}
                </div>
            </DemoContainer>
        </div>

        {/* --- RESIZING --- */}
        <div className="space-y-6">
            <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Resize Handles</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DemoContainer>
                    <ComponentLabel id="DD-20" name="Column Resize" />
                    <div className="flex border border-slate-200 rounded h-10 overflow-hidden">
                        <div className="flex-1 bg-white flex items-center justify-center text-xs text-slate-500 border-r border-slate-200 relative group">
                            Col A
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-blue-500 cursor-col-resize z-10 transition-colors"></div>
                        </div>
                        <div className="flex-1 bg-slate-50 flex items-center justify-center text-xs text-slate-500">Col B</div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="DD-21" name="Pane Splitter (V)" />
                    <div className="flex h-16 border border-slate-200 rounded">
                        <div className="flex-1 bg-white"></div>
                        <div className="w-1 bg-slate-200 hover:bg-blue-400 cursor-col-resize flex items-center justify-center transition-colors">
                            <div className="h-4 w-0.5 bg-slate-400 rounded"></div>
                        </div>
                        <div className="flex-1 bg-slate-50"></div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="DD-22" name="Row Resize" />
                     <div className="border border-slate-200 rounded bg-white flex flex-col">
                        <div className="h-8 flex items-center px-2 text-xs relative group border-b border-slate-200">
                             Row 1
                             <div className="absolute bottom-0 left-0 right-0 h-1 bg-transparent group-hover:bg-blue-500 cursor-row-resize z-10 transition-colors"></div>
                        </div>
                        <div className="h-8 flex items-center px-2 text-xs bg-slate-50">Row 2</div>
                     </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- COMPLEX DRAG --- */}
        <div className="space-y-6">
             <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Complex Interactions</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <DemoContainer>
                    <ComponentLabel id="DD-30" name="Swimlane Header Drag" />
                    <div className="bg-slate-100 p-2 rounded-t-lg border border-slate-200 flex items-center justify-between cursor-move active:cursor-grabbing hover:bg-slate-200 transition-colors">
                        <span className="text-xs font-bold text-slate-700 uppercase">To Do</span>
                        <GripHorizontal size={14} className="text-slate-400"/>
                    </div>
                 </DemoContainer>

                 <DemoContainer>
                    <ComponentLabel id="DD-35" name="Ghost Overlay" />
                    <div className="relative p-3 border-2 border-dashed border-blue-400 bg-blue-50 rounded-lg text-center">
                        <span className="text-xs font-bold text-blue-600 opacity-50">Drop Here</span>
                        <div className="absolute top-2 left-2 right-[-10px] bottom-[-10px] bg-white border border-slate-300 shadow-xl rounded-lg p-3 opacity-80 rotate-3 z-20 pointer-events-none">
                            <span className="text-xs font-bold text-slate-800">Dragged Item</span>
                        </div>
                    </div>
                 </DemoContainer>

                 <DemoContainer>
                    <ComponentLabel id="DD-40" name="Reorder List Placeholder" />
                    <div className="space-y-2">
                        <div className="p-2 bg-white border border-slate-200 rounded shadow-sm text-xs">Item 1</div>
                        <div className="h-8 border-2 border-blue-400 bg-blue-50 rounded border-dashed transition-all"></div>
                        <div className="p-2 bg-white border border-slate-200 rounded shadow-sm text-xs">Item 3</div>
                    </div>
                 </DemoContainer>
             </div>
        </div>
    </div>
  );
};
