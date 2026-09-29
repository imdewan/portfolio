import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  updated: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  content: string;
  readingMinutes: number;
};

const postsDir = path.join(process.cwd(), "content", "posts");

function toDateString(value: unknown) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value ?? "");
}

function withoutLeadingTitle(content: string, title: string) {
  const firstLine = content.trimStart().split("\n")[0] ?? "";
  if (firstLine.replace(/^#\s+/, "").trim() === title.trim()) {
    return content.trimStart().slice(firstLine.length).trimStart();
  }
  return content;
}

function readPost(file: string): Post {
  const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
  const { data, content } = matter(raw);
  const title = String(data.title);
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const date = toDateString(data.date);

  return {
    slug: file.replace(/\.md$/, ""),
    title,
    excerpt: String(data.excerpt ?? ""),
    date,
    updated: toDateString(data.updated) || date,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    seoTitle: data.seoTitle ? String(data.seoTitle) : undefined,
    seoDescription: data.seoDescription
      ? String(data.seoDescription)
      : undefined,
    content: withoutLeadingTitle(content, title),
    readingMinutes: Math.max(1, Math.ceil(words / 220)),
  };
}

export const getAllPosts = cache((): Post[] => {
  return fs
    .readdirSync(postsDir)
    .filter((file) => file.endsWith(".md"))
    .map(readPost)
    .filter((post) => post.date)
    .sort((a, b) => b.date.localeCompare(a.date));
});

export const getPost = cache((slug: string) => {
  return getAllPosts().find((post) => post.slug === slug) ?? null;
});
