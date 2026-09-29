import { ImageResponse } from "next/og";
import { getAllPosts, getPost } from "@/lib/posts";
import { formatDate } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Blog post by Dewan Shakil Akhtar";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  const title = post?.title ?? "Dewan Shakil Akhtar";
  const meta = post
    ? [formatDate(post.date), ...post.tags.slice(0, 3)].join("  /  ")
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "linear-gradient(135deg, rgba(52,211,153,0.18) 0%, rgba(20,184,166,0.06) 45%, #0b0d10 100%), #0b0d10",
          color: "#fafafa",
        }}
      >
        <div style={{ display: "flex", color: "#34d399", fontSize: 28 }}>
          mrdsa.dev / blog
        </div>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 60 ? 60 : 72,
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", color: "#a1a1aa", fontSize: 26 }}>
            {meta}
          </div>
          <div style={{ display: "flex", height: 4, background: "#34d399" }} />
          <div style={{ display: "flex", color: "#d4d4d8", fontSize: 24 }}>
            Dewan Shakil Akhtar
          </div>
        </div>
      </div>
    ),
    size,
  );
}
