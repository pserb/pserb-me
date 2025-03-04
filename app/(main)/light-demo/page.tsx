'use client';

import React, { useState, useEffect } from 'react';
import FlutedGlass from '@/components/ui/fluted-glass';
import { WinButton } from '@/components/ui/win-button';
import { usePathname } from 'next/navigation';
import SmartBreadcrumb from '@/components/utils/breadcrumb-utils';
import { motion } from 'framer-motion';
import { motionContainer, motionItem } from '@/components/utils/framer-motion-utils';
import { useNaturalLight } from '@/components/utils/natural-light-context';

export default function LightDemo() {
  const pathname = usePathname();
  const { 
    lightMode, setLightMode,
    colorMode, setColorMode,
    intensity, setIntensity,
    position, setPosition,
    temperatureK, setTemperatureK,
    driftSpeed, setDriftSpeed,
    numberOfRays, setNumberOfRays
  } = useNaturalLight();
  
  // Local preview state
  const [previewMode, setPreviewMode] = useState(true);

  return (
    <motion.div variants={motionContainer()} initial="hidden" animate="visible">
      <motion.div variants={motionItem}>
        <SmartBreadcrumb pathname={pathname} pageTitle="Light Demo" />
      </motion.div>
      
      <motion.div variants={motionItem}>
        <h1 className="text-4xl font-bold mb-4">Natural Light Demo</h1>
      </motion.div>
      
      <motion.div variants={motionItem}>
        <p className="mb-6">
          This page demonstrates the various light effects that can be applied to the site. 
          You can adjust settings like intensity, color temperature, and light source position.
          The effects are designed to be subtle and enhance the depth and atmosphere of the site.
        </p>
      </motion.div>

      <motion.div variants={motionItem} className="mb-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Light Source</h3>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <WinButton 
                  onClick={() => setLightMode('natural')} 
                  variant={lightMode === 'natural' ? 'default' : 'outline'}
                  shadow="stippled"
                >
                  Natural Light
                </WinButton>
                <WinButton 
                  onClick={() => setLightMode('ambient')} 
                  variant={lightMode === 'ambient' ? 'default' : 'outline'}
                  shadow="stippled"
                >
                  Ambient Light
                </WinButton>
                <WinButton 
                  onClick={() => setLightMode('none')} 
                  variant={lightMode === 'none' ? 'default' : 'outline'}
                  shadow="stippled"
                >
                  No Light
                </WinButton>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Position</h3>
                <div className="flex flex-wrap gap-4">
                  <WinButton 
                    onClick={() => setPosition('top-left')} 
                    variant={position === 'top-left' ? 'default' : 'outline'}
                    shadow="solid"
                  >
                    Top Left
                  </WinButton>
                  <WinButton 
                    onClick={() => setPosition('top-right')} 
                    variant={position === 'top-right' ? 'default' : 'outline'}
                    shadow="solid"
                  >
                    Top Right
                  </WinButton>
                  <WinButton 
                    onClick={() => setPosition('center')} 
                    variant={position === 'center' ? 'default' : 'outline'}
                    shadow="solid"
                  >
                    Center
                  </WinButton>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Color Mode</h3>
              <div className="flex flex-wrap gap-4">
                <WinButton 
                  onClick={() => setColorMode('warm')} 
                  variant={colorMode === 'warm' ? 'default' : 'outline'}
                  shadow="solid"
                >
                  Warm
                </WinButton>
                <WinButton 
                  onClick={() => setColorMode('cool')} 
                  variant={colorMode === 'cool' ? 'default' : 'outline'}
                  shadow="solid"
                >
                  Cool
                </WinButton>
                <WinButton 
                  onClick={() => setColorMode('neutral')} 
                  variant={colorMode === 'neutral' ? 'default' : 'outline'}
                  shadow="solid"
                >
                  Neutral
                </WinButton>
                {lightMode === 'ambient' && (
                  <WinButton 
                    onClick={() => setColorMode('rainbow')} 
                    variant={colorMode === 'rainbow' ? 'default' : 'outline'}
                    shadow="solid"
                  >
                    Rainbow
                  </WinButton>
                )}
              </div>
              
              {lightMode === 'ambient' && (
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Animation</h3>
                  <div className="flex flex-wrap gap-4">
                    <WinButton 
                      onClick={() => setDriftSpeed('none')} 
                      variant={driftSpeed === 'none' ? 'default' : 'outline'}
                      shadow="solid"
                    >
                      None
                    </WinButton>
                    <WinButton 
                      onClick={() => setDriftSpeed('slow')} 
                      variant={driftSpeed === 'slow' ? 'default' : 'outline'}
                      shadow="solid"
                    >
                      Slow
                    </WinButton>
                    <WinButton 
                      onClick={() => setDriftSpeed('medium')} 
                      variant={driftSpeed === 'medium' ? 'default' : 'outline'}
                      shadow="solid"
                    >
                      Medium
                    </WinButton>
                    <WinButton 
                      onClick={() => setDriftSpeed('fast')} 
                      variant={driftSpeed === 'fast' ? 'default' : 'outline'}
                      shadow="solid"
                    >
                      Fast
                    </WinButton>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p>Light Intensity: {intensity}%</p>
              <input
                type="range"
                min="0"
                max="100"
                value={intensity}
                onChange={(e) => setIntensity(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <p>Color Temperature: {temperatureK}K</p>
              <input
                type="range"
                min="1500"
                max="10000"
                step="100"
                value={temperatureK}
                onChange={(e) => setTemperatureK(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Warm (1500K)</span>
                <span>Daylight (5500K)</span>
                <span>Cool (10000K)</span>
              </div>
            </div>
          </div>
          
          {lightMode === 'ambient' && (
            <div className="space-y-2">
              <p>Number of Light Rays: {numberOfRays}</p>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={numberOfRays}
                onChange={(e) => setNumberOfRays(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          )}
          
          <div className="pt-4">
            <WinButton 
              onClick={() => setPreviewMode(!previewMode)}
              variant="outline"
              shadow="stippled"
            >
              {previewMode ? "Hide Preview" : "Show Preview"}
            </WinButton>
          </div>
        </div>
      </motion.div>

      {previewMode && (
        <motion.div variants={motionItem}>
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Light Effect Preview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-6 border border-foreground rounded-md shadow-md bg-card">
                  <h3 className="text-lg font-medium mb-4">Active Settings Preview</h3>
                  <ul className="space-y-2">
                    <li><strong>Light Type:</strong> {lightMode}</li>
                    <li><strong>Position:</strong> {position}</li>
                    <li><strong>Color Mode:</strong> {colorMode}</li>
                    <li><strong>Color Temperature:</strong> {temperatureK}K</li>
                    <li><strong>Intensity:</strong> {intensity}%</li>
                    {lightMode === 'natural' && (
                      <>
                        <li><strong>Ray Count:</strong> {numberOfRays}</li>
                        <li><strong>Animation:</strong> {driftSpeed === 'none' ? 'Off' : 'On'}</li>
                      </>
                    )}
                    {lightMode === 'ambient' && (
                      <>
                        <li><strong>Animation:</strong> {driftSpeed}</li>
                        <li><strong>Number of Rays:</strong> {numberOfRays}</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-6 border border-foreground rounded-md shadow-md">
                  <h3 className="text-lg font-medium mb-2">Effect Explanation</h3>
                  {lightMode === 'natural' && (
                    <>
                      <p className="mb-2">The "God Rays" effect creates subtle light beams emanating from the {position.replace('-', ' ')} of the page.</p>
                      <p>Adjust the temperature to simulate different types of lighting, from warm indoor lighting (2000K) to cool daylight (6500K) to blue moonlight (10000K).</p>
                    </>
                  )}
                  {lightMode === 'ambient' && (
                    <p>The ambient light effect creates a gentle illumination from the {position.replace('-', ' ')} with subtle color variations.</p>
                  )}
                  {lightMode === 'none' && (
                    <p>All light effects are currently disabled.</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </motion.div>
      )}
      
      <motion.div variants={motionItem}>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">UI Components with Natural Light</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg mb-2">Glass Panel</h3>
              <FlutedGlass type="fluted" angle={90} className="h-40" rounded border>
                <div className="flex items-center justify-center h-full">
                  <p>Glass surfaces catch and reflect the natural light</p>
                </div>
              </FlutedGlass>
            </div>
            
            <div>
              <h3 className="text-lg mb-2">Card Element</h3>
              <div className="h-40 border border-foreground rounded-md shadow-md p-4 light-card">
                <h4 className="text-lg font-medium mb-2">Card Title</h4>
                <p>Cards and other UI elements appear to have depth and dimension with natural light.</p>
              </div>
            </div>
          </div>
        </section>
      </motion.div>

      <motion.div variants={motionItem}>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Button Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg">Primary Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <WinButton variant="default" shadow="solid">Default</WinButton>
                <WinButton variant="destructive" shadow="solid">Destructive</WinButton>
                <WinButton variant="outline" shadow="solid">Outline</WinButton>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg">Styled Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <WinButton variant="default" shadow="stippled" className="light-hover">
                  With Hover
                </WinButton>
                
                <WinButton variant="default" shadow="striped" className="light-rim">
                  With Rim
                </WinButton>
                
                <WinButton variant="outline" shadow="solid" className="light-pulse">
                  With Pulse
                </WinButton>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
        
      <motion.div variants={motionItem}>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Text Effects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg mb-2 light-heading">Light Heading</h3>
              <p className="mb-4 light-first-letter">
                This paragraph has an illuminated first letter effect. The natural light creates subtle highlights throughout the text.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg mb-2">Gradient Text</h3>
              <p className="text-xl font-bold light-gradient-text">
                This text has a subtle gradient that simulates light reflection
              </p>
              <div className="light-separator"></div>
              <p>The separator line above catches the light as well</p>
            </div>
          </div>
        </section>
      </motion.div>
    </motion.div>
  );
}