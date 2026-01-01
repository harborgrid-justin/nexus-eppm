
import React from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Button } from './ui/Button';

const RouteError: React.FC = () => {
  const error: any = useRouteError();
  
  // Safely log the error to avoid [object Object]
  try {
    console.error("Router Error details:", JSON.stringify(error, null, 2));
  } catch (e) {
    console.error("Router Error details (circular or non-serializable):", error);
  }

  let title = "An error occurred";
  let message = "Something went wrong.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText || 'Error'}`;
    message = error.data?.message || (typeof error.data === 'string' ? error.data : error.statusText);
  } else if (error instanceof Error) {
    title = error.name || "Application Error";
    message = error.message;
    stack = error.stack;
  } else if (typeof error === 'object' && error !== null) {
      if('status' in error) {
          title = `${error.status} ${error.statusText || 'Error'}`;
          message = error.data || error.statusText || `Request failed with status ${error.status}`;
          if (typeof message === 'object') {
              try { message = JSON.stringify(message, null, 2); } catch {}
          }
      } else {
        try {
            const json = JSON.stringify(error, null, 2);
            if (json === '{}') {
                message = (error as any).message || String(error);
                if (message === '[object Object]') {
                     message = "Unknown error object received.";
                }
            } else {
                message = json;
            }
        } catch (e) {
            message = String(error);
        }
      }
  } else if (typeof error === 'string') {
      message = error;
  }

  if (typeof message !== 'string') {
      message = "Error details could not be rendered.";
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-600 shadow-sm border border-red-200">
        <AlertTriangle size={40} />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-3">{title}</h1>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-2xl w-full mb-8 text-left overflow-hidden">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Error Details</h3>
          <div className="text-red-600 font-medium font-mono text-sm whitespace-pre-wrap break-words max-h-64 overflow-y-auto">
            {message}
          </div>
          {stack && (
            <div className="mt-4 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Stack Trace</h3>
                <pre className="text-xs text-slate-500 bg-slate-50 p-3 rounded border border-slate-200 overflow-auto max-h-48 whitespace-pre-wrap font-mono">
                    {stack}
                </pre>
            </div>
          )}
      </div>

      <div className="flex gap-4">
        <Button variant="secondary" icon={RefreshCw} onClick={() => window.location.reload()}>
            Try Again
        </Button>
        <Button icon={Home} onClick={() => window.location.href = '/'}>
            Return Home
        </Button>
      </div>
    </div>
  );
};

export default RouteError;
