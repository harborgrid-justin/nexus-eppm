
import React from 'react';
import { QualityReport } from '../../../types';
import StatCard from '../../shared/StatCard';
import { ClipboardList, CheckCircle, AlertOctagon } from 'lucide-react';
import { Button } from '../../ui/Button';

interface ControlLogHeaderProps {
    reports: QualityReport[];
    canEdit: boolean;
    onNewInspection: () => void;
}

export const ControlLogHeader: React.FC<ControlLogHeaderProps> = ({ reports, canEdit, onNewInspection }) => {
    const total = reports.length;
    const pass = reports.filter(r => r.status === 'Pass').length;
    const fail = reports.filter(r => r.status === 'Fail').length;

    return (
        <div className="p-6 border-b border-border bg-white flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
             <div className="grid grid-cols-3 gap-6 w-full lg:w-auto">
                 <StatCard title="Inspections" value={total} icon={ClipboardList} />
                 <StatCard title="Passed" value={pass} icon={CheckCircle} trend="up" />
                 <StatCard title="Failed" value={fail} icon={AlertOctagon} trend={fail > 0 ? 'down' : undefined} />
             </div>
             {canEdit && <Button icon={ClipboardList} onClick={onNewInspection}>New Inspection</Button>}
        </div>
    );
};
