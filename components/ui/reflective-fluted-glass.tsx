'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import FlutedGlass from './fluted-glass';

type FlutedGlassType = 'fluted' | 'cross' | 'romb' | 'circle';

interface ReflectiveFlutedGlassProps {
  type?: FlutedGlassType;
  angle?: number;
  children?: React.ReactNode;
  className?: string;
  rounded?: boolean;
  border?: boolean;
  reflectionIntensity?: number; // 0-100
  lightResponse?: 'subtle' | 'moderate' | 'pronounced';
}

const ReflectiveFlutedGlass: React.FC<ReflectiveFlutedGlassProps> = ({
  type = 'fluted',
  angle,
  children,
  className = '',
  rounded = false,
  border = true,
  reflectionIntensity = 30,
  lightResponse = 'subtle',
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isHydrated, setIsHydrated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [elementPosition, setElementPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // Calculate intensity based on input
  const normalizedIntensity = Math.min(Math.max(reflectionIntensity, 0), 100) / 100;
  
  // Response factors based on lightResponse setting
  const responseFactors = {
    subtle: { opacity: 0.15, size: 100, blur: 30 },
    moderate: { opacity: 0.25, size: 80, blur: 20 },
    pronounced: { opacity: 0.35, size: 60, blur: 15 },
  };
  
  const { opacity, size, blur } = responseFactors[lightResponse];

  // Update element position
  const updateElementPosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setElementPosition({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      });
    }
  };

  useEffect(() => {
    setIsHydrated(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      updateElementPosition();
    };
    
    handleResize();
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', updateElementPosition);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', updateElementPosition);
    };
  }, []);

  // Calculate relative mouse position to the element
  const relativeX = mousePosition.x - elementPosition.x;
  const relativeY = mousePosition.y - elementPosition.y;
  
  // Normalized relative positions (0-1)
  const normalizedX = elementPosition.width > 0 ? relativeX / elementPosition.width : 0.5;
  const normalizedY = elementPosition.height > 0 ? relativeY / elementPosition.height : 0.5;
  
  // Determine if mouse is near the element
  const isNearElement = 
    normalizedX >= -0.5 && normalizedX <= 1.5 && 
    normalizedY >= -0.5 && normalizedY <= 1.5;

  const reflectionX = `${normalizedX * 100}%`;
  const reflectionY = `${normalizedY * 100}%`;

  // Subtle animation for when mouse is not near
  const idleAnimation = {
    x: ['0%', '100%', '0%'],
    y: ['0%', '100%', '0%'],
    transition: {
      x: { duration: 15, ease: 'easeInOut', repeat: Infinity },
      y: { duration: 18, ease: 'easeInOut', repeat: Infinity },
    },
  };

  if (!isHydrated) {
    return (
      <FlutedGlass
        type={type}
        angle={angle}
        className={className}
        rounded={rounded}
        border={border}
      >
        {children}
      </FlutedGlass>
    );
  }

  return (
    <div className="relative" ref={containerRef}>
      <FlutedGlass
        type={type}
        angle={angle}
        className={className}
        rounded={rounded}
        border={border}
      >
        {children}
        
        {/* Light reflection effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          animate={isNearElement ? {
            background: `radial-gradient(
              circle at ${reflectionX} ${reflectionY},
              rgba(255, 255, 255, ${opacity * normalizedIntensity}) 0%,
              transparent ${size}%
            )`,
            backdropFilter: `blur(${blur}px)`,
            opacity: 1,
          } : {
            background: `radial-gradient(
              circle at 50% 50%,
              rgba(255, 255, 255, ${opacity * normalizedIntensity * 0.6}) 0%,
              transparent ${size * 1.2}%
            )`,
            backdropFilter: `blur(${blur * 1.5}px)`,
            opacity: 0.7,
            ...idleAnimation,
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ mixBlendMode: 'overlay' }}
        />
      </FlutedGlass>
    </div>
  );
};

export default ReflectiveFlutedGlass;