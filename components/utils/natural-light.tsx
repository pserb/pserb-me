'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface NaturalLightProps {
  children?: React.ReactNode;
  intensity?: number; // 0-100, controls the overall intensity of the effect
  colorMode?: 'warm' | 'cool' | 'neutral'; // Different color schemes
  responsive?: boolean; // Not used anymore but kept for API compatibility
  className?: string;
  position?: 'top-left' | 'top-right' | 'center';
  temperatureK?: number; // Color temperature in Kelvin
  animate?: boolean;
}

const NaturalLight: React.FC<NaturalLightProps> = ({
  children,
  intensity = 30,
  colorMode = 'neutral',
  responsive = false, // Ignored parameter
  className = '',
  position = 'top-left',
  temperatureK = 5000,
  animate = false,
}) => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isHydrated, setIsHydrated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Normalize intensity to a 0-1 scale with reasonable defaults
  const normalizedIntensity = Math.min(Math.max(intensity, 0), 100) / 100;

  // Convert Kelvin to RGB (simplified algorithm)
  const kelvinToRGB = (kelvin: number) => {
    // Clamp temperature to valid range
    kelvin = Math.max(1000, Math.min(40000, kelvin));
    
    let r, g, b;
    
    // Red
    if (kelvin <= 6600) {
      r = 255;
    } else {
      r = kelvin / 100 - 60;
      r = 329.698727446 * Math.pow(r, -0.1332047592);
      r = Math.max(0, Math.min(255, r));
    }
    
    // Green
    if (kelvin <= 6600) {
      g = kelvin / 100;
      g = 99.4708025861 * Math.log(g) - 161.1195681661;
    } else {
      g = kelvin / 100 - 60;
      g = 288.1221695283 * Math.pow(g, -0.0755148492);
    }
    g = Math.max(0, Math.min(255, g));
    
    // Blue
    if (kelvin >= 6600) {
      b = 255;
    } else if (kelvin <= 1900) {
      b = 0;
    } else {
      b = kelvin / 100 - 10;
      b = 138.5177312231 * Math.log(b) - 305.0447927307;
      b = Math.max(0, Math.min(255, b));
    }
    
    return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
  };
  
  // Get light position coordinates
  const getLightPosition = () => {
    switch (position) {
      case 'top-left': return { x: 0, y: 0 };
      case 'top-right': return { x: 100, y: 0 };
      case 'center': return { x: 50, y: 50 };
      default: return { x: 0, y: 0 };
    }
  };
  
  // Get color based on temperature and color mode
  const getColors = () => {
    const tempColor = kelvinToRGB(temperatureK);
    const baseColor = `rgba(${tempColor.r}, ${tempColor.g}, ${tempColor.b}`;
    
    // Adjust for dark mode
    const intensity = isDarkMode ? normalizedIntensity * 1.2 : normalizedIntensity * 0.8;
    
    switch (colorMode) {
      case 'warm':
        return {
          primary: `${baseColor}, ${0.25 * intensity})`,
          secondary: `${baseColor}, ${0.15 * intensity})`,
        };
      case 'cool':
        return {
          primary: `rgba(180, 220, 255, ${0.25 * intensity})`,
          secondary: `rgba(190, 210, 255, ${0.15 * intensity})`,
        };
      case 'neutral':
      default:
        return {
          primary: `rgba(255, 255, 255, ${0.25 * intensity})`,
          secondary: `rgba(240, 240, 240, ${0.15 * intensity})`,
        };
    }
  };
  
  // Get light source position
  const lightPosition = getLightPosition();

  useEffect(() => {
    setIsHydrated(true);
    
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    handleResize();
    checkDarkMode();
    
    window.addEventListener('resize', handleResize);
    
    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkDarkMode();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  // Add a subtle drift animation
  const driftAnimation = animate ? {
    opacity: [0.7, 0.8, 0.7],
    scale: [1, 1.02, 1],
    transition: {
      duration: 20,
      repeat: Infinity,
      repeatType: 'reverse' as const,
      ease: 'easeInOut',
    },
  } : {};

  if (!isHydrated) {
    return <>{children}</>;
  }
  
  const colors = getColors();
  
  // Determine mix blend mode based on dark/light mode
  const mixBlendMode = isDarkMode ? 'screen' : 'multiply';

  return (
    <div className={`relative ${className}`}>
      {/* Main content */}
      <div className="relative z-10">{children}</div>

      {/* Primary light source */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        style={{ mixBlendMode: isDarkMode ? 'plus-lighter' : 'multiply' }}
        animate={{
          background: `radial-gradient(circle at ${lightPosition.x}% ${lightPosition.y}%, ${colors.primary} 0%, transparent 70%)`,
          ...driftAnimation,
        }}
      />

      {/* Secondary light rays */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        style={{ mixBlendMode: isDarkMode ? 'plus-lighter' : 'multiply' }}
        animate={{
          background: `conic-gradient(
            from 45deg at ${lightPosition.x}% ${lightPosition.y}%, 
            ${colors.secondary} 0%, 
            transparent 15%, 
            transparent 85%, 
            ${colors.secondary} 100%
          )`,
          ...driftAnimation,
        }}
      />
      
      {/* Lens flare effect */}
      <motion.div
        className="fixed pointer-events-none z-0"
        style={{ 
          width: '200px', 
          height: '200px', 
          left: `${lightPosition.x}%`, 
          top: `${lightPosition.y}%`, 
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'plus-lighter',
          opacity: isDarkMode ? 0.4 : 0.1
        }}
        animate={{
          boxShadow: `0 0 100px 20px ${colors.primary}`,
          ...driftAnimation,
        }}
      />
      
      {/* Background adjustment for light mode */}
      {!isDarkMode && (
        <div 
          className="fixed inset-0 pointer-events-none z-[-1]" 
          style={{ 
            backgroundColor: 'rgba(230, 230, 230, 0.2)',
            mixBlendMode: 'multiply' 
          }}
        />
      )}
    </div>
  );
};

export default NaturalLight;