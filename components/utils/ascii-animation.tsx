"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
 
 type Rgb = [number, number, number];
 
 type AsciiAnimationConfig = {
 	speed?: number;
 	rotationPeriod?: number;
 	grid?: {
 		columns?: number;
 		rows?: number;
 	};
 	character?: {
 		width?: number;
 		height?: number;
 		fontSize?: number;
 		fontFamily?: string;
 	};
 	colors?: {
 		cyan?: string;
 		teal?: string;
 		gold?: string;
 		edge?: string;
 		substrate?: string;
 		background?: string;
 	};
	themeColors?: {
		dark?: {
			cyan?: string;
			teal?: string;
			gold?: string;
			edge?: string;
			substrate?: string;
			background?: string;
		};
		light?: {
			cyan?: string;
			teal?: string;
			gold?: string;
			edge?: string;
			substrate?: string;
			background?: string;
		};
	};
 	chip?: {
 		size?: number;
 		thickness?: number;
 		projectionScale?: number;
 		cameraDistance?: number;
 	};
 };
 
 type AsciiAnimationDocument = {
 	_id?: string;
 	animationType?: string;
	preset?: string;
 	config?: AsciiAnimationConfig;
 };
 
type ChipConfig = Required<NonNullable<AsciiAnimationConfig["chip"]>>;

 type AsciiAnimationProps = {
 	animation?: AsciiAnimationDocument | null;
 	className?: string;
 	size?: "small" | "medium" | "large";
	maxWidth?: number;
	maxHeight?: number;
	responsive?: boolean;
	showControls?: boolean;
 };
 
//  const LUMINANCE_RAMP = " ·:;+*?X#%@";
// const LUMINANCE_RAMP = " .'`:;!+*?xX#%@$&MW";
//  const LUMINANCE_RAMP = " .'`:;!|/\\-~+*?xX#%@$&MW";
 const LUMINANCE_RAMP = " .'`^,:;!|/\\-~+<>?[]{}1icxtjfnuvzXYJCL0Oqpbdkh#MW&8%B@$";
 const DEFAULT_COLORS: Record<string, Rgb> = {
 	cyan: [0, 255, 255],
 	teal: [0, 180, 200],
 	gold: [255, 200, 100],
 	edge: [80, 130, 160],
 	substrate: [50, 75, 95],
 	background: [0, 0, 0],
 };
const PRESET_COLORS: Record<
	string,
	{
		dark?: Partial<Record<keyof typeof DEFAULT_COLORS, string>>;
		light?: Partial<Record<keyof typeof DEFAULT_COLORS, string>>;
	}
