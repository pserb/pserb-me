"use client";

import React, { useEffect, useState, useRef } from "react";

// Ray appearance constants - simplified
const RAY_BLUR = 30; // Simplified single blur value
const RAY_GRADIENT_STOP = 0.85; // Where the ray gradient transitions to transparent (0-1)

interface GodRaysProps {
	children?: React.ReactNode;
	intensity?: number; // 0-100, controls the overall intensity of the effect
	colorMode?: "warm" | "cool" | "neutral"; // Different color schemes
	position?: "top-left" | "top-right" | "center"; // Light source position
	rayCount?: number; // Number of rays (reduced for mobile)
	className?: string;
	temperatureK?: number; // Color temperature in Kelvin
	animate?: boolean; // Option to enable/disable all animations
	// Simplified ray properties
	rayWidth?: [number, number]; // Min and max ray width in vw units
	rayOpacity?: [number, number]; // Min and max opacity
	rayLength?: number; // Ray length multiplier (1 = screen height)
	disableOnMobile?: boolean; // Option to disable effects on mobile devices
}

const GodRays: React.FC<GodRaysProps> = ({
	children,
	intensity = 30,
	colorMode = "neutral",
	position = "top-left",
	rayCount = 10, // Reduced default
	className = "",
	temperatureK = 7500,
	rayWidth = [4.5, 5.5], // Reduced width
	rayOpacity = [0.08, 0.2], // Reduced opacity
	rayLength = 1.5,
	disableOnMobile = true, // Disable on mobile by default
}) => {
	const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
	const [isHydrated, setIsHydrated] = useState(false);
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

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

	// Get color based on temperature and color mode
	const getRayColor = () => {
		const tempColor = kelvinToRGB(temperatureK);

		// Adjust for dark mode
		const intensity = isDarkMode ? normalizedIntensity * 1.2 : normalizedIntensity;

		// In dark mode, use a more bluish tint for moonlight effect
		if (isDarkMode) {
			switch (colorMode) {
				case "warm":
					return `rgba(${tempColor.r}, ${Math.max(0, tempColor.g - 30)}, ${Math.max(0, tempColor.b - 50)}, ${intensity})`;
				case "cool":
					return `rgba(${Math.max(0, tempColor.r - 50)}, ${Math.max(0, tempColor.g - 20)}, ${tempColor.b}, ${intensity})`;
				case "neutral":
				default:
					return `rgba(${Math.max(0, tempColor.r - 30)}, ${Math.max(0, tempColor.g - 10)}, ${tempColor.b}, ${intensity})`;
			}
		} else {
			// In light mode, use more contrast
			switch (colorMode) {
				case "warm":
					return `rgba(${tempColor.r}, ${Math.max(0, tempColor.g - 30)}, ${Math.max(0, tempColor.b - 50)}, ${intensity})`;
				case "cool":
					return `rgba(${Math.max(0, tempColor.r - 50)}, ${Math.max(0, tempColor.g - 20)}, ${tempColor.b}, ${intensity})`;
				case "neutral":
				default:
					return `rgba(${tempColor.r}, ${tempColor.g}, ${tempColor.b}, ${intensity})`;
			}
		}
	};

	// Calculate ray angles and positions based on position - simplified
	const getRaysConfig = () => {
		// Default angles based on position
		let baseAngle = 315; // For top-left (this makes rays go to bottom-right)
		if (position === "top-right") baseAngle = 225; // Make rays go to bottom-left
		if (position === "center") baseAngle = 270; // Straight down

		// Calculate ray origins
		const origins: { x: number; y: number }[] = [];

		// Generate origins based on position - simplified approach
		if (position === "top-left") {
			// Simple diagonal distribution
			for (let i = 0; i < rayCount; i++) {
				const ratio = i / (rayCount - 1);
				// generate random x and y offsets
				const xOffset = Math.random() * 50 - 50;
				const yOffset = Math.random() * 50 - 50;
				origins.push({
					x: xOffset + ratio * 20,
					y: yOffset + ratio * 20,
				});
			}
		} else if (position === "top-right") {
			// Simple diagonal distribution
			for (let i = 0; i < rayCount; i++) {
				const ratio = i / (rayCount - 1);
				origins.push({
					x: 85 + ratio * 20,
					y: -5 + ratio * 20,
				});
			}
		} else {
			// Center - simple fan-like pattern
			for (let i = 0; i < rayCount; i++) {
				const ratio = i / (rayCount - 1);
				origins.push({
					x: 20 + ratio * 60, // Range from 20% to 80%
					y: -10,
				});
			}
		}

		// Generate ray configs
		return origins.map((origin) => {
			// Small variance to the angle (different for each ray)
			const variance = (Math.random() * 2 - 1) * 10; // Simplified variance
			const angle = baseAngle + variance;

			// Random width within the specified range
			const width = rayWidth[0] + Math.random() * (rayWidth[1] - rayWidth[0]);

			// Random opacity within the specified range, scaled by intensity
			const opacityScale = normalizedIntensity;
			const opacity = (rayOpacity[0] + Math.random() * (rayOpacity[1] - rayOpacity[0])) * opacityScale;

			return {
				originX: origin.x,
				originY: origin.y,
				angle,
				width,
				opacity,
			};
		});
	};

	useEffect(() => {
		setIsHydrated(true);

		const handleResize = () => {
			const width = window.innerWidth;
			const height = window.innerHeight;
			setWindowSize({ width, height });

			// Check if device is mobile based on screen width
			setIsMobile(width < 768);
		};

		const checkDarkMode = () => {
			setIsDarkMode(document.documentElement.classList.contains("dark"));
		};

		handleResize();
		checkDarkMode();

		window.addEventListener("resize", handleResize);

		// Listen for theme changes
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.attributeName === "class") {
					checkDarkMode();
				}
			});
		});

		observer.observe(document.documentElement, { attributes: true });

		return () => {
			window.removeEventListener("resize", handleResize);
			observer.disconnect();
		};
	}, []);

	if (!isHydrated) {
		return <>{children}</>;
	}

	// If on mobile and disableOnMobile is true, just render children
	if (isMobile && disableOnMobile) {
		return <div className={className}>{children}</div>;
	}

	const rayColor = getRayColor();
	const rays = getRaysConfig();

	// Determine appropriate mix blend mode based on dark/light mode
	const rayBlendMode = isDarkMode ? "screen" : "overlay";

	return (
		<div className={`relative ${className}`} ref={containerRef}>
			{/* Main content */}
			<div className="relative z-10">{children}</div>

			{/* God Rays Container */}
			<div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
				{/* Individual God Rays - simplified, fewer elements */}
				{rays.map((ray, index) => (
					<div
						key={`ray-${index}`}
						className="absolute origin-[0%_0%]"
						style={{
							left: `${ray.originX}%`,
							top: `${ray.originY}%`,
							width: `${ray.width}vw`,
							height: `${rayLength * 100}vh`,
							transform: `rotate(${ray.angle}deg)`,
							position: "absolute",
							background: `linear-gradient(to bottom, ${rayColor}, transparent ${RAY_GRADIENT_STOP * 100}%)`,
							mixBlendMode: rayBlendMode,
							opacity: ray.opacity,
							filter: `blur(${RAY_BLUR}px)`,
						}}
					/>
				))}

				{/* Simplified ambient overlay */}
				<div
					className="fixed inset-0 pointer-events-none"
					style={{
						background: `radial-gradient(
              circle at ${position === "top-left" ? "5% 5%" : position === "top-right" ? "95% 5%" : "50% 5%"}, 
              ${rayColor} 0%, 
              transparent 70%
            )`,
						mixBlendMode: isDarkMode ? "screen" : "overlay",
						opacity: normalizedIntensity * 0.3,
					}}
				/>
			</div>
		</div>
	);
};

export default GodRays;
