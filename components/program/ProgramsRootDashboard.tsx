import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { ProgramCommandBar } from './dashboard/ProgramCommandBar';
import { ProgramPortfolioStats } from './dashboard/ProgramPortfolioStats';
import { ProgramListGrid } from './dashboard/ProgramListGrid';

interface ProgramsRootDashboardProps {
  onSelectProgram: (id: string) => void;
}

const ProgramsRootDashboard: React.FC<ProgramsRootDashboardProps> = ({ onSelectProgram }) => {
  const { state } = useData();
  const theme = useTheme();
  const navigate = useNavigate();

  const metrics = useMemo(() => {
    const totalBudget = state.programs.reduce((acc, p) => acc + p.budget, 0);
    
    let totalSpent = 0;
    state.programs.forEach(prog => {
       const childProjects = state.projects.filter(p => p.programId === prog.id);
       totalSpent += childProjects.reduce((s, p) => s + p.spent, 0);
    });

    const activeCount = state.programs.filter(p => p.status === 'Active').length;
    const criticalCount = state.programs.filter(p => p.health === 'Critical').length;
    
    return { totalBudget, totalSpent, activeCount, criticalCount };
  }, [state.programs, state.projects]);

  const handleCreateProgram = () => {
    // Navigate to dedicated enterprise creation page
    navigate('/programs/create');
  };

  return (
    <div className={`h-full overflow-y-auto p-6 space-y-8 animate-in fade-in duration-300`}>
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