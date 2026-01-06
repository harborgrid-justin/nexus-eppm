import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { UserPlus, Mail, Trash2, Send, Plus, Users } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { generateId } from '../../utils/formatters';
import { User } from '../../types/auth';

export const TeamOnboarding: React.FC = () => {
    const { state, dispatch } = useData();
    const theme = useTheme();
    const [invites, setInvites] = useState([{ email: '', name: '', role: 'Team Member' }]);
    const [sent, setSent] = useState(false);
    const sentTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (sentTimerRef.current) clearTimeout(sentTimerRef.current);
        };
    }, []);

    const addRow = () => {
        setInvites([...invites, { email: '', name: '', role: 'Team Member' }]);
    };

    const removeRow = (index: number) => {
        setInvites(invites.filter((_, i) => i !== index));
    };

    const updateRow = (index: number, field: string, value: string) => {
        const newInvites = [...invites];
        newInvites[index] = { ...newInvites[index], [field]: value };
        setInvites(newInvites);
    };

    const handleSendInvites = () => {
        const validInvites = invites.filter(i => i.email && i.name);
        if (validInvites.length === 0) return;

        validInvites.forEach(invite => {
            const newUser: User = {
                id: generateId('U'),
                name: invite.name,
                email: invite.email,
                role: invite.role as any,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${invite.name}`,
                department: 'Unassigned',
                lastLogin: '',
                status: 'Active' 
            };
            dispatch({ type: 'ADMIN_ADD_USER', payload: newUser });
        });

        setSent(true);
        if (sentTimerRef.current) clearTimeout(sentTimerRef.current);
        sentTimerRef.current = setTimeout(() => {
            setSent(false);
            setInvites([{ email: '', name: '', role: 'Team Member' }]);
        }, 3000);
    };

    return (
        <div className={`${theme.components.card} flex flex-col h-full`}>
            <div className="p-6 border-b border-slate-200 flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <UserPlus size={20} />
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg">Team Onboarding</h3>
                    </div>
                    <p className="text-sm text-slate-500">Bulk invite team members to the workspace.</p>
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                        <Users size={16} className="text-slate-500"/>
                        {state.users.length} Users in Directory
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
                {sent ? (
                    <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                            <Send size={32}/>
                        </div>
                        <h4 className="text-xl font-bold text-slate-900">Invites Sent!</h4>
                        <p className="text-slate-500 mt-2">New users have been added to the directory.</p>
                        <Button className="mt-6" variant="outline" onClick={() => setSent(false)}>Add More</Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {invites.map((invite, idx) => (
                            <div key={idx} className="flex gap-2 items-start">
                                <div className="flex-1">
                                    <Input 
                                        placeholder="Full Name" 
                                        value={invite.name} 
                                        onChange={e => updateRow(idx, 'name', e.target.value)} 
                                    />
                                </div>
                                <div className="flex-1">
                                    <Input 
                                        placeholder="Email Address" 
                                        value={invite.email} 
                                        onChange={e => updateRow(idx, 'email', e.target.value)} 
                                    />
                                </div>
                                <div className="w-40">
                                    <select 
                                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"
                                        value={invite.role}
                                        onChange={e => updateRow(idx, 'role', e.target.value)}
                                    >
                                        <option>Viewer</option>
                                        <option>Team Member</option>
                                        <option>Project Manager</option>
                                        <option>Portfolio Manager</option>
                                        <option>Global Admin</option>
                                    </select>
                                </div>
                                {invites.length > 1 && (
                                    <button onClick={() => removeRow(idx)} className="p-2.5 text-slate-400 hover:text-red-500">
                                        <Trash2 size={16}/>
                                    </button>
                                )}
                            </div>
                        ))}
                        <Button variant="ghost" size="sm" icon={Plus} onClick={addRow}>Add Row</Button>
                    </div>
                )}
            </div>

            {!sent && (
                <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
                    <Button onClick={handleSendInvites} icon={Mail} disabled={!invites.some(i => i.email && i.name)}>
                        Send Invitations
                    </Button>
                </div>
            )}
        </div>
    );
};