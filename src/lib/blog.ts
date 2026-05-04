import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export type BlogStatus = "draft" | "published";

export type BlogPost = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: BlogStatus;
  tags: string[];
  readingMinutes: number;
  ogImageUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  publishedAt?: Date | null;
};

export type BlogPostInput = Omit<
  BlogPost,
  "id" | "createdAt" | "updatedAt" | "publishedAt" | "readingMinutes"
> & {
  publishedAt?: Date | null;
};

const postsRef = collection(db, "posts");

function toDate(value: unknown) {
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  return null;
}

function estimateReadingMinutes(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function toPost(id: string, data: Record<string, unknown>): BlogPost {
  const content = String(data.content ?? "");

  return {
    id,
    title: String(data.title ?? ""),
    slug: String(data.slug ?? ""),
    excerpt: String(data.excerpt ?? ""),
    content,
    status: data.status === "published" ? "published" : "draft",
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    readingMinutes:
      typeof data.readingMinutes === "number"
        ? data.readingMinutes
        : estimateReadingMinutes(content),
    ogImageUrl: data.ogImageUrl ? String(data.ogImageUrl) : undefined,
    seoTitle: data.seoTitle ? String(data.seoTitle) : undefined,
    seoDescription: data.seoDescription
      ? String(data.seoDescription)
      : undefined,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
    publishedAt: toDate(data.publishedAt),
  };
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getPublishedPosts() {
  const snapshot = await getDocs(
    query(postsRef, where("status", "==", "published")),
  );

  return snapshot.docs
    .map((item) => toPost(item.id, item.data()))
    .sort(
      (a, b) =>
        (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0),
    );
}

export async function getPostBySlug(slug: string) {
  const snapshot = await getDocs(
    query(
      postsRef,
      where("slug", "==", slug),
      where("status", "==", "published"),
      limit(1),
    ),
  );

  const match = snapshot.docs[0];
  if (!match) return null;

  return toPost(match.id, match.data());
}

export async function getAdminPosts() {
  const snapshot = await getDocs(postsRef);
  return snapshot.docs
    .map((item) => toPost(item.id, item.data()))
    .sort(
      (a, b) => (b.updatedAt?.getTime() ?? 0) - (a.updatedAt?.getTime() ?? 0),
    );
}

export async function savePost(input: BlogPostInput, id?: string) {
  const publishedAt =
    input.status === "published"
      ? Timestamp.fromDate(input.publishedAt ?? new Date())
      : null;
  const payload: Record<string, unknown> = {
    ...input,
    tags: input.tags.map((tag) => tag.trim()).filter(Boolean),
    readingMinutes: estimateReadingMinutes(input.content),
    updatedAt: serverTimestamp(),
    publishedAt,
  };

  if (!payload.seoTitle) delete payload.seoTitle;
  if (!payload.seoDescription) delete payload.seoDescription;
  if (!payload.ogImageUrl) delete payload.ogImageUrl;

  if (id) {
    await updateDoc(doc(db, "posts", id), payload);
    return id;
  }

  const created = await addDoc(postsRef, {
    ...payload,
    createdAt: serverTimestamp(),
  });

  return created.id;
}

export async function deletePost(id: string) {
  await deleteDoc(doc(db, "posts", id));
}
