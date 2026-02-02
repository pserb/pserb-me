# ASCII Chip Animation - Context for Next.js Port

## Overview

A 3D rotating silicon chip rendered as ASCII art. The animation features:
- Rotating chip with circuit trace patterns on top surface
- Glowing core with breathing pulse effect
- BGA (ball grid array) solder pins on bottom with radial pulse
- Teal/cyan/gold color palette on black background

## Current Implementation

**Location:** `chip.py` in this directory

**Tech:** Python + PIL, outputs rasterized GIF

**Problem:** Converting vector-based monospace font to pixelated GIF loses crispness. Real-time rendering looks significantly better than the exported GIF.

## Goal

Achieve **CMS flexibility** (swap/configure animations via Sanity) + **real-time render quality** (crisp at any resolution).

## User's Setup

- Next.js website
- Sanity IO as CMS/CDN
- `projects` page with configuration-driven `project` documents
- Needs a flexible approach that works within this pattern (not hardcoded per-animation)

## Recommended Approach

**Canvas-based rendering with Sanity-stored configuration.**

Sanity document could store:
```js
{
  animationType: "ascii-chip",  // or other animation types
  config: {
    colors: { cyan: "#00FFFF", teal: "#00B4C8", gold: "#FFC864" },
    speed: 1.0,
    size: "medium",
    // ... other params
  }
}
```

React component fetches config, renders appropriate animation client-side.

## Core Animation Algorithm (for porting)

The 3D projection math:
```
// Rotation matrices (A = Y-axis rotation, B = X-axis tilt)
x1 = x * cos(A) + z * sin(A)
z1 = z * cos(A) - x * sin(A)
y1 = y * cos(B) - z1 * sin(B)
z2 = z1 * cos(B) + y * sin(B) + K2  // K2 = camera distance

// Project to 2D
screenX = centerX + K1 * x1 / z2
screenY = centerY - K1 * y1 / z2
```

Animation loop:
- `A` increments from 0 to 2π for full rotation
- `B = sin(A * 2) * 0.35` for gentle rocking motion
- Wave effects use `sin(A * n - distance * m)` for synchronized pulses

Key surfaces:
1. **Top surface:** Grid pattern, nodes at intersections glow with traveling wave
2. **Glowing core:** Central circle with breathing pulse `0.65 + 0.35 * sin(A * 2)`
3. **Edges:** 4 sides with lighting based on face normal dot camera direction
4. **BGA pins:** Grid with hollow center, radial pulse emanating outward

## Color Palette

```js
const colors = {
  cyan: [0, 255, 255],      // Bright nodes
  teal: [0, 180, 200],      // Circuit traces
  gold: [255, 200, 100],    // BGA pins
  edge: [80, 130, 160],     // Chip edges
  substrate: [50, 75, 95],  // Silicon base
  bg: [0, 0, 0],            // Background
}
```

## Luminance Ramp

Characters ordered by visual density for shading:
```
" ·:;+*?X#%@"
```

## Technical Considerations

- Use `requestAnimationFrame` for smooth animation
- Canvas `ctx.fillText()` for character rendering
- Monospace font required (user has Berkeley Mono)
- Z-buffer needed for correct depth sorting
- Consider `OffscreenCanvas` or memoization for performance
- Could use Web Workers for complex calculations

## File Reference

See `chip.py` for complete Python implementation with all geometry and rendering logic.
