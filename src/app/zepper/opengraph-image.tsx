import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Zepper, a calm browser for your Mac";

export default async function OgImage() {
  const icon = await readFile(join(process.cwd(), "public/zepper/icon@2x.png"));
  const src = `data:image/png;base64,${icon.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(60% 70% at 50% 0%, rgba(95,134,245,0.42) 0%, rgba(95,134,245,0.08) 55%, #06080d 100%), #06080d",
          color: "#fafafa",
        }}
      >
        <img src={src} width={168} height={168} alt="" />
        <div style={{ display: "flex", marginTop: 36, fontSize: 84, fontWeight: 700, letterSpacing: "-0.04em" }}>
          A calm browser for your Mac.
        </div>
        <div style={{ display: "flex", marginTop: 22, fontSize: 32, color: "#a1a1aa" }}>
          Spaces, a vertical sidebar and privacy on from the start.
        </div>
        <div style={{ display: "flex", marginTop: 44, fontSize: 26, color: "#9db4ff" }}>mrdsa.dev/zepper</div>
      </div>
    ),
    size,
  );
}
