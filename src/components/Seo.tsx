import { useEffect } from "react";

type SeoProps = {
  title: string;
  description: string;
  canonicalPath?: string;
  type?: "website" | "article";
  image?: string;
  jsonLd?: Record<string, unknown>;
};

const siteUrl = "https://mrdsa.dev";
const defaultImage = `${siteUrl}/og-profile.png`;

function setMeta(selector: string, attribute: "name" | "property", value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }

  return element;
}

export function Seo({
  title,
  description,
  canonicalPath = "/",
  type = "website",
  image,
  jsonLd,
}: SeoProps) {
  useEffect(() => {
    const fullTitle = title.includes("Dewan")
      ? title
      : `${title} | Dewan Shakil Akhtar`;
    const canonical = `${siteUrl}${canonicalPath}`;
    const previewImage = image ?? defaultImage;

    document.title = fullTitle;

    setMeta('meta[name="description"]', "name", "description").content =
      description;
    setMeta('meta[name="robots"]', "name", "robots").content =
      "index,follow,max-snippet:-1,max-image-preview:large";
    setMeta('meta[property="og:title"]', "property", "og:title").content =
      fullTitle;
    setMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
    ).content = description;
    setMeta('meta[property="og:type"]', "property", "og:type").content = type;
    setMeta('meta[property="og:url"]', "property", "og:url").content =
      canonical;
    setMeta('meta[property="og:image"]', "property", "og:image").content =
      previewImage;
    setMeta(
      'meta[property="og:image:secure_url"]',
      "property",
      "og:image:secure_url",
    ).content = previewImage;
    setMeta('meta[property="og:image:type"]', "property", "og:image:type")
      .content = "image/png";
    setMeta(
      'meta[property="og:image:width"]',
      "property",
      "og:image:width",
    ).content = "1200";
    setMeta(
      'meta[property="og:image:height"]',
      "property",
      "og:image:height",
    ).content = "630";
    setMeta(
      'meta[property="og:image:alt"]',
      "property",
      "og:image:alt",
    ).content = fullTitle;
    setMeta('meta[name="twitter:card"]', "name", "twitter:card").content =
      "summary_large_image";
    setMeta('meta[name="twitter:title"]', "name", "twitter:title").content =
      fullTitle;
    setMeta(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
    ).content = description;
    setMeta('meta[name="twitter:image"]', "name", "twitter:image").content =
      previewImage;

    let link = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );

    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }

    link.href = canonical;

    const existing = document.getElementById("structured-data");
    existing?.remove();

    const script = document.createElement("script");
    script.id = "structured-data";
    script.type = "application/ld+json";
    script.text = JSON.stringify(
      jsonLd ?? {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Dewan Shakil Akhtar",
        url: siteUrl,
        sameAs: [
          "https://github.com/imdewan",
          "https://linkedin.com/in/mrdsa04",
          "https://x.com/mrdsa04",
        ],
        jobTitle: "Member of Technical Staff",
        worksFor: {
          "@type": "Organization",
          name: "Stellon Labs",
        },
      },
    );
    document.head.appendChild(script);
  }, [canonicalPath, description, image, jsonLd, title, type]);

  return null;
}
