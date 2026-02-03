import { ImageResponse } from 'next/og';
// App router includes @vercel/og.
// No need to install it.

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || ''

  return new ImageResponse(
    (
      // Modified based on https://tailwindui.com/components/marketing/sections/cta-sections

      <div tw="flex flex-col w-full h-full items-center justify-center bg-black">
        <h2 tw="flex flex-col text-8xl font-bold tracking-tight text-gray-100">
          <span>Paul Serbanescu</span>
          <span tw="text-green-600">{title}</span>
        </h2>
        <div tw="flex flex-row absolute top-6 left-6">
          <span tw="text-3xl pr-4">🐧</span>
          <span tw="text-gray-100 text-2xl font-black">pserb.me</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}