
import React from 'react';
import { Box, FileText, Download } from 'lucide-react';
import { UserAvatar } from '../../common/UserAvatar';
import { DemoContainer, ComponentLabel } from '../DesignHelpers';

export const DesignCardsBasic = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <DemoContainer>
            <ComponentLabel id="CD-01" name="Standard Card" />
            <div className="border rounded-lg shadow-sm p-4 bg-white font-bold text-sm text-slate-900">Card Title</div>
        </DemoContainer>
        <DemoContainer>
            <ComponentLabel id="CD-02" name="User Profile" />
            <div className="flex items-center gap-3 p-3 border rounded-lg bg-white"><UserAvatar name="Sarah J." size="md"/><div><div className="font-bold text-sm">Sarah J.</div><div className="text-xs text-slate-500">Legal</div></div></div>
        </DemoContainer>
        <DemoContainer>
            <ComponentLabel id="CD-03" name="File Asset" />
            <div className="flex items-center border rounded-lg p-2 gap-2 bg-slate-50"><div className="bg-red-100 p-1.5 rounded"><FileText size={16} className="text-red-500"/></div><div className="overflow-hidden flex-1"><div className="text-xs font-bold truncate">contract.pdf</div><div className="text-[10px] text-slate-400">1.2 MB</div></div><Download size={14} className="text-slate-400"/></div>
        </DemoContainer>
    </div>
);
