
import { useState, useEffect, useMemo, useRef } from 'react';

interface VirtualScrollOptions {
  totalItems: number;
  itemHeight: number;
  containerHeight: number;
  buffer?: number;
}

interface VirtualScrollResult {
  virtualItems: { index: number; offsetTop: number }[];
  totalHeight: number;
  isScrolling: boolean;
  onScroll: (scrollTop: number) => void;
}

export const useVirtualScroll = (
  initialScrollTop: number,
  options: VirtualScrollOptions
): VirtualScrollResult => {
  const { totalItems, itemHeight, containerHeight, buffer = 5 } = options;
  const [scrollTop, setScrollTop] = useState(initialScrollTop);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);

  const onScroll = (newScrollTop: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      setScrollTop(newScrollTop);
      setIsScrolling(true);
      
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    });
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const { virtualItems } = useMemo(() => {
    const startNode = Math.floor(scrollTop / itemHeight);
    const visibleNodeCount = Math.ceil(containerHeight / itemHeight);
    
    const startIndex = Math.max(0, startNode - buffer);
    const endIndex = Math.min(totalItems - 1, startNode + visibleNodeCount + buffer);

    const items = [];
    for (let i = startIndex; i <= endIndex; i++) {
      items.push({
        index: i,
        offsetTop: i * itemHeight
      });
    }

    return { virtualItems: items };
  }, [scrollTop, totalItems, itemHeight, containerHeight, buffer]);

  const totalHeight = totalItems * itemHeight;

  return { virtualItems, totalHeight, isScrolling, onScroll };
};
