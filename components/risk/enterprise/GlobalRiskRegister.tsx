import React, { useState, useMemo } from 'react';
import { useData } from '../../../context/DataContext';
import { useTheme } from '../../../context/ThemeContext';
import DataTable from '../../common/DataTable';
import { Column, Risk } from '../../../types/index';
import { Badge } from '../../ui/Badge';
import { formatCompactCurrency } from '../../../utils/formatters';
import { Filter, Search, Download, Briefcase } from 'lucide-react';
import { Button } from '../../ui/Button';
import { EmptyGrid } from '../../common/EmptyGrid';

interface EnrichedRisk extends Risk {
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
        
        state.risks.forEach(r => {
            const proj = state.projects.find(p => p.id === r.projectId);
            list.push({
                ...r,
                context: 'Project',
                sourceName: proj ? `${proj.code}: ${proj.name}` : r.projectId
            });
        });

        state.portfolioRisks.forEach(r => {
            list.push({
                ...r,
                context: 'Portfolio',
                sourceName: 'Enterprise Portfolio',
                financialImpact: r.financialImpact || 0,
                projectId: 'GLOBAL',
                responseActions: [],
                strategy: 'Accept',
                score: r.score || 0
            } as EnrichedRisk);
        });

        state.programRisks.forEach(r => {
             const prog = state.programs.find(p => p.id === r.programId);
             list.push({
                 ...r,
                 context: 'Program',
                 sourceName: prog ? `PRG: ${prog.name}` : r.programId
             } as EnrichedRisk);
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

    const columns = useMemo<Column<EnrichedRisk>[]>(() => [
        { key: 'context', header: 'Node Level', width: 'w-24', render: (r) => <Badge variant={r.context === 'Portfolio' ? 'info' : r.context === 'Program' ? 'warning' : 'neutral'}>{r.context}</Badge>, sortable: true },
        { key: 'sourceName', header: 'Source Artifact', width: 'w-48', render: (r) => <span className={`text-[11px] font-bold ${theme.colors.text.secondary} truncate block max-w-[200px] uppercase tracking-tight`} title={r.sourceName}>{r.sourceName}</span>, sortable: true },
        { key: 'description', header: 'Risk Narrative & Summary', render: (r) => <span className={`text-sm font-black ${theme.colors.text.primary} line-clamp-2 uppercase tracking-tight`} title={r.description}>{r.description}</span> },
        { key: 'category', header: 'RBS Domain', width: 'w-32', sortable: true, render: (r) => <span className="text-xs font-bold text-slate-500 uppercase">{r.category}</span> },
        { key: 'score', header: 'Score', align: 'center', width: 'w-20', render: (r) => <span className={`font-black text-base ${r.score >= 15 ? 'text-red-600' : r.score >= 8 ? 'text-yellow-600' : 'text-green-600'}`}>{r.score}</span>, sortable: true },
        { key: 'financialImpact', header: 'Net Exposure', align: 'right', width: 'w-32', render: (r) => <span className="font-mono font-black text-slate-800 text-sm">{formatCompactCurrency(r.financialImpact || 0)}</span>, sortable: true },
        { key: 'status', header: 'Lifecycle', width: 'w-24', render: (r) => <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border shadow-inner ${theme.colors.background} ${theme.colors.border}`}>{r.status}</span>, sortable: true }
    ], [theme]);

    return (
        <div className={`h-full flex flex-col ${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
            <div className={`p-4 border-b ${theme.colors.border} flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50 shadow-inner`}>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-72">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                        <input 
                            className={`w-full pl-9 pr-4 py-2 border ${theme.colors.border} rounded-xl text-sm font-bold focus:ring-4 focus:ring-nexus-500/10 focus:border-nexus-500 outline-none transition-all`}
                            placeholder="Search risk ledger..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select 
                        className={`p-2 h-9 text-[10px] font-black uppercase tracking-widest border border-slate-200 rounded-xl bg-white focus:ring-4 focus:ring-nexus-500/5 outline-none cursor-pointer`}
                        value={contextFilter}
                        onChange={e => setContextFilter(e.target.value)}
                    >
                        <option value="All">All Tiers</option>
                        <option value="Portfolio">Portfolio</option>
                        <option value="Program">Program</option>
                        <option value="Project">Project</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" icon={Download} className="font-black uppercase tracking-widest text-[9px] h-9">Export Ledger</Button>
                </div>
            </div>
            
            <div className={`flex-1 overflow-hidden p-0 bg-white`}>
                 {filteredRisks.length > 0 ? (
                    <DataTable 
                        data={filteredRisks}
                        columns={columns}
                        keyField="id"
                        emptyMessage="No active risks found matching criteria."
                    />
                 ) : (
                    <div className="h-full flex flex-col justify-center">
                        <EmptyGrid title="Risk Ledger Inactive" description="No threats recorded for the selected organizational tiers." icon={Briefcase} />
                    </div>
                 )}
            </div>
        </div>
    );
};