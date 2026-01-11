
import React from 'react';
import { Scale } from 'lucide-react';
import { SectionHeading, DemoContainer, ComponentLabel } from './DesignHelpers';

export const DesignLegal = () => {
  return (
    <div className="space-y-8 animate-fade-in">
        <SectionHeading title="Regulatory Layouts" icon={Scale} count="LG-01 to LG-50" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DemoContainer>
                <ComponentLabel id="LG-01" name="Pleading Caption" />
                <div className="border border-black p-2 flex text-[9px] font-serif bg-white shadow-sm">
                    <div className="w-1/2 border-r border-black pr-1">
                        John Doe,<br/>Plaintiff,<br/><br/>v.<br/><br/>Acme Corp,<br/>Defendant.
                    </div>
                    <div className="w-1/2 pl-1 text-center flex flex-col justify-center">
                        <span className="font-bold">CIVIL ACTION</span>
                        <span>Case No. 123-456</span>
                    </div>
                </div>
            </DemoContainer>
            
            <DemoContainer>
                <ComponentLabel id="LG-02" name="Redaction Pattern" />
                <div className="text-xs font-serif leading-relaxed bg-white p-2 border border-slate-200">
                    On the date of <span className="bg-black text-black select-none rounded-sm px-1">Jan 12</span>, the witness stated that <span className="bg-black text-black select-none rounded-sm px-1">Mr. Smith</span> was present at the location.
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="LG-03" name="Exhibit Stamp" />
                <div className="relative h-20 w-full bg-white border border-slate-200 p-2 flex items-end justify-end">
                    <div className="border-2 border-slate-800 text-slate-800 px-2 py-1 text-[8px] font-bold uppercase rotate-[-5deg] opacity-80 mix-blend-multiply">
                        <div className="border-b border-slate-800 mb-0.5">Plaintiff's Exhibit</div>
                        <div className="text-lg leading-none">14-A</div>
                        <div className="text-[6px] font-normal">Case 1:23-cv-00042</div>
                    </div>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="LG-04" name="Signature Block" />
                <div className="space-y-4 pt-2">
                    <div className="border-b border-black w-3/4"></div>
                    <div className="text-[9px] font-serif">
                        <span className="font-bold">By:</span> ______________________<br/>
                        <span className="font-bold">Name:</span> Sarah Jenkins<br/>
                        <span className="font-bold">Title:</span> General Counsel
                    </div>
                </div>
            </DemoContainer>

            <DemoContainer>
                <ComponentLabel id="LG-05" name="Confidential Watermark" />
                <div className="relative h-24 w-full bg-white border border-slate-200 p-2 overflow-hidden flex items-center justify-center">
                    <p className="text-[8px] text-slate-400 text-justify blur-[0.5px]">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-slate-200 font-black text-2xl -rotate-12 uppercase tracking-widest border-4 border-slate-200 px-4 py-1 rounded-lg opacity-50 mix-blend-multiply">
                            Confidential
                        </span>
                    </div>
                </div>
            </DemoContainer>
        </div>
    </div>
  );
};
