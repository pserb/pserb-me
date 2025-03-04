"use client";

import type React from "react";
import { type ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface GlassSheetProps {
	children: ReactNode;
	className?: string;
	blur?: number; // Blur intensity (0-20)
	transparency?: number; // Transparency level (0-100)
	tint?: "clear" | "blue" | "warm" | "cool"; // Tint color
	border?: boolean; // Show subtle border
	rounded?: boolean; // Use rounded corners
	padding?: string; // Custom padding
	mobilePadding?: string; // Custom padding for mobile
	elevation?: "flat" | "raised" | "floating"; // Shadow elevation
	fullWidthOnMobile?: boolean; // Remove horizontal margins on mobile
}

const GlassSheet: React.FC<GlassSheetProps> = ({
	children,
	className = "",
	blur = 8,
	transparency = 30,
	tint = "clear",
	border = true,
	rounded = true,
	padding = "p-6",
	mobilePadding = "px-3 py-4",
	elevation = "raised",
	fullWidthOnMobile = true,
}) => {
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [isHydrated, setIsHydrated] = useState(false);

	// Calculate normalized values
	const blurValue = Math.min(Math.max(blur, 0), 20);
	const transparencyValue = Math.min(Math.max(transparency, 0), 100) / 100;

	// Set tint colors based on mode and tint prop
	const getTintColor = () => {
		if (isDarkMode) {
			switch (tint) {
				case "blue":
					return "rgba(100, 130, 255, 0.1)";
				case "warm":
					return "rgba(255, 180, 120, 0.1)";
				case "cool":
					return "rgba(130, 200, 255, 0.1)";
				default:
					return "rgba(100, 255, 0, 0.01)";
			}
		} else {
			switch (tint) {
				case "blue":
					return "rgba(100, 130, 255, 0.05)";
				case "warm":
					return "rgba(255, 180, 120, 0.05)";
				case "cool":
					return "rgba(130, 200, 255, 0.05)";
				default:
					return "rgba(0, 0, 0, 0.05)";
			}
		}
	};

	// Get shadow based on elevation
	const getShadow = () => {
		if (isDarkMode) {
			switch (elevation) {
				case "flat":
					return "none";
				case "raised":
					return "0 4px 12px rgba(0, 0, 0, 0.2)";
				case "floating":
					return "0 8px 30px rgba(0, 0, 0, 0.3)";
				default:
					return "0 4px 12px rgba(0, 0, 0, 0.2)";
			}
		} else {
			switch (elevation) {
				case "flat":
					return "none";
				case "raised":
					return "0 4px 12px rgba(0, 0, 0, 0.1)";
				case "floating":
					return "0 8px 30px rgba(0, 0, 0, 0.15)";
				default:
					return "0 4px 12px rgba(0, 0, 0, 0.1)";
			}
		}
	};

	// Generate noise SVG for texture
	const generateNoiseSVG = () => {
		return `
      data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E
    `;
	};

	// Check if dark mode is enabled
	useEffect(() => {
		setIsHydrated(true);

		const checkDarkMode = () => {
			setIsDarkMode(document.documentElement.classList.contains("dark"));
		};

		checkDarkMode();

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
			observer.disconnect();
		};
	}, []);

	if (!isHydrated) {
		// Return a simple wrapper before hydration to prevent layout shift
		return <div className={className}>{children}</div>;
	}

	return (
		<div className={`relative ${fullWidthOnMobile ? "sm:mx-0 -mx-4 md:-mx-0" : ""} ${className}`}>
			{/* Main glass container */}
			<div
				className={`
          relative z-10 
          overflow-hidden
          backdrop-blur-md
          ${rounded ? "sm:rounded-2xl rounded-lg" : ""} 
          ${border ? (isDarkMode ? "border border-white/10" : "border border-black/5") : ""}
          transition-all duration-300
          ${fullWidthOnMobile ? "sm:w-auto w-[92vw] max-w-[100vw] left-1/2 right-1/2 -translate-x-1/2 relative" : ""}
        `}
				style={{
					backdropFilter: `blur(${blurValue}px)`,
					backgroundColor: isDarkMode
						? `rgba(25, 25, 35, ${1 - transparencyValue})`
						: `rgba(255, 255, 255, ${1 - transparencyValue})`,
					boxShadow: getShadow(),
					backgroundImage: `url("${generateNoiseSVG()}")`,
				}}
			>
				{/* Background tint layer */}
				<div
					className="absolute inset-0 z-0"
					style={{
						backgroundColor: getTintColor(),
					}}
				/>

				{/* Subtle highlight at top */}
				<div
					className="absolute top-0 left-0 right-0 h-[1px] z-10 opacity-50"
					style={{
						background: isDarkMode
							? "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)"
							: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)",
					}}
				/>

				{/* Content area */}
				<div className={`relative z-20 sm:${padding} ${mobilePadding}`}>{children}</div>
			</div>
		</div>
	);
};

export default GlassSheet;
