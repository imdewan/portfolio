import type { Metadata } from "next";
import { BlogList } from "@/components/BlogList";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeading } from "@/components/SectionHeading";
import { getAllPosts } from "@/lib/posts";
import { blogDescription, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description: blogDescription,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog | Dewan Shakil Akhtar",
    description: blogDescription,
    url: "/blog",
  },
  twitter: {
    title: "Blog | Dewan Shakil Akhtar",
    description: blogDescription,
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          "@id": `${siteUrl}/blog`,
          url: `${siteUrl}/blog`,
          name: "Dewan Shakil Akhtar's blog",
          description: blogDescription,
          author: { "@id": `${siteUrl}/#person` },
          blogPost: posts.map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            url: `${siteUrl}/blog/${post.slug}`,
            datePublished: post.date,
          })),
        }}
      />
      <SectionHeading
        as="h1"
        eyebrow="Blog"
        title="Writing, notes, and build logs."
      />
      <BlogList posts={posts} />
    </main>
  );
}
