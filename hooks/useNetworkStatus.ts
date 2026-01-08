
import { useState, useEffect } from 'react';

export const useNetworkStatus = () => {
  const isBrowser = typeof window !== 'undefined';
  
  const getNetworkInfo = () => {
    if (!isBrowser) return { isOnline: true, effectiveType: '4g', saveData: false };
    
    const nav = navigator as any;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
    
    return {
      isOnline: navigator.onLine,
      effectiveType: connection?.effectiveType || '4g',
      saveData: connection?.saveData || false
    };
  };

  const [status, setStatus] = useState(getNetworkInfo());

  useEffect(() => {
    if (!isBrowser) return;

    const nav = navigator as any;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

    const updateStatus = () => {
      setStatus(getNetworkInfo());
    };

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    
    if (connection) {
      connection.addEventListener('change', updateStatus);
    }

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      if (connection) {
        connection.removeEventListener('change', updateStatus);
      }
    };
  }, []);

  return status;
};
