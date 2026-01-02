import React, { useState } from 'react';
import { SidePanel } from '../../ui/SidePanel';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

interface UpdateReservePanelProps {
    isOpen: boolean;
    onClose: () => void;
    reserves: { contingencyReserve: number; managementReserve: number };
    onSave: () => void;
}

export const UpdateReservePanel: React.FC<UpdateReservePanelProps> = ({ isOpen, onClose, reserves, onSave }) => {
    const [values, setValues] = useState(reserves);

    return (
        <SidePanel
            isOpen={isOpen}
            onClose={onClose}
            title="Adjust Project Reserves"
            footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={onSave}>Save Adjustments</Button></>}
        >
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Contingency Reserve</label>
                    <Input type="number" value={values.contingencyReserve} onChange={e => setValues({...values, contingencyReserve: parseFloat(e.target.value)})} />
                    <p className="text-xs text-slate-500 mt-1">For identified risks (Within Baseline).</p>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Management Reserve</label>
                    <Input type="number" value={values.managementReserve} onChange={e => setValues({...values, managementReserve: parseFloat(e.target.value)})} />
                    <p className="text-xs text-slate-500 mt-1">For unidentified risks (Above Baseline).</p>
                </div>
            </div>
        </SidePanel>
    );
};
