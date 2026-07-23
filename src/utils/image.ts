import { rgb } from "polished";

export function coerceImageDataUrl(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.startsWith("data:image/")) {
    return undefined;
  }

  return value;
}

export function isSvgImageDataUrl(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.toLowerCase().startsWith("data:image/svg+xml")
  );
}

type RgbColor = {
  red: number;
  green: number;
  blue: number;
};

const MAX_SAMPLE_DIMENSION = 1024;
const MAX_EDGE_DEPTH = 8;
const MIN_EDGE_ALPHA = 240;
const COLOR_TOLERANCE = 12;
const MIN_MATCHING_EDGE_RATIO = 0.6;

// Vibe slafs btw men det funke
// Workaround because of native color picker dont work 100%
export async function getDominantImageEdgeColor(
  source: string,
): Promise<string | undefined> {
  const image = await loadImage(source);

  const scale = Math.min(
    1,
    MAX_SAMPLE_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight),
  );

  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", {
    colorSpace: "srgb",
    willReadFrequently: true,
  });

  if (!context) {
    return undefined;
  }

  context.drawImage(image, 0, 0, width, height);

  const { data } = context.getImageData(0, 0, width, height, {
    colorSpace: "srgb",
  });

  const edgeDepth = Math.min(
    MAX_EDGE_DEPTH,
    Math.max(1, Math.round(Math.min(width, height) * 0.02)),
  );

  const colors: RgbColor[] = [];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const isEdge =
        x < edgeDepth ||
        x >= width - edgeDepth ||
        y < edgeDepth ||
        y >= height - edgeDepth;

      if (!isEdge) {
        continue;
      }

      const offset = (y * width + x) * 4;

      if (data[offset + 3] < MIN_EDGE_ALPHA) {
        continue;
      }

      colors.push({
        red: data[offset],
        green: data[offset + 1],
        blue: data[offset + 2],
      });
    }
  }

  if (colors.length === 0) {
    return undefined;
  }

  const medianColor = {
    red: median(colors.map(({ red }) => red)),
    green: median(colors.map(({ green }) => green)),
    blue: median(colors.map(({ blue }) => blue)),
  };

  const matchingColorCount = colors.filter(
    ({ red, green, blue }) =>
      Math.abs(red - medianColor.red) <= COLOR_TOLERANCE &&
      Math.abs(green - medianColor.green) <= COLOR_TOLERANCE &&
      Math.abs(blue - medianColor.blue) <= COLOR_TOLERANCE,
  ).length;

  if (matchingColorCount / colors.length < MIN_MATCHING_EDGE_RATIO) {
    return undefined;
  }

  return rgb(medianColor).replace(
    /^#([\da-f])([\da-f])([\da-f])$/i,
    "#$1$1$2$2$3$3",
  );
}

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.addEventListener("load", () => resolve(image), { once: true });
    image.addEventListener(
      "error",
      () => reject(new Error("Could not decode the selected icon.")),
      { once: true },
    );
    image.src = source;
  });
}

function median(values: number[]): number {
  values.sort((left, right) => left - right);
  return values[Math.floor(values.length / 2)];
}
