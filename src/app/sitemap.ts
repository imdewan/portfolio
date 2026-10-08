import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const latest = posts[0]?.updated;

  return [
    { url: siteUrl, lastModified: latest, changeFrequency: "weekly", priority: 1 },
    {
      url: `${siteUrl}/blog`,
      lastModified: latest,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    { url: `${siteUrl}/zepper`, changeFrequency: "weekly", priority: 0.9 },
    ...posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.updated,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
