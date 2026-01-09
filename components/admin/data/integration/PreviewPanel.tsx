
import React from 'react';
import { Clock } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';

interface PreviewPanelProps {
    testPayload: string;
    setTestPayload: (val: string) => void;
    previewOutput: any;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ testPayload, setTestPayload, previewOutput }) => {
    const theme = useTheme();
    const isDark = theme.isDark;

    return (
        <div className={`w-96 rounded-xl border flex flex-col shadow-xl overflow-hidden ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-900 border-slate-800'}`}>
            <div className={`p-4 border-b flex justify-between items-center ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-800 bg-slate-900'}`}>
                <h4 className="text-white font-bold flex items-center gap-2"><Clock size={16} className="text-green-500"/> Live Preview</h4>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700 font-mono">JSON Output</span>
            </div>
            <div className="flex-1 p-4 overflow-auto font-mono text-xs">
                <div className="mb-4">
                    <p className="text-slate-500 mb-2 uppercase font-bold text-[10px] tracking-widest">Input (Source)</p>
                    <textarea 
                        className="w-full h-32 bg-slate-950 border border-slate-700 rounded p-2 text-blue-400 outline-none resize-none scrollbar-thin scrollbar-thumb-slate-700"
                        value={testPayload}
                        onChange={(e) => setTestPayload(e.target.value)}
                    />
                </div>
                <div className="border-t border-slate-800 pt-4">
                    <p className="text-slate-500 mb-2 uppercase font-bold text-[10px] tracking-widest">Output (Mapped)</p>
                    <pre className="text-green-400 whitespace-pre-wrap">
                        {JSON.stringify(previewOutput, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
};
