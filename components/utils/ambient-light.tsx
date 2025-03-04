'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface AmbientLightProps {
  children?: React.ReactNode;
  intensity?: number; // 0-100
  colorMode?: 'warm' | 'cool' | 'neutral' | 'rainbow';
  driftSpeed?: 'none' | 'slow' | 'medium' | 'fast';
  position?: 'top-left' | 'top-right' | 'center';
  numberOfRays?: number;
  className?: string;
  temperatureK?: number; // Color temperature in Kelvin
}

const AmbientLight: React.FC<AmbientLightProps> = ({
  children,
  intensity = 25,
  colorMode = 'neutral',
  driftSpeed = 'none',
  position = 'top-left',
  numberOfRays = 3,
  className = '',
  temperatureK = 5000,
}) => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isHydrated, setIsHydrated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Create animation controls for each ray
  const control1 = useAnimation();
  const control2 = useAnimation();
  const control3 = useAnimation();
  const control4 = useAnimation();
  const control5 = useAnimation();
  
  // Only use as many controls as we need
  const controlsArray = [control1, control2, control3, control4, control5].slice(0, numberOfRays);
  
  // Normalize intensity
  const normalizedIntensity = Math.min(Math.max(intensity, 0), 100) / 100;
  
  // Determine drift speed in seconds
  const driftDuration = driftSpeed === 'none' ? 0 : {
    slow: 120,
    medium: 90,
    fast: 60,
  }[driftSpeed];
  
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
  
  // Get color based on temperature and color mode
  const getColors = () => {
    const tempColor = kelvinToRGB(temperatureK);
    const baseColor = `rgba(${tempColor.r}, ${tempColor.g}, ${tempColor.b}`;
    
    // Check if we're in dark mode
    const isDarkMode = typeof document !== 'undefined' && 
                      document.documentElement.classList.contains('dark');
    
    // Adjust intensity based on mode
    const intensityFactor = isDarkMode ? 1.2 : 0.8;
    const adjustedIntensity = normalizedIntensity * intensityFactor;
    
    switch (colorMode) {
      case 'warm':
        return [
          `${baseColor}, ${0.25 * adjustedIntensity})`,
          `${baseColor}, ${0.2 * adjustedIntensity})`,
          `${baseColor}, ${0.15 * adjustedIntensity})`,
        ];
      case 'cool':
        return [
          `rgba(180, 220, 255, ${0.25 * adjustedIntensity})`,
          `rgba(190, 210, 255, ${0.2 * adjustedIntensity})`,
          `rgba(200, 230, 255, ${0.15 * adjustedIntensity})`,
        ];
      case 'neutral':
        return [
          `rgba(255, 255, 255, ${0.25 * adjustedIntensity})`,
          `rgba(250, 250, 250, ${0.2 * adjustedIntensity})`,
          `rgba(240, 240, 240, ${0.15 * adjustedIntensity})`,
        ];
      case 'rainbow':
        return [
          `rgba(255, 200, 200, ${0.15 * adjustedIntensity})`,
          `rgba(200, 255, 200, ${0.15 * adjustedIntensity})`,
          `rgba(200, 200, 255, ${0.15 * adjustedIntensity})`,
        ];
    }
  };
  
  // Get the appropriate color palette
  const colors = getColors();
  
  // Get position coordinates based on position prop
  const getPositionCoordinates = () => {
    switch (position) {
      case 'top-left': return { x: 0, y: 0 };
      case 'top-right': return { x: 100, y: 0 };
      case 'center': return { x: 50, y: 50 };
      default: return { x: 0, y: 0 };
    }
  };
  
  // Calculate ray positions based on the source position
  const getLightRayPositions = () => {
    const source = getPositionCoordinates();
    const rayPositions = [];
    
    // Main ray (centered at light source)
    rayPositions.push({
      x: source.x,
      y: source.y,
      size: 100,
      angle: 0
    });
    
    // For top-left position
    if (position === 'top-left') {
      rayPositions.push({ x: 20, y: 10, size: 85, angle: 20 });
      rayPositions.push({ x: 10, y: 20, size: 85, angle: -20 });
      rayPositions.push({ x: 30, y: 30, size: 70, angle: 45 });
      rayPositions.push({ x: 40, y: 15, size: 65, angle: 30 });
    }
    // For top-right position
    else if (position === 'top-right') {
      rayPositions.push({ x: 80, y: 10, size: 85, angle: 20 });
      rayPositions.push({ x: 90, y: 20, size: 85, angle: -20 });
      rayPositions.push({ x: 70, y: 30, size: 70, angle: 45 });
      rayPositions.push({ x: 60, y: 15, size: 65, angle: 30 });
    }
    // For center position
    else {
      rayPositions.push({ x: 40, y: 40, size: 85, angle: 20 });
      rayPositions.push({ x: 60, y: 40, size: 85, angle: -20 });
      rayPositions.push({ x: 40, y: 60, size: 85, angle: -45 });
      rayPositions.push({ x: 60, y: 60, size: 85, angle: 45 });
    }
    
    return rayPositions.slice(0, numberOfRays);
  };
  
  // Get ray positions
  const rayPositions = getLightRayPositions();
  
  // Subtle animation for rays if drift is enabled
  const animateRay = (controls: any, position: any, index: number) => {
    if (driftSpeed === 'none') return;
    
    const duration = driftDuration;
    const delay = index * 300;
    
    // Create a subtle breathing effect
    const animate = () => {
      // Original position
      const originalSize = position.size;
      const newSize1 = originalSize - 5;
      const newSize2 = originalSize + 5;
      
      controls.start({
        background: `radial-gradient(circle at ${position.x}% ${position.y}%, var(--color) 0%, transparent ${newSize1}%)`,
        transition: { duration: duration / 2, ease: 'easeInOut', delay: delay / 1000 },
      }).then(() => {
        controls.start({
          background: `radial-gradient(circle at ${position.x}% ${position.y}%, var(--color) 0%, transparent ${newSize2}%)`,
          transition: { duration: duration / 2, ease: 'easeInOut' },
        }).then(animate);
      });
    };
    
    animate();
  };
  
  // Get blend mode and additional styles based on theme
  const getThemeSpecificStyles = () => {
    // Check if we're in dark mode
    const isDarkMode = typeof document !== 'undefined' && 
                      document.documentElement.classList.contains('dark');
    
    if (isDarkMode) {
      return {
        mixBlendMode: 'screen' as const,
        overlayColor: 'rgba(10, 10, 40, 0.1)',
        overlayBlendMode: 'multiply' as const
      };
    } else {
      return {
        mixBlendMode: 'difference' as const,
        overlayColor: 'rgba(230, 230, 240, 0.6)',
        overlayBlendMode: 'overlay' as const
      };
    }
  };

  const themeStyles = getThemeSpecificStyles();
  
  // Initialize light rays
  useEffect(() => {
    setIsHydrated(true);
    
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Initialize each ray
    rayPositions.forEach((position, index) => {
      if (index < controlsArray.length) {
        controlsArray[index].start({
          background: `radial-gradient(circle at ${position.x}% ${position.y}%, var(--color) 0%, transparent ${position.size}%)`,
          transition: { duration: 0.5 },
        });
        
        // Start animation if drift is enabled
        if (driftSpeed !== 'none') {
          setTimeout(() => {
            animateRay(controlsArray[index], position, index);
          }, index * 100);
        }
      }
    });
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [driftSpeed, driftDuration, position, numberOfRays, temperatureK, colorMode, intensity]);

  if (!isHydrated) {
    return <div className={className}>{children}</div>;
  }
  
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Main content */}
      <div className="relative z-10">{children}</div>
      
      {/* Ambient light layers */}
      {rayPositions.map((position, index) => {
        if (index >= controlsArray.length) return null;
        
        return (
          <motion.div
            key={`ambient-light-${index}`}
            className="fixed inset-0 pointer-events-none"
            style={{ 
              zIndex: -1, 
              opacity: index === 0 ? 0.9 : 0.7, 
              mixBlendMode: themeStyles.mixBlendMode,
              '--color': colors[index % colors.length] 
            } as any}
            initial={{ 
              background: `radial-gradient(circle at ${position.x}% ${position.y}%, var(--color) 0%, transparent ${position.size}%)` 
            }}
            animate={controlsArray[index]}
          />
        );
      })}
      
      {/* Additional overlay to enhance visibility */}
      <div 
        className="fixed inset-0 pointer-events-none" 
        style={{
          zIndex: -2,
          backgroundColor: themeStyles.overlayColor,
          mixBlendMode: themeStyles.overlayBlendMode
        }}
      />
    </div>
  );
};

export default AmbientLight;