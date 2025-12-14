import type { Metadata } from "next";
import "./globals.css";
import { SanityLive } from "@/sanity/lib/live";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/utils/theme-provider";
import Navbar from "@/components/navbar";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], adjustFontFallback: false });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], adjustFontFallback: false });

export const metadata: Metadata = {
	title: "Paul Serbanescu",
	description: "Portfolio",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<Navbar />
					<div className="min-h-screen bg-background px-2 sm:px-6 md:px-10 lg:px-16">
						<main className="mx-auto w-full max-w-4xl space-y-16 pt-20">{children}</main>
					</div>
					<SanityLive />
					{(await draftMode()).isEnabled && <VisualEditing />}
				</ThemeProvider>
				<Analytics />
			</body>
		</html>
	);
}