> = {
	"chip-default": {
		dark: {
			cyan: "#00FFFF",
			teal: "#00B4C8",
			gold: "#FFC864",
			edge: "#5082A0",
			substrate: "#324B5F",
			background: "#000000",
		},
		light: {
			cyan: "#007A8C",
			teal: "#006B73",
			gold: "#8C5A14",
			edge: "#2F3F4A",
			substrate: "#8EA0AE",
			background: "#FFFFFF",
		},
	},
	"chip-dark": {
		dark: {
			cyan: "#00FFFF",
			teal: "#00B4C8",
			gold: "#FFC864",
			edge: "#5082A0",
			substrate: "#324B5F",
			background: "#000000",
		},
	},
	"chip-light": {
		light: {
			cyan: "#007A8C",
			teal: "#006B73",
			gold: "#8C5A14",
			edge: "#2F3F4A",
			substrate: "#8EA0AE",
			background: "#FFFFFF",
		},
	},
};
 
 function hexToRgb(value: string): Rgb | null {
 	const normalized = value.replace("#", "").trim();
 	if (normalized.length === 3) {
 		const r = parseInt(normalized[0] + normalized[0], 16);
 		const g = parseInt(normalized[1] + normalized[1], 16);
 		const b = parseInt(normalized[2] + normalized[2], 16);
 		return [r, g, b];
 	}
 	if (normalized.length === 6) {
 		const r = parseInt(normalized.slice(0, 2), 16);
 		const g = parseInt(normalized.slice(2, 4), 16);
 		const b = parseInt(normalized.slice(4, 6), 16);
 		return [r, g, b];
 	}
 	return null;
 }
 
 function resolveColor(value: string | undefined, fallback: Rgb): Rgb {
 	if (!value) return fallback;
 	const rgb = hexToRgb(value);
 	return rgb ?? fallback;
 }
 
 function rgbToCss([r, g, b]: Rgb): string {
 	return `rgb(${r}, ${g}, ${b})`;
 }
 
 function lerp(a: number, b: number, t: number) {
 	return a + (b - a) * t;
 }
 
 function mix(c1: Rgb, c2: Rgb, t: number): Rgb {
 	return [
 		Math.round(lerp(c1[0], c2[0], t)),
 		Math.round(lerp(c1[1], c2[1], t)),
 		Math.round(lerp(c1[2], c2[2], t)),
 	];
 }
 
 function renderAsciiChipFrame({
 	ctx,
 	columns,
 	rows,
 	charWidth,
 	charHeight,
 	fontSize,
 	fontFamily,
 	colors,
 	A,
 	B,
 	chip,
	lightModeBoost,
 }: {
 	ctx: CanvasRenderingContext2D;
 	columns: number;
 	rows: number;
 	charWidth: number;
 	charHeight: number;
 	fontSize: number;
 	fontFamily: string;
 	colors: Record<string, Rgb>;
 	A: number;
 	B: number;
	chip: ChipConfig;
	lightModeBoost: boolean;
 }) {
 	const buf = new Array(columns * rows).fill(" ");
 	const zbuf = new Array(columns * rows).fill(0);
 	const col = new Array(columns * rows).fill(colors.background);
 
 	const cA = Math.cos(A);
 	const sA = Math.sin(A);
 	const cB = Math.cos(B);
 	const sB = Math.sin(B);
 
 	const K1 = chip.projectionScale;
 	const K2 = chip.cameraDistance;
 
 	const proj = (x: number, y: number, z: number) => {
 		const x1 = x * cA + z * sA;
 		const z1 = z * cA - x * sA;
 		const y1 = y * cB - z1 * sB;
 		const z2 = z1 * cB + y1 * sB + K2;
 		if (z2 < 0.3) return null;
 		const ooz = 1 / z2;
 		return {
 			x: Math.floor(columns / 2 + K1 * ooz * x1 * 2),
 			y: Math.floor(rows / 2 - K1 * ooz * y1),
 			z: ooz,
 		};
 	};
 
	const plot = (x: number, y: number, z: number, lum: number, c: Rgb) => {
 		if (x < 0 || x >= columns || y < 0 || y >= rows) return;
 		const idx = y * columns + x;
 		if (z <= zbuf[idx]) return;
 		zbuf[idx] = z;
		const boostedLum = lightModeBoost ? Math.min(1, lum * 1.45 + 0.05) : lum;
		const lumIndex = Math.min(
 			LUMINANCE_RAMP.length - 1,
			Math.max(0, Math.floor(boostedLum * (LUMINANCE_RAMP.length - 1))),
 		);
 		buf[idx] = LUMINANCE_RAMP[lumIndex];
 		col[idx] = c;
 	};
 
 	const size = chip.size;
 	const thickness = chip.thickness;
 
 	for (let i = 0; i < 140; i += 1) {
 		for (let j = 0; j < 140; j += 1) {
 			const u = (i / 139 - 0.5) * size;
 			const v = (j / 139 - 0.5) * size;
 			const projected = proj(u, thickness / 2, v);
 			if (!projected) continue;
 
 			const gi = i % 6;
 			const gj = j % 6;
 			const trace = gi === 0 || gj === 0;
 			const node = gi === 0 && gj === 0;
 
 			const wave = Math.sin(A * 3 - (u + v) * 5) * 0.5 + 0.5;
 
 			if (node) {
 				const lum = 0.7 + 0.3 * wave;
 				const c = mix(colors.teal, colors.cyan, wave);
 				plot(projected.x, projected.y, projected.z, lum, c);
 			} else if (trace) {
 				const lum = 0.3 + 0.4 * wave;
 				const c = mix([50, 85, 100], colors.teal, wave * 0.7);
 				plot(projected.x, projected.y, projected.z, lum, c);
 			} else {
 				plot(projected.x, projected.y, projected.z, 0.15, colors.substrate);
 			}
 		}
 	}
 
 	for (let i = 0; i < 50; i += 1) {
 		for (let j = 0; j < 50; j += 1) {
 			const u = (i / 49 - 0.5) * 0.45;
 			const v = (j / 49 - 0.5) * 0.45;
 			const r = Math.sqrt(u * u + v * v);
 			if (r > 0.18) continue;
 			const projected = proj(u, thickness / 2 + 0.005, v);
 			if (!projected) continue;
 
 			const glow = 1 - r / 0.18;
 			const pulse = 0.65 + 0.35 * Math.sin(A * 2);
 			const lum = glow * pulse;
 			const c = mix(colors.teal, [200, 255, 255], glow);
 			plot(projected.x, projected.y, projected.z + 0.01, lum, c);
 		}
 	}
 
 	for (let side = 0; side < 4; side += 1) {
 		for (let i = 0; i < 100; i += 1) {
 			for (let j = 0; j < 8; j += 1) {
 				const e = i / 99;
 				const y = (j / 7 - 0.5) * thickness;
 
 				let u = 0;
 				let v = 0;
 				let normal = 0;
 
 				if (side === 0) {
 					u = (e - 0.5) * size;
 					v = size / 2;
 					normal = sA;
 				} else if (side === 1) {
 					u = (e - 0.5) * size;
 					v = -size / 2;
 					normal = -sA;
 				} else if (side === 2) {
 					u = -size / 2;
 					v = (e - 0.5) * size;
 					normal = -cA;
 				} else {
 					u = size / 2;
 					v = (e - 0.5) * size;
 					normal = cA;
 				}
 
 				const projected = proj(u, y, v);
 				if (!projected) continue;
 
 				const brightness = 0.3 + 0.25 * Math.max(0, normal);
 				const c = mix([45, 70, 90], colors.edge, brightness);
 				plot(projected.x, projected.y, projected.z, brightness, c);
 			}
 		}
 	}
 
 	if (sB > 0.05) {
 		for (let i = 0; i < 100; i += 1) {
 			for (let j = 0; j < 100; j += 1) {
 				const u = (i / 99 - 0.5) * size * 0.95;
 				const v = (j / 99 - 0.5) * size * 0.95;
 				const projected = proj(u, -thickness / 2, v);
 				if (!projected) continue;
 				const lum = 0.2 * sB;
 				plot(projected.x, projected.y, projected.z, lum, [40, 55, 70]);
 			}
 		}
 	}
 
 	const pinY = -thickness / 2 - 0.07;
 	for (let i = 0; i < 16; i += 1) {
 		for (let j = 0; j < 16; j += 1) {
 			if (i >= 5 && i <= 10 && j >= 5 && j <= 10) continue;
 			const u = ((i - 7.5) / 15) * size * 0.85;
 			const v = ((j - 7.5) / 15) * size * 0.85;
 			const projected = proj(u, pinY, v);
 			if (!projected) continue;
 
 			const d = Math.sqrt(u * u + v * v);
 			const pulse = Math.sin(A * 2 - d * 7) * 0.5 + 0.5;
 
 			const lum = 0.5 + 0.5 * pulse;
 			const c = mix([180, 140, 60], colors.gold, pulse);
 			plot(projected.x, projected.y, projected.z, lum, c);
 		}
 	}
 
 	ctx.fillStyle = rgbToCss(colors.background);
 	ctx.fillRect(0, 0, columns * charWidth, rows * charHeight);
 
 	ctx.font = `${fontSize}px ${fontFamily}`;
 	ctx.textBaseline = "top";
 
 	for (let y = 0; y < rows; y += 1) {
 		for (let x = 0; x < columns; x += 1) {
 			const idx = y * columns + x;
 			const char = buf[idx];
 			if (char === " ") continue;
 			ctx.fillStyle = rgbToCss(col[idx]);
 			ctx.fillText(char, x * charWidth, y * charHeight);
 		}
 	}
 }
 
