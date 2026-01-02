import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children?: ReactNode;
  name?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in component:", this.props.name, error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error instanceof Error 
        ? this.state.error.message 
        : typeof this.state.error === 'string' 
            ? this.state.error 
            : 'An unexpected error occurred.';

      const errorStack = this.state.error instanceof Error ? this.state.error.stack : null;

      return (
        <div className="p-4 m-4 bg-red-50 border border-red-200 rounded-lg text-red-700 animate-in fade-in zoom-in-95 duration-200">
          <h2 className="font-bold flex items-center gap-2"><AlertTriangle size={20} /> Error in {this.props.name || 'Component'}</h2>
          <p className="text-sm mt-2">{errorMessage}</p>
          {errorStack && (
             <pre className="text-xs bg-white p-3 mt-3 rounded border border-red-100 overflow-auto max-h-32 text-red-800 font-mono">
                {errorStack}
             </pre>
          )}
          <button 
            onClick={this.handleRetry} 
            className="mt-4 px-4 py-2 bg-white border border-red-200 text-red-700 hover:bg-red-50 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
          >
            <RefreshCw size={14}/> Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}