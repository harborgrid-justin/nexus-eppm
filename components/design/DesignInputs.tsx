
import React, { useState } from 'react';
import { Mail, Lock, Search, ChevronDown, Eye, EyeOff, FileText } from 'lucide-react';
import { SectionHeading, DemoContainer, ComponentLabel } from './DesignHelpers';

export const DesignInputs = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-8 animate-fade-in">
        <SectionHeading title="Data Input Controls" icon={FileText} count="INP-01 to INP-25" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DemoContainer>
                <ComponentLabel id="INP-01" name="Standard Text" />
                <input 
                    className="w-full px-3 py-2 border rounded text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-300"
                    placeholder="Type something..."
                />
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="INP-02" name="Email Address" />
                <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"/>
                    <input 
                        className="w-full pl-9 pr-3 py-2 border rounded text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="user@example.com"
                    />
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="INP-03" name="Secure Password" />
                <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"/>
                    <input 
                        type={showPassword ? "text" : "password"}
                        className="w-full pl-9 pr-9 py-2 border rounded text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        placeholder="••••••••"
                        defaultValue="Secret123"
                    />
                    <button 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                        {showPassword ? <EyeOff size={14}/> : <Eye size={14}/>}
                    </button>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="INP-04" name="Search Bar" />
                <div className="relative">
                    <input 
                        className="w-full pl-3 pr-9 py-2 border rounded-full text-sm bg-slate-50 focus:bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        placeholder="Search..."
                    />
                    <div className="absolute right-1 top-1 p-1.5 bg-blue-600 rounded-full text-white cursor-pointer hover:bg-blue-700">
                        <Search className="h-3 w-3"/>
                    </div>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="INP-05" name="Dropdown Select" />
                <div className="relative">
                    <select className="w-full px-3 py-2 border rounded text-sm appearance-none bg-white outline-none focus:border-blue-500 cursor-pointer text-slate-700">
                        <option>Option 1</option>
                        <option>Option 2</option>
                        <option>Option 3</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none"/>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="INP-06" name="Checkbox (Checked)" />
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="checkbox" className="h-4 w-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500" defaultChecked/>
                    Accept terms
                </label>
            </DemoContainer>
            
            <DemoContainer>
                <ComponentLabel id="INP-07" name="Checkbox (Unchecked)" />
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300 focus:ring-blue-500"/>
                    Subscribe to newsletter
                </label>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="INP-08" name="Toggle Switch" />
                <label className="flex items-center justify-between cursor-pointer text-sm">
                    <span>Enable Notifications</span>
                    <div className="relative">
                        <input type="checkbox" className="sr-only peer" defaultChecked/>
                        <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </div>
                </label>
            </DemoContainer>
        </div>
    </div>
  );
};
