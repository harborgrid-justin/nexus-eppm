
import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to detect when an element enters the viewport.
 * Useful for lazy loading charts, heavy components, or data fetching.
 */
export const useLazyLoad = (options = { root: null, rootMargin: '0px', threshold: 0.1 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setIsVisible(true);
        // Once visible, we disconnect to stop observing (trigger once)
        if (containerRef.current) observer.unobserve(containerRef.current);
      }
    }, options);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, [options.root, options.rootMargin, options.threshold]);

  return { containerRef, isVisible };
};
