
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const MetricGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const theme = useTheme();
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${theme.layout.gridGap} animate-nexus-in`}>
            {children}
        </div>
    );
};
