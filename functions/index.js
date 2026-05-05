import admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";

admin.initializeApp();

const db = admin.firestore();
const siteUrl = "https://mrdsa.dev";
const fallbackImage = `${siteUrl}/og-profile.png`;
const siteTitle = "Dewan Shakil Akhtar | Builder, Engineer, Notes";
const siteDescription =
  "Personal site and blog for Dewan Shakil Akhtar, a full-stack builder working on on-device AI, React Native SDKs, and product engineering.";
const blogTitle = "Blog | Dewan Shakil Akhtar";
const blogDescription = "Writing, notes, and build logs by Dewan Shakil Akhtar.";

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeSlug(path = "") {
  const normalized = path.replace(/^\/blog\/?/, "").split(/[/?#]/)[0] ?? "";
  return decodeURIComponent(normalized);
}

function stripManagedTags(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(
      /<meta\s+(?:name|property)=["'](?:description|robots|twitter:[^"']+|og:[^"']+|article:[^"']+)["'][^>]*>\s*/gi,
      "",
    )
    .replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, "");
}

function createMetaTags({
  title,
  description,
  url,
  image,
  imageType,
  type,
  publishedAt,
  updatedAt,
}) {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeUrl = escapeHtml(url);
  const safeImage = escapeHtml(image);
  const articleMeta =
    type === "article"
      ? `
    ${publishedAt ? `<meta property="article:published_time" content="${escapeHtml(publishedAt)}" />` : ""}
    ${updatedAt ? `<meta property="article:modified_time" content="${escapeHtml(updatedAt)}" />` : ""}`
      : "";

  return `
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDescription}" />
    <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large" />
    <link rel="canonical" href="${safeUrl}" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:type" content="${escapeHtml(type)}" />
    <meta property="og:url" content="${safeUrl}" />
    <meta property="og:image" content="${safeImage}" />
    <meta property="og:image:secure_url" content="${safeImage}" />
    <meta property="og:image:type" content="${escapeHtml(imageType)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${safeTitle}" />${articleMeta}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <meta name="twitter:image" content="${safeImage}" />`;
}

async function getPublishedPost(slug) {
  if (!slug) return null;

  const snapshot = await db
    .collection("posts")
    .where("slug", "==", slug)
    .where("status", "==", "published")
    .limit(1)
    .get();

  return snapshot.docs[0]?.data() ?? null;
}

async function getAppShell() {
  const response = await fetch(siteUrl);
  if (!response.ok) {
    throw new Error(`Could not fetch app shell: ${response.status}`);
  }

  return response.text();
}

function toIsoDate(value) {
  return value?.toDate?.().toISOString?.();
}

export const blogMeta = onRequest(
  {
    region: "us-central1",
    cors: false,
  },
  async (request, response) => {
    const slug = normalizeSlug(request.path);
    const post = await getPublishedPost(slug);
    const isBlogIndex = !slug;

    const url = isBlogIndex ? `${siteUrl}/blog` : `${siteUrl}/blog/${slug}`;
    const rawTitle = isBlogIndex
      ? blogTitle
      : post?.seoTitle || post?.title || siteTitle;
    const title = rawTitle.includes("Dewan")
      ? rawTitle
      : `${rawTitle} | Dewan Shakil Akhtar`;
    const description = isBlogIndex
      ? blogDescription
      : post?.seoDescription || post?.excerpt || siteDescription;
    const image = post?.ogImageUrl || fallbackImage;
    const imageType = image.includes(".webp") ? "image/webp" : "image/png";
    const type = post ? "article" : "website";

    try {
      const shell = stripManagedTags(await getAppShell());
      const html = shell.replace(
        /<head>/i,
        `<head>${createMetaTags({
          title,
          description,
          url,
          image,
          imageType,
          type,
          publishedAt: toIsoDate(post?.publishedAt),
          updatedAt: toIsoDate(post?.updatedAt),
        })}`,
      );

      response
        .status(!slug || post ? 200 : 404)
        .set("Cache-Control", "public, max-age=300, s-maxage=300")
        .send(html);
    } catch (error) {
      response
        .status(500)
        .set("Cache-Control", "no-store")
        .send(error instanceof Error ? error.message : "Could not render page.");
    }
  },
);
