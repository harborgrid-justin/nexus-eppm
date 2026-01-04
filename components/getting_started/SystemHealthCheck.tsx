
import React from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { CheckCircle, AlertTriangle, Settings, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SystemHealthCheck: React.FC = () => {
    const { state } = useData();
    const theme = useTheme();
    const navigate = useNavigate();

    const checks = [
        { 
            id: 'fiscal', 
            label: 'Fiscal Calendar', 
            status: state.governance.organization.fiscalYearStart ? 'Pass' : 'Fail',
            fixUrl: '/admin?view=general'
        },
        { 
            id: 'currency', 
            label: 'Base Currency', 
            status: state.governance.organization.currency ? 'Pass' : 'Fail',
            fixUrl: '/admin?view=general'
        },
        { 
            id: 'security', 
            label: 'Security Policy', 
            status: state.governance.security.passwordComplexity ? 'Pass' : 'Fail',
            fixUrl: '/admin?view=security'
        },
        { 
            id: 'roles', 
            label: 'Enterprise Roles', 
            status: state.roles.length > 0 ? 'Pass' : 'Fail',
            fixUrl: '/admin?view=resources'
        },
        { 
            id: 'calendars', 
            label: 'Global Calendar', 
            status: state.calendars.length > 0 ? 'Pass' : 'Fail',
            fixUrl: '/admin?view=calendars'
        },
        {
            id: 'funding',
            label: 'Funding Sources',
            status: state.fundingSources.length > 0 ? 'Pass' : 'Warning',
            fixUrl: '/admin?view=fundingSources'
        }
    ];

    const passCount = checks.filter(c => c.status === 'Pass').length;
    const healthScore = Math.round((passCount / checks.length) * 100);

    return (
        <div className={`${theme.components.card} p-6 h-full flex flex-col`}>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-bold text-slate-800 text-lg">System Health</h3>
                    <p className="text-sm text-slate-500">Configuration Readiness</p>
                </div>
                <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
                        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="175.9" strokeDashoffset={175.9 - (175.9 * healthScore) / 100} className={`${healthScore === 100 ? 'text-green-500' : 'text-nexus-500'}`} />
                    </svg>
                    <span className="absolute text-sm font-bold text-slate-700">{healthScore}%</span>
                </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto">
                {checks.map(check => (
                    <div key={check.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-3">
                            {check.status === 'Pass' ? (
                                <CheckCircle size={16} className="text-green-500" />
                            ) : (
                                <AlertTriangle size={16} className={check.status === 'Fail' ? 'text-red-500' : 'text-yellow-500'} />
                            )}
                            <span className="text-sm font-medium text-slate-700">{check.label}</span>
                        </div>
                        {check.status !== 'Pass' && (
                            <button 
                                onClick={() => navigate(check.fixUrl)}
                                className="text-xs text-nexus-600 font-bold flex items-center gap-1 hover:underline"
                            >
                                Fix <ArrowRight size={10}/>
                            </button>
                        )}
                    </div>
                ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                <button onClick={() => navigate('/admin')} className="text-sm font-bold text-slate-500 hover:text-nexus-600 flex items-center justify-center gap-2">
                    <Settings size={14}/> Advanced Configuration
                </button>
            </div>
        </div>
    );
};
