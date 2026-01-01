
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ensureElement } from './utils/validationUtils';

// Global error handlers for unhandled promises and runtime errors
window.addEventListener('error', (event) => {
  console.error("Global Error Caught:", event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error("Unhandled Promise Rejection:", event.reason);
});

const mountApp = () => {
  try {
    const rootElement = ensureElement('root');
    const root = ReactDOM.createRoot(rootElement);
    
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Failed to mount application:", error);
    // Uses Tailwind classes for styling instead of inline styles
    document.body.innerHTML = `
      <div class="p-8 text-red-600 font-sans max-w-2xl mx-auto mt-10 border border-red-200 rounded-lg bg-red-50 shadow-sm">
        <h1 class="text-2xl font-bold mb-2">Critical System Error</h1>
        <p class="mb-4 text-sm text-red-800">The application failed to initialize. Please check the console for details.</p>
        <pre class="bg-white p-4 rounded border border-red-100 text-xs font-mono overflow-auto">${error instanceof Error ? error.message : 'Unknown error'}</pre>
      </div>
    `;
  }
};

mountApp();
