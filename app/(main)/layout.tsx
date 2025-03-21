import type { Metadata } from "next";
import "./globals.css";
import { SanityLive } from "@/sanity/lib/live";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity";
import { Geist, Geist_Mono, Oxanium, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/utils/theme-provider";
import Navbar from "@/components/navbar";
import { Analytics } from "@vercel/analytics/react";
import NaturalLightProvider from "@/components/utils/natural-light-context";
import LightProvider from "@/components/utils/light-provider";

const geist = Geist({ subsets: ["latin"], adjustFontFallback: false });
const geistMono = Geist_Mono({ subsets: ["latin"], adjustFontFallback: false, variable: "--geistMono" });

const tempFont = Oxanium({ subsets: ["latin"], adjustFontFallback: false });
const tempMono = JetBrains_Mono({ subsets: ["latin"], adjustFontFallback: false, variable: "--jetbrainsMono" });

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${tempFont.className} ${tempMono.variable}`}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<NaturalLightProvider
						defaultLightMode="natural"
						defaultColorMode="cool"
						defaultIntensity={50}
						defaultPosition="top-left"
						defaultTemperatureK={7000}
						defaultDriftSpeed="none"
						defaultNumberOfRays={10}
					>
						<LightProvider>
							<Navbar />
							<main className="mx-auto max-w-3xl w-[calc(100%-2rem)] md:px-6 min-h-screen p-8 pt-28">{children}</main>
							<SanityLive />
							{(await draftMode()).isEnabled && <VisualEditing />}
						</LightProvider>
					</NaturalLightProvider>
				</ThemeProvider>
				<Analytics />
			</body>
		</html>
	);
}
