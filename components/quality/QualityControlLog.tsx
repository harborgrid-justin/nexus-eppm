



import React, { useState } from 'react';
// FIX: Corrected import path to use the barrel file to resolve module ambiguity.
import { QualityReport, InspectionChecklist } from '../../types/index';
import { usePermissions } from '../../hooks/usePermissions';
import { useTheme } from '../../context/ThemeContext';
import { ControlLogHeader } from './control/ControlLogHeader';
import { ControlLogTable } from './control/ControlLogTable';
import { ControlLogDetail } from './control/ControlLogDetail';
import { CreateInspectionPanel } from './control/CreateInspectionPanel';

interface QualityControlLogProps {
  qualityReports: QualityReport[] | undefined;
}

const QualityControlLog: React.FC<QualityControlLogProps> = ({ qualityReports = [] }) => {
  const { canEditProject } = usePermissions();
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredReports = qualityReports.filter(r => 
    filterStatus === 'All' || r.status === filterStatus
  );

  // Note: In a real implementation, we would fetch the checklist from an API based on report ID.
  // Since we don't have checklist data in the global state for every report, we pass undefined
  // to the detail view, which will render a "No checklist" state, staying true to the data model.
  const selectedReport = filteredReports.find(r => r.id === selectedReportId);
  const checklist = undefined; 

  return (
    <div className="h-full flex flex-col bg-slate-50/30 overflow-hidden">
       <ControlLogHeader 
         reports={qualityReports}
         canEdit={canEditProject()}
         onNewInspection={() => setIsCreateOpen(true)}
       />
       <div className="flex-1 flex overflow-hidden relative">
          <div className={`flex-1 flex flex-col bg-white overflow-hidden transition-all duration-300 ${selectedReportId ? 'hidden xl:flex xl:w-2/3 border-r border-slate-200' : 'w-full'}`}>
            <ControlLogTable
              reports={filteredReports}
              filterStatus={filterStatus}
              onFilterChange={setFilterStatus}
              onSelectReport={setSelectedReportId}
              selectedReportId={selectedReportId}
            />
          </div>
          {selectedReportId && selectedReport && (
            <ControlLogDetail
              report={selectedReport}
              checklist={checklist}
              onClose={() => setSelectedReportId(null)}
            />
          )}
       </div>
       <CreateInspectionPanel 
         isOpen={isCreateOpen} 
         onClose={() => setIsCreateOpen(false)} 
         onSave={() => setIsCreateOpen(false)} 
       />
    </div>
  );
};

export default QualityControlLog;