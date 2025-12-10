import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

// FIX: Use this.props and this.state directly to avoid potential 'this' context issues with destructuring in some environments.
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  // FIX: Explicitly adding the return type to the render method to help with type inference.
  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700 m-4">
           <div className="flex items-center gap-2">
             <AlertTriangle />
             <h3 className="font-bold">Something went wrong</h3>
           </div>
           <p className="text-sm mt-2">A component within this module has encountered an error. Please try refreshing the page or contact support if the problem persists.</p>
        </div>
      );
    }
    // FIX: Destructure children from this.props to improve readability and potentially resolve obscure typing issues.
    const { children } = this.props;
    return children;
  }
}

export default ErrorBoundary;