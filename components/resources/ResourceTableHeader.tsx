
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const ResourceTableHeader: React.FC = () => {
  const theme = useTheme();
  return (
    <thead className={`${theme.colors.background} sticky top-0 z-10 shadow-sm border-b`}>
      <tr>
        <th className={theme.components.table.header}>Resource Identity</th>
        <th className={theme.components.table.header}>Enterprise Role</th>
        <th className={theme.components.table.header}>Class</th>
        <th className={theme.components.table.header}>Org Calendar</th>
        <th className={theme.components.table.header}>Status</th>
        <th className={`${theme.components.table.header} text-right`}>Std Rate</th>
        <th className={`${theme.components.table.header} text-right`}>Actions</th>
      </tr>
    </thead>
  );
};
