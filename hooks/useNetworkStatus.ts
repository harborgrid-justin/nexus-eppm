
import { useState, useEffect } from 'react';
import { Logger } from '../services/Logger';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
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
