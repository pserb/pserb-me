import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const geist = Geist({ subsets: ["latin"], adjustFontFallback: false });
const geistMono = Geist_Mono({ subsets: ["latin"], adjustFontFallback: false, variable: "--geistMono" });

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
            <body className={`${geist.className} ${geistMono.variable}`}>
                {children}
            </body>
        </html>
    );
}
