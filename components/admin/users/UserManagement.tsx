
import React, { useState, useMemo, useDeferredValue } from 'react';
import { User, Role } from '../../../types/auth';
import { useAuth } from '../../../context/AuthContext';
import { UserPlus, Search } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useData } from '../../../context/DataContext';
import { UserTable } from './UserTable';
import { UserPanel } from './UserPanel';
import { EmptyState } from '../../common/EmptyState';
import { useTheme } from '../../../context/ThemeContext';

const UserManagement: React.FC = () => {
  const { updateUserRole } = useAuth();
  const { state, dispatch } = useData();
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);

  const filteredUsers = useMemo(() => {
      const users = state.users || [];
      return users.filter(u => 
        u.name.toLowerCase().includes(deferredSearchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(deferredSearchTerm.toLowerCase())
      );
  }, [state.users, deferredSearchTerm]);

  const handleOpenPanel = (user?: User) => {
    setEditingUser(user || { name: '', email: '', role: 'Viewer', status: 'Active', department: 'Unassigned' });
    setIsPanelOpen(true);
  };

  const handleSave = (userToSave: User) => {
    dispatch({
        type: userToSave.id.startsWith('U-') ? 'ADMIN_UPDATE_USER' : 'ADMIN_ADD_USER',
        payload: userToSave
    });
    if (userToSave.id) updateUserRole(userToSave.id, userToSave.role as Role);
    setIsPanelOpen(false);
  };

  const handleDelete = (id: string) => {
      if (confirm("Permanently remove this user?")) {
          dispatch({ type: 'ADMIN_DELETE_USER', payload: id });
      }
  };

  return (
    <div className="h-full flex flex-col bg-white">
        <div className={`p-4 border-b ${theme.colors.border} flex flex-col md:flex-row justify-between items-center ${theme.colors.background} gap-4`}>
            <div className="relative w-full md:w-80 group">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-nexus-600 transition-colors"/>
                <input
                    type="text"
                    placeholder="Search directory..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-4 focus:ring-nexus-500/5 focus:border-nexus-500 outline-none bg-white text-sm font-bold shadow-inner transition-all"
                />
            </div>
            <Button icon={UserPlus} onClick={() => handleOpenPanel()} className="w-full md:w-auto shadow-lg shadow-nexus-500/20 font-black uppercase text-[10px] tracking-widest px-8">
                Provision User
            </Button>
        </div>

        <div className={`flex-1 overflow-auto p-4 ${theme.colors.background}/50`}>
            {filteredUsers.length > 0 ? (
                <UserTable 
                    users={filteredUsers}
                    onEdit={handleOpenPanel}
                    onDelete={handleDelete}
                />
            ) : (
                <div className="h-full flex flex-col justify-center">
                    <EmptyState 
                        title="No Users Found" 
                        description={searchTerm ? `No users match "${searchTerm}"` : "The user directory is empty."}
                        icon={Search}
                        action={searchTerm ? undefined : <Button size="sm" onClick={() => handleOpenPanel()}>Add User</Button>}
                    />
                </div>
            )}
        </div>
        
        <UserPanel 
            isOpen={isPanelOpen}
            onClose={() => setIsPanelOpen(false)}
            onSave={handleSave}
            editingUser={editingUser}
        />
    </div>
  );
};
export default UserManagement;
