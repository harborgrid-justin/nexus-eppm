import React from 'react';
import { Map as MapIcon, Link } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { AlignmentPanel } from './roadmap/AlignmentPanel';
import { RoadmapTimeline } from './roadmap/RoadmapTimeline';
import { DependencyLog } from './roadmap/DependencyLog';
import { DependencyForm } from './roadmap/DependencyForm';
import { usePortfolioRoadmapLogic } from '../../hooks/domain/usePortfolioRoadmapLogic';
import { EmptyGrid } from '../common/EmptyGrid';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

const PortfolioRoadmap: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const {
      drivers,
      lanes,
      projects,
      selectedProjectId,
      isEditPanelOpen,
      setIsEditPanelOpen,
      isDependencyModalOpen,
      setIsDependencyModalOpen,
      handleEditAlignment,
      handleMoveDriver,
      handleQuickAlign,
      handleAddDependency,
      isEmpty
  } = usePortfolioRoadmapLogic();

  if (isEmpty) {
      return (
        <div className={`h-full flex items-center justify-center ${theme.colors.background}`}>
             <EmptyGrid 
                title="Strategic Roadmap Empty" 
                description="Populate the portfolio with projects to visualize the long-range plan aligned to strategic drivers." 
                icon={MapIcon}
                actionLabel="Create Initiative"
                onAdd={() => navigate('/projectList?action=create')}
             />
        </div>
      );
  }

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-10 animate-in fade-in`}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h2 className={`${theme.typography.h2} flex items-center gap-2`}>
                    <MapIcon className="text-nexus-600" size={24}/> Strategic Portfolio Roadmap
                </h2>
                <p className={theme.typography.small}>Long-range visualization of portfolio components aligned to strategic drivers.</p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" icon={Link} onClick={() => setIsDependencyModalOpen(true)}>Define Dependency</Button>
            </div>
        </div>

        {/* Timeline Visualization */}
        <section>
            <RoadmapTimeline 
                drivers={drivers}
                lanes={lanes}
                projects={projects} 
                onEditAlignment={handleEditAlignment} 
                onQuickAlign={handleQuickAlign}
            />
        </section>

        {/* Dependency Ledger */}
        <section>
            <DependencyLog onAdd={() => setIsDependencyModalOpen(true)} />
        </section>

        {/* Alignment Panel (Sidebar) */}
        <AlignmentPanel
            isOpen={isEditPanelOpen}
            onClose={() => setIsEditPanelOpen(false)}
            projectId={selectedProjectId}
            onMoveDriver={handleMoveDriver}
        />

        {/* Dependency Creation Modal */}
        <DependencyForm 
            isOpen={isDependencyModalOpen}
            onClose={() => setIsDependencyModalOpen(false)}
            onSave={handleAddDependency}
            projects={projects}
        />
    </div>
  );
};

export default PortfolioRoadmap;