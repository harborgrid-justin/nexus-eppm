
import React, { useState } from 'react';
import { SidePanel } from '../../ui/SidePanel';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { useTheme } from '../../../context/ThemeContext';
import { useData } from '../../../context/DataContext';
import { useProjectWorkspace } from '../../../context/ProjectWorkspaceContext';

interface UpdateReservePanelProps {
    isOpen: boolean;
    onClose: () => void;
    reserves: { contingencyReserve: number; managementReserve: number };
    onSave: () => void;
}

export const UpdateReservePanel: React.FC<UpdateReservePanelProps> = ({ isOpen, onClose, reserves, onSave }) => {
    const theme = useTheme();
    const { dispatch } = useData();
    const { project } = useProjectWorkspace();
    const [values, setValues] = useState(reserves);

    const handleSave = () => {
        dispatch({
            type: 'PROJECT_UPDATE',
            payload: {
                projectId: project.id,
                updatedData: { reserves: values }
            }
        });
        onSave();
    };

    return (
        <SidePanel
            isOpen={isOpen}
            onClose={onClose}
            title="Adjust Project Reserves"
            footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={handleSave}>Save Adjustments</Button></>}
        >
            <div className="space-y-6">
                <div>
                    <label className={`block text-sm font-bold ${theme.colors.text.primary} mb-1`}>Contingency Reserve</label>
                    <Input type="number" value={values.contingencyReserve} onChange={e => setValues({...values, contingencyReserve: parseFloat(e.target.value)})} />
                </div>
                <div>
                    <label className={`block text-sm font-bold ${theme.colors.text.primary} mb-1`}>Management Reserve</label>
                    <Input type="number" value={values.managementReserve} onChange={e => setValues({...values, managementReserve: parseFloat(e.target.value)})} />
                </div>
            </div>
        </SidePanel>
    );
};
