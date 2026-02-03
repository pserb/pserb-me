import { Resvg } from "@resvg/resvg-js";
import { GIFEncoder, applyPalette, quantize } from "gifenc";
import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";

export const runtime = "nodejs";

type Rgb = [number, number, number];

type AsciiAnimationConfig = {
	speed?: number;
	rotationPeriod?: number;
	grid?: { columns?: number; rows?: number };
	character?: { width?: number; height?: number; fontSize?: number; fontFamily?: string };
	colors?: {
		cyan?: string;
		teal?: string;
		gold?: string;
		edge?: string;
		substrate?: string;
		background?: string;
	};
	themeColors?: {
		dark?: Partial<AsciiAnimationConfig["colors"]>;
		light?: Partial<AsciiAnimationConfig["colors"]>;
	};
	chip?: {
		size?: number;
		thickness?: number;
		projectionScale?: number;
		cameraDistance?: number;
	};
};

type AsciiAnimationDoc = {
	_id?: string;
	animationType?: string;
	preset?: string;
	config?: AsciiAnimationConfig;
};

const DEFAULT_COLORS: Record<string, Rgb> = {
	cyan: [0, 255, 255],
	teal: [0, 180, 200],
	gold: [255, 200, 100],
	edge: [80, 130, 160],
	substrate: [50, 75, 95],
	background: [0, 0, 0],
};

const PRESET_COLORS: Record<
	string,
	{
		dark?: Partial<Record<keyof typeof DEFAULT_COLORS, string>>;
		light?: Partial<Record<keyof typeof DEFAULT_COLORS, string>>;
	}
> = {
	"chip-default": {
		dark: {
			cyan: "#00FFFF",
			teal: "#00B4C8",
			gold: "#FFC864",
			edge: "#5082A0",
			substrate: "#324B5F",
			background: "#000000",
		},
		light: {
			cyan: "#007A8C",
			teal: "#006B73",
			gold: "#8C5A14",
			edge: "#2F3F4A",
			substrate: "#8EA0AE",
			background: "#FFFFFF",
		},
	},
	"chip-dark": {
		dark: {
			cyan: "#00FFFF",
			teal: "#00B4C8",
			gold: "#FFC864",
			edge: "#5082A0",
			substrate: "#324B5F",
			background: "#000000",
		},
	},
	"chip-light": {
		light: {
			cyan: "#007A8C",
			teal: "#006B73",
			gold: "#8C5A14",
			edge: "#2F3F4A",
			substrate: "#8EA0AE",
			background: "#FFFFFF",
		},
	},
};

const LUMINANCE_RAMP =
	" .'`^,:;!|/\\-~+<>?[]{}1icxtjfnuvzXYJCL0Oqpbdkh#MW&8%B@$";

const DEFAULT_FONT_FAMILY =
	"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace";

const ASCII_QUERY = groq`*[_type == "asciiAnimation" && _id == $id][0]{
  _id,
  animationType,
  preset,
  config
}`;

function hexToRgb(value: string): Rgb | null {
	const normalized = value.replace("#", "").trim();
	if (normalized.length === 3) {
		const r = parseInt(normalized[0] + normalized[0], 16);
		const g = parseInt(normalized[1] + normalized[1], 16);
		const b = parseInt(normalized[2] + normalized[2], 16);
		return [r, g, b];
	}
	if (normalized.length === 6) {
		const r = parseInt(normalized.slice(0, 2), 16);
		const g = parseInt(normalized.slice(2, 4), 16);
		const b = parseInt(normalized.slice(4, 6), 16);
		return [r, g, b];
	}
	return null;
}

function resolveColor(value: string | undefined, fallback: Rgb): Rgb {
	if (!value) return fallback;
	const rgb = hexToRgb(value);
	return rgb ?? fallback;
}

function lerp(a: number, b: number, t: number) {
	return a + (b - a) * t;
}

function mix(c1: Rgb, c2: Rgb, t: number): Rgb {
	return [
		Math.round(lerp(c1[0], c2[0], t)),
		Math.round(lerp(c1[1], c2[1], t)),
		Math.round(lerp(c1[2], c2[2], t)),
	];
}

