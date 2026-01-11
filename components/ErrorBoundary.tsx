import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children?: ReactNode;
  name?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error | string | unknown;
}

// FIX: Use the imported Component class to ensure proper type inheritance for this.props and this.setState
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: undefined,
  };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // FIX: Access inherited props properly
    console.error(`[Nexus Error] ${this.props.name || 'Component'}:`, error, errorInfo);
  }

  handleRetry = () => {
    // FIX: Access inherited setState properly
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const { error } = this.state;
      let errorMessage = 'A runtime exception occurred in the execution context.';
      
      if (error instanceof Error) {
          errorMessage = error.message;
      } else if (typeof error === 'string') {
          errorMessage = error;
      }

      return (
        <div className="p-8 m-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 animate-in fade-in zoom-in-95 duration-200 shadow-xl">
          <h2 className="font-black flex items-center gap-2 uppercase tracking-tighter text-lg">
            <AlertTriangle size={24} /> 
            {/* FIX: Access inherited props properly */}
            Module Failure: {this.props.name || 'Runtime'}
          </h2>
          <div className="mt-4 p-4 bg-white rounded-xl border border-red-100 font-mono text-xs overflow-auto max-h-64 shadow-inner text-red-800 leading-relaxed">
            {errorMessage}
          </div>
          <button 
            onClick={this.handleRetry} 
            className="mt-6 px-6 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-xl flex items-center gap-2 text-sm font-black uppercase tracking-widest transition-all shadow-lg shadow-red-500/20 active:scale-95"
          >
            <RefreshCw size={14}/> Re-initialize Module
          </button>
        </div>
      );
    }

    // FIX: Return children from inherited props
    return this.props.children;
  }
}
