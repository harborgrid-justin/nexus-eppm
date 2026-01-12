import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children?: ReactNode;
  name?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error | string | unknown;
}

/**
 * Enterprise Error Boundary
 * Provides a fallback UI and diagnostic information when sub-modules fail.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: undefined,
  };

  public static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[Nexus Error] ${this.props.name || 'Component'}:`, error, errorInfo);
  }

  public handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 m-6 nexus-empty-pattern shadow-inner min-h-[400px]">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4 text-red-500 shadow-sm border border-red-100 rotate-3 transition-transform hover:rotate-0">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Module Runtime Error</h2>
          <p className="text-slate-500 text-sm max-w-sm mb-8 font-medium leading-relaxed">
            The <span className="font-bold text-slate-800">{this.props.name || 'sub-module'}</span> encountered an unhandled exception and has been isolated to protect the enterprise environment.
          </p>
          <div className="flex gap-3">
             <button 
                onClick={this.handleRetry}
                className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95"
             >
                <RefreshCw size={14}/> Re-Initialize Module
             </button>
          </div>
          {process.env.NODE_ENV !== 'production' && (
              <div className="mt-12 w-full max-w-2xl text-left animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Debug Intelligence Output</p>
                  <pre className="p-5 bg-slate-900 text-red-400 text-[10px] font-mono rounded-2xl border border-slate-800 overflow-auto shadow-2xl max-h-48 scrollbar-thin">
                      {String(this.state.error)}
                  </pre>
              </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
