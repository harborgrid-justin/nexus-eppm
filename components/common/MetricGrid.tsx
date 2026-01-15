
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface MetricGridProps {
    children: React.ReactNode;
    columns?: 2 | 3 | 4;
}

export const MetricGrid: React.FC<MetricGridProps> = ({ children, columns = 4 }) => {
    const theme = useTheme();
    const columnClass = {
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
    }[columns];

    return (
        <div className={`grid ${columnClass} ${theme.layout.gridGap} animate-nexus-in`}>
            {children}
        </div>
    );
};
