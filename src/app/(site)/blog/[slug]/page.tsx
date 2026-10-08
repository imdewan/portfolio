import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { MarkdownContent } from "@/components/MarkdownContent";
import { ShareButtons } from "@/components/ShareButtons";
import { getAllPosts, getPost } from "@/lib/posts";
import { formatDate, personJsonLd, siteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;

  return {
    title,
    description,
    keywords: post.tags,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
      modifiedTime: post.updated,
      authors: [siteUrl],
      tags: post.tags,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const url = `${siteUrl}/blog/${post.slug}`;
  const posts = getAllPosts();
  const index = posts.findIndex((item) => item.slug === post.slug);
  const newer = posts[index - 1];
  const older = posts[index + 1];

  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BlogPosting",
              headline: post.title,
              description: post.seoDescription || post.excerpt,
              image: `${url}/opengraph-image`,
              datePublished: post.date,
              dateModified: post.updated,
              keywords: post.tags.join(", "),
              wordCount: post.content.split(/\s+/).length,
              author: personJsonLd,
              publisher: { "@id": `${siteUrl}/#person` },
              mainEntityOfPage: url,
              url,
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Blog",
                  item: `${siteUrl}/blog`,
                },
                { "@type": "ListItem", position: 3, name: post.title, item: url },
              ],
            },
          ],
        }}
      />
      <article>
        <div className="flex items-center justify-between gap-4">
          <Link href="/blog" className="font-mono text-sm text-emerald-400">
            Back to blog
          </Link>
          <ShareButtons title={post.title} text={post.excerpt} url={url} />
        </div>
        <header className="mb-10 mt-8">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-50">
            {post.title}
          </h1>
          <p className="mt-3 font-mono text-xs text-zinc-500">
            <time dateTime={post.date}>{formatDate(post.date)}</time> ·{" "}
            {post.readingMinutes} min
            {post.tags.length ? ` · ${post.tags.join(", ")}` : ""}
          </p>
          <p className="mt-5 text-lg leading-8 text-zinc-400">{post.excerpt}</p>
        </header>
        <MarkdownContent content={post.content} />
      </article>

      <nav
        aria-label="More posts"
        className="mt-16 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-2"
      >
        {older ? (
          <Link href={`/blog/${older.slug}`} className="group block">
            <span className="font-mono text-xs text-zinc-500">Older</span>
            <span className="mt-1 block text-zinc-200 group-hover:text-emerald-300">
              {older.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {newer ? (
          <Link href={`/blog/${newer.slug}`} className="group block sm:text-right">
            <span className="font-mono text-xs text-zinc-500">Newer</span>
            <span className="mt-1 block text-zinc-200 group-hover:text-emerald-300">
              {newer.title}
            </span>
          </Link>
        ) : null}
      </nav>
    </main>
  );
}
