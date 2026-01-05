
import React from 'react';
import { History, Download } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';

export const DocumentVersions: React.FC<{ documentId?: string }> = ({ documentId }) => {
  const theme = useTheme();
  const { state } = useData();
  
  // Find document to get version info
  const doc = state.documents.find(d => d.id === documentId);
  const history = doc?.history || [];

  return (
    <div className={`p-4 ${theme.colors.background} border ${theme.colors.border} rounded-lg`}>
        <h4 className={`${theme.typography.label} mb-3 flex items-center gap-2`}>
            <History size={14}/> Version History
        </h4>
        <div className="space-y-2">
            {history.length > 0 ? (
                history.map((ver, idx) => (
                    <div key={idx} className={`flex justify-between items-center p-2 ${theme.colors.surface} rounded border ${theme.colors.border} text-sm`}>
                        <div>
                            <span className={`font-bold ${theme.colors.text.primary}`}>v{ver.version}</span>
                            <span className={`${theme.colors.text.tertiary} mx-2`}>•</span>
                            <span className={theme.colors.text.secondary}>{ver.notes}</span>
                            <div className={`${theme.typography.small} mt-0.5`}>{ver.date} by {ver.user}</div>
                        </div>
                        <button className="text-nexus-600 hover:bg-nexus-50 p-1.5 rounded transition-colors"><Download size={14}/></button>
                    </div>
                ))
            ) : (
                <p className={`text-xs ${theme.colors.text.tertiary} italic text-center py-2`}>
                    No version history available.
                </p>
            )}
        </div>
    </div>
  );
};
