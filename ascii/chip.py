#!/usr/bin/env python3
"""
silicon_gif.py - Export the chip animation as a GIF
Refined: square aspect, seamless loop, better 3D visibility
"""

import math
from PIL import Image, ImageDraw, ImageFont
import os

# ═══════════════════════════════════════════════════════════════════════════════
# Config
# ═══════════════════════════════════════════════════════════════════════════════

# Square output: 120x60 grid × 8x16 chars = 960x960
W, H = 120, 60
CHAR_W, CHAR_H = 8, 16
IMG_W, IMG_H = W * CHAR_W, H * CHAR_H  # 960x960

BG_COLOR = (0, 0, 0)

# Seamless loop: 120 frames, rotation completes exactly 2π
FRAMES = 480
FPS = 30  # 4 second loop

# Luminance ramp - Berkeley Mono renders these beautifully
L = " ·:;+*?X#%@"  # Simplified for cleaner look
# L = " .'`^,:;!|/\\-~+<>?[]{}1icxtjfnuvzXYJCL0Oqpbdkh#MW&8%B@$"  # Full ramp

# Colors
CYAN = (0, 255, 255)  # Bright nodes
TEAL = (0, 180, 200)  # Circuit traces
GOLD = (255, 200, 100)  # BGA pins
EDGE = (80, 130, 160)  # Chip edges - brighter for black bg
SUBSTRATE = (50, 75, 95)  # Dark silicon - more visible on black


def lerp(a, b, t):
    return int(a + (b - a) * t)


def mix(c1, c2, t):
    return tuple(lerp(a, b, t) for a, b in zip(c1, c2))


# ═══════════════════════════════════════════════════════════════════════════════
# Chip Renderer
# ═══════════════════════════════════════════════════════════════════════════════


def render_frame_data(A, B, t):
    """
    A = Y-axis rotation (0 to 2π for full loop)
    B = X-axis tilt (rocking)
    t = time for wave animations
    """
    buf = [[" "] * W for _ in range(H)]
    zbuf = [[0.0] * W for _ in range(H)]
    col = [[BG_COLOR] * W for _ in range(H)]

    cA, sA, cB, sB = math.cos(A), math.sin(A), math.cos(B), math.sin(B)

    K1 = 64  # Projection scale (doubled for 2x res)
    K2 = 3.5  # Camera distance

    def proj(x, y, z):
        # Rotate around Y, then X
        x1, z1 = x * cA + z * sA, z * cA - x * sA
        y1, z2 = y * cB - z1 * sB, z1 * cB + y * sB + K2
        if z2 < 0.3:
            return None, None, 0
        ooz = 1 / z2
        return int(W / 2 + K1 * ooz * x1 * 2), int(H / 2 - K1 * ooz * y1), ooz

    def plot(x, y, z, lum, c):
        if 0 <= x < W and 0 <= y < H and z > zbuf[y][x]:
            zbuf[y][x] = z
            buf[y][x] = L[min(len(L) - 1, max(0, int(lum * (len(L) - 1))))]
            col[y][x] = c

    # Chip geometry - thinner for better 3D read
    sz = 1.8  # Chip size (larger for visibility)
    th = 0.1  # Chip thickness

    # ───────────────────────────────────────────────────────────────────────
    # TOP SURFACE - circuit traces with flowing light
    # ───────────────────────────────────────────────────────────────────────
    for i in range(140):
        for j in range(140):
            u, v = (i / 139 - 0.5) * sz, (j / 139 - 0.5) * sz
            px, py, pz = proj(u, th / 2, v)
            if px is None:
                continue

            # Circuit grid pattern
            gi, gj = i % 6, j % 6
            trace = gi == 0 or gj == 0
            node = gi == 0 and gj == 0

            # Wave pulses across surface (use A for seamless sync)
            wave = math.sin(A * 3 - (u + v) * 5) * 0.5 + 0.5

            if node:
                lum = 0.7 + 0.3 * wave
                c = mix(TEAL, CYAN, wave)
            elif trace:
                lum = 0.3 + 0.4 * wave
                c = mix((50, 85, 100), TEAL, wave * 0.7)
            else:
                lum = 0.15
                c = SUBSTRATE

            plot(px, py, pz, lum, c)

    # ───────────────────────────────────────────────────────────────────────
    # GLOWING CORE - breathing pulse
    # ───────────────────────────────────────────────────────────────────────
    for i in range(50):
        for j in range(50):
            u, v = (i / 49 - 0.5) * 0.45, (j / 49 - 0.5) * 0.45
            r = math.sqrt(u * u + v * v)
            if r > 0.18:
                continue
            px, py, pz = proj(u, th / 2 + 0.005, v)
            if px is None:
                continue

            glow = 1 - r / 0.18
            pulse = 0.65 + 0.35 * math.sin(A * 2)  # Synced to rotation
            lum = glow * pulse
            c = mix(TEAL, (200, 255, 255), glow)
            plot(px, py, pz + 0.01, lum, c)

    # ───────────────────────────────────────────────────────────────────────
    # EDGES - visible but subtle
    # ───────────────────────────────────────────────────────────────────────
    for side in range(4):
        for i in range(100):
            for j in range(8):
                e = i / 99
                y = (j / 7 - 0.5) * th

                if side == 0:  # Front
                    u, v = (e - 0.5) * sz, sz / 2
                    normal = sA  # Facing camera when rotated
                elif side == 1:  # Back
                    u, v = (e - 0.5) * sz, -sz / 2
                    normal = -sA
                elif side == 2:  # Left
                    u, v = -sz / 2, (e - 0.5) * sz
                    normal = -cA
                else:  # Right
                    u, v = sz / 2, (e - 0.5) * sz
                    normal = cA

                px, py, pz = proj(u, y, v)
                if px is None:
                    continue

                # Lighting based on face orientation
                brightness = 0.3 + 0.25 * max(0, normal)
                c = mix((45, 70, 90), EDGE, brightness)
                plot(px, py, pz, brightness, c)

    # ───────────────────────────────────────────────────────────────────────
    # BOTTOM - darker underside (visible when tilted)
    # ───────────────────────────────────────────────────────────────────────
    if sB > 0.05:  # Only render when tilted to show bottom
        for i in range(100):
            for j in range(100):
                u, v = (i / 99 - 0.5) * sz * 0.95, (j / 99 - 0.5) * sz * 0.95
                px, py, pz = proj(u, -th / 2, v)
                if px is None:
                    continue
                lum = 0.2 * sB  # Darker, scales with visibility
                plot(px, py, pz, lum, (40, 55, 70))

    # ───────────────────────────────────────────────────────────────────────
    # BGA PINS - golden solder balls with radial pulse
    # ───────────────────────────────────────────────────────────────────────
    pin_y = -th / 2 - 0.07
    for i in range(16):
        for j in range(16):
            # Hollow center (no pins under die)
            if 5 <= i <= 10 and 5 <= j <= 10:
                continue

            u = (i - 7.5) / 15 * sz * 0.85
            v = (j - 7.5) / 15 * sz * 0.85
            px, py, pz = proj(u, pin_y, v)
            if px is None:
                continue

            # Radial ripple from center (synced to rotation)
            d = math.sqrt(u * u + v * v)
            pulse = math.sin(A * 2 - d * 7) * 0.5 + 0.5

            lum = 0.5 + 0.5 * pulse
            c = mix((180, 140, 60), GOLD, pulse)
            plot(px, py, pz, lum, c)

    return buf, col


