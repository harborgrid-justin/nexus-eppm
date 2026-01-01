
import React from 'react';
import { Shield, Check, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const PERMISSIONS = ['Read', 'Write', 'Delete', 'Approve', 'Admin'];
const ROLES = ['Viewer', 'Team Member', 'Project Manager', 'Admin'];

export const PermissionMatrix: React.FC = () => {
  const theme = useTheme();

  return (
    <div className={`${theme.components.card} overflow-hidden`}>
        <div className={`p-4 ${theme.colors.background} border-b ${theme.colors.border} font-bold ${theme.colors.text.primary} flex items-center gap-2`}>
            <Shield size={18} className="text-nexus-600"/> Security Matrix
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className={theme.colors.background}>
                    <tr>
                        <th className={`${theme.components.table.header} text-left`}>Role</th>
                        {PERMISSIONS.map(p => <th key={p} className={`${theme.components.table.header} text-center`}>{p}</th>)}
                    </tr>
                </thead>
                <tbody className={`divide-y ${theme.colors.border.replace('border-', 'divide-')}`}>
                    {ROLES.map(role => (
                        <tr key={role} className={theme.components.table.row}>
                            <td className={`${theme.components.table.cell} font-bold`}>{role}</td>
                            {PERMISSIONS.map((p, i) => {
                                const hasPerm = (role === 'Admin') || (role === 'Project Manager' && i < 4) || (role === 'Team Member' && i < 2) || (role === 'Viewer' && i === 0);
                                return (
                                    <td key={p} className="px-6 py-4 text-center">
                                        {hasPerm ? <Check size={16} className="text-green-500 mx-auto"/> : <X size={16} className={`${theme.colors.text.tertiary} mx-auto`}/>}
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};
