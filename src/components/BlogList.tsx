import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/lib/posts";
import { formatDate } from "@/lib/site";

export function BlogList({
  posts,
  compact = false,
}: {
  posts: Post[];
  compact?: boolean;
}) {
  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <article key={post.slug} className="group">
          <Link href={`/blog/${post.slug}`} className="block">
            <h3 className="text-xl font-semibold tracking-tight text-zinc-50 transition-colors group-hover:text-emerald-300">
              {post.title}
            </h3>
            <p className="mt-2 font-mono text-xs text-zinc-500">
              <time dateTime={post.date}>{formatDate(post.date)}</time> ·{" "}
              {post.readingMinutes} min
              {post.tags[0] ? ` · ${post.tags[0]}` : ""}
            </p>
            <p className="mt-3 leading-7 text-zinc-400">{post.excerpt}</p>
          </Link>
        </article>
      ))}
      {compact ? (
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-mono text-sm text-emerald-400 hover:text-emerald-300"
        >
          All posts <ArrowUpRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}