export function AsciiAnimation({
	animation,
	className,
	size = "medium",
	maxWidth,
	maxHeight,
	responsive = false,
	showControls = false,
}: AsciiAnimationProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);
 	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [mounted, setMounted] = useState(false);
	const [isDark, setIsDark] = useState(true);
	const [containerWidth, setContainerWidth] = useState<number | null>(null);
	const [isPaused, setIsPaused] = useState(false);
	const frameIdRef = useRef<number | null>(null);
	const startTimeRef = useRef<number | null>(null);
	const elapsedOffsetRef = useRef(0);
	const lastElapsedRef = useRef(0);
 
 	const config = useMemo(() => animation?.config ?? {}, [animation?.config]);
 	const animationType = animation?.animationType ?? "ascii-chip";
	const preset = animation?.preset ?? "chip-default";
 
 	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!responsive || !containerRef.current) return;
		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				setContainerWidth(entry.contentRect.width);
			}
		});
		observer.observe(containerRef.current);
		setContainerWidth(containerRef.current.offsetWidth);
		return () => observer.disconnect();
	}, [responsive]);

	useEffect(() => {
		if (!mounted) return;
		const updateTheme = () => {
			setIsDark(document.documentElement.classList.contains("dark"));
		};
		updateTheme();
		const observer = new MutationObserver(updateTheme);
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
		return () => observer.disconnect();
	}, [mounted]);

	useEffect(() => {
		elapsedOffsetRef.current = 0;
		lastElapsedRef.current = 0;
		startTimeRef.current = null;
	}, [animationType, config, containerWidth, isDark, maxHeight, maxWidth, preset, responsive, size]);

	useEffect(() => {
 		const canvas = canvasRef.current;
 		if (!canvas) return;
 		if (animationType !== "ascii-chip") return;
		if (isPaused) return;
 
 		const columns = config.grid?.columns ?? 120;
 		const rows = config.grid?.rows ?? 60;
 		const baseCharWidth = config.character?.width ?? 8;
 		const baseCharHeight = config.character?.height ?? 16;
 		const baseFontSize = config.character?.fontSize ?? 14;
 		const fontFamily =
 			config.character?.fontFamily ??
 			"Berkeley Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace";
 
		const scaleBySize = size === "small" ? 0.7 : size === "large" ? 1.25 : 1;
		const baseWidth = columns * baseCharWidth;
		const baseHeight = rows * baseCharHeight;
		const effectiveMaxWidth = responsive && containerWidth ? Math.min(containerWidth, maxWidth ?? Infinity) : maxWidth;
		const scaleByBounds = Math.min(
			effectiveMaxWidth ? effectiveMaxWidth / baseWidth : 1,
			maxHeight ? maxHeight / baseHeight : 1,
		);
		const scale = Math.min(scaleBySize, scaleByBounds);

		const charWidth = baseCharWidth * scale;
		const charHeight = baseCharHeight * scale;
		const fontSize = baseFontSize * scale;
 
 		const displayWidth = Math.ceil(columns * charWidth);
 		const displayHeight = Math.ceil(rows * charHeight);
 
 		const dpr = window.devicePixelRatio || 1;
 		canvas.width = Math.floor(displayWidth * dpr);
 		canvas.height = Math.floor(displayHeight * dpr);
 		canvas.style.width = `${displayWidth}px`;
 		canvas.style.height = `${displayHeight}px`;
 
 		const ctx = canvas.getContext("2d");
 		if (!ctx) return;
 		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
 
		const presetColors = PRESET_COLORS[preset] ?? PRESET_COLORS["chip-default"];
		const themeOverride = isDark ? config.themeColors?.dark : config.themeColors?.light;
		const themePreset = isDark ? presetColors?.dark : presetColors?.light;
		const fallbackPreset = isDark ? presetColors?.dark : presetColors?.light ?? presetColors?.dark;
		const themedColors = themeOverride ?? themePreset ?? fallbackPreset;
		const fallbackColors = config.colors ?? {};
		const resolvedColors = {
			cyan: resolveColor(
				themedColors?.cyan ?? fallbackColors.cyan,
				DEFAULT_COLORS.cyan,
			),
			teal: resolveColor(
				themedColors?.teal ?? fallbackColors.teal,
				DEFAULT_COLORS.teal,
			),
			gold: resolveColor(
				themedColors?.gold ?? fallbackColors.gold,
				DEFAULT_COLORS.gold,
			),
			edge: resolveColor(
				themedColors?.edge ?? fallbackColors.edge,
				DEFAULT_COLORS.edge,
			),
			substrate: resolveColor(
				themedColors?.substrate ?? fallbackColors.substrate,
				DEFAULT_COLORS.substrate,
			),
			background: resolveColor(
				themedColors?.background ?? fallbackColors.background,
				DEFAULT_COLORS.background,
			),
		};
 
 		const speed = config.speed ?? 1;
 		const rotationPeriod = config.rotationPeriod ?? 16;
		const chip: ChipConfig = {
 			size: config.chip?.size ?? 1.8,
 			thickness: config.chip?.thickness ?? 0.1,
 			projectionScale: config.chip?.projectionScale ?? 64,
 			cameraDistance: config.chip?.cameraDistance ?? 3.5,
 		};
 
		let frameId: number;
 
 		const tick = (now: number) => {
			if (startTimeRef.current === null) {
				startTimeRef.current = now;
			}
			const elapsed =
				((now - startTimeRef.current) / 1000) * speed + elapsedOffsetRef.current;
			lastElapsedRef.current = elapsed;
 			const A = (elapsed / rotationPeriod) * Math.PI * 2;
 			const B = Math.sin(A * 2) * 0.35;
 
 			renderAsciiChipFrame({
 				ctx,
 				columns,
 				rows,
 				charWidth,
 				charHeight,
 				fontSize,
 				fontFamily,
 				colors: resolvedColors,
				A,
				B,
				chip,
				lightModeBoost: !isDark,
 			});
 
			frameId = window.requestAnimationFrame(tick);
			frameIdRef.current = frameId;
 		};
 
 		frameId = window.requestAnimationFrame(tick);
		frameIdRef.current = frameId;
 
 		return () => {
 			window.cancelAnimationFrame(frameId);
 		};
	}, [
		animationType,
		config,
		containerWidth,
		isDark,
		isPaused,
		maxHeight,
		maxWidth,
		preset,
		responsive,
		size,
	]);
 
 	if (!animation) return null;
 
 	if (animationType !== "ascii-chip") {
 		return (
 			<div
 				className={cn(
 					"flex items-center justify-center rounded border border-border bg-black text-xs text-muted-foreground",
 					className,
 				)}
 			>
 				Unsupported animation type: {animationType}
 			</div>
 		);
 	}
 
	const handleTogglePause = () => {
		setIsPaused((prev) => {
			if (!prev) {
				elapsedOffsetRef.current = lastElapsedRef.current;
				if (frameIdRef.current !== null) {
					window.cancelAnimationFrame(frameIdRef.current);
				}
				return true;
			}
			startTimeRef.current = null;
			return false;
		});
	};

	const pauseButton = showControls ? (
		<button
			type="button"
			onClick={handleTogglePause}
			aria-pressed={isPaused}
			className={cn(
				"pointer-events-auto absolute bottom-2 right-2 z-10 rounded border border-border",
				"bg-background/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]",
				"text-muted-foreground shadow-sm opacity-0 transition-opacity duration-200",
				"group-hover:opacity-100 focus-visible:opacity-100 hover:text-foreground",
				"focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
				"backdrop-blur",
			)}
		>
			{isPaused ? "Play" : "Pause"}
		</button>
	) : null;

	if (responsive) {
		return (
			<div ref={containerRef} className="w-full flex justify-center">
				<div className={cn("relative inline-block", showControls && "group")}>
					{pauseButton}
					<canvas ref={canvasRef} className={cn("block rounded border border-border bg-black", className)} />
				</div>
			</div>
		);
	}

	if (showControls) {
		return (
			<div className="relative inline-block group">
				{pauseButton}
				<canvas ref={canvasRef} className={cn("block rounded border border-border bg-black", className)} />
			</div>
		);
	}

	return (
		<canvas ref={canvasRef} className={cn("block rounded border border-border bg-black", className)} />
	);
 }
