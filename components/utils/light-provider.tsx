'use client';

import React from 'react';
import NaturalLight from './natural-light';
import AmbientLight from './ambient-light';
import GodRays from './god-rays';  // Import the new GodRays component
import { useNaturalLight } from '@/components/utils/natural-light-context';

interface LightProviderProps {
  children: React.ReactNode;
  className?: string;
}

const LightProvider: React.FC<LightProviderProps> = ({
  children,
  className = '',
}) => {
  const {
    lightMode,
    colorMode,
    intensity,
    position,
    temperatureK,
    driftSpeed,
    numberOfRays,
  } = useNaturalLight();

  if (lightMode === 'none') {
    return <div className={className}>{children}</div>;
  }

  // Use the GodRays component for natural light instead of NaturalLight
  if (lightMode === 'natural') {
    return (
      <GodRays
        intensity={intensity}
        colorMode={colorMode === 'rainbow' ? 'neutral' : colorMode}
        position={position}
        temperatureK={temperatureK}
        animate={driftSpeed !== 'none'}
        rayCount={numberOfRays}
        className={className}
      >
        {children}
      </GodRays>
    );
  }

  if (lightMode === 'ambient') {
    return (
      <AmbientLight
        intensity={intensity}
        colorMode={colorMode}
        position={position}
        temperatureK={temperatureK}
        driftSpeed={driftSpeed}
        numberOfRays={numberOfRays}
        className={className}
      >
        {children}
      </AmbientLight>
    );
  }

  // Fallback
  return <div className={className}>{children}</div>;
};

export default LightProvider;