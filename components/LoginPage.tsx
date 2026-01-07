import React from 'react';
import { Form, useActionData, useNavigation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const LoginPage: React.FC = () => {
  const theme = useTheme();
  const actionData = useActionData() as { error: string } | undefined;
  const navigation = useNavigation();
  const isLoading = navigation.state === 'submitting';

  return (
    <div className={`min-h-screen flex ${theme.colors.background} overflow-hidden relative`}>
      <div className="flex-1 flex flex-col justify-center items-center z-10 p-4">
        <div className={`w-full max-w-md ${theme.colors.surface} rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500 border ${theme.colors.border}`}>
          <div className={`p-8 ${theme.colors.background} border-b ${theme.colors.border} flex flex-col items-center`}>
             <div className={`w-12 h-12 ${theme.colors.primary} rounded-xl flex items-center justify-center ${theme.colors.text.inverted} mb-4 shadow-lg shadow-nexus-500/30`}>
                <ShieldCheck size={28} />
             </div>
             <h1 className={`text-2xl font-bold ${theme.colors.text.primary}`}>Nexus PPM</h1>
             <p className={`${theme.colors.text.secondary} text-sm mt-1`}>Enterprise Portfolio Management</p>
          </div>

          <Form method="post" className="p-8 space-y-6 bg-white">
            {actionData?.error && (
              <div className={`p-3 ${theme.colors.semantic.danger.bg} border ${theme.colors.semantic.danger.border} ${theme.colors.semantic.danger.text} text-sm rounded-lg flex items-center gap-2`}>
                <Lock size={14} /> {actionData.error}
              </div>
            )}

            <div>
              <label className={`block text-sm font-medium ${theme.colors.text.primary} mb-1`}>Email Address</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  defaultValue="justin@nexus.com"
                  className={`w-full pl-10 pr-4 py-2.5 ${theme.colors.background} border ${theme.colors.border} rounded-lg focus:ring-2 focus:ring-nexus-500 focus:border-nexus-500 outline-none transition-all ${theme.colors.text.primary}`}
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.colors.text.primary} mb-1`}>Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  defaultValue="password"
                  className={`w-full pl-10 pr-4 py-2.5 ${theme.colors.background} border ${theme.colors.border} rounded-lg focus:ring-2 focus:ring-nexus-500 focus:border-nexus-500 outline-none transition-all ${theme.colors.text.primary}`}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 ${theme.colors.primary} ${theme.colors.text.inverted} font-semibold rounded-lg shadow-lg shadow-nexus-500/30 ${theme.colors.primaryHover} focus:ring-2 focus:ring-offset-2 focus:ring-nexus-500 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed`}
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
          </Form>
          
          <div className={`p-4 ${theme.colors.background} border-t ${theme.colors.border} text-center text-xs ${theme.colors.text.tertiary}`}>
              Protected by Enterprise SSO and MFA.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;