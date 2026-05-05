import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

type OgImageInput = {
  title: string;
  slug: string;
  tags: string[];
  date?: string;
};

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines = 3,
) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    if (context.measureText(word).width > maxWidth) {
      if (line) {
        lines.push(line);
        line = "";
      }

      let chunk = "";
      for (const character of word) {
        const test = `${chunk}${character}`;
        if (context.measureText(test).width <= maxWidth) {
          chunk = test;
          continue;
        }

        if (chunk) lines.push(chunk);
        chunk = character;
      }

      line = chunk;
      continue;
    }

    const test = line ? `${line} ${word}` : word;

    if (context.measureText(test).width <= maxWidth) {
      line = test;
      continue;
    }

    if (line) lines.push(line);
    line = word;
  }

  if (line) lines.push(line);
  if (lines.length <= maxLines) return lines;

  const visible = lines.slice(0, maxLines);
  visible[maxLines - 1] = trimText(context, visible[maxLines - 1], maxWidth);
  return visible;
}

function trimText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  if (context.measureText(text).width <= maxWidth) return text;

  const ellipsis = "...";
  let trimmed = text.trim();

  while (
    trimmed.length > 0 &&
    context.measureText(`${trimmed}${ellipsis}`).width > maxWidth
  ) {
    trimmed = trimmed.slice(0, -1).trimEnd();
  }

  return `${trimmed}${ellipsis}`;
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }

      reject(new Error("Could not generate preview image."));
    }, "image/png");
  });
}

export async function generateAndUploadOgImage({
  title,
  slug,
  tags,
  date,
}: OgImageInput) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not supported.");

  context.fillStyle = "#0b0d10";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const gradient = context.createLinearGradient(0, 0, 1200, 630);
  gradient.addColorStop(0, "rgba(52, 211, 153, 0.18)");
  gradient.addColorStop(0.45, "rgba(20, 184, 166, 0.06)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "rgba(255, 255, 255, 0.08)";
  context.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 48) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
    context.stroke();
  }
  for (let y = 0; y < canvas.height; y += 48) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(canvas.width, y);
    context.stroke();
  }

  context.fillStyle = "#34d399";
  context.font = "600 28px monospace";
  context.fillText("mrdsa.dev / blog", 82, 96);

  context.fillStyle = "#fafafa";
  context.font =
    "700 76px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  const lines = wrapText(context, title, 960, 3);
  lines.forEach((line, index) => {
    context.fillText(line, 80, 210 + index * 88);
  });

  const meta = [date, ...tags].filter(Boolean).join("  /  ");
  context.fillStyle = "rgba(244, 244, 245, 0.62)";
  context.font = "500 28px monospace";
  context.fillText(
    trimText(context, meta || "Dewan Shakil Akhtar", 1036),
    82,
    540,
  );

  context.fillStyle = "#34d399";
  context.fillRect(80, 568, 1040, 4);

  context.fillStyle = "rgba(244, 244, 245, 0.72)";
  context.font = "500 24px monospace";
  context.fillText("Dewan Shakil Akhtar", 82, 604);

  const blob = await canvasToBlob(canvas);
  const imageRef = ref(
    storage,
    `og-images/${slug || "untitled"}-${Date.now()}.png`,
  );

  await uploadBytes(imageRef, blob, {
    contentType: "image/png",
    cacheControl: "public,max-age=31536000",
  });

  return getDownloadURL(imageRef);
}