function escapeXml(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;");
}

function resolveColors(config: AsciiAnimationConfig, preset: string) {
	const presetColors = PRESET_COLORS[preset] ?? PRESET_COLORS["chip-default"];
	const themedColors = config.themeColors?.dark ?? presetColors?.dark ?? presetColors?.light;
	const fallbackColors = config.colors ?? {};
	return {
		cyan: resolveColor(themedColors?.cyan ?? fallbackColors.cyan, DEFAULT_COLORS.cyan),
		teal: resolveColor(themedColors?.teal ?? fallbackColors.teal, DEFAULT_COLORS.teal),
		gold: resolveColor(themedColors?.gold ?? fallbackColors.gold, DEFAULT_COLORS.gold),
		edge: resolveColor(themedColors?.edge ?? fallbackColors.edge, DEFAULT_COLORS.edge),
		substrate: resolveColor(
			themedColors?.substrate ?? fallbackColors.substrate,
			DEFAULT_COLORS.substrate,
		),
		background: resolveColor(
			themedColors?.background ?? fallbackColors.background,
			DEFAULT_COLORS.background,
		),
	};
}

function renderAsciiChipFrameData({
	columns,
	rows,
	colors,
	A,
	B,
	chip,
	lightModeBoost,
}: {
	columns: number;
	rows: number;
	colors: Record<string, Rgb>;
	A: number;
	B: number;
	chip: Required<NonNullable<AsciiAnimationConfig["chip"]>>;
	lightModeBoost: boolean;
}) {
	const buf = new Array(columns * rows).fill(" ");
	const zbuf = new Array(columns * rows).fill(0);
	const col = new Array(columns * rows).fill(colors.background);

	const cA = Math.cos(A);
	const sA = Math.sin(A);
	const cB = Math.cos(B);
	const sB = Math.sin(B);

	const K1 = chip.projectionScale;
	const K2 = chip.cameraDistance;

	const proj = (x: number, y: number, z: number) => {
		const x1 = x * cA + z * sA;
		const z1 = z * cA - x * sA;
		const y1 = y * cB - z1 * sB;
		const z2 = z1 * cB + y1 * sB + K2;
		if (z2 < 0.3) return null;
		const ooz = 1 / z2;
		return {
			x: Math.floor(columns / 2 + K1 * ooz * x1 * 2),
			y: Math.floor(rows / 2 - K1 * ooz * y1),
			z: ooz,
		};
	};

	const plot = (x: number, y: number, z: number, lum: number, c: Rgb) => {
		if (x < 0 || x >= columns || y < 0 || y >= rows) return;
		const idx = y * columns + x;
		if (z <= zbuf[idx]) return;
		zbuf[idx] = z;
		const boostedLum = lightModeBoost ? Math.min(1, lum * 1.45 + 0.05) : lum;
		const lumIndex = Math.min(
			LUMINANCE_RAMP.length - 1,
			Math.max(0, Math.floor(boostedLum * (LUMINANCE_RAMP.length - 1))),
		);
		buf[idx] = LUMINANCE_RAMP[lumIndex];
		col[idx] = c;
	};

	const size = chip.size;
	const thickness = chip.thickness;

	for (let i = 0; i < 140; i += 1) {
		for (let j = 0; j < 140; j += 1) {
			const u = (i / 139 - 0.5) * size;
			const v = (j / 139 - 0.5) * size;
			const projected = proj(u, thickness / 2, v);
			if (!projected) continue;

			const gi = i % 6;
			const gj = j % 6;
			const trace = gi === 0 || gj === 0;
			const node = gi === 0 && gj === 0;

			const wave = Math.sin(A * 3 - (u + v) * 5) * 0.5 + 0.5;

			if (node) {
				const lum = 0.7 + 0.3 * wave;
				const c = mix(colors.teal, colors.cyan, wave);
				plot(projected.x, projected.y, projected.z, lum, c);
			} else if (trace) {
				const lum = 0.3 + 0.4 * wave;
				const c = mix([50, 85, 100], colors.teal, wave * 0.7);
				plot(projected.x, projected.y, projected.z, lum, c);
			} else {
				plot(projected.x, projected.y, projected.z, 0.15, colors.substrate);
			}
		}
	}

	for (let i = 0; i < 50; i += 1) {
		for (let j = 0; j < 50; j += 1) {
			const u = (i / 49 - 0.5) * 0.45;
			const v = (j / 49 - 0.5) * 0.45;
			const r = Math.sqrt(u * u + v * v);
			if (r > 0.18) continue;
			const projected = proj(u, thickness / 2 + 0.005, v);
			if (!projected) continue;

			const glow = 1 - r / 0.18;
			const pulse = 0.65 + 0.35 * Math.sin(A * 2);
			const lum = glow * pulse;
			const c = mix(colors.teal, [200, 255, 255], glow);
			plot(projected.x, projected.y, projected.z + 0.01, lum, c);
		}
	}

	for (let side = 0; side < 4; side += 1) {
		for (let i = 0; i < 100; i += 1) {
			for (let j = 0; j < 8; j += 1) {
				const e = i / 99;
				const y = (j / 7 - 0.5) * thickness;

				let u = 0;
				let v = 0;
				let normal = 0;

				if (side === 0) {
					u = (e - 0.5) * size;
					v = size / 2;
					normal = sA;
				} else if (side === 1) {
					u = (e - 0.5) * size;
					v = -size / 2;
					normal = -sA;
				} else if (side === 2) {
					u = -size / 2;
					v = (e - 0.5) * size;
					normal = -cA;
				} else {
					u = size / 2;
					v = (e - 0.5) * size;
					normal = cA;
				}

				const projected = proj(u, y, v);
				if (!projected) continue;

				const brightness = 0.3 + 0.25 * Math.max(0, normal);
				const c = mix([45, 70, 90], colors.edge, brightness);
				plot(projected.x, projected.y, projected.z, brightness, c);
			}
		}
	}

	if (sB > 0.05) {
		for (let i = 0; i < 100; i += 1) {
			for (let j = 0; j < 100; j += 1) {
				const u = (i / 99 - 0.5) * size * 0.95;
				const v = (j / 99 - 0.5) * size * 0.95;
				const projected = proj(u, -thickness / 2, v);
				if (!projected) continue;
				const lum = 0.2 * sB;
				plot(projected.x, projected.y, projected.z, lum, [40, 55, 70]);
			}
		}
	}

	const pinY = -thickness / 2 - 0.07;
	for (let i = 0; i < 16; i += 1) {
		for (let j = 0; j < 16; j += 1) {
			if (i >= 5 && i <= 10 && j >= 5 && j <= 10) continue;
			const u = ((i - 7.5) / 15) * size * 0.85;
			const v = ((j - 7.5) / 15) * size * 0.85;
			const projected = proj(u, pinY, v);
			if (!projected) continue;

			const d = Math.sqrt(u * u + v * v);
			const pulse = Math.sin(A * 2 - d * 7) * 0.5 + 0.5;

			const lum = 0.5 + 0.5 * pulse;
			const c = mix([180, 140, 60], colors.gold, pulse);
			plot(projected.x, projected.y, projected.z, lum, c);
		}
	}

	return { buf, col };
}

