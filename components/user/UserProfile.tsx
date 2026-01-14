import React, { useState, useEffect } from 'react';
import { SidePanel } from '../ui/SidePanel';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { User, Role } from '../../types/auth';
import { User as UserIcon, Mail, Shield, Building, Clock, LogOut, Camera, Moon, Sun, Activity, Settings2 } from 'lucide-react';
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
        title={<span className="font-black text-sm uppercase tracking-[0.2em] text-slate-500">Global Identity Config</span>}
        width="md:w-[480px]"
        footer={
            <div className="flex justify-between w-full gap-6">
                 <Button variant="danger" icon={LogOut} onClick={handleLogout} className="shrink-0 font-black uppercase tracking-widest text-[10px]">Terminate Session</Button>
                 <div className="flex gap-3">
                    <Button variant="secondary" onClick={onClose} className="font-black uppercase tracking-widest text-[10px]">Cancel</Button>
                    <Button onClick={handleSave} className="font-black uppercase tracking-widest text-[10px] shadow-lg shadow-nexus-500/20">Commit Changes</Button>
                 </div>
            </div>
        }
    >
        <div className="space-y-10 animate-nexus-in">
            {/* Header Profile Image */}
            <div className="flex flex-col items-center">
                <div className="relative group cursor-pointer">
                    <div className="w-28 h-28 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-700">
                        <img src={formData.avatar || user.avatar} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute inset-0 bg-nexus-900/60 rounded-[2.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                        <Camera className="text-white" size={28}/>
                    </div>
                </div>
                <h3 className="mt-6 text-3xl font-black text-slate-900 tracking-tighter uppercase">{user.name}</h3>
                <span className="text-[10px] font-black bg-nexus-600 px-4 py-1.5 rounded-full mt-2 border border-white shadow-lg text-white uppercase tracking-[0.2em]">{user.role}</span>
            </div>

            {/* Form Fields */}
            <div className="space-y-8 pt-4">
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2.5 ml-1">Identity Designation</label>
                    <Input 
                        icon={UserIcon}
                        value={formData.name || ''} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        className="h-12 font-bold"
                    />
                </div>
                
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2.5 ml-1">Transmission Endpoint (Email)</label>
                    <Input 
                        icon={Mail}
                        value={formData.email || ''} 
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                        disabled
                        className="h-12 bg-slate-50 font-mono opacity-60"
                    />
                    <p className="text-[10px] text-slate-400 mt-2.5 font-bold uppercase tracking-tight pl-1 italic opacity-60">Controlled by Enterprise SSO Provider.</p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2.5 ml-1">Node Domain</label>
                         <Input 
                            icon={Building}
                            value={formData.department || ''} 
                            onChange={e => setFormData({...formData, department: e.target.value})} 
                            className="h-12 font-bold"
                         />
                    </div>
                    <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2.5 ml-1">Auth Perimeter</label>
                         <div className="relative">
                             <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                             <input 
                                className="w-full pl-12 pr-4 h-12 bg-slate-100 border border-slate-200 rounded-2xl text-[10px] text-slate-500 cursor-not-allowed font-black uppercase tracking-widest"
                                value={formData.role} 
                                disabled
                             />
                         </div>
                    </div>
                </div>

                <div className="bg-slate-950 p-6 rounded-[2rem] border border-slate-800 flex items-center justify-between shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-nexus-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-slate-500 shadow-inner">
                            <Clock size={20}/>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-nexus-400 uppercase tracking-[0.2em]">Last Ingestion Cycle</p>
                            <p className="text-xs font-mono font-bold text-white mt-1 uppercase">{new Date(user.lastLogin).toLocaleString()}</p>
                        </div>
                    </div>
                    <span className="relative z-10 text-[9px] font-black bg-green-500/20 text-green-400 px-3 py-1.5 rounded-xl border border-green-500/20 uppercase tracking-[0.2em]">Session Valid</span>
                </div>
            </div>
            
            <div className="pt-10 border-t border-slate-100">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-2"><Settings2 size={14} className="text-nexus-600"/> Layout Rendering & Polarity</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-3xl cursor-pointer hover:border-nexus-300 hover:shadow-lg transition-all group">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl transition-all ${theme.isDark ? 'bg-slate-800 text-purple-400' : 'bg-amber-50 text-orange-500'}`}>
                                {theme.isDark ? <Moon size={20} /> : <Sun size={20} />}
                            </div>
                            <span className="text-sm font-black text-slate-700 uppercase tracking-tight">Dark Mode</span>
                        </div>
                        <input 
                            type="checkbox" 
                            className="sr-only" 
                            checked={theme.isDark}
                            onChange={theme.toggleDark}
                        />
                        <div className={`w-12 h-7 rounded-full transition-all relative ${theme.isDark ? 'bg-nexus-600' : 'bg-slate-200'}`}>
                            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 ${theme.isDark ? 'left-6' : 'left-1'}`}></div>
                        </div>
                    </label>

                    <label className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-3xl cursor-pointer hover:border-nexus-300 hover:shadow-lg transition-all group">
                        <div className="flex items-center gap-4">
                             <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-nexus-600 transition-colors">
                                <Activity size={20}/>
                             </div>
                             <span className="text-sm font-black text-slate-700 uppercase tracking-tight">High Density</span>
                        </div>
                        <input 
                            type="checkbox" 
                            className="sr-only" 
                            checked={theme.density === 'compact'}
                            onChange={() => theme.setDensity(theme.density === 'compact' ? 'normal' : 'compact')}
                        />
                         <div className={`w-12 h-7 rounded-full transition-all relative ${theme.density === 'compact' ? 'bg-nexus-600' : 'bg-slate-200'}`}>
                            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 ${theme.density === 'compact' ? 'left-6' : 'left-1'}`}></div>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    </SidePanel>
  );
};

export default UserProfile;