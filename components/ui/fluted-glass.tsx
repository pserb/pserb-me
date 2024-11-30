'use client'

import React, { ReactNode } from 'react'

type FlutedGlassType = 'fluted' | 'cross' | 'romb' | 'circle'

interface FlutedGlassProps {
  type?: FlutedGlassType
  angle?: number
  children?: ReactNode
  className?: string
  rounded?: boolean
  border?: boolean
}

const FlutedGlass: React.FC<FlutedGlassProps> = ({ type = 'fluted', angle, children, className = '', rounded = false, border = true }) => {
  const createGroove = (grooveAngle: number) => {
    if (type === 'circle') {
      return `repeating-radial-gradient(circle at 50%,
        black 0px,
        black 1px,
        transparent 3px,
        transparent 6px)`
    }
    return `repeating-linear-gradient(${grooveAngle}deg,
        black 0px,
        black 1px,
        transparent 3px,
        transparent 6px)`
  }

  const createDiffusion = (diffusionAngle: number) => {
    if (type === 'circle') {
      return `repeating-radial-gradient(circle at 50%,
        transparent 0px,
        transparent 3px,
        black 4px,
        black 5px,
        transparent 6px)`
    }
    return `repeating-linear-gradient(${diffusionAngle}deg,
        transparent 0px,
        transparent 3px,
        black 4px,
        black 5px,
        transparent 6px)`
  }

  const groovesAngle = angle ?? (type === 'romb' ? 45 : 90)
  const grooves = [createGroove(groovesAngle)]

  if (type !== 'fluted') {
    grooves.push(createGroove(groovesAngle + 90))
  }

  const groovesStyle = {
    maskImage: grooves.join(', ')
  }

  const diffusionStyle = {
    maskImage: createDiffusion(groovesAngle)
  }

  return (
    <div className={`relative w-full h-full ${rounded ? 'rounded-md overflow-hidden' : ''} ${className}`} suppressHydrationWarning>
      <div className={`absolute inset-0 backdrop-blur-md bg-background/60 ${rounded ? 'rounded-md' : ''}`}>
      </div>

      <div
        className={`absolute inset-0 bg-zinc-400/10 backdrop-blur-xl ${rounded ? 'rounded-md' : ''}`}
        style={groovesStyle}>
      </div>

      <div className={`absolute inset-0 bg-indigo-300/10 ${rounded ? 'rounded-md' : ''}`}
        style={diffusionStyle}>
      </div>

      <div
        className={`absolute inset-0 ${border ? 'border' : ''} z-20 ${rounded ? 'rounded-md' : ''}`}>
        {children}
      </div>
    </div>
  )
}

export default FlutedGlass

