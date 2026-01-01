
import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Map as MapIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { AlignmentPanel } from './roadmap/AlignmentPanel';
import { RoadmapTimeline } from './roadmap/RoadmapTimeline';
import { DependencyLog } from './roadmap/DependencyLog';

const PortfolioRoadmap: React.FC = () => {
  const { state, dispatch } = useData();
  const theme = useTheme();

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);

  const handleEditAlignment = (id: string) => {
      setSelectedProjectId(id);
      setIsEditPanelOpen(true);
  };

  const handleMoveDriver = (projectId: string, newDriverId: string) => {
      dispatch({
          type: 'UPDATE_PROJECT',
          payload: { projectId, updatedData: { primaryDriverId: newDriverId } }
      });
  };

  return (
    <div className={`h-full overflow-y-auto p-6 space-y-6 animate-in fade-in`}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h2 className={`${theme.typography.h2} flex items-center gap-2`}>
                    <MapIcon className="text-nexus-600" size={24}/> Strategic Portfolio Roadmap
                </h2>
                <p className={theme.typography.small}>Long-range visualization of portfolio components aligned to strategic drivers.</p>
            </div>
        </div>

        <RoadmapTimeline 
            drivers={state.strategicDrivers} 
            projects={state.projects} 
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
