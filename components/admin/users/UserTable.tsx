
import React, { useMemo } from 'react';
import { User } from '../../../types/auth';
import DataTable from '../../common/DataTable';
import { Column } from '../../../types';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Edit2, Trash2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface UserTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (id: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete }) => {
    const theme = useTheme();
    const columns = useMemo<Column<User>[]>(() => [
        {
            key: 'name',
            header: 'User',
            render: (user) => (
                <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className={`w-8 h-8 rounded-full border ${theme.colors.border}`} />
                    <div>
                        <div className={`font-medium ${theme.colors.text.primary}`}>{user.name}</div>
                        <div className={`text-xs ${theme.colors.text.tertiary}`}>{user.email}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'role',
            header: 'Role',
            render: (user) => <Badge variant="info">{user.role}</Badge>
        },
        {
            key: 'department',
            header: 'Department',
            render: (user) => <span className={theme.colors.text.secondary}>{user.department}</span>
        },
        {
            key: 'status',
            header: 'Status',
            render: (user) => <Badge variant={user.status === 'Active' ? 'success' : 'neutral'}>{user.status}</Badge>
        },
        {
            key: 'actions',
            header: 'Actions',
            align: 'right',
            render: (user) => (
                <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" icon={Edit2} onClick={(e) => { e.stopPropagation(); onEdit(user); }}>Edit</Button>
                    <Button variant="ghost" size="sm" icon={Trash2} onClick={(e) => { e.stopPropagation(); onDelete(user.id); }} className="text-red-500 hover:bg-red-50">Delete</Button>
                </div>
            )
        }
    ], [onEdit, onDelete, theme]);

    return (
        <DataTable
            data={users}
            columns={columns}
            keyField="id"
            emptyMessage="No users found."
        />
    );
};
