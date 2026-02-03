import { ImageResponse } from "next/og";

export const runtime = "edge";

const WIDTH = 1200;
const HEIGHT = 630;
const PADDING = 64;
const THUMB_SIZE = 680;
const THUMB_PADDING = 8;
const TEXT_GAP = 32;

function escapeXml(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;");
}

function toBase64(data: Uint8Array) {
	let binary = "";
	const chunkSize = 0x8000;
	for (let i = 0; i < data.length; i += chunkSize) {
		const chunk = data.subarray(i, i + chunkSize);
		binary += String.fromCharCode(...chunk);
	}
	return btoa(binary);
}

function animatedSvg({ title, thumb }: { title: string; thumb: string }) {
	const safeTitle = escapeXml(title || "");
	const safeThumb = escapeXml(thumb || "");
	const thumbBoxX = WIDTH - PADDING - THUMB_SIZE;
	const thumbBoxY = (HEIGHT - THUMB_SIZE) / 2;
	const textMaxWidth = WIDTH - PADDING * 2 - THUMB_SIZE - TEXT_GAP;
	const imageSize = THUMB_SIZE - THUMB_PADDING * 2;

	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="100%" height="100%" fill="#000000" />
  <text x="${PADDING + 44}" y="52" fill="#f3f4f6" font-family="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif" font-size="28" font-weight="800">pserb.me</text>
  <text x="${PADDING}" y="54" font-family="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif" font-size="32">🐧</text>

  <text x="${PADDING}" y="184" fill="#f3f4f6" font-family="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif" font-size="56" font-weight="800">Paul Serbanescu</text>
  <foreignObject x="${PADDING}" y="216" width="${textMaxWidth}" height="320">
    <div xmlns="http://www.w3.org/1999/xhtml" style="color:#16a34a;font-size:56px;font-weight:800;font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;line-height:1.12;letter-spacing:-0.01em;">
      ${safeTitle}
    </div>
  </foreignObject>

  <rect x="${thumbBoxX}" y="${thumbBoxY}" width="${THUMB_SIZE}" height="${THUMB_SIZE}" rx="4" fill="rgba(0,0,0,0.2)" stroke="#2a2a2a" stroke-width="1" />
  <image href="${safeThumb}" xlink:href="${safeThumb}" x="${thumbBoxX + THUMB_PADDING}" y="${thumbBoxY + THUMB_PADDING}" width="${imageSize}" height="${imageSize}" preserveAspectRatio="xMidYMid meet" />
</svg>`;
}

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const title = searchParams.get("title") || "";
	const thumb = searchParams.get("thumb") || "";
	const animated = searchParams.get("animated") === "1";

	if (animated && thumb) {
		const response = await fetch(thumb);
		const contentType = response.headers.get("content-type") || "image/gif";
		const bytes = new Uint8Array(await response.arrayBuffer());
		const dataUri = `data:${contentType};base64,${toBase64(bytes)}`;
		const svg = animatedSvg({ title, thumb: dataUri });
		return new Response(svg, {
			headers: {
				"content-type": "image/svg+xml; charset=utf-8",
				"cache-control": "public, max-age=31536000, immutable",
			},
		});
	}

	return new ImageResponse(
		(
			<div tw="flex w-full h-full items-center justify-center bg-black">
				<div tw="flex w-full h-full items-center justify-between px-16">
					<div tw="flex flex-col max-w-[720px]">
						<h2 tw="flex flex-col text-8xl font-bold tracking-tight text-gray-100">
							<span>Paul Serbanescu</span>
							<span tw="text-green-600">{title}</span>
						</h2>
					</div>
					{thumb ? (
						<div tw="flex items-center justify-center rounded-lg border border-gray-800 bg-black/40 p-4">
							<img
								src={thumb}
								tw="w-[360px] h-[360px] object-cover rounded-md"
							/>
						</div>
					) : null}
				</div>
				<div tw="flex flex-row absolute top-6 left-6">
					<span tw="text-3xl pr-4">🐧</span>
					<span tw="text-gray-100 text-2xl font-black">pserb.me</span>
				</div>
			</div>
		),
		{
			width: WIDTH,
			height: HEIGHT,
		},
	);
}