# ═══════════════════════════════════════════════════════════════════════════════
# Image Rendering
# ═══════════════════════════════════════════════════════════════════════════════


def get_font():
    """Try to find Berkeley Mono or a good fallback"""
    font_paths = [
        # Berkeley Mono locations
        "/mnt/user-data/uploads/BerkeleyMono-Regular.ttf",
        "/Users/pserb/Library/Fonts/berkeley.ttf",
        "/Users/pserb/Library/Fonts/BerkeleyMono-Regular.ttf",
        "~/.local/share/fonts/BerkeleyMono-Regular.ttf",
        # Fallbacks
        "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf",
    ]

    for path in font_paths:
        path = os.path.expanduser(path)
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, 14)
            except Exception:
                pass

    return ImageFont.load_default()


def render_image(buf, col, font):
    """Render character/color arrays to an image"""
    img = Image.new("RGB", (IMG_W, IMG_H), BG_COLOR)
    draw = ImageDraw.Draw(img)

    for y in range(H):
        for x in range(W):
            char = buf[y][x]
            color = col[y][x]
            if char != " ":
                px, py = x * CHAR_W, y * CHAR_H
                draw.text((px, py), char, font=font, fill=color)

    return img


# ═══════════════════════════════════════════════════════════════════════════════
# Main
# ═══════════════════════════════════════════════════════════════════════════════


def main():
    print("Silicon GIF Generator")
    print(f"  {FRAMES} frames @ {FPS}fps = {FRAMES/FPS:.1f}s loop")
    print(f"  Resolution: {IMG_W}×{IMG_H}")
    print()

    font = get_font()
    images = []

    # Animation: one full rotation (2π) over FRAMES
    # This ensures perfect seamless loop
    for frame in range(FRAMES):
        # Progress indicator
        pct = (frame + 1) / FRAMES * 100
        bar = "█" * int(pct / 5) + "░" * (20 - int(pct / 5))
        print(f"\r  Rendering: [{bar}] {pct:5.1f}%", end="", flush=True)

        # Calculate angles for this frame
        # A: full rotation 0 → 2π
        A = (frame / FRAMES) * 2 * math.pi

        # B: gentle rocking, completes 2 full cycles per rotation
        # (so it also loops perfectly)
        B = math.sin(A * 2) * 0.35

        # t: for wave animations (same as A for sync)
        t = A

        buf, col = render_frame_data(A, B, t)
        img = render_image(buf, col, font)
        images.append(img)

    print("\n")
    print("  Saving GIF...")

    output_path = "silicon.gif"
    images[0].save(
        output_path,
        save_all=True,
        append_images=images[1:],
        duration=int(1000 / FPS),
        loop=0,
        optimize=True,
    )

    size_kb = os.path.getsize(output_path) / 1024
    print(f"  ✓ {output_path} ({size_kb:.0f} KB)")
    print()


if __name__ == "__main__":
    main()
