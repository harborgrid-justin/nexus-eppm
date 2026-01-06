
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
    // FIX: In a class component constructor, `state` must be assigned to `this.state`.
    this.state = {
      hasError: false,
      error: undefined,
    };
    this.handleRetry = this.handleRetry.bind(this);
  }

  public static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: unknown, errorInfo: ErrorInfo) {
    // FIX: Component properties (`props`) are accessed via `this.props` in class components.
    console.error("Uncaught error in component:", this.props.name, error, errorInfo);
  }

  public handleRetry() {
    // FIX: The `setState` method is accessed via `this.setState` in class components to update state.
    this.setState({ hasError: false, error: undefined });
  }

  public render() {
    // FIX: State is accessed via `this.state` in class components.
    if (this.state.hasError) {
      // FIX: Destructuring `error` from `this.state`.
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
          {/* FIX: Component properties (`props`) are accessed via `this.props`. */}
          <h2 className="font-bold flex items-center gap-2"><AlertTriangle size={20} /> Error in {this.props.name || 'Component'}</h2>
          <p className="text-sm mt-2 font-mono whitespace-pre-wrap break-all">{errorMessage}</p>
          {errorStack && (
             <pre className="text-xs bg-white p-3 mt-3 rounded border border-red-100 max-h-32 text-red-800 font-mono overflow-auto">
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

    // FIX: The `children` prop is accessed via `this.props`.
    return this.props.children;
  }
}
