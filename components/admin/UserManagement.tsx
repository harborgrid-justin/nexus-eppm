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
    <div className="h-full flex flex-col">
        <div className={`p-4 ${theme.layout.headerBorder} flex flex-col md:flex-row justify-between items-center ${theme.colors.background} gap-4`}>
            <input
                type="text"
                placeholder="Search directory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 pl-4 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-nexus-500 outline-none"
            />
            <Button icon={UserPlus} onClick={() => handleOpenPanel()} className="w-full md:w-auto">
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