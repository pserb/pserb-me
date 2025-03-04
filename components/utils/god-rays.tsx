"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

// Ray appearance constants
const RAY_BLUR_RANGE = [20, 50] // Min and max blur values for rays
const RAY_CONTRAST_RANGE = [1.2, 2] // Min and max contrast values for rays
const RAY_SATURATION_RANGE = [1.05, 1.1] // Min and max saturation values for rays
const RAY_GRADIENT_STOP = 0.85 // Where the ray gradient transitions to transparent (0-1)

// Animation constants
const ANIMATION_DURATION_RANGE = [8, 14] // Min and max duration for animations in seconds
const BACKGROUND_POSITION_RANGE = 15 // Maximum percentage for background position animation

// Noise constants
const BASE_NOISE_DENSITY = 1 // Base density for the noise SVG
const BASE_NOISE_OPACITY = 0.1 // Base opacity for the noise SVG
const EDGE_NOISE_DENSITY = 0.5 // Density for the edge noise SVG
const EDGE_NOISE_OPACITY = 0.5 // Opacity for the edge noise SVG
const PERLIN_NOISE_OPACITY = 0.5 // Opacity for the perlin noise SVG
const HIGH_FREQ_NOISE_DENSITY = 10.1 // Density for high-frequency noise overlay
const HIGH_FREQ_NOISE_OPACITY = 0.1 // Opacity for high-frequency noise overlay

// Edge effect constants
const EDGE_SCALE = [1.05, 1.2] // Scale factors for the edge effect [x, y]
const EDGE_BLUR_RANGE = [5, 10] // Min and max blur values for edge effect
const EDGE_CONTRAST_RANGE = [1.2, 1.3] // Min and max contrast values for edge effect
const EDGE_SATURATION_RANGE = [0.8, 0.7] // Min and max saturation values for edge effect

// Perlin noise effect constants
const PERLIN_SCALE = [1.1, 1.05] // Scale factors for the perlin noise effect [x, y]
const PERLIN_BLUR_RANGE = [1, 2] // Min and max blur values for perlin noise effect
const PERLIN_CONTRAST = 2 // Contrast value for perlin noise effect
const PERLIN_BRIGHTNESS_RANGE = [1.5, 1.7] // Min and max brightness values for perlin noise effect
const PERLIN_POSITION_RANGE = 20 // Maximum percentage for perlin noise position animation

// Glow effect constants
const GLOW_SCALE = [1.15, 1.1] // Scale factors for the glow effect [x, y]
const GLOW_BLUR = 12 // Blur value for the glow effect
const GLOW_INTENSITY = 0.15 // Intensity of the glow effect (0-1)

// Ambient overlay constants
const AMBIENT_OVERLAY_OPACITY_LIGHT = 0.35 // Opacity for ambient overlay in light mode
const AMBIENT_OVERLAY_OPACITY_DARK = 0.15 // Opacity for ambient overlay in dark mode
const AMBIENT_BLUR = 8 // Blur value for ambient overlay

// Animation control
const DEFAULT_ANIMATE = true // Default value for animation

interface GodRaysProps {
  children?: React.ReactNode
  intensity?: number // 0-100, controls the overall intensity of the effect
  colorMode?: "warm" | "cool" | "neutral" // Different color schemes
  position?: "top-left" | "top-right" | "center" // Light source position
  rayCount?: number // Number of rays
  className?: string
  temperatureK?: number // Color temperature in Kelvin
  animate?: boolean // Option to enable/disable all animations
  // New ray properties
  baseAngle?: number // Override the default base angle in degrees
  angleVariance?: number // How much variation in the angle (degrees)
  rayWidth?: [number, number] // Min and max ray width in vw units
  rayOpacity?: [number, number] // Min and max opacity
  rayLength?: number // Ray length multiplier (1 = screen height)
}

const GodRays: React.FC<GodRaysProps> = ({
  children,
  intensity = 30,
  colorMode = "neutral",
  position = "top-left",
  rayCount = 5,
  className = "",
  temperatureK = 5000,
  animate = DEFAULT_ANIMATE,
  // New ray properties with defaults
  baseAngle = undefined, // Will be set based on position if undefined
  angleVariance = 0,
  rayWidth = [2, 3], // Min and max width in vw units
  rayOpacity = [0.1, 0.4], // Min and max opacity multipliers
  rayLength = 1.7, // Ray length multiplier (2.0 = 200% of screen height)
}) => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [isHydrated, setIsHydrated] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Normalize intensity to a 0-1 scale with reasonable defaults
  const normalizedIntensity = Math.min(Math.max(intensity, 0), 100) / 100

  // Convert Kelvin to RGB (simplified algorithm)
  const kelvinToRGB = (kelvin: number) => {
    // Clamp temperature to valid range
    kelvin = Math.max(1000, Math.min(40000, kelvin))

    let r, g, b

    // Red
    if (kelvin <= 6600) {
      r = 255
    } else {
      r = kelvin / 100 - 60
      r = 329.698727446 * Math.pow(r, -0.1332047592)
      r = Math.max(0, Math.min(255, r))
    }

    // Green
    if (kelvin <= 6600) {
      g = kelvin / 100
      g = 99.4708025861 * Math.log(g) - 161.1195681661
    } else {
      g = kelvin / 100 - 60
      g = 288.1221695283 * Math.pow(g, -0.0755148492)
    }
    g = Math.max(0, Math.min(255, g))

    // Blue
    if (kelvin >= 6600) {
      b = 255
    } else if (kelvin <= 1900) {
      b = 0
    } else {
      b = kelvin / 100 - 10
      b = 138.5177312231 * Math.log(b) - 305.0447927307
      b = Math.max(0, Math.min(255, b))
    }

    return { r: Math.round(r), g: Math.round(g), b: Math.round(b) }
  }

  // Get color based on temperature and color mode
  const getRayColor = () => {
    const tempColor = kelvinToRGB(temperatureK)

    // Adjust for dark mode
    const intensity = isDarkMode ? normalizedIntensity * 1.2 : normalizedIntensity

    // In dark mode, use a more bluish tint for moonlight effect
    if (isDarkMode) {
      switch (colorMode) {
        case "warm":
          return `rgba(${tempColor.r}, ${Math.max(0, tempColor.g - 30)}, ${Math.max(0, tempColor.b - 50)}, ${intensity})`
        case "cool":
          return `rgba(${Math.max(0, tempColor.r - 50)}, ${Math.max(0, tempColor.g - 20)}, ${tempColor.b}, ${intensity})`
        case "neutral":
        default:
          return `rgba(${Math.max(0, tempColor.r - 30)}, ${Math.max(0, tempColor.g - 10)}, ${tempColor.b}, ${intensity})`
      }
    } else {
      // In light mode, use more contrast
      switch (colorMode) {
        case "warm":
          return `rgba(${tempColor.r}, ${Math.max(0, tempColor.g - 30)}, ${Math.max(0, tempColor.b - 50)}, ${intensity})`
        case "cool":
          return `rgba(${Math.max(0, tempColor.r - 50)}, ${Math.max(0, tempColor.g - 20)}, ${tempColor.b}, ${intensity})`
        case "neutral":
        default:
          return `rgba(${tempColor.r}, ${tempColor.g}, ${tempColor.b}, ${intensity})`
      }
    }
  }

  // Add noise texture as a URL-encoded SVG for better ray texture
  const getNoiseSVGBackground = (density = BASE_NOISE_DENSITY, opacity = BASE_NOISE_OPACITY, highFrequency = false) => {
    // Generate a more complex noise filter as an inline SVG encoded as a data URL
    const baseFrequency = highFrequency ? `${density * 2} ${density}` : `${density}`
    const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="500" height="500">
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="${baseFrequency}" numOctaves="6" stitchTiles="stitch" seed="${Math.random() * 100}" />
        <feComponentTransfer>
          <feFuncR type="gamma" amplitude="0.8" exponent="1" offset="0" />
          <feFuncG type="gamma" amplitude="0.8" exponent="1" offset="0" />
          <feFuncB type="gamma" amplitude="0.8" exponent="1" offset="0" />
        </feComponentTransfer>
        <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${opacity} 0" />
      </filter>
      <rect width="500" height="500" filter="url(#noise)" opacity="1"/>
    </svg>`

    const encodedSVG = encodeURIComponent(svgContent)
    return `url("data:image/svg+xml,${encodedSVG}")`
  }

  // Generate perlin noise SVG specifically for edge diffusion
  const getPerlinNoiseSVG = (opacity = PERLIN_NOISE_OPACITY) => {
    const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="500" height="500">
      <filter id="perlinNoise">
        <feTurbulence type="turbulence" baseFrequency="0.7" numOctaves="8" stitchTiles="stitch" seed="${Math.random() * 100}" />
        <feDisplacementMap in="SourceGraphic" scale="20" />
        <feGaussianBlur stdDeviation="2" />
        <feComponentTransfer>
          <feFuncA type="table" tableValues="0 0.1 0.2 0.3 0.4 0.5 0.6 0.7 0.8 0.9 1" />
        </feComponentTransfer>
      </filter>
      <rect width="500" height="500" filter="url(#perlinNoise)" opacity="${opacity}"/>
    </svg>`

    const encodedSVG = encodeURIComponent(svgContent)
    return `url("data:image/svg+xml,${encodedSVG}")`
  }

  // Calculate ray angles and positions based on position
  const getRaysConfig = () => {
    // Default base angles based on position if not specified
    let defaultBaseAngle = 315 // For top-left (this makes rays go to bottom-right)
    if (position === "top-right") defaultBaseAngle = 225 // Make rays go to bottom-left
    if (position === "center") defaultBaseAngle = 270 // Straight down

    // Use provided baseAngle or default
    const actualBaseAngle = baseAngle !== undefined ? baseAngle : defaultBaseAngle

    // Calculate ray origins - positioning them off-screen
    const origins: { x: number; y: number }[] = []

    // Generate origins based on position - all positioned beyond the visible area
    if (position === "top-left") {
      // Distribute origins along the top and left edges, but off-screen
      for (let i = 0; i < rayCount; i++) {
        const ratio = i / (rayCount - 1)
        if (ratio < 0.5) {
          // Points along extended top edge (-20%,0) to (30%,-10%)
          origins.push({
            x: -20 + ratio * 2 * 50,
            y: -10,
          })
        } else {
          // Points along extended left edge (-10%,-10%) to (-10%,40%)
          origins.push({
            x: -10,
            y: -10 + (ratio - 0.5) * 2 * 50,
          })
        }
      }
    } else if (position === "top-right") {
      // Distribute origins along the top and right edges, but off-screen
      for (let i = 0; i < rayCount; i++) {
        const ratio = i / (rayCount - 1)
        if (ratio < 0.5) {
          // Points along extended top edge (70%,-10%) to (120%,0)
          origins.push({
            x: 70 + ratio * 2 * 50,
            y: -10,
          })
        } else {
          // Points along extended right edge (110%,-10%) to (110%,40%)
          origins.push({
            x: 110,
            y: -10 + (ratio - 0.5) * 2 * 50,
          })
        }
      }
    } else {
      // Center
      // Fan-like pattern from beyond the top edge
      for (let i = 0; i < rayCount; i++) {
        const ratio = i / (rayCount - 1)
        // Spread across extended top edge, positioned above viewport
        const x = 20 + ratio * 60 // Range from 20% to 80%
        origins.push({ x, y: -15 }) // Position above the viewport
      }
    }

    // Generate ray configs
    return origins.map((origin) => {
      // Add variance to the angle (different for each ray)
      const variance = (Math.random() * 2 - 1) * angleVariance
      const angle = actualBaseAngle + variance

      // Random width within the specified range
      const width = rayWidth[0] + Math.random() * (rayWidth[1] - rayWidth[0])

      // Random opacity within the specified range, scaled by intensity
      const opacityScale = normalizedIntensity
      const opacity = (rayOpacity[0] + Math.random() * (rayOpacity[1] - rayOpacity[0])) * opacityScale

      return {
        originX: origin.x,
        originY: origin.y,
        angle,
        width,
        opacity,
      }
    })
  }

  // Create ray animations with dynamic blurs and texture pulsing
  const getRayAnimation = (ray: any) => {
    if (!animate) return {}

    return {
      opacity: [ray.opacity * 0.7, ray.opacity, ray.opacity * 0.8],
      filter: [
        `blur(${RAY_BLUR_RANGE[0]}px) contrast(${RAY_CONTRAST_RANGE[0]}) saturate(${RAY_SATURATION_RANGE[0]})`,
        `blur(${RAY_BLUR_RANGE[1]}px) contrast(${RAY_CONTRAST_RANGE[1]}) saturate(${RAY_SATURATION_RANGE[1]})`,
        `blur(${RAY_BLUR_RANGE[0]}px) contrast(${RAY_CONTRAST_RANGE[0]}) saturate(${RAY_SATURATION_RANGE[0]})`,
      ],
      backgroundPosition: [
        "0% 0%",
        `${Math.random() * BACKGROUND_POSITION_RANGE}% ${Math.random() * BACKGROUND_POSITION_RANGE}%`,
        "0% 0%",
      ],
      transition: {
        opacity: {
          duration:
            ANIMATION_DURATION_RANGE[0] + Math.random() * (ANIMATION_DURATION_RANGE[1] - ANIMATION_DURATION_RANGE[0]),
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse" as const,
          ease: "easeInOut",
        },
        filter: {
          duration:
            ANIMATION_DURATION_RANGE[0] + Math.random() * (ANIMATION_DURATION_RANGE[1] - ANIMATION_DURATION_RANGE[0]),
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse" as const,
          ease: "easeInOut",
        },
        backgroundPosition: {
          duration: ANIMATION_DURATION_RANGE[1] + Math.random() * ANIMATION_DURATION_RANGE[0],
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse" as const,
          ease: "easeInOut",
        },
      },
    }
  }

  useEffect(() => {
    setIsHydrated(true)

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"))
    }

    handleResize()
    checkDarkMode()

    window.addEventListener("resize", handleResize)

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          checkDarkMode()
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    return () => {
      window.removeEventListener("resize", handleResize)
      observer.disconnect()
    }
  }, [])

  // Generate SVG noise texture
  const noiseTexture = getNoiseSVGBackground(BASE_NOISE_DENSITY, BASE_NOISE_OPACITY)

  if (!isHydrated) {
    return <>{children}</>
  }

  const rayColor = getRayColor()
  const rays = getRaysConfig()

  // Determine appropriate mix blend mode based on dark/light mode
  const rayBlendMode = isDarkMode ? "screen" : "overlay"
  const ambientOverlayOpacity = isDarkMode ? AMBIENT_OVERLAY_OPACITY_DARK : AMBIENT_OVERLAY_OPACITY_LIGHT

  return (
    <div className={`relative ${className}`}>
      {/* Main content */}
      <div className="relative z-10">{children}</div>

      {/* God Rays Container */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Individual God Rays */}
        {rays.map((ray, index) => {
          // Create multiple layers for each ray to enhance the grainy effect
          const edgeNoiseTexture = getNoiseSVGBackground(EDGE_NOISE_DENSITY, EDGE_NOISE_OPACITY, true)
          const perlinNoiseTexture = getPerlinNoiseSVG(PERLIN_NOISE_OPACITY)

          return (
            <motion.div
              key={`ray-${index}`}
              className="absolute origin-[0%_0%]"
              style={{
                left: `${ray.originX}%`,
                top: `${ray.originY}%`,
                width: `${ray.width}vw`,
                height: `${rayLength * 100}vh`,
                transform: `rotate(${ray.angle}deg)`,
                position: "absolute",
                overflow: "visible",
              }}
            >
              {/* Base ray with gradient */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to bottom, ${rayColor}, transparent ${RAY_GRADIENT_STOP * 100}%)`,
                  mixBlendMode: rayBlendMode,
                  opacity: ray.opacity * 0.8,
                  filter: `blur(${RAY_BLUR_RANGE[0]}px) contrast(${RAY_CONTRAST_RANGE[0]}) saturate(${RAY_SATURATION_RANGE[0]})`,
                }}
                animate={animate ? getRayAnimation(ray) : undefined}
              />

              {/* Grainy edge layer */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: edgeNoiseTexture,
                  backgroundBlendMode: "overlay",
                  maskImage: `linear-gradient(to bottom, black 5%, black 30%, transparent ${RAY_GRADIENT_STOP * 100}%)`,
                  mixBlendMode: rayBlendMode,
                  opacity: ray.opacity * 0.9,
                  filter: `blur(${EDGE_BLUR_RANGE[0]}px) contrast(${EDGE_CONTRAST_RANGE[0]}) saturate(${EDGE_SATURATION_RANGE[0]})`,
                  transform: `scale(${EDGE_SCALE[0]}, ${EDGE_SCALE[1]})`,
                }}
                animate={
                  animate
                    ? {
                        filter: [
                          `blur(${EDGE_BLUR_RANGE[0]}px) contrast(${EDGE_CONTRAST_RANGE[0]}) saturate(${EDGE_SATURATION_RANGE[0]})`,
                          `blur(${EDGE_BLUR_RANGE[1]}px) contrast(${EDGE_CONTRAST_RANGE[1]}) saturate(${EDGE_SATURATION_RANGE[1]})`,
                          `blur(${EDGE_BLUR_RANGE[0]}px) contrast(${EDGE_CONTRAST_RANGE[0]}) saturate(${EDGE_SATURATION_RANGE[0]})`,
                        ],
                        opacity: [ray.opacity * 0.9, ray.opacity * 0.7, ray.opacity * 0.9],
                        transition: {
                          duration:
                            ANIMATION_DURATION_RANGE[0] +
                            Math.random() * (ANIMATION_DURATION_RANGE[1] - ANIMATION_DURATION_RANGE[0]),
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                          ease: "easeInOut",
                        },
                      }
                    : undefined
                }
              />

              {/* Perlin noise displacement layer for ultra-grainy edges */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: perlinNoiseTexture,
                  backgroundBlendMode: "overlay",
                  mixBlendMode: "overlay",
                  opacity: ray.opacity * 0.6,
                  filter: `blur(${PERLIN_BLUR_RANGE[0]}px) contrast(${PERLIN_CONTRAST}) brightness(${PERLIN_BRIGHTNESS_RANGE[0]})`,
                  transform: `scale(${PERLIN_SCALE[0]}, ${PERLIN_SCALE[1]})`,
                }}
                animate={
                  animate
                    ? {
                        filter: [
                          `blur(${PERLIN_BLUR_RANGE[0]}px) contrast(${PERLIN_CONTRAST}) brightness(${PERLIN_BRIGHTNESS_RANGE[0]})`,
                          `blur(${PERLIN_BLUR_RANGE[1]}px) contrast(${PERLIN_CONTRAST}) brightness(${PERLIN_BRIGHTNESS_RANGE[1]})`,
                          `blur(${PERLIN_BLUR_RANGE[0]}px) contrast(${PERLIN_CONTRAST}) brightness(${PERLIN_BRIGHTNESS_RANGE[0]})`,
                        ],
                        opacity: [ray.opacity * 0.6, ray.opacity * 0.4, ray.opacity * 0.6],
                        backgroundPosition: [
                          "0% 0%",
                          `${Math.random() * PERLIN_POSITION_RANGE}% ${Math.random() * PERLIN_POSITION_RANGE}%`,
                          "0% 0%",
                        ],
                        transition: {
                          duration: ANIMATION_DURATION_RANGE[1] + Math.random() * ANIMATION_DURATION_RANGE[0],
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                          ease: "easeInOut",
                        },
                      }
                    : undefined
                }
              />

              {/* Outer diffusion glow */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: "transparent",
                  boxShadow: `0 0 ${ray.width * 2}px ${ray.width * 0.8}px ${rayColor.replace(")", `, ${GLOW_INTENSITY})`)}`,
                  mixBlendMode: "screen",
                  opacity: ray.opacity * 0.7,
                  filter: `blur(${GLOW_BLUR}px)`,
                  transform: `scale(${GLOW_SCALE[0]}, ${GLOW_SCALE[1]})`,
                }}
              />
            </motion.div>
          )
        })}
        {/* High-frequency grain overlay for enhanced texture */}
        <div
          className="fixed inset-0 pointer-events-none z-1"
          style={{
            backgroundImage: getNoiseSVGBackground(HIGH_FREQ_NOISE_DENSITY, HIGH_FREQ_NOISE_OPACITY, true),
            mixBlendMode: isDarkMode ? "overlay" : "multiply",
            opacity: 0.5,
            filter: "contrast(1.5) brightness(1.05)",
          }}
        />
        {/* Grain overlay for texture */}
        <div
          className="fixed inset-0 pointer-events-none z-1"
          style={{
            backgroundImage: getNoiseSVGBackground(BASE_NOISE_DENSITY, BASE_NOISE_OPACITY),
            mixBlendMode: isDarkMode ? "overlay" : "multiply",
            opacity: 0.4,
          }}
        />
        {/* Subtle ambient overlay for light mode */}
        {!isDarkMode && (
          <div
            className="fixed inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(
                  circle at ${position === "top-left" ? "5% 5%" : position === "top-right" ? "95% 5%" : "50% 5%"}, 
                  rgba(255, 255, 255, ${ambientOverlayOpacity * 1.2}) 0%, 
                  transparent 70%
                ),
                ${getNoiseSVGBackground(BASE_NOISE_DENSITY, BASE_NOISE_OPACITY)}
              `,
              backgroundBlendMode: "soft-light",
              mixBlendMode: "overlay",
              opacity: 0.35,
              filter: `blur(${AMBIENT_BLUR}px)`,
            }}
          />
        )}

        {/* Subtle ambient overlay for dark mode to enhance moonlight effect */}
        {isDarkMode && (
          <div
            className="fixed inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(
                  circle at ${position === "top-left" ? "5% 5%" : position === "top-right" ? "95% 5%" : "50% 5%"}, 
                  rgba(100, 150, 255, ${ambientOverlayOpacity * 1.2}) 0%, 
                  transparent 70%
                ),
                ${getNoiseSVGBackground(BASE_NOISE_DENSITY, BASE_NOISE_OPACITY)}
              `,
              backgroundBlendMode: "overlay",
              mixBlendMode: "screen",
              opacity: 0.45,
              filter: `blur(${AMBIENT_BLUR}px)`,
            }}
          />
        )}
      </div>
    </div>
  )
}

export default GodRays