function buildAsciiSvg({
	buf,
	col,
	columns,
	rows,
	charWidth,
	charHeight,
	fontSize,
	fontFamily,
	background,
}: {
	buf: string[];
	col: Rgb[];
	columns: number;
	rows: number;
	charWidth: number;
	charHeight: number;
	fontSize: number;
	fontFamily: string;
	background: Rgb;
}) {
	const width = Math.ceil(columns * charWidth);
	const height = Math.ceil(rows * charHeight);
	const lines: string[] = [];
	lines.push(
		`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
	);
	lines.push(
		`<rect width="100%" height="100%" fill="rgb(${background[0]},${background[1]},${background[2]})" />`,
	);
	lines.push(
		`<g font-family="${escapeXml(fontFamily)}" font-size="${fontSize.toFixed(
			2,
		)}" dominant-baseline="text-before-edge" text-anchor="start">`,
	);
	for (let y = 0; y < rows; y += 1) {
		for (let x = 0; x < columns; x += 1) {
			const idx = y * columns + x;
			const char = buf[idx];
			if (!char || char === " ") continue;
			const [r, g, b] = col[idx] as Rgb;
			lines.push(
				`<text x="${(x * charWidth).toFixed(2)}" y="${(
					y * charHeight
				).toFixed(2)}" fill="rgb(${r},${g},${b})">${escapeXml(char)}</text>`,
			);
		}
	}
	lines.push("</g></svg>");
	return lines.join("");
}

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get("id");
	if (!id) {
		return new Response("Missing id", { status: 400 });
	}

	const doc = (await client.fetch(ASCII_QUERY, { id })) as AsciiAnimationDoc | null;
	if (!doc || doc.animationType !== "ascii-chip") {
		return new Response("Not found", { status: 404 });
	}

	const config = doc.config ?? {};
	const preset = doc.preset ?? "chip-default";
	const colors = resolveColors(config, preset);

	const columns = config.grid?.columns ?? 120;
	const rows = config.grid?.rows ?? 60;
	const baseCharWidth = config.character?.width ?? 8;
	const baseCharHeight = config.character?.height ?? 16;
	const baseFontSize = config.character?.fontSize ?? 14;
	const fontFamily = config.character?.fontFamily ?? DEFAULT_FONT_FAMILY;

	const targetSize = Math.min(
		720,
		Math.max(360, Number(searchParams.get("size") ?? "512")),
	);
	const baseWidth = columns * baseCharWidth;
	const baseHeight = rows * baseCharHeight;
	const scale = targetSize / Math.max(baseWidth, baseHeight);
	const charWidth = baseCharWidth * scale;
	const charHeight = baseCharHeight * scale;
	const fontSize = baseFontSize * scale;

	const speed = config.speed ?? 1;
	var rotationPeriod = config.rotationPeriod ?? 24;
	rotationPeriod += 12;	
	const chip = {
		size: config.chip?.size ?? 1.8,
		thickness: config.chip?.thickness ?? 0.1,
		projectionScale: config.chip?.projectionScale ?? 64,
		cameraDistance: config.chip?.cameraDistance ?? 3.5,
	};

	const fps = 12;
	const totalSeconds = Math.max(1, rotationPeriod / Math.max(0.25, speed));
	const frameCount = Math.min(60, Math.max(8, Math.round(totalSeconds * fps)));
	const delay = Math.round(1000 / fps);
	const gif = GIFEncoder();

	for (let i = 0; i < frameCount; i += 1) {
		const A = (i / frameCount) * Math.PI * 2;
		const B = Math.sin(A * 2) * 0.35;
		const { buf, col } = renderAsciiChipFrameData({
			columns,
			rows,
			colors,
			A,
			B,
			chip,
			lightModeBoost: false,
		});

		const svg = buildAsciiSvg({
			buf,
			col,
			columns,
			rows,
			charWidth,
			charHeight,
			fontSize,
			fontFamily,
			background: colors.background,
		});

		const resvg = new Resvg(svg, {
			fitTo: { mode: "original" },
			font: {
				loadSystemFonts: true,
				monospaceFamily: DEFAULT_FONT_FAMILY,
				defaultFontFamily: DEFAULT_FONT_FAMILY,
			},
			shapeRendering: 1,
			textRendering: 1,
		});
		const rendered = resvg.render();
		const rgba = rendered.pixels;
		const palette = quantize(rgba, 256);
		const index = applyPalette(rgba, palette);
		gif.writeFrame(index, rendered.width, rendered.height, {
			palette,
			delay,
			repeat: i === 0 ? 0 : undefined,
		});
	}

	gif.finish();

	return new Response(gif.bytes(), {
		headers: {
			"content-type": "image/gif",
			"cache-control": "public, max-age=31536000, immutable",
		},
	});
}
