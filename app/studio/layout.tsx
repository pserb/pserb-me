export const metadata = {
    title: 'Sanity Studio',
    description: 'sanity studio',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}