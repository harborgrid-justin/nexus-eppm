import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { Folder, ChevronRight, ChevronDown, Table } from 'lucide-react';
import { Card } from '../../ui/Card';

export const TreeHierarchyTmpl: React.FC = () => {
    const { state } = useData();
    const [expanded, setExpanded] = useState<Set<string>>(new Set(['EPS-ROOT']));

    const toggle = (id: string) => {
        const next = new Set(expanded);
        if (next.has(id)) next.delete(id); else next.add(id);
        setExpanded(next);
    };

    const renderNode = (nodes: any[], parentId: string | null = null, level = 0) => {
        return nodes.filter(n => n.parentId === parentId).map(node => (
            <div key={node.id}>
                <div 
                    onClick={() => toggle(node.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-sm hover:bg-slate-50 ${expanded.has(node.id) ? 'font-bold text-nexus-700' : 'text-slate-600'}`}
                    style={{ paddingLeft: `${level * 16 + 8}px` }}
                >
                    {expanded.has(node.id) ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                    <Folder size={16} className="text-blue-400" />
                    <span className="truncate">{node.name}</span>
                </div>
                {expanded.has(node.id) && renderNode(nodes, node.id, level + 1)}
            </div>
        ));
    };

    return (
        <div className="flex gap-6 h-full">
            <div className="w-72 border border-slate-200 bg-white rounded-xl overflow-hidden flex flex-col shadow-sm">
                <div className="p-4 border-b bg-slate-50 font-bold text-[10px] uppercase text-slate-500 tracking-widest">Enterprise Tree</div>
                <div className="flex-1 overflow-auto p-2">{renderNode(state.eps)}</div>
            </div>
            <Card className="flex-1 p-8 flex flex-col items-center justify-center text-slate-400 text-center border-dashed">
                <Table size={48} className="mb-4 opacity-10" />
                <p>Select a node to inspect nested project data.</p>
            </Card>
        </div>
    );
};