
import React, { useState } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { useData } from '../../context/DataContext';
import { Layers, ArrowRight, Activity, TrendingUp, DollarSign, Plus, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { formatCompactCurrency } from '../../utils/formatters';
import { ProgressBar } from '../common/ProgressBar';
import { StatusBadge } from '../common/StatusBadge';
import { Card } from '../ui/Card';
import { EmptyGrid } from '../common/EmptyGrid';
import { Button } from '../ui/Button';
import { ProgramForm } from './ProgramForm';
import { Program } from '../../types';

interface PortfolioProgramsProps {
  onSelectProgram: (programId: string) => void;
}

const PortfolioPrograms: React.FC<PortfolioProgramsProps> = ({ onSelectProgram }) => {
  const { programs, projects } = usePortfolioData();
  const { dispatch } = useData();
  const theme = useTheme();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  const handleCreate = () => {
      setEditingProgram(null);
      setIsFormOpen(true);
  };

  const handleEdit = (program: Program) => {
      setEditingProgram(program);
      setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
      if (confirm("Are you sure you want to delete this program? Linked projects will remain but be unlinked.")) {
          dispatch({ type: 'DELETE_PROGRAM', payload: id });
      }
  };

  if (programs.length === 0) {
      return (
          <div className="h-full flex items-center justify-center p-12">
              <EmptyGrid 
                title="Program Portfolio Null"
                description="No cross-functional programs identified. Establish a program to aggregate strategic project delivery."
                icon={Layers}
                actionLabel="Establish Program"
                onAdd={handleCreate}
              />
              <ProgramForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} program={null} />
          </div>
      );
  }

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-in fade-in duration-300`}>
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className={theme.typography.h2}>Program Portfolio Summary</h2>
          <p className={theme.typography.small}>Aggregated oversight of cross-project delivery groups.</p>
        </div>
        <Button size="sm" icon={Plus} onClick={handleCreate}>Establish Program</Button>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
        {programs.map(program => {
          const childProjects = projects.filter(p => p.programId === program.id);
          const totalBudget = program.budget;
          const totalSpent = childProjects.reduce((sum, p) => sum + p.spent, 0);
          const avgProgress = childProjects.length > 0 
            ? Math.round(childProjects.reduce((sum, p) => sum + (p.spent / p.budget) * 100, 0) / childProjects.length)
            : 0;

          return (
            <Card key={program.id} className="p-0 overflow-hidden group hover:border-nexus-400 transition-all relative">
              {/* Card Actions Overlay */}
              <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white/80 backdrop-blur rounded-lg p-1 shadow-sm border border-slate-100">
                   <button onClick={() => handleEdit(program)} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-nexus-600" title="Edit Program">
                       <Edit2 size={14}/>
                   </button>
                   <button onClick={() => handleDelete(program.id)} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-red-500" title="Delete Program">
                       <Trash2 size={14}/>
                   </button>
              </div>

              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-nexus-600 text-white rounded-xl shadow-lg shadow-nexus-500/20">
                    <Layers size={24}/>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-nexus-700 transition-colors">{program.name}</h3>
                    <p className="text-xs text-slate-500">Manager: {program.managerId}</p>
                  </div>
                </div>
                <StatusBadge status={program.health} variant="health" />
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-slate-50">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><DollarSign size={12}/> Financials</p>
                  <p className="text-sm font-bold text-slate-800">{formatCompactCurrency(totalSpent)} <span className="text-slate-400 font-normal">/ {formatCompactCurrency(totalBudget)}</span></p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Activity size={12}/> Execution</p>
                  <p className="text-sm font-bold text-slate-800">{childProjects.length} <span className="text-slate-400 font-normal">Active Projects</span></p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><TrendingUp size={12}/> Progress</p>
                  <p className="text-sm font-bold text-slate-800">{avgProgress}% <span className="text-slate-400 font-normal">Avg.</span></p>
                </div>
              </div>

              <div className="p-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Program Component Health</p>
                <div className="space-y-3">
                  {childProjects.slice(0, 3).map(p => (
                    <div key={p.id} className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium truncate w-1/2">{p.name}</span>
                      <div className="flex items-center gap-3 w-1/3">
                        <ProgressBar value={(p.spent/p.budget)*100} size="sm" colorClass={p.health === 'Critical' ? 'bg-red-500' : 'bg-nexus-500'} />
                      </div>
                      <StatusBadge status={p.health} variant="health" className="scale-75 origin-right" />
                    </div>
                  ))}
                  {childProjects.length > 3 && (
                    <p className="text-[10px] text-center text-slate-400 font-bold uppercase pt-2 border-t border-slate-50">
                      + {childProjects.length - 3} more projects
                    </p>
                  )}
                  {childProjects.length === 0 && (
                      <p className="text-xs text-slate-400 italic text-center py-2">No projects assigned.</p>
                  )}
                </div>
              </div>

              <button 
                onClick={() => onSelectProgram(program.id)}
                className="w-full py-4 bg-slate-50 hover:bg-nexus-50 text-nexus-600 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors border-t border-slate-100"
              >
                Launch Program Control Center <ArrowRight size={14}/>
              </button>
            </Card>
          );
        })}
      </div>
      
      <ProgramForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} program={editingProgram} />
    </div>
  );
};

export default PortfolioPrograms;
