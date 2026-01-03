
import React, { useState, useMemo } from 'react';
import { useData } from '../../../context/DataContext';
import { useTheme } from '../../../context/ThemeContext';
import DataTable, { Column } from '../../common/DataTable';
import { Badge } from '../../ui/Badge';
import { formatCompactCurrency } from '../../../utils/formatters';
import { Filter, Search, Download } from 'lucide-react';
import { Button } from '../../ui/Button';

interface EnrichedRisk {
    id: string;
    description: string;
    category: string;
    score: number;
    status: string;
    ownerId: string;
    financialImpact?: number;
    context: string;
    sourceName: string;
}

export const GlobalRiskRegister: React.FC = () => {
    const { state } = useData();
    const theme = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [contextFilter, setContextFilter] = useState('All');

    const allRisks = useMemo(() => {
        const list: EnrichedRisk[] = [];
        
        // Project Risks
        state.risks.forEach(r => {
            const proj = state.projects.find(p => p.id === r.projectId);
            list.push({
                ...r,
                context: 'Project',
                sourceName: proj ? `${proj.code}: ${proj.name}` : r.projectId
            });
        });

        // Portfolio Risks
        state.portfolioRisks.forEach(r => {
            list.push({
                ...r,
                context: 'Portfolio',
                sourceName: 'Enterprise Portfolio',
                financialImpact: 0 // Portfolio risks mock might typically lack this field or define it differently
            });
        });

        // Program Risks
        state.programRisks.forEach(r => {
             const prog = state.programs.find(p => p.id === r.programId);
             list.push({
                 ...r,
                 context: 'Program',
                 sourceName: prog ? `PRG: ${prog.name}` : r.programId
             });
        });

        return list.sort((a,b) => b.score - a.score);
    }, [state.risks, state.portfolioRisks, state.programRisks, state.projects, state.programs]);

    const filteredRisks = useMemo(() => {
        return allRisks.filter(r => {
            const matchesSearch = r.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  r.sourceName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesContext = contextFilter === 'All' || r.context === contextFilter;
            return matchesSearch && matchesContext;
        });
    }, [allRisks, searchTerm, contextFilter]);

    const columns: Column<EnrichedRisk>[] = [
        { key: 'context', header: 'Level', width: 'w-24', render: (r) => <Badge variant={r.context === 'Portfolio' ? 'info' : r.context === 'Program' ? 'warning' : 'neutral'}>{r.context}</Badge>, sortable: true },
        { key: 'sourceName', header: 'Source', width: 'w-48', render: (r) => <span className="text-xs font-bold text-slate-600 truncate block max-w-[200px]" title={r.sourceName}>{r.sourceName}</span>, sortable: true },
        { key: 'description', header: 'Risk Description', render: (r) => <span className="text-sm font-medium text-slate-900 line-clamp-2" title={r.description}>{r.description}</span> },
        { key: 'category', header: 'Category', width: 'w-32', sortable: true },
        { key: 'score', header: 'Score', align: 'center', width: 'w-20', render: (r) => <span className={`font-bold ${r.score >= 15 ? 'text-red-600' : r.score >= 8 ? 'text-yellow-600' : 'text-green-600'}`}>{r.score}</span>, sortable: true },
        { key: 'financialImpact', header: 'Impact ($)', align: 'right', width: 'w-32', render: (r) => <span className="font-mono text-xs">{formatCompactCurrency(r.financialImpact || 0)}</span>, sortable: true },
        { key: 'ownerId', header: 'Owner', width: 'w-32', render: (r) => <span className="text-xs text-slate-500">{r.ownerId}</span> },
        { key: 'status', header: 'Status', width: 'w-24', render: (r) => <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 border border-slate-200">{r.status}</span>, sortable: true }
    ];

    return (
        <div className={`h-full flex flex-col ${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
            <div className={`p-4 border-b ${theme.colors.border} flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50`}>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                        <input 
                            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-nexus-500 outline-none" 
                            placeholder="Search all risks..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select 
                        className="p-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-nexus-500 outline-none"
                        value={contextFilter}
                        onChange={e => setContextFilter(e.target.value)}
                    >
                        <option value="All">All Levels</option>
                        <option value="Portfolio">Portfolio</option>
                        <option value="Program">Program</option>
                        <option value="Project">Project</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" icon={Download}>Export</Button>
                </div>
            </div>
            
            <div className="flex-1 overflow-hidden p-4 bg-slate-50">
                 <DataTable 
                    data={filteredRisks}
                    columns={columns}
                    keyField="id"
                    emptyMessage="No risks found matching criteria."
                 />
            </div>
            
            <div className="p-3 border-t border-slate-200 bg-white text-xs text-slate-500 flex justify-between px-6">
                <span>Total Active Risks: <strong>{filteredRisks.length}</strong></span>
                <span>Total Exposure: <strong>{formatCompactCurrency(filteredRisks.reduce((s, r) => s + (r.financialImpact || 0), 0))}</strong></span>
            </div>
        </div>
    );
};
