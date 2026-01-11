import { useState, useEffect, useRef } from 'react';

export const useLazyLoad = (options = { root: null, rootMargin: '50px', threshold: 0.01 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (containerRef.current) observer.unobserve(containerRef.current);
      }
    }, options);

    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, [options.root, options.rootMargin, options.threshold]);

  return { containerRef, isVisible };
};