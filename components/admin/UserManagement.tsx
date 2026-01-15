
import React, { useState, useMemo, useDeferredValue } from 'react';
import { User, Role } from '../../types/auth';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { useData } from '../../context/DataContext';
import { UserTable } from './users/UserTable';
import { UserPanel } from './users/UserPanel';
import { EmptyState } from '../common/EmptyState';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';

const UserManagement: React.FC = () => {
  const { updateUserRole } = useAuth();
  const { state, dispatch } = useData();
  const theme = useTheme();
  const { t } = useI18n();
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

  return (
    <div className="h-full flex flex-col bg-white">
        <div className={`p-4 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center bg-slate-50/50 gap-4`}>
            <div className="relative w-full md:w-80 group">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-nexus-600 transition-colors"/>
                <input
                    type="text"
                    placeholder={t('user.search', 'Search directory...')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-4 focus:ring-nexus-500/5 focus:border-nexus-500 outline-none bg-white text-sm font-bold shadow-inner`}
                />
            </div>
            <Button icon={UserPlus} onClick={() => { setEditingUser(null); setIsPanelOpen(true); }} className="shadow-lg shadow-nexus-500/10 font-black uppercase text-[10px] tracking-widest px-8">
                {t('user.provision', 'Provision User')}
            </Button>
        </div>

        <div className="flex-1 overflow-auto bg-white scrollbar-thin">
            {filteredUsers.length > 0 ? (
                <UserTable 
                    users={filteredUsers}
                    onEdit={(u) => { setEditingUser(u); setIsPanelOpen(true); }}
                    onDelete={(id) => dispatch({type: 'ADMIN_DELETE_USER', payload: id})}
                />
            ) : (
                <div className="h-full flex flex-col justify-center">
                    <EmptyState 
                        title={t('user.empty', 'Directory Isolated')}
                        description={t('user.empty_desc', 'The organizational user database is currently unpopulated in this partition.')}
                        icon={Search}
                    />
                </div>
            )}
        </div>
        
        <UserPanel 
            isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)}
            onSave={(u) => dispatch({type: u.id.startsWith('U-') ? 'ADMIN_UPDATE_USER' : 'ADMIN_ADD_USER', payload: u})}
            editingUser={editingUser}
        />
    </div>
  );
};
export default UserManagement;
