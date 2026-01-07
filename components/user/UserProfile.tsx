
import React, { useState, useEffect } from 'react';
import { SidePanel } from '../ui/SidePanel';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { User, Role } from '../../types/auth';
// Added missing Activity icon import from lucide-react
import { User as UserIcon, Mail, Shield, Building, Clock, LogOut, Camera, Moon, Sun, Activity } from 'lucide-react';
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
        title={<span className="font-black text-sm uppercase tracking-widest">Profile Configuration</span>}
        width="md:w-[450px]"
        footer={
            <div className="flex justify-between w-full gap-4">
                 <Button variant="danger" icon={LogOut} onClick={handleLogout} className="shrink-0">Sign Out</Button>
                 <div className="flex gap-2">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                 </div>
            </div>
        }
    >
        <div className="space-y-8 animate-nexus-in">
            {/* Header Profile Image */}
            <div className="flex flex-col items-center">
                <div className="relative group cursor-pointer">
                    <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-white shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                        <img src={formData.avatar || user.avatar} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute inset-0 bg-nexus-900/40 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="text-white" size={24}/>
                    </div>
                </div>
                <h3 className="mt-4 text-2xl font-black text-slate-900 tracking-tight">{user.name}</h3>
                <span className="text-[10px] font-black bg-nexus-50 px-3 py-1 rounded-full mt-1 border border-nexus-200 text-nexus-700 uppercase tracking-widest">{user.role}</span>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Display Name</label>
                    <Input 
                        icon={UserIcon}
                        value={formData.name || ''} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                    />
                </div>
                
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Email Address</label>
                    <Input 
                        icon={Mail}
                        value={formData.email || ''} 
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                        disabled
                    />
                    <p className="text-[10px] text-slate-400 mt-2 font-medium italic">Email is managed by Identity Provider (SSO).</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Department</label>
                         <Input 
                            icon={Building}
                            value={formData.department || ''} 
                            onChange={e => setFormData({...formData, department: e.target.value})} 
                         />
                    </div>
                    <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">System Role</label>
                         <div className="relative">
                             <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                             <input 
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed font-bold"
                                value={formData.role} 
                                disabled
                             />
                         </div>
                    </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-inner">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-xl border border-slate-200 text-slate-400 shadow-sm">
                            <Clock size={18}/>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Session</p>
                            <p className="text-xs font-mono font-bold text-slate-700 mt-0.5">{new Date(user.lastLogin).toLocaleString()}</p>
                        </div>
                    </div>
                    <span className="text-[10px] font-black bg-green-100 text-green-700 px-2 py-1 rounded-lg border border-green-200 uppercase tracking-widest">Active</span>
                </div>
            </div>
            
            <div className="pt-6 border-t border-slate-100">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Interface & Preferences</h4>
                <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${theme.isDark ? 'bg-slate-800 text-purple-400' : 'bg-amber-50 text-orange-500'}`}>
                                {theme.isDark ? <Moon size={18} /> : <Sun size={18} />}
                            </div>
                            <span className="text-sm font-bold text-slate-700">Dark Mode</span>
                        </div>
                        <input 
                            type="checkbox" 
                            className="w-10 h-5 rounded-full appearance-none bg-slate-200 checked:bg-nexus-600 relative cursor-pointer transition-all before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-5 shadow-inner" 
                            checked={theme.isDark}
                            onChange={theme.toggleDark}
                        />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all shadow-sm">
                        <div className="flex items-center gap-3">
                             <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                                <Activity size={18}/>
                             </div>
                             <span className="text-sm font-bold text-slate-700">Compact Density Mode</span>
                        </div>
                        <input 
                            type="checkbox" 
                            className="w-10 h-5 rounded-full appearance-none bg-slate-200 checked:bg-nexus-600 relative cursor-pointer transition-all before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-5 shadow-inner" 
                            checked={theme.density === 'compact'}
                            onChange={() => theme.setDensity(theme.density === 'compact' ? 'normal' : 'compact')}
                        />
                    </label>
                </div>
            </div>
        </div>
    </SidePanel>
  );
};

export default UserProfile;
