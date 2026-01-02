
import { useState, useEffect, useCallback, RefObject } from 'react';

interface VirtualScrollOptions {
  totalItems: number;
  itemHeight: number;
  containerHeight: number;
  buffer?: number;
}

interface VirtualScrollResult {
  virtualItems: { index: number; offsetTop: number }[];
  totalHeight: number;
  startIndex: number;
  endIndex: number;
  isScrolling: boolean;
}

export const useVirtualScroll = (
  scrollPosition: number,
  options: VirtualScrollOptions
): VirtualScrollResult => {
  const { totalItems, itemHeight, containerHeight, buffer = 5 } = options;
  const [isScrolling, setIsScrolling] = useState(false);
  
  // Debounce scrolling state for performance optimizations during rapid movement
  useEffect(() => {
    if (!isScrolling) return;
    const timeout = setTimeout(() => setIsScrolling(false), 150);
    return () => clearTimeout(timeout);
  }, [scrollPosition, isScrolling]);

  // Calculate visible range
  const startIndex = Math.max(0, Math.floor(scrollPosition / itemHeight) - buffer);
  const endIndex = Math.min(
    totalItems - 1,
    Math.floor((scrollPosition + containerHeight) / itemHeight) + buffer
  );

  const virtualItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    virtualItems.push({
      index: i,
      offsetTop: i * itemHeight
    });
  }

  const totalHeight = totalItems * itemHeight;

  return {
    virtualItems,
    totalHeight,
    startIndex,
    endIndex,
    isScrolling
  };
};
