import type { Metadata } from "next";
import "./globals.css";
import { SanityLive } from "@/sanity/lib/live";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity";
import { Geist, Geist_Mono, Oxanium, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/utils/theme-provider";
import Navbar from "@/components/navbar";
import { Analytics } from "@vercel/analytics/react"

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
					<Navbar />
					<main className="container mx-auto min-h-screen max-w-3xl p-8 pt-28">
						{children}
					</main>
					<SanityLive />
					{(await draftMode()).isEnabled && <VisualEditing />}
				</ThemeProvider>
				<Analytics />
			</body>
		</html>
	);
}
