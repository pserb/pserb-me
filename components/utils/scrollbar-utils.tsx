'use client';

import { useEffect } from 'react';

/**
 * This hook detects the width of the scrollbar and sets it as a CSS variable
 * to ensure consistent layout regardless of scrollbar presence
 */
export function useScrollbarSize() {
  useEffect(() => {
    // Function to calculate and set scrollbar width
    const setScrollbarWidth = () => {
      // Calculate scrollbar width: difference between window inner width and document client width
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Set it as a CSS variable
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    };

    // Run once on mount
    setScrollbarWidth();
    
    // Also run when window is resized
    window.addEventListener('resize', setScrollbarWidth);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setScrollbarWidth);
    };
  }, []);
}

/**
 * Component that handles scrollbar detection and CSS variable setting
 */
export function ScrollbarSizeProvider({ children }: { children: React.ReactNode }) {
  useScrollbarSize();
  return <>{children}</>;
}