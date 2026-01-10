import React, { useState, useMemo, useDeferredValue } from 'react';
import { User, Role } from '../../types/auth';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';
import { useData } from '../../context/DataContext';
import { UserTable } from './users/UserTable';
import { UserPanel } from './users/UserPanel';
import { EmptyState } from '../common/EmptyState';

const UserManagement: React.FC = () => {
  const theme = useTheme();
  const { updateUserRole } = useAuth();
  const { state, dispatch } = useData();
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
    <div className={`h-full flex flex-col ${theme.layout.sectionSpacing}`}>
        <div className={`p-4 ${theme.layout.headerBorder} flex flex-col md:flex-row justify-between items-center bg-slate-50/30 gap-4 rounded-xl border ${theme.colors.border}`}>
            <div className="relative w-full md:w-80">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input
                    type="text"
                    placeholder="Search directory..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-nexus-500 outline-none transition-all ${theme.colors.surface} ${theme.colors.border} ${theme.colors.text.primary} text-sm font-medium`}
                />
            </div>
            <Button icon={UserPlus} onClick={() => handleOpenPanel()} className="w-full md:w-auto">
                Provision User
            </Button>
        </div>

        <div className={`flex-1 overflow-hidden rounded-xl border ${theme.colors.border} bg-white`}>
            {filteredUsers.length > 0 ? (
                <div className="h-full overflow-auto">
                    <UserTable 
                        users={filteredUsers}
                        onEdit={handleOpenPanel}
                        onDelete={handleDelete}
                    />
                </div>
            ) : (
                <div className="h-full flex flex-col justify-center">
                    <EmptyState 
                        title="No Users Found" 
                        description={searchTerm ? `No users match "${searchTerm}"` : "The enterprise user directory is currently unpopulated."}
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