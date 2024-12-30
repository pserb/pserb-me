import type { Metadata } from 'next'

type MetadataProps = {
  title: string
  ogtitle: string
  description: string
  image?: string
  path?: string
}

export function customMetadata({
  title,
  ogtitle,
  description,
  image,
  path = '',
}: MetadataProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.pserb.me'
  const fullPath = `${baseUrl}${path}`
  const imageUrl = image ? `${baseUrl}${image}` : `${baseUrl}/api/og?title=${encodeURIComponent(ogtitle)}`

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      url: fullPath,
      siteName: 'Paul Serbanescu',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@pserb_',
    },
    alternates: {
      canonical: fullPath,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  }
}

