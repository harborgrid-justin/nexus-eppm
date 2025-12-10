
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
    document.body.innerHTML = `
      <div style="padding: 20px; color: red; font-family: sans-serif;">
        <h1>Critical System Error</h1>
        <p>The application failed to initialize. Please check the console for details.</p>
        <pre>${error instanceof Error ? error.message : 'Unknown error'}</pre>
      </div>
    `;
  }
};

mountApp();
