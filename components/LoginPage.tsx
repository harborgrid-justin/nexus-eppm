
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const LoginPage: React.FC = () => {
  const { login, isLoading, error } = useAuth();
  const theme = useTheme();

  const [email, setEmail] = useState('sarah@nexus.com');
  const [password, setPassword] = useState('password');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex bg-slate-900 overflow-hidden relative">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
         <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-nexus-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
         <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center z-10 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          <div className="p-8 bg-slate-50 border-b border-slate-100 flex flex-col items-center">
             <div className="w-12 h-12 bg-nexus-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-nexus-500/30">
                <ShieldCheck size={28} />
             </div>
             <h1 className="text-2xl font-bold text-slate-900">Nexus PPM</h1>
             <p className="text-slate-500 text-sm mt-1">Enterprise Portfolio Management</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
                <Lock size={14} /> {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-nexus-500 focus:border-nexus-500 outline-none transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-nexus-500 focus:border-nexus-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 ${theme.colors.accentBg} text-white font-semibold rounded-lg shadow-lg shadow-nexus-500/30 hover:bg-nexus-700 focus:ring-2 focus:ring-offset-2 focus:ring-nexus-500 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
            
            <div className="text-center text-xs text-slate-400 mt-4">
               <p>Mock Credentials:</p>
               <p className="font-mono mt-1">sarah@nexus.com / password</p>
               <p className="font-mono">mike@nexus.com / password</p>
            </div>
          </form>
        </div>
        <p className="mt-8 text-slate-500 text-sm">© 2024 Nexus Enterprise Systems. Secure Access Required.</p>
      </div>
    </div>
  );
};

export default LoginPage;
