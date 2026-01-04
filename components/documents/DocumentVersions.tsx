
import React from 'react';
import { History, Download } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';

export const DocumentVersions: React.FC<{ documentId?: string }> = ({ documentId }) => {
  const theme = useTheme();
  const { state } = useData();
  
  // Find document to get version info, or default
  const doc = state.documents.find(d => d.id === documentId);
  const currentVersion = doc?.version || '1.0';

  // Mock history generation based on current version
  const history = [
      { v: currentVersion, date: 'Just now', user: doc?.uploadedBy || 'System', notes: 'Current Version' },
      { v: (parseFloat(currentVersion) - 0.1).toFixed(1), date: '2 days ago', user: 'System', notes: 'Previous Draft' }
  ];

  return (
    <div className={`p-4 ${theme.colors.background} border ${theme.colors.border} rounded-lg`}>
        <h4 className={`${theme.typography.label} mb-3 flex items-center gap-2`}>
            <History size={14}/> Version History
        </h4>
        <div className="space-y-2">
            {history.map(ver => (
                <div key={ver.v} className={`flex justify-between items-center p-2 ${theme.colors.surface} rounded border ${theme.colors.border} text-sm`}>
                    <div>
                        <span className={`font-bold ${theme.colors.text.primary}`}>v{ver.v}</span>
                        <span className={`${theme.colors.text.tertiary} mx-2`}>•</span>
                        <span className={theme.colors.text.secondary}>{ver.notes}</span>
                        <div className={`${theme.typography.small} mt-0.5`}>{ver.date} by {ver.user}</div>
                    </div>
                    <button className="text-nexus-600 hover:bg-nexus-50 p-1.5 rounded transition-colors"><Download size={14}/></button>
                </div>
            ))}
        </div>
    </div>
  );
};
