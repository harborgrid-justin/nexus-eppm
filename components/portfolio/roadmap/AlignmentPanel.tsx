
import React from 'react';
import { SidePanel } from '../../ui/SidePanel';
import { Button } from '../../ui/Button';

interface AlignmentPanelProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string | null;
    onMoveDriver: (id: string, driver: string) => void;
}

export const AlignmentPanel: React.FC<AlignmentPanelProps> = ({ isOpen, onClose, projectId, onMoveDriver }) => {
    if (!projectId) return null;

    return (
        <SidePanel
            isOpen={isOpen}
            onClose={onClose}
            title="Strategic Alignment"
            width="md:w-[400px]"
            footer={<Button onClick={onClose}>Done</Button>}
        >
            <div className="space-y-4">
                <p className="text-sm text-slate-600">Realign <strong>{projectId}</strong> to a new strategic driver.</p>
                {['Innovation & Growth', 'Operational Efficiency', 'Regulatory & Compliance', 'Market Expansion'].map(driver => (
                    <button
                        key={driver}
                        onClick={() => { onMoveDriver(projectId, driver); onClose(); }}
                        className="w-full p-4 text-left border rounded-lg hover:bg-slate-50 hover:border-blue-300 transition-all font-medium text-slate-700"
                    >
                        {driver}
                    </button>
                ))}
            </div>
        </SidePanel>
    );
};
