'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LuminousTextProps {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  glowColor?: string;
  glowIntensity?: number; // 0-100
  animated?: boolean;
  hoverEffect?: boolean;
  underlineEffect?: boolean;
}

const LuminousText: React.FC<LuminousTextProps> = ({
  children,
  as: Component = 'span',
  className = '',
  glowColor = 'rgba(var(--accent), 0.15)',
  glowIntensity = 40,
  animated = false,
  hoverEffect = true,
  underlineEffect = false,
}) => {
  // Normalize intensity to reasonable value
  const normalizedIntensity = Math.min(Math.max(glowIntensity, 0), 100) / 100;
  
  // Calculate text shadow based on intensity
  const getTextShadow = () => {
    const intensity = normalizedIntensity;
    const color = glowColor;
    
    return `0 0 ${Math.floor(intensity * 5)}px ${color}, 
            0 0 ${Math.floor(intensity * 10)}px ${color}`;
  };
  
  // Animation for subtle "breathing" glow effect
  const breathingAnimation = animated ? {
    textShadow: [
      getTextShadow(),
      `0 0 ${Math.floor(normalizedIntensity * 8)}px ${glowColor}, 
       0 0 ${Math.floor(normalizedIntensity * 15)}px ${glowColor}`,
      getTextShadow(),
    ],
    transition: {
      textShadow: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  } : {};
  
  // Base styles
  const baseStyle = {
    textShadow: getTextShadow(),
    position: 'relative' as const,
  };
  
  // Hover effect styles
  const hoverClass = hoverEffect 
    ? 'transition-all duration-300 ease-in-out hover:text-accent' 
    : '';
  
  // Underline effect
  const underlineClass = underlineEffect 
    ? 'after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-accent after:transition-all after:duration-300 hover:after:w-full' 
    : '';

  return (
    <motion.span
      style={{ display: 'inline-block' }}
      animate={breathingAnimation}
    >
      <Component 
        className={cn(hoverClass, underlineClass, className)}
        style={baseStyle}
      >
        {children}
      </Component>
    </motion.span>
  );
};

export default LuminousText;