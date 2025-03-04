'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type LightMode = 'natural' | 'ambient' | 'none';
type ColorMode = 'warm' | 'cool' | 'neutral' | 'rainbow';
type LightPosition = 'top-left' | 'top-right' | 'center';
type DriftSpeed = 'none' | 'slow' | 'medium' | 'fast';

interface NaturalLightContextProps {
  lightMode: LightMode;
  setLightMode: (mode: LightMode) => void;
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  intensity: number;
  setIntensity: (intensity: number) => void;
  position: LightPosition;
  setPosition: (position: LightPosition) => void;
  temperatureK: number;
  setTemperatureK: (temp: number) => void;
  driftSpeed: DriftSpeed;
  setDriftSpeed: (speed: DriftSpeed) => void;
  numberOfRays: number;
  setNumberOfRays: (num: number) => void;
}

const NaturalLightContext = createContext<NaturalLightContextProps>({
  lightMode: 'natural',
  setLightMode: () => {},
  colorMode: 'neutral',
  setColorMode: () => {},
  intensity: 30,
  setIntensity: () => {},
  position: 'top-left',
  setPosition: () => {},
  temperatureK: 5000,
  setTemperatureK: () => {},
  driftSpeed: 'none',
  setDriftSpeed: () => {},
  numberOfRays: 3,
  setNumberOfRays: () => {},
});

export const useNaturalLight = () => useContext(NaturalLightContext);

interface NaturalLightProviderProps {
  children: ReactNode;
  defaultLightMode?: LightMode;
  defaultColorMode?: ColorMode;
  defaultIntensity?: number;
  defaultPosition?: LightPosition;
  defaultTemperatureK?: number;
  defaultDriftSpeed?: DriftSpeed;
  defaultNumberOfRays?: number;
}

export const NaturalLightProvider: React.FC<NaturalLightProviderProps> = ({
  children,
  defaultLightMode = 'natural',
  defaultColorMode = 'neutral',
  defaultIntensity = 30,
  defaultPosition = 'top-left',
  defaultTemperatureK = 5000,
  defaultDriftSpeed = 'none',
  defaultNumberOfRays = 3,
}) => {
  const [lightMode, setLightMode] = useState<LightMode>(defaultLightMode);
  const [colorMode, setColorMode] = useState<ColorMode>(defaultColorMode);
  const [intensity, setIntensity] = useState(defaultIntensity);
  const [position, setPosition] = useState<LightPosition>(defaultPosition);
  const [temperatureK, setTemperatureK] = useState(defaultTemperatureK);
  const [driftSpeed, setDriftSpeed] = useState<DriftSpeed>(defaultDriftSpeed);
  const [numberOfRays, setNumberOfRays] = useState(defaultNumberOfRays);

  return (
    <NaturalLightContext.Provider
      value={{
        lightMode,
        setLightMode,
        colorMode,
        setColorMode,
        intensity,
        setIntensity,
        position,
        setPosition,
        temperatureK,
        setTemperatureK,
        driftSpeed,
        setDriftSpeed,
        numberOfRays,
        setNumberOfRays,
      }}
    >
      {children}
    </NaturalLightContext.Provider>
  );
};

export default NaturalLightProvider;