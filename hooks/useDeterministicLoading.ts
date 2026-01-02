
import { useState, useEffect, useRef } from 'react';

export const useDeterministicLoading = (isLoading: boolean, minDuration: number = 500) => {
  const [displayLoading, setDisplayLoading] = useState(isLoading);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (isLoading) {
      startTimeRef.current = Date.now();
      setDisplayLoading(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    } else {
      const elapsed = Date.now() - (startTimeRef.current || 0);
      const remaining = minDuration - elapsed;

      if (remaining > 0 && startTimeRef.current !== null) {
        timeoutRef.current = setTimeout(() => {
          setDisplayLoading(false);
          startTimeRef.current = null;
        }, remaining);
      } else {
        setDisplayLoading(false);
        startTimeRef.current = null;
      }
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isLoading, minDuration]);

  return displayLoading;
};
