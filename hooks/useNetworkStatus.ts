
import { useState, useEffect } from 'react';
import { Logger } from '../services/Logger';

export const useNetworkStatus = () => {
  // Rule 38: Hydration-Safe Conditional Rendering
  // Initialize to true (optimistic) to ensure server/client markup matches.
  // We update to the actual status immediately after mount.
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Sync with actual browser state upon mount
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
        setIsOnline(true);
        Logger.info('Network Status: Online');
    };
    const handleOffline = () => {
        setIsOnline(false);
        Logger.warn('Network Status: Offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};
