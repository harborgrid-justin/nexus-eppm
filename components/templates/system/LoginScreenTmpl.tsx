
import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

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
