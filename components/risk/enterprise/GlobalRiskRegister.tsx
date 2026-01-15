
import React, { useState, useMemo } from 'react';
import { useData } from '../../../context/DataContext';
import { useTheme } from '../../../context/ThemeContext';
import DataTable from '../../common/DataTable';
import { Column, Risk } from '../../../types/index';
import { Badge } from '../../ui/Badge';
import { formatCompactCurrency } from '../../../utils/formatters';
import { Filter, Search, Download, Briefcase, Globe, ShieldAlert } from 'lucide-react';
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
                sourceName: 'Strategic Enterprise Layer',
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
        { key: 'context', header: 'Topology Level', width: 'w-32', render: (r) => <Badge variant={r.context === 'Portfolio' ? 'info' : r.context === 'Program' ? 'warning' : 'neutral'} className="h-7 px-4">{r.context}</Badge>, sortable: true },
        { key: 'sourceName', header: 'Source Artifact', width: 'w-56', render: (r) => <span className={`text-[11px] font-black text-slate-400 truncate block max-w-[220px] uppercase tracking-tighter group-hover:text-nexus-600 transition-colors`} title={r.sourceName}>{r.sourceName}</span>, sortable: true },
        { key: 'description', header: 'Risk Narrative Summary', render: (r) => <span className={`text-sm font-black ${theme.colors.text.primary} line-clamp-2 uppercase tracking-tight`} title={r.description}>{r.description}</span> },
        { key: 'category', header: 'RBS Domain', width: 'w-32', sortable: true, render: (r) => <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{r.category}</span> },
        { key: 'score', header: 'Heat', align: 'center', width: 'w-24', render: (r) => <span className={`font-black text-base h-10 w-14 flex items-center justify-center rounded-2xl ${r.score >= 15 ? 'bg-red-50 text-red-600 border border-red-100' : r.score >= 8 ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>{r.score}</span>, sortable: true },
        { key: 'financialImpact', header: 'Net Exposure', align: 'right', width: 'w-36', render: (r) => <span className="font-mono font-black text-slate-900 text-sm tabular-nums">{formatCompactCurrency(r.financialImpact || 0)}</span>, sortable: true },
        { key: 'status', header: 'Lifecycle', width: 'w-32', render: (r) => <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-xl border shadow-inner ${theme.colors.background} ${theme.colors.border}`}>{r.status}</span>, sortable: true }
    ], [theme]);

    return (
        <div className={`h-full flex flex-col bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden`}>
            <div className={`p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6 bg-slate-50/30 shadow-inner`}>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-80 group">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-nexus-500 transition-colors"/>
                        <input 
                            className={`w-full pl-12 pr-4 py-2.5 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-8 focus:ring-nexus-500/5 focus:border-nexus-500 outline-none transition-all bg-white shadow-sm`}
                            placeholder="Search universal risk graph..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select 
                        className={`p-2.5 h-11 text-[10px] font-black uppercase tracking-[0.2em] border border-slate-200 rounded-2xl bg-white focus:ring-4 focus:ring-nexus-500/5 outline-none cursor-pointer shadow-sm text-slate-700`}
                        value={contextFilter}
                        onChange={e => setContextFilter(e.target.value)}
                    >
                        <option value="All">All Organizational Tiers</option>
                        <option value="Portfolio">Enterprise Portfolio</option>
                        <option value="Program">Program Execution</option>
                        <option value="Project">Tactical Projects</option>
                    </select>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" size="md" icon={Download} className="font-black uppercase tracking-widest text-[10px] h-11 px-8 rounded-2xl">Export Ledger</Button>
                </div>
            </div>
            
            <div className={`flex-1 overflow-hidden p-0 bg-white relative`}>
                 {filteredRisks.length > 0 ? (
                    <DataTable 
                        data={filteredRisks}
                        columns={columns}
                        keyField="id"
                        emptyMessage="The universal risk ledger contains zero matching artifacts."
                    />
                 ) : (
                    <div className="h-full flex flex-col justify-center">
                        <EmptyGrid 
                            title="Organizational Risk Matrix Null" 
                            description="No threats or opportunities have been identified across the selected strategic partitions. Governance baseline is optimal." 
                            icon={ShieldAlert} 
                        />
                    </div>
                 )}
            </div>
        </div>
    );
};
