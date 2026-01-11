
import React from 'react';
import { Database, UploadCloud, FileText, X, ArrowRight, AlertCircle, CheckCircle, RefreshCw, Layers, Link, Shield, Activity, FileCode } from 'lucide-react';
import { SectionHeading, DemoContainer, ComponentLabel } from './DesignHelpers';

export const DesignDataManagement = () => {
  return (
    <div className="space-y-12 animate-fade-in pb-20">
        <SectionHeading title="ETL & Ingestion" icon={Database} count="DMT-01 to DMT-55" />
        
        {/* --- UPLOAD & INGESTION --- */}
        <div className="space-y-6">
             <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Upload & Ingestion</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DemoContainer>
                    <ComponentLabel id="DMT-01" name="Upload Zone (Hero)" />
                    <div className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100 hover:border-blue-400 transition-all group">
                        <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                            <UploadCloud className="h-6 w-6 text-blue-500"/>
                        </div>
                        <span className="text-sm font-bold text-slate-700">Click to Upload</span>
                        <span className="text-[10px] text-slate-500 mt-1">CSV, JSON, or XML (Max 50MB)</span>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="DMT-02" name="File Queue Item" />
                    <div className="flex items-center gap-3 p-2 bg-white border border-slate-200 rounded-lg shadow-sm">
                        <div className="bg-slate-100 p-2 rounded text-slate-500"><FileText size={16}/></div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-slate-800 truncate">contacts_v2.csv</div>
                            <div className="text-[10px] text-slate-400">2.4 MB • Queued</div>
                        </div>
                        <button className="text-slate-400 hover:text-red-500"><X size={14}/></button>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="DMT-03" name="Ingestion Progress" />
                    <div className="w-full space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-slate-600">
                            <span>Processing...</span>
                            <span>450 / 1200 rows</span>
                        </div>
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 w-1/3 animate-pulse"></div>
                        </div>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- SCHEMA MAPPING & ETL --- */}
        <div className="space-y-6">
             <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Schema Mapping & ETL</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DemoContainer>
                    <ComponentLabel id="DMT-10" name="Field Mapping Row" />
                    <div className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg">
                        <div className="flex-1 bg-slate-50 p-1.5 rounded text-xs font-mono text-slate-600 border border-slate-100 truncate">source_id</div>
                        <ArrowRight size={14} className="text-slate-300"/>
                        <div className="flex-1 bg-blue-50 p-1.5 rounded text-xs font-mono text-blue-700 border border-blue-100 truncate font-bold">Target.ID</div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="DMT-11" name="Transformation Logic" />
                    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200">
                        <div className="text-[10px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">f(x)</div>
                        <span className="text-xs font-mono text-slate-600">UPPERCASE(val)</span>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="DMT-12" name="Data Type Badge" />
                     <div className="flex gap-2">
                        <span className="text-[9px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">String</span>
                        <span className="text-[9px] font-mono bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded border border-orange-100">Date</span>
                        <span className="text-[9px] font-mono bg-green-50 text-green-600 px-1.5 py-0.5 rounded border border-green-100">Int</span>
                     </div>
                </DemoContainer>
                
                <DemoContainer>
                    <ComponentLabel id="DMT-13" name="Validation Error Row" />
                     <div className="flex items-start gap-2 p-2 bg-red-50/50 border border-red-100 rounded text-xs">
                         <AlertCircle size={14} className="text-red-500 mt-0.5 shrink-0"/>
                         <div>
                             <span className="font-bold text-red-800 block">Row 42: Type Mismatch</span>
                             <span className="text-[10px] text-red-700">Expected Date, got "TBD"</span>
                         </div>
                     </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- CONNECTOR STATUS --- */}
        <div className="space-y-6">
             <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Connector Health</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DemoContainer>
                    <ComponentLabel id="DMT-20" name="Connector Card (Active)" />
                    <div className="p-3 border border-green-200 bg-green-50/30 rounded-lg flex items-center gap-3">
                         <div className="p-1.5 bg-white rounded shadow-sm text-green-600"><Activity size={16}/></div>
                         <div>
                             <p className="text-xs font-bold text-slate-800">SAP ERP</p>
                             <p className="text-[9px] text-green-700 font-bold uppercase tracking-wider flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Connected</p>
                         </div>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="DMT-21" name="Connector Card (Error)" />
                    <div className="p-3 border border-red-200 bg-red-50/30 rounded-lg flex items-center gap-3">
                         <div className="p-1.5 bg-white rounded shadow-sm text-red-600"><AlertCircle size={16}/></div>
                         <div>
                             <p className="text-xs font-bold text-slate-800">Salesforce</p>
                             <p className="text-[9px] text-red-700 font-bold uppercase tracking-wider">Auth Failed</p>
                         </div>
                    </div>
                </DemoContainer>
                
                <DemoContainer>
                    <ComponentLabel id="DMT-22" name="Last Sync Info" />
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-200 w-fit">
                        <RefreshCw size={10}/> Last sync: 2m ago
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="DMT-23" name="API Endpoint Pill" />
                    <div className="flex items-center gap-2 font-mono text-[9px] bg-slate-900 text-slate-300 px-2 py-1 rounded w-fit">
                        <span className="font-bold text-green-400">POST</span>
                        <span>/v1/projects/bulk</span>
                    </div>
                </DemoContainer>
            </div>
        </div>

        {/* --- ADVANCED DATA VISUALS --- */}
         <div className="space-y-6">
             <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Data Operations</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DemoContainer>
                    <ComponentLabel id="DMT-30" name="Data Lineage Node" />
                    <div className="flex flex-col items-center gap-1 w-fit">
                        <div className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center bg-white shadow-sm">
                            <Database size={16} className="text-slate-500"/>
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Raw Store</span>
                    </div>
                </DemoContainer>

                <DemoContainer>
                    <ComponentLabel id="DMT-35" name="Secure Field" />
                    <div className="flex items-center gap-2 border border-slate-200 rounded px-2 py-1 bg-slate-50 text-xs w-fit">
                        <Shield size={12} className="text-slate-400"/>
                        <span className="font-mono text-slate-500">•••••••••</span>
                        <span className="text-[9px] text-slate-400 uppercase font-bold border-l pl-2 border-slate-200">Encrypted</span>
                    </div>
                </DemoContainer>

                 <DemoContainer>
                    <ComponentLabel id="DMT-40" name="Log Entry Row" />
                    <div className="font-mono text-[9px] text-slate-600 bg-slate-50 p-1 rounded border border-slate-100 truncate w-full">
                        <span className="text-blue-500 font-bold">INFO</span> Record 4921 imported successfully.
                    </div>
                </DemoContainer>
                
                <DemoContainer>
                    <ComponentLabel id="DMT-45" name="JSON Preview Block" />
                    <div className="bg-slate-900 p-2 rounded text-[9px] font-mono text-green-400 w-full overflow-hidden">
                        {`{ "id": 1, "status": "ok" }`}
                    </div>
                </DemoContainer>
            </div>
        </div>
    </div>
  );
};
