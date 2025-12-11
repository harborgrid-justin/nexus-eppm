import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`ErrorBoundary caught an error in ${this.props.name || 'Component'}:`, error, errorInfo);
    this.setState({ errorInfo });
    // In a real app, log to service like Sentry
  }

  // FIX: Converted to an arrow function to ensure `this` is correctly bound without needing a constructor.
  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-900 m-4 flex flex-col gap-4 shadow-sm animate-in fade-in zoom-in-95 duration-300">
           <div className="flex items-start gap-3">
             <div className="p-2 bg-red-100 rounded-full shrink-0">
                <AlertTriangle className="text-red-600" size={24} />
             </div>
             <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg">Application Error</h3>
                <p className="text-sm mt-1 text-red-800">
                    {this.props.name ? `Error in ${this.props.name}: ` : ''}
                    {this.state.error?.message || "An unexpected error occurred."}
                </p>
                {this.state.errorInfo && (
                    <details className="mt-3 text-xs font-mono bg-red-100/50 p-2 rounded border border-red-200/50 overflow-auto max-h-32 whitespace-pre-wrap text-red-800">
                        <summary className="cursor-pointer font-semibold mb-1 opacity-70 hover:opacity-100">View Stack Trace</summary>
                        {this.state.errorInfo.componentStack}
                    </details>
                )}
             </div>
           </div>
           
           <div className="flex justify-end pt-2 border-t border-red-200/50">
             <button 
                onClick={this.handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-700 text-sm font-medium rounded-lg hover:bg-red-50 focus:ring-2 focus:ring-red-500 focus:outline-none transition-colors"
             >
                <RefreshCw size={14} /> Try Again
             </button>
           </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}

export default ErrorBoundary;