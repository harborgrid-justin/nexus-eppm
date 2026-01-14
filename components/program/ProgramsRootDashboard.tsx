
import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { ProgramCommandBar } from './dashboard/ProgramCommandBar';
import { ProgramPortfolioStats } from './dashboard/ProgramPortfolioStats';
import { ProgramListGrid } from './dashboard/ProgramListGrid';
import { EmptyGrid } from '../common/EmptyGrid';
import { Layers } from 'lucide-react';

interface ProgramsRootDashboardProps {
  onSelectProgram: (id: string) => void;
}

const ProgramsRootDashboard: React.FC<ProgramsRootDashboardProps> = ({ onSelectProgram }) => {
  const { state } = useData();
  const theme = useTheme();
  const navigate = useNavigate();

  const metrics = useMemo(() => {
    const totalBudget = state.programs.reduce((acc, p) => acc + (p.budget || 0), 0);
    
    let totalSpent = 0;
    state.programs.forEach(prog => {
       const childProjects = state.projects.filter(p => p.programId === prog.id);
       totalSpent += childProjects.reduce((s, p) => s + (p.spent || 0), 0);
    });

    const activeCount = state.programs.filter(p => p.status === 'Active').length;
    const criticalCount = state.programs.filter(p => p.health === 'Critical').length;
    
    return { totalBudget, totalSpent, activeCount, criticalCount };
  }, [state.programs, state.projects]);

  const handleCreateProgram = () => {
    navigate('/programs/create');
  };

  if (state.programs.length === 0) {
      return (
          <div className="h-full flex flex-col items-center justify-center p-8 animate-nexus-in">
              <EmptyGrid 
                title="Program Portfolio Empty"
                description="The organizational strategic layer requires defined programs to aggregate project delivery and value realization. Establish your first program to activate executive reporting."
                icon={Layers}
                actionLabel="Establish Strategic Program"
                onAdd={handleCreateProgram}
              />
          </div>
      )
  }

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-in fade-in duration-300 scrollbar-thin`}>
        <ProgramCommandBar onCreateProgram={handleCreateProgram} />
        <ProgramPortfolioStats metrics={metrics} programCount={state.programs.length} />
        <ProgramListGrid 
            programs={state.programs} 
            projects={state.projects} 
            onSelectProgram={onSelectProgram} 
            onCreateProgram={handleCreateProgram} 
        />
    </div>
  );
};

export default ProgramsRootDashboard;
