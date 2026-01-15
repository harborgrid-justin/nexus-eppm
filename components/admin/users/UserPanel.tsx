
import React, { useState, useEffect } from 'react';
import { User, Role } from '../../../types/auth';
import { SidePanel } from '../../ui/SidePanel';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Save } from 'lucide-react';
import { generateId } from '../../../utils/formatters';
import { useTheme } from '../../../context/ThemeContext';

interface UserPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: User) => void;
    editingUser: Partial<User> | null;
}

export const UserPanel: React.FC<UserPanelProps> = ({ isOpen, onClose, onSave, editingUser }) => {
    const theme = useTheme();
    const [formData, setFormData] = useState<Partial<User>>({});

    useEffect(() => {
        if (isOpen && editingUser) {
            setFormData(editingUser);
        } else if (isOpen) {
            setFormData({
                name: '', email: '', role: 'Viewer', status: 'Active', department: 'Unassigned',
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`
            });
        }
    }, [editingUser, isOpen]);

    const handleSave = () => {
        if (!formData.name || !formData.email) {
            alert('Name and Email are required.');
            return;
        }

        const userToSave: User = {
            id: formData.id || generateId('U'),
            lastLogin: formData.lastLogin || new Date().toISOString(),
            ...formData,
        } as User;
        onSave(userToSave);
    };

    return (
        <SidePanel
            isOpen={isOpen}
            onClose={onClose}
            title={editingUser?.id ? 'Edit User Profile' : 'Provision New User'}
            width="md:w-[450px]"
            footer={<>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} icon={Save}>Save User</Button>
            </>}
        >
            <div className="space-y-6 animate-nexus-in">
                <div>
                    <label className={theme.typography.label + " block mb-1"}>Full Name</label>
                    <Input value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Sarah Connor" />
                </div>
                <div>
                    <label className={theme.typography.label + " block mb-1"}>Email</label>
                    <Input type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="email@company.com" />
                </div>
                <div>
                    <label className={theme.typography.label + " block mb-1"}>Role</label>
                    <select
                        value={formData.role || 'Viewer'}
                        onChange={e => setFormData({...formData, role: e.target.value as Role})}
                        className={`w-full p-2.5 border ${theme.colors.border} rounded-lg text-sm bg-white font-medium focus:ring-2 focus:ring-nexus-500 outline-none`}
                    >
                        <option>Viewer</option>
                        <option>Team Member</option>
                        <option>Project Manager</option>
                        <option>Portfolio Manager</option>
                        <option>Global Admin</option>
                    </select>
                </div>
                 <div>
                    <label className={theme.typography.label + " block mb-1"}>Department</label>
                    <Input value={formData.department || ''} onChange={e => setFormData({...formData, department: e.target.value})} placeholder="e.g. Engineering" />
                </div>
            </div>
        </SidePanel>
    );
};
