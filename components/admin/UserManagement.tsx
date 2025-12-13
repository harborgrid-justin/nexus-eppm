
import React, { useState } from 'react';
import { MOCK_USERS } from '../../constants/auth';
import { User, Role } from '../../types/auth';
import { useAuth } from '../../context/AuthContext';
import { Users, Search, MoreVertical, Shield, Mail, Calendar, UserPlus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../ui/Badge';

const UserManagement: React.FC = () => {
  const theme = useTheme();
  const { updateUserRole } = useAuth(); // In real app, this calls API
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleChange = (userId: string, newRole: Role) => {
    // Optimistic update
    const updated = users.map(u => u.id === userId ? { ...u, role: newRole } : u);
    setUsers(updated);
    updateUserRole(userId, newRole);
  };

  return (
    <div className="h-full flex flex-col">
        <div className={`p-4 ${theme.layout.headerBorder} flex justify-between items-center bg-slate-50`}>
            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search users..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-64 focus:ring-1 focus:ring-nexus-500"
                />
            </div>
            <button className={`flex items-center gap-2 px-3 py-2 ${theme.colors.accentBg} text-white rounded-lg text-sm font-medium hover:bg-nexus-700 shadow-sm`}>
                <UserPlus size={16} /> Invite User
            </button>
        </div>

        <div className="flex-1 overflow-auto">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-white">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Department</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Login</th>
                        <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                    {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-slate-900">{user.name}</div>
                                        <div className="text-xs text-slate-500 flex items-center gap-1"><Mail size={10}/> {user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                    <Shield size={14} className="text-slate-400" />
                                    <select 
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                                        className="text-sm border-none bg-transparent font-medium text-slate-700 focus:ring-0 cursor-pointer hover:bg-slate-200 rounded px-1 -ml-1"
                                    >
                                        <option value="Global Admin">Global Admin</option>
                                        <option value="Portfolio Manager">Portfolio Manager</option>
                                        <option value="Project Manager">Project Manager</option>
                                        <option value="Team Member">Team Member</option>
                                        <option value="Viewer">Viewer</option>
                                    </select>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant={user.status === 'Active' ? 'success' : 'neutral'}>
                                    {user.status}
                                </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                {user.department}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                <div className="flex items-center gap-1">
                                    <Calendar size={12} />
                                    {new Date(user.lastLogin).toLocaleDateString()}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-slate-400 hover:text-slate-600">
                                    <MoreVertical size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default UserManagement;
