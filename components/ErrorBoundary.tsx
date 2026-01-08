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
 * Standard Error Boundary component to catch and display runtime errors gracefully.
 */
// Fix: Explicitly use React.Component to ensure TypeScript correctly recognizes instance properties like state and props
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    // Fix: Access state property defined in base Component class
    this.state = {
      hasError: false,
      error: undefined,
    };
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Fix: Access props property defined in base Component class
    console.error("Uncaught error in component:", this.props.name, error, errorInfo);
  }

  handleRetry = () => {
    // Fix: Access setState method defined in base Component class
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    // Fix: Access state property defined in base Component class
    if (this.state.hasError) {
      // Fix: Access state property defined in base Component class
      const { error } = this.state;
      let errorMessage = 'An unexpected error occurred.';
      let errorStack: string | undefined = undefined;

      if (error instanceof Error) {
          errorMessage = error.message;
          errorStack = error.stack;
      } else if (typeof error === 'string') {
          errorMessage = error;
      } else if (typeof error === 'object' && error !== null) {
          try {
              errorMessage = JSON.stringify(error, null, 2);
          } catch (e) {
              errorMessage = 'Non-serializable error object caught';
          }
      }

      return (
        <div className="p-4 m-4 bg-red-50 border border-red-200 rounded-lg text-red-700 animate-in fade-in zoom-in-95 duration-200">
          <h2 className="font-bold flex items-center gap-2">
            <AlertTriangle size={20} /> 
            {/* Fix: Access props property defined in base Component class */}
            Error in {this.props.name || 'Component'}
          </h2>
          <p className="text-sm mt-2 font-mono whitespace-pre-wrap break-all">{errorMessage}</p>
          {errorStack && (
             <pre className="text-xs bg-white p-4 mt-3 rounded border border-red-100 text-xs font-mono overflow-auto max-h-64">
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

    // Fix: Access props property defined in base Component class
    return this.props.children;
  }
}