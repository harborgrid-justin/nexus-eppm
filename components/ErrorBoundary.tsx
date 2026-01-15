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

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: undefined,
    };
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log exception to enterprise telemetry
    console.error(`[Nexus Error] ${this.props.name || 'Component'}:`, error, errorInfo);
  }

  handleRetry = () => {
    // Reset state to attempt re-initialization of child partition
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 m-6 nexus-empty-pattern shadow-inner min-h-[400px]">
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6 text-red-500 shadow-xl border border-red-100 rotate-3 transition-transform hover:rotate-0">
            <AlertTriangle size={36} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Module Runtime Exception</h2>
          <p className="text-slate-500 text-sm max-w-sm mb-10 font-medium leading-relaxed">
            The <span className="font-bold text-slate-800">{this.props.name || 'sub-module'}</span> partition encountered a memory or logic fault and has been isolated to preserve system state.
          </p>
          <button 
            onClick={this.handleRetry}
            className="flex items-center gap-3 px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-all shadow-lg active:scale-95"
          >
            <RefreshCw size={14}/> Re-Initialize Partition
          </button>
          {process.env.NODE_ENV !== 'production' && (
              <div className="mt-12 w-full max-w-3xl text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Stack Trace Introspection</p>
                  <pre className="p-6 bg-slate-900 text-red-400 text-[10px] font-mono rounded-3xl border border-slate-800 overflow-auto shadow-2xl max-h-64 scrollbar-thin">
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