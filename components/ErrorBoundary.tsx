
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
// Fix: Use Component directly from react and ensure proper generic types for props and state to resolve inheritance visibility issues.
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Initialize state using standard property initializer
  state: ErrorBoundaryState = {
    hasError: false,
    error: undefined,
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.handleRetry = this.handleRetry.bind(this);
  }

  // Static method for identifying errors during render phase
  public static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { hasError: true, error };
  }

  // Fix: Ensuring this.props is correctly inherited and accessible in lifecycle methods.
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Correctly logging the component name from props
    console.error("Uncaught error in component:", this.props.name, error, errorInfo);
  }

  // Fix: Ensuring this.setState is correctly inherited and accessible in class methods.
  public handleRetry() {
    this.setState({ hasError: false, error: undefined });
  }

  public render() {
    if (this.state.hasError) {
      const { error } = this.state;
      let errorMessage = 'An unexpected error occurred.';
      let errorStack = null;

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
            {/* Fix: Correctly accessing inherited this.props for rendering the component name. */}
            Error in {this.props.name || 'Component'}
          </h2>
          <p className="text-sm mt-2 font-mono whitespace-pre-wrap break-all">{errorMessage}</p>
          {errorStack && (
             <pre className="text-xs bg-white p-3 mt-3 rounded border border-red-100 font-mono overflow-auto">
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

    // Fix: Correctly accessing inherited this.props to render children when no error occurs.
    return this.props.children;
  }
}
