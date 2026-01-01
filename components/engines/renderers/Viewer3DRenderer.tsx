
import React from 'react';
import { Box } from 'lucide-react';

interface Viewer3DRendererProps {
    extensionVersion: string;
}

export const Viewer3DRenderer: React.FC<Viewer3DRendererProps> = ({ extensionVersion }) => {
    return (
        <div className="flex-1 bg-slate-900 relative flex items-center justify-center">
            <div className="grid grid-cols-12 gap-1 absolute inset-0 opacity-20 pointer-events-none">
                {[...Array(144)].map((_, i) => <div key={i} className="border border-nexus-500/30"></div>)}
            </div>
            <div className="text-center text-slate-300 z-10">
                <Box size={64} className="mx-auto text-nexus-500 mb-6 animate-pulse" />
                <h3 className="text-2xl font-light">3D Model Context</h3>
                <p className="text-slate-500 mt-2 max-w-sm">
                    Loading BIM dataset v{extensionVersion}...<br/>
                    WebGL rendering engine initialized.
                </p>
            </div>
        </div>
    );
};
