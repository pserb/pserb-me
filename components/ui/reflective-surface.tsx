'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ReflectiveSurfaceProps {
  children: React.ReactNode;
  intensity?: number; // 0-100
  className?: string;
  reflectionColor?: string;
  reflectionSize?: number; // 0-100
  disabled?: boolean;
}

const ReflectiveSurface: React.FC<ReflectiveSurfaceProps> = ({
  children,
  intensity = 30,
  className = '',
  reflectionColor = 'rgba(255, 255, 255, 0.07)',
  reflectionSize = 70,
  disabled = false,
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);
  const [elementPosition, setElementPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isHydrated, setIsHydrated] = useState(false);

  // Normalized values
  const normalizedIntensity = Math.min(Math.max(intensity, 0), 100) / 100;
  const normalizedSize = Math.min(Math.max(reflectionSize, 20), 200);
  
  // Update element position on scroll and resize
  const updateElementPosition = () => {
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
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
    
    if (disabled) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    updateElementPosition();
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', updateElementPosition);
    window.addEventListener('resize', updateElementPosition);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', updateElementPosition);
      window.removeEventListener('resize', updateElementPosition);
    };
  }, [disabled]);

  // Calculate the relative position of the mouse to the element
  const relativeX = (mousePosition.x - elementPosition.x) / elementPosition.width;
  const relativeY = (mousePosition.y - elementPosition.y) / elementPosition.height;
  
  // Determine if mouse is near or over the element
  const isNearElement = 
    relativeX >= -0.5 && relativeX <= 1.5 && 
    relativeY >= -0.5 && relativeY <= 1.5;

  // Only apply effect if element is visible and mouse is nearby
  const shouldApplyEffect = !disabled && isHydrated && isNearElement;

  // Calculate reflection position
  const reflectionX = `${relativeX * 100}%`;
  const reflectionY = `${relativeY * 100}%`;
  
  // For subtle animations when mouse is away
  const idleAnimation = {
    x: ['0%', '100%', '0%'],
    y: ['0%', '100%', '0%'],
    transition: {
      x: {
        duration: 10,
        ease: 'easeInOut',
        repeat: Infinity,
      },
      y: {
        duration: 13,
        ease: 'easeInOut',
        repeat: Infinity,
      },
    },
  };

  if (!isHydrated) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div 
      ref={elementRef}
      className={cn('relative overflow-hidden', className)}
    >
      {children}
    </div>
  );
};

export default ReflectiveSurface;