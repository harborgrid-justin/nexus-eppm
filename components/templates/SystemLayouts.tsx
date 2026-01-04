
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ShieldCheck, ArrowRight, AlertOctagon, Home, Search, Wrench, Terminal, Lock, ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

/**
 * 26. Login Screen
 */
export const LoginScreenTmpl: React.FC = () => {
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 2000);
    };

    return (
        <div className="h-full flex min-h-screen">
            {/* Form Section */}
            <div className={`flex-1 bg-white flex flex-col justify-center px-12 sm:px-24 relative`}>
                <div className="max-w-sm w-full mx-auto animate-in fade-in slide-in-from-left-8 duration-500">
                    <div className="mb-10 flex items-center gap-3">
                         <div className="w-10 h-10 bg-nexus-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-nexus-500/30">
                             <ShieldCheck size={24}/>
                         </div>
                         <span className="text-xl font-bold tracking-tight text-slate-900">Nexus PPM</span>
                    </div>
                    
                    <h1 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h1>
                    <p className="text-slate-500 mb-8">Enter your credentials to access the secure workspace.</p>
                    
                    <form className="space-y-5" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
                            <Input 
                                placeholder="name@company.com" 
                                className="bg-slate-50 border-slate-200 focus:bg-white" 
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-sm font-bold text-slate-700">Password</label>
                                <a href="#" className="text-xs text-nexus-600 font-bold hover:underline">Forgot?</a>
                            </div>
                            <Input 
                                placeholder="••••••••" 
                                type="password" 
                                className="bg-slate-50 border-slate-200 focus:bg-white" 
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        <Button className="w-full justify-center h-12 text-base shadow-lg shadow-nexus-500/20" disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Sign In"} 
                            {!isLoading && <ArrowRight size={18} className="ml-2"/>}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-slate-400">Protected by reCAPTCHA and Enterprise SSO.</p>
                    </div>
                </div>
                
                <div className="absolute bottom-8 left-12 text-xs text-slate-400">
                    © 2024 Nexus Enterprise Systems
                </div>
            </div>

            {/* Visual Section */}
            <div className="hidden lg:block flex-1 bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-nexus-700 to-slate-950 opacity-90 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover opacity-20"></div>
                
                <div className="relative z-10 p-24 text-white h-full flex flex-col justify-end max-w-2xl">
                    <div className="w-16 h-1 bg-green-500 mb-8"></div>
                    <h2 className="text-5xl font-black mb-6 leading-tight tracking-tight">Precision at Scale.</h2>
                    <p className="text-lg text-slate-300 leading-relaxed">
                        Manage billion-dollar portfolios with military-grade governance controls and real-time predictive analytics.
                    </p>
                    
                    <div className="flex gap-6 mt-12">
                        <div className="flex flex-col">
                            <span className="text-3xl font-bold text-white">99.9%</span>
                            <span className="text-xs text-slate-400 uppercase tracking-widest mt-1">Uptime SLA</span>
                        </div>
                        <div className="w-px bg-white/20 h-12"></div>
                         <div className="flex flex-col">
                            <span className="text-3xl font-bold text-white">SOC 2</span>
                            <span className="text-xs text-slate-400 uppercase tracking-widest mt-1">Certified</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * 27. Error 404
 * Friendly error page
 */
export const Error404Tmpl: React.FC = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center bg-slate-50 text-center p-6 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:32px_32px] opacity-40"></div>
            
            <div className="relative z-10 max-w-md w-full bg-white p-12 rounded-3xl shadow-xl border border-slate-200 animate-in zoom-in-95">
                <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mb-8 mx-auto rotate-12 shadow-sm">
                    <AlertOctagon size={40} className="text-red-500"/>
                </div>
                <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Page Not Found</h1>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    The resource you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <div className="flex flex-col gap-3">
                    <Button icon={Home} className="w-full justify-center">Return to Dashboard</Button>
                    <Button variant="ghost" className="w-full justify-center" icon={ChevronLeft} onClick={() => window.history.back()}>Go Back</Button>
                </div>
            </div>
        </div>
    );
};

/**
 * 28. Empty State
 * Placeholder for new sections
 */
export const EmptyStateTmpl: React.FC = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-50/50">
            <div className="w-full max-w-lg border-2 border-dashed border-slate-300 rounded-3xl p-12 flex flex-col items-center text-center bg-white/50">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <Search size={40} className="text-slate-300"/>
                </div>
                <h3 className="text-xl font-bold text-slate-800">No Projects Found</h3>
                <p className="text-slate-500 mt-2 mb-8 max-w-xs leading-relaxed">
                    Your portfolio is currently empty. Get started by initializing your first project charter.
                </p>
                <Button>Create Project</Button>
            </div>
        </div>
    );
};

/**
 * 29. Maintenance Mode
 * System status page
 */
export const MaintenanceTmpl: React.FC = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center bg-amber-50 text-center p-6 relative">
            <div className="max-w-lg w-full">
                <Wrench size={64} className="text-amber-500 mb-6 mx-auto animate-pulse"/>
                <h1 className="text-3xl font-black text-amber-900 mb-3 tracking-tight">System Under Maintenance</h1>
                <p className="text-amber-800/80 mb-8 text-lg">
                    We are currently deploying a critical security patch. <br/>
                    The system will be back online at <strong>02:00 UTC</strong>.
                </p>
                <div className="bg-white rounded-xl border border-amber-200 shadow-sm p-4 text-left">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Deployment Status</span>
                        <span className="text-xs font-mono font-bold text-amber-600">85%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 w-[85%] animate-pulse"></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 font-mono">Running migration script: 05_schema_update.sql...</p>
                </div>
            </div>
        </div>
    );
};

/**
 * 30. Audit Log Detail
 * Terminal style view
 */
export const AuditLogTmpl: React.FC = () => {
    return (
        <div className="h-full bg-slate-950 p-6 flex flex-col font-mono text-xs md:text-sm shadow-inner overflow-hidden">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-4 flex-shrink-0">
                <h2 className="text-green-400 font-bold flex items-center gap-3">
                    <Terminal size={18}/> 
                    <span className="tracking-widest">SYSTEM_AUDIT_STREAM</span>
                </h2>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 rounded border border-slate-800 text-slate-400">
                        <Lock size={12}/> Secure
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500 animate-pulse">●</span>
                        <span className="text-slate-400">Live</span>
                    </div>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 text-slate-300 font-medium pb-4 pr-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                <div className="opacity-50">
                    <span className="text-slate-600 mr-3">[10:41:55]</span> 
                    <span className="text-purple-400 mr-2">SYSTEM</span> 
                    Initializing connection pool...
                </div>
                <div>
                    <span className="text-slate-600 mr-3">[10:42:01]</span> 
                    <span className="text-blue-400 mr-2">INFO</span> 
                    User 'admin' initiated sync job <span className="text-white">#J-992</span>
                </div>
                <div>
                    <span className="text-slate-600 mr-3">[10:42:05]</span> 
                    <span className="text-yellow-500 mr-2">WARN</span> 
                    API rate limit approaching (80% capacity)
                </div>
                <div>
                    <span className="text-slate-600 mr-3">[10:42:12]</span> 
                    <span className="text-blue-400 mr-2">INFO</span> 
                    Data packet received from Gateway-01. Size: 4.2MB
                </div>
                <div>
                    <span className="text-slate-600 mr-3">[10:42:15]</span> 
                    <span className="text-green-500 mr-2">SUCCESS</span> 
                    Transaction committed to immutable ledger. Block #49210
                </div>
                <div>
                    <span className="text-slate-600 mr-3">[10:45:00]</span> 
                    <span className="text-blue-400 mr-2">INFO</span> 
                    Heartbeat check... OK
                </div>
                <div className="flex items-center gap-2 mt-4 text-green-500">
                    <span>&gt;</span>
                    <span className="animate-pulse">_</span>
                </div>
            </div>
        </div>
    );
};
