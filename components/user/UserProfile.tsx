
import React, { useState, useEffect } from 'react';
import { SidePanel } from '../ui/SidePanel';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { User, Role } from '../../types/auth';
import { User as UserIcon, Mail, Shield, Building, Clock, LogOut, Camera, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { dispatch } = useData();
  const theme = useTheme();
  
  const [formData, setFormData] = useState<Partial<User>>({});

  useEffect(() => {
    if (user) {
        setFormData({ ...user });
    }
  }, [user, isOpen]);

  const handleSave = () => {
    if (!user || !formData.name) return;
    
    // In a real app, this would call an API
    dispatch({ 
        type: 'UPDATE_USER', 
        payload: { ...user, ...formData } as User 
    });
    onClose();
  };

  const handleLogout = () => {
      onClose();
      logout();
  };

  if (!user) return null;

  return (
    <SidePanel
        isOpen={isOpen}
        onClose={onClose}
        title="User Profile"
        width="md:w-[450px]"
        footer={
            <div className="flex justify-between w-full">
                 <Button variant="danger" icon={LogOut} onClick={handleLogout}>Sign Out</Button>
                 <div className="flex gap-2">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                 </div>
            </div>
        }
    >
        <div className="space-y-8">
            {/* Header Profile Image */}
            <div className="flex flex-col items-center">
                <div className="relative group cursor-pointer">
                    <div className={`w-24 h-24 rounded-full overflow-hidden border-4 ${theme.colors.background} shadow-md`}>
                        <img src={formData.avatar || user.avatar} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="text-white" size={24}/>
                    </div>
                </div>
                <h3 className={`mt-3 text-xl font-bold ${theme.colors.text.primary}`}>{user.name}</h3>
                <span className={`text-sm font-medium ${theme.colors.background} px-3 py-1 rounded-full mt-1 border ${theme.colors.border} ${theme.colors.text.secondary}`}>{user.role}</span>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
                <div>
                    <label className={theme.typography.label + " block mb-1.5"}>Display Name</label>
                    <Input 
                        icon={UserIcon}
                        value={formData.name || ''} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                    />
                </div>
                
                <div>
                    <label className={theme.typography.label + " block mb-1.5"}>Email Address</label>
                    <Input 
                        icon={Mail}
                        value={formData.email || ''} 
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                        disabled
                    />
                    <p className={`text-[10px] ${theme.colors.text.tertiary} mt-1 pl-1`}>Email is managed by Identity Provider (SSO).</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                         <label className={theme.typography.label + " block mb-1.5"}>Department</label>
                         <Input 
                            icon={Building}
                            value={formData.department || ''} 
                            onChange={e => setFormData({...formData, department: e.target.value})} 
                         />
                    </div>
                    <div>
                         <label className={theme.typography.label + " block mb-1.5"}>System Role</label>
                         <div className="relative">
                             <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                             <input 
                                className={`w-full pl-10 pr-4 py-2 ${theme.colors.background} border ${theme.colors.border} rounded-lg text-sm ${theme.colors.text.secondary} cursor-not-allowed font-medium`}
                                value={formData.role} 
                                disabled
                             />
                         </div>
                    </div>
                </div>

                <div className={`${theme.colors.background} p-4 rounded-xl border ${theme.colors.border} flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 ${theme.colors.surface} rounded-lg border ${theme.colors.border} ${theme.colors.text.tertiary}`}>
                            <Clock size={16}/>
                        </div>
                        <div>
                            <p className={theme.typography.label}>Last Session</p>
                            <p className={`text-sm font-mono font-bold ${theme.colors.text.primary}`}>{new Date(user.lastLogin).toLocaleString()}</p>
                        </div>
                    </div>
                    <span className={`text-[10px] font-bold ${theme.colors.semantic.success.bg} ${theme.colors.semantic.success.text} px-2 py-1 rounded border ${theme.colors.semantic.success.border} uppercase`}>Active</span>
                </div>
            </div>
            
            <div className={`pt-4 border-t ${theme.colors.border}`}>
                <h4 className={`text-sm font-bold ${theme.colors.text.primary} mb-3`}>Interface & Preferences</h4>
                <div className="space-y-3">
                    <label className={`flex items-center justify-between p-3 border ${theme.colors.border} rounded-lg cursor-pointer hover:${theme.colors.background}`}>
                        <div className="flex items-center gap-3">
                            {theme.mode === 'dark' ? <Moon size={18} className="text-purple-400" /> : <Sun size={18} className="text-orange-500" />}
                            <span className={`text-sm ${theme.colors.text.secondary}`}>Dark Mode</span>
                        </div>
                        <input 
                            type="checkbox" 
                            className="rounded text-nexus-600 focus:ring-nexus-500" 
                            checked={theme.mode === 'dark'}
                            onChange={() => theme.setMode(theme.mode === 'dark' ? 'light' : 'dark')}
                        />
                    </label>

                    <label className={`flex items-center justify-between p-3 border ${theme.colors.border} rounded-lg cursor-pointer hover:${theme.colors.background}`}>
                        <span className={`text-sm ${theme.colors.text.secondary}`}>Compact Density Mode</span>
                        <input 
                            type="checkbox" 
                            className="rounded text-nexus-600 focus:ring-nexus-500" 
                            checked={theme.density === 'compact'}
                            onChange={() => theme.setDensity(theme.density === 'compact' ? 'comfortable' : 'compact')}
                        />
                    </label>
                </div>
            </div>
        </div>
    </SidePanel>
  );
};

export default UserProfile;
