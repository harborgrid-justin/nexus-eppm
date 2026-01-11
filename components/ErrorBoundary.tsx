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

/**
 * Standard Error Boundary component to catch and display runtime errors gracefully.
 */
// Fix: Use Component directly from react to ensure base properties like this.props and this.setState are correctly inherited and typed
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Fix: Defining the component state with correct typing
  public state: ErrorBoundaryState = {
    hasError: false,
    error: undefined,
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  // Required static method to handle state transition on error.
  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { hasError: true, error };
  }

  // Lifecycle method to capture component errors
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Fix: Accessing this.props.name via inherited class property
    console.error("Uncaught error in component:", this.props.name, error, errorInfo);
  }

  // Reset error state for manual retry actions
  handleRetry = () => {
    // Fix: Accessing this.setState via inherited class method
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    // Fix: Using state property from inherited Component class
    if (this.state.hasError) {
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
            {/* Fix: Correctly referencing this.props.name from the Component instance in JSX */}
            Error in {this.props.name || 'Component'}
          </h2>
          <p className="text-sm mt-2 font-mono whitespace-pre-wrap break-all">{errorMessage}</p>
          {errorStack && (
             <pre className="text-xs bg-white p-4 mt-3 rounded border border-red-100 font-mono overflow-auto max-h-64">
                {errorStack}
             </pre>
          )}
          <button 
            onClick={this.handleRetry} 
            className="mt-4 px-4 py-2 bg-white border border-slate-200 text-red-700 hover:bg-red-50 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
          >
            <RefreshCw size={14}/> Try again
          </button>
        </div>
      );
    }

    // Fix: Returning children from the Component props instance
    return this.props.children;
  }
}
