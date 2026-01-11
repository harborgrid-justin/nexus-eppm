import { useState, useMemo, useRef, useCallback, useEffect } from 'react';

interface VirtualScrollOptions {
  totalItems: number;
  itemHeight: number;
  containerHeight: number;
  buffer?: number;
}

export const useVirtualScroll = (
  initialScrollTop: number,
  options: VirtualScrollOptions
) => {
  const { totalItems, itemHeight, containerHeight, buffer = 5 } = options;
  const [scrollTop, setScrollTop] = useState(initialScrollTop);
  const rafRef = useRef<number | null>(null);

  const onScroll = useCallback((top: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setScrollTop(top);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const virtualItems = useMemo(() => {
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

    return items;
  }, [scrollTop, totalItems, itemHeight, containerHeight, buffer]);

  const totalHeight = totalItems * itemHeight;

  return { virtualItems, totalHeight, onScroll };
};