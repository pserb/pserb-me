import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			// Terminal UI Design System: OKLCH tokens (stored as space-separated components)
  			background: "oklch(var(--background) / <alpha-value>)",
  			foreground: "oklch(var(--foreground) / <alpha-value>)",
  			card: {
  				DEFAULT: "oklch(var(--card) / <alpha-value>)",
  				foreground: "oklch(var(--card-foreground) / <alpha-value>)"
  			},
  			popover: {
  				DEFAULT: "oklch(var(--popover) / <alpha-value>)",
  				foreground: "oklch(var(--popover-foreground) / <alpha-value>)"
  			},
  			primary: {
  				DEFAULT: "oklch(var(--primary) / <alpha-value>)",
  				foreground: "oklch(var(--primary-foreground) / <alpha-value>)"
  			},
  			secondary: {
  				DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
  				foreground: "oklch(var(--secondary-foreground) / <alpha-value>)"
  			},
  			muted: {
  				DEFAULT: "oklch(var(--muted) / <alpha-value>)",
  				foreground: "oklch(var(--muted-foreground) / <alpha-value>)"
  			},
  			accent: {
  				DEFAULT: "oklch(var(--accent) / <alpha-value>)",
  				foreground: "oklch(var(--accent-foreground) / <alpha-value>)"
  			},
        success: {
          DEFAULT: "oklch(var(--success) / <alpha-value>)",
          foreground: "oklch(var(--success-foreground) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "oklch(var(--warning) / <alpha-value>)",
          foreground: "oklch(var(--warning-foreground) / <alpha-value>)",
        },
  			destructive: {
  				DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
  				foreground: "oklch(var(--destructive-foreground) / <alpha-value>)"
  			},
  			border: "oklch(var(--border) / <alpha-value>)",
  			input: "oklch(var(--input) / <alpha-value>)",
  			ring: "oklch(var(--ring) / <alpha-value>)",
        // Extended palette (solid + subtle variants)
        gray: {
          DEFAULT: "rgb(var(--gray) / <alpha-value>)",
          foreground: "rgb(var(--gray-foreground) / <alpha-value>)",
          subtle: "rgb(var(--gray-subtle) / <alpha-value>)",
          "subtle-foreground": "rgb(var(--gray-subtle-foreground) / <alpha-value>)",
        },
        blue: {
          DEFAULT: "oklch(var(--blue) / <alpha-value>)",
          foreground: "oklch(var(--blue-foreground) / <alpha-value>)",
          subtle: "oklch(var(--blue-subtle) / <alpha-value>)",
          "subtle-foreground": "oklch(var(--blue-subtle-foreground) / <alpha-value>)",
        },
        purple: {
          DEFAULT: "oklch(var(--purple) / <alpha-value>)",
          foreground: "oklch(var(--purple-foreground) / <alpha-value>)",
          subtle: "oklch(var(--purple-subtle) / <alpha-value>)",
          "subtle-foreground": "oklch(var(--purple-subtle-foreground) / <alpha-value>)",
        },
        amber: {
          DEFAULT: "oklch(var(--amber) / <alpha-value>)",
          foreground: "oklch(var(--amber-foreground) / <alpha-value>)",
          subtle: "oklch(var(--amber-subtle) / <alpha-value>)",
          "subtle-foreground": "oklch(var(--amber-subtle-foreground) / <alpha-value>)",
        },
        red: {
          DEFAULT: "oklch(var(--red) / <alpha-value>)",
          foreground: "oklch(var(--red-foreground) / <alpha-value>)",
          subtle: "oklch(var(--red-subtle) / <alpha-value>)",
          "subtle-foreground": "oklch(var(--red-subtle-foreground) / <alpha-value>)",
        },
        pink: {
          DEFAULT: "oklch(var(--pink) / <alpha-value>)",
          foreground: "oklch(var(--pink-foreground) / <alpha-value>)",
          subtle: "oklch(var(--pink-subtle) / <alpha-value>)",
          "subtle-foreground": "oklch(var(--pink-subtle-foreground) / <alpha-value>)",
        },
        green: {
          DEFAULT: "oklch(var(--green) / <alpha-value>)",
          foreground: "oklch(var(--green-foreground) / <alpha-value>)",
          subtle: "oklch(var(--green-subtle) / <alpha-value>)",
          "subtle-foreground": "oklch(var(--green-subtle-foreground) / <alpha-value>)",
        },
        teal: {
          DEFAULT: "oklch(var(--teal) / <alpha-value>)",
          foreground: "oklch(var(--teal-foreground) / <alpha-value>)",
          subtle: "oklch(var(--teal-subtle) / <alpha-value>)",
          "subtle-foreground": "oklch(var(--teal-subtle-foreground) / <alpha-value>)",
        },
  			chart: {
  				'1': "oklch(var(--chart-1) / <alpha-value>)",
  				'2': "oklch(var(--chart-2) / <alpha-value>)",
  				'3': "oklch(var(--chart-3) / <alpha-value>)",
  				'4': "oklch(var(--chart-4) / <alpha-value>)",
  				'5': "oklch(var(--chart-5) / <alpha-value>)"
  			}
  		},
  		borderRadius: {
        // Sharp, terminal-inspired corners (base radius = 4px)
        none: "0px",
        xs: "2px",
        sm: "3px",
        DEFAULT: "4px",
        md: "5px",
        lg: "6px",
        xl: "8px",
        "2xl": "10px",
        full: "9999px",
      },
      fontFamily: {
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "monospace"],
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
