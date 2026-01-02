
import { useSyncExternalStore } from 'react';
import { Logger } from '../services/Logger';

// External store subscription logic
const subscribe = (callback: () => void) => {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
};

const getSnapshot = () => navigator.onLine;

const getServerSnapshot = () => true; // Default for SSR consistency

export const useNetworkStatus = () => {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!isOnline) {
      // Side effect for logging (kept separate from store logic)
      // Note: In strict mode, this might log double, but it's safe.
      // We throttle this in a real app, simplified here.
  }

  return isOnline;
};
