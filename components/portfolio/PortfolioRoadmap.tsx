
import React from 'react';
import { Map as MapIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { AlignmentPanel } from './roadmap/AlignmentPanel';
import { RoadmapTimeline } from './roadmap/RoadmapTimeline';
import { DependencyLog } from './roadmap/DependencyLog';
import { usePortfolioRoadmapLogic } from '../../hooks/domain/usePortfolioRoadmapLogic';
import { EmptyGrid } from '../common/EmptyGrid';
import { useNavigate } from 'react-router-dom';

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
      handleEditAlignment,
      handleMoveDriver,
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
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-6 animate-in fade-in`}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h2 className={`${theme.typography.h2} flex items-center gap-2`}>
                    <MapIcon className="text-nexus-600" size={24}/> Strategic Portfolio Roadmap
                </h2>
                <p className={theme.typography.small}>Long-range visualization of portfolio components aligned to strategic drivers.</p>
            </div>
        </div>

        {/* Pass the computed lanes instead of raw driver objects for better display logic */}
        <RoadmapTimeline 
            drivers={drivers}
            lanes={lanes}
            projects={projects} 
            onEditAlignment={handleEditAlignment} 
        />

        <DependencyLog />

        <AlignmentPanel
            isOpen={isEditPanelOpen}
            onClose={() => setIsEditPanelOpen(false)}
            projectId={selectedProjectId}
            onMoveDriver={handleMoveDriver}
        />
    </div>
  );
};

export default PortfolioRoadmap;
