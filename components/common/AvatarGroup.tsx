import React from 'react';
import { UserAvatar } from './UserAvatar';
import { useTheme } from '../../context/ThemeContext';

interface UserInfo {
    id: string;
    name: string;
}

interface AvatarGroupProps {
    users: UserInfo[];
    limit?: number;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ users, limit = 3, size = 'sm', className = '' }) => {
    const theme = useTheme();
    const visibleUsers = users.slice(0, limit);
    const remainingCount = Math.max(0, users.length - limit);

    const sizeMap = {
        sm: 'w-6 h-6 text-[9px]',
        md: 'w-8 h-8 text-[10px]',
        lg: 'w-10 h-10 text-xs'
    };

    return (
        <div className={`flex -space-x-2 overflow-hidden items-center ${className}`}>
            {visibleUsers.map((user) => (
                <UserAvatar 
                    key={user.id} 
                    name={user.name} 
                    size={size} 
                    className={`ring-2 ${theme.isDark ? 'ring-slate-900' : 'ring-white'}`} 
                />
            ))}
            {remainingCount > 0 && (
                <div 
                    className={`flex items-center justify-center rounded-full bg-slate-100 border-2 ${theme.isDark ? 'border-slate-900 bg-slate-800' : 'border-white'} ${theme.colors.text.tertiary} font-bold ${sizeMap[size]}`}
                >
                    +{remainingCount}
                </div>
            )}
        </div>
    );
};