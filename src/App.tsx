import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Copy,
  Edit3,
  Eye,
  FileText,
  Github,
  Linkedin,
  LogIn,
  LogOut,
  Mail,
  Menu,
  Save,
  Share2,
  Terminal,
  Trash2,
  Twitter,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { MarkdownContent } from "./components/MarkdownContent";
import { Seo } from "./components/Seo";
import {
  deletePost,
  getAdminPosts,
  getPostBySlug,
  getPublishedPosts,
  savePost,
  slugify,
  type BlogPost,
  type BlogPostInput,
  type BlogStatus,
} from "./lib/blog";
import { adminEmails, auth, googleProvider } from "./lib/firebase";
import { generateAndUploadOgImage } from "./lib/ogImage";

const navItems = [
  { label: "About", href: "/#about" },
  { label: "Blog", href: "/blog" },
  { label: "Work", href: "/#work" },
  { label: "Stack", href: "/#stack" },
  { label: "Contact", href: "/#contact" },
];

const socials = [
  { label: "GitHub", href: "https://github.com/imdewan", icon: Github },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/mrdsa04",
    icon: Linkedin,
  },
  { label: "Twitter", href: "https://x.com/mrdsa04", icon: Twitter },
];

const projects = [
  {
    name: "Stellon Labs",
    detail:
      "Member of Technical Staff at a San Francisco-based YC S25 company, working across on-device AI, SDKs, and product engineering.",
    href: "https://stellonlabs.com",
    status: "Current | Member of Technical Staff",
  },
  {
    name: "SoyFin",
    detail:
      "AI-powered personal finance app for tracking spending, scanning receipts, and getting cleaner budget context.",
    href: "https://soyfin.com",
    status: "Past | Founder",
  },
  {
    name: "NOOL",
    detail:
      "Founding engineer work on a React Native app with a Convex backend, focused on fast product iteration.",
    href: "https://thenool.com",
    status: "Past | Founding Engineer",
  },
  {
    name: "Ledref",
    detail:
      "Archived newsletter builder with drag-and-drop editing, AI helpers, and analytics.",
    href: null,
    status: "Archived | Founder",
  },
  {
    name: "Coldpen",
    detail:
      "Archived cold email platform for founders and small teams. Domain retired.",
    href: null,
    status: "Archived | Founder",
  },
];

const stack = [
  {
    name: "TypeScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },
  {
    name: "React Native",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    name: "React",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    name: "Node.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },
  {
    name: "Python",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    name: "C++",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  },
  {
    name: "Go",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
  },
  {
    name: "Firebase",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
  },
  {
    name: "Supabase",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg",
  },
  {
    name: "Docker",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  },
  {
    name: "GCP",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
  },
  {
    name: "Convex",
    icon: "https://media2.dev.to/dynamic/image/width=320,height=320,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Forganization%2Fprofile_image%2F8065%2Fd559bbad-1732-4020-82c4-ad689dbdbc5d.png",
  },
];

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "# Untitled\n\nWrite your README-style Markdown here.",
  status: "draft" as BlogStatus,
  publishDate: new Date().toISOString().slice(0, 10),
  tagsText: "",
  seoTitle: "",
  seoDescription: "",
  ogImageUrl: "",
};

const aiWritingPrompt = `You are helping me draft a blog post for my personal site.

My background:
- I am Dewan Shakil Akhtar.
- I am a Member of Technical Staff at Stellon Labs, a San Francisco-based YC S25 company.
- I write about on-device AI, React Native SDKs, mobile/product engineering, Firebase, build logs, and honest lessons from shipping software.
- My tone should be human, reflective, clear, and practical. Avoid generic AI hype.

Topic I want to write about:
[PASTE TOPIC / ROUGH NOTES HERE]

Return the post in this exact structure:

Title:

Slug:

Excerpt:

Tags:

SEO Title:

SEO Description:

Markdown:

Requirements:
- Write like a real person, with some feeling and memory, not corporate copy.
- Include a strong opening.
- Include useful technical details where relevant.
- Include source links if claims need support.
- Include one tasteful Markdown image near the top if it helps the post.
- Prefer real Pixabay images, not AI-generated looking stock.
- Keep the Markdown ready to paste into my blog admin.
- Do not include fake personal experiences unless they are framed as examples.`;

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 },
  },
};

function formatDate(date?: Date | null) {
  if (!date) return "Draft";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function withoutDuplicateTitle(content: string, title: string) {
  const firstHeading = new RegExp(`^#\\s+${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\n+`);
  return content.replace(firstHeading, "");
}

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-8">
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-emerald-400">
        {eyebrow}
      </p>
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-50">
        {title}
      </h2>
    </div>
  );
}

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-white/10">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-6">
        <Link to="/" className="font-mono text-sm text-zinc-100">
          Dewan Shakil Akhtar
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="font-mono text-sm text-zinc-400 transition-colors hover:text-zinc-100"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          className="grid h-9 w-9 place-items-center rounded-md border border-white/10 text-zinc-300 md:hidden"
          onClick={() => setIsMenuOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </button>
      </div>

      {isMenuOpen ? (
        <nav className="mx-auto flex max-w-3xl flex-col gap-3 border-t border-white/10 px-5 py-4 md:hidden">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="font-mono text-sm text-zinc-300"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  );
}

function Footer() {
  return (
    <footer className="mx-auto flex max-w-3xl items-center justify-between border-t border-white/10 px-5 py-8 text-sm text-zinc-500">
      <span>© Dewan Shakil Akhtar</span>
      <div className="flex gap-4">
        {socials.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noreferrer"
            className="hover:text-zinc-200"
          >
            {social.label}
          </a>
        ))}
      </div>
    </footer>
  );
}

function usePublishedPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    getPublishedPosts()
      .then((items) => {
        if (!ignore) setPosts(items);
      })
      .catch((reason) => {
        if (!ignore) {
          setError(
            reason instanceof Error
              ? reason.message
              : "Could not load posts from Firestore.",
          );
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  return { posts, isLoading, error };
}

function BlogList({
  posts,
  compact = false,
}: {
  posts: BlogPost[];
  compact?: boolean;
}) {
  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <article key={post.slug} className="group">
          <Link to={`/blog/${post.slug}`} className="block">
            <h3 className="text-xl font-semibold tracking-tight text-zinc-50 transition-colors group-hover:text-emerald-300">
              {post.title}
            </h3>
            <p className="mt-2 font-mono text-xs text-zinc-500">
              {formatDate(post.publishedAt)} · {post.readingMinutes} min
              {post.tags[0] ? ` · ${post.tags[0]}` : ""}
            </p>
            <p className="mt-3 leading-7 text-zinc-400">{post.excerpt}</p>
          </Link>
        </article>
      ))}
      {compact ? (
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 font-mono text-sm text-emerald-400 hover:text-emerald-300"
        >
          All posts <ArrowUpRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}

function HomePage() {
  const { posts, error } = usePublishedPosts();

  useEffect(() => {
    if (!window.location.hash) return;

    const frame = window.requestAnimationFrame(() => {
      document.querySelector(window.location.hash)?.scrollIntoView();
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <Seo
        title="Dewan Shakil Akhtar | Builder, Engineer, Notes"
        description="Personal site and blog for Dewan Shakil Akhtar, a full-stack builder working on on-device AI, React Native SDKs, and product engineering."
      />
      <main className="mx-auto max-w-3xl px-5">
        <motion.section
          id="about"
          className="grid gap-8 py-16 sm:grid-cols-[132px_1fr] sm:py-20"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <img
            src="/avatar.jpeg"
            alt="Dewan Shakil Akhtar"
            className="h-32 w-32 rounded-2xl object-cover"
          />

          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-xs text-emerald-400">
              <Terminal className="h-3.5 w-3.5" />
              <span>mrdsa04 / full-stack builder</span>
            </div>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-zinc-50 sm:text-4xl">
              Hey, I&apos;m Dewan.
            </h1>
            <p className="mt-4 text-lg leading-8 text-zinc-300">
              I&apos;m a Member of Technical Staff at Stellon Labs, a San
              Francisco-based YC S25 company, working on on-device AI and SDKs,
              and full-stack product engineering. I write about what I&apos;m
              building and the tradeoffs behind it.
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-100"
                >
                  <social.icon className="h-4 w-4" />
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </motion.section>

        <section id="blog" className="border-t border-white/10 py-14">
          <SectionHeading
            eyebrow="Recent posts"
            title="Writing, notes, and build logs."
          />
          {error ? (
            <p className="font-mono text-sm text-red-300">{error}</p>
          ) : posts.length > 0 ? (
            <BlogList posts={posts.slice(0, 3)} compact />
          ) : (
            <p className="leading-7 text-zinc-500">
              No published posts yet.
            </p>
          )}
        </section>

        <section id="work" className="border-t border-white/10 py-14">
          <SectionHeading
            eyebrow="Work"
            title="Roles, builds, and archived projects."
          />

          <div className="divide-y divide-white/10">
            {projects.map((project) => (
              <article key={project.name} className="py-5 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-zinc-50">
                        {project.name}
                      </h3>
                      <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[11px] text-zinc-500">
                        {project.status}
                      </span>
                    </div>
                    <p className="leading-7 text-zinc-400">{project.detail}</p>
                  </div>

                  {project.href ? (
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${project.name}`}
                      className="mt-1 shrink-0 text-zinc-500 transition-colors hover:text-zinc-100"
                    >
                      <ArrowUpRight className="h-5 w-5" />
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="stack" className="border-t border-white/10 py-14">
          <SectionHeading eyebrow="Stack" title="The tools I reach for." />

          <div className="flex flex-wrap gap-2">
            {stack.map((item) => (
              <span
                key={item.name}
                className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-sm text-zinc-300"
              >
                <img src={item.icon} alt="" className="h-4 w-4 rounded-sm" />
                {item.name}
              </span>
            ))}
          </div>
        </section>

        <section id="contact" className="border-t border-white/10 py-14">
          <SectionHeading eyebrow="Contact" title="Need to reach me?" />

          <p className="max-w-2xl leading-8 text-zinc-400">
            If you want to say hi, ask about something I&apos;ve built, or need
            help with React Native, AI SDKs, or product engineering, you can
            reach me here.
          </p>

          <a
            href="mailto:hi@mrdsa.dev"
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-md bg-zinc-100 px-4 text-sm font-medium text-zinc-950 transition-colors hover:bg-white"
          >
            <Mail className="h-4 w-4" />
            hi@mrdsa.dev
          </a>
        </section>
      </main>
    </>
  );
}

function BlogIndexPage() {
  const { posts, isLoading, error } = usePublishedPosts();

  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <Seo
        title="Blog"
        description="Writing, notes, and build logs by Dewan Shakil Akhtar."
        canonicalPath="/blog"
      />
      <SectionHeading eyebrow="Blog" title="Writing, notes, and build logs." />
      {isLoading ? (
        <p className="font-mono text-sm text-zinc-500">Loading posts...</p>
      ) : error ? (
        <p className="font-mono text-sm text-red-300">{error}</p>
      ) : posts.length > 0 ? (
        <BlogList posts={posts} />
      ) : (
        <p className="leading-7 text-zinc-500">No published posts yet.</p>
      )}
    </main>
  );
}

function BlogPostPage() {
  const { slug = "" } = useParams();
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined);
  const [copyMessage, setCopyMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    getPostBySlug(slug)
      .then((item) => {
        if (ignore) return;
        setPost(item?.status === "published" ? item : null);
      })
      .catch(() => {
        if (!ignore) setPost(null);
      });

    return () => {
      ignore = true;
    };
  }, [slug]);

  if (post === undefined) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16">
        <p className="font-mono text-sm text-zinc-500">Loading post...</p>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16">
        <Seo
          title="Post not found"
          description="This blog post could not be found."
          canonicalPath={`/blog/${slug}`}
        />
        <SectionHeading eyebrow="404" title="Post not found." />
        <Link to="/blog" className="font-mono text-sm text-emerald-400">
          Back to blog
        </Link>
      </main>
    );
  }

  const description = post.seoDescription || post.excerpt;
  const title = post.seoTitle || post.title;
  const postUrl = `${window.location.origin}/blog/${post.slug}`;
  const ogImage = post.ogImageUrl || "https://mrdsa.dev/og-profile.png";

  async function copyPostLink() {
    await navigator.clipboard.writeText(postUrl);
    setCopyMessage("Copied");
    window.setTimeout(() => setCopyMessage(""), 1600);
  }

  async function sharePost() {
    if (navigator.share) {
      await navigator.share({
        title: post.title,
        text: post.excerpt,
        url: postUrl,
      });
      return;
    }

    await copyPostLink();
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <Seo
        title={title}
        description={description}
        canonicalPath={`/blog/${post.slug}`}
        type="article"
        image={ogImage}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description,
          image: ogImage,
          datePublished: post.publishedAt?.toISOString(),
          dateModified: post.updatedAt?.toISOString(),
          author: {
            "@type": "Person",
            name: "Dewan Shakil Akhtar",
            url: "https://mrdsa.dev",
          },
          mainEntityOfPage: `https://mrdsa.dev/blog/${post.slug}`,
        }}
      />
      <article>
        <div className="flex items-center justify-between gap-4">
          <Link to="/blog" className="font-mono text-sm text-emerald-400">
            Back to blog
          </Link>
          <div className="flex items-center gap-2">
            <button
              className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-xs text-zinc-500 transition-colors hover:bg-white/[0.04] hover:text-zinc-300"
              onClick={sharePost}
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </button>
            <button
              className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-xs text-zinc-500 transition-colors hover:bg-white/[0.04] hover:text-zinc-300"
              onClick={copyPostLink}
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </button>
            {copyMessage ? (
              <span className="font-mono text-xs text-emerald-500">
                {copyMessage}
              </span>
            ) : null}
          </div>
        </div>
        <header className="mb-10 mt-8">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-50">
            {post.title}
          </h1>
          <p className="mt-3 font-mono text-xs text-zinc-500">
            {formatDate(post.publishedAt)} · {post.readingMinutes} min
            {post.tags.length ? ` · ${post.tags.join(", ")}` : ""}
          </p>
          <p className="mt-5 text-lg leading-8 text-zinc-400">{post.excerpt}</p>
        </header>
        <MarkdownContent content={withoutDuplicateTitle(post.content, post.title)} />
      </article>
    </main>
  );
}

function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setIsLoading(false);
    });
  }, []);

  return { user, isLoading };
}

function AdminPage() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuthUser();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingId, setEditingId] = useState<string | undefined>();
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const allowed = useMemo(() => {
    return Boolean(
      user?.email && adminEmails.includes(user.email.toLowerCase()),
    );
  }, [user]);

  function loadPosts() {
    if (!allowed) return;
    getAdminPosts()
      .then(setPosts)
      .catch(() => setMessage("Could not load posts."));
  }

  useEffect(loadPosts, [allowed]);

  function updateField(field: keyof typeof emptyForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
      slug:
        field === "title" && !current.slug
          ? slugify(value)
          : field === "slug"
            ? slugify(value)
            : current.slug,
    }));
  }

  function editPost(post: BlogPost) {
    setEditingId(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      status: post.status,
      publishDate:
        post.publishedAt?.toISOString().slice(0, 10) ??
        new Date().toISOString().slice(0, 10),
      tagsText: post.tags.join(", "),
      seoTitle: post.seoTitle ?? "",
      seoDescription: post.seoDescription ?? "",
      ogImageUrl: post.ogImageUrl ?? "",
    });
  }

  function getFormTags() {
    return form.tagsText
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  async function createPreviewImage(slug: string, tags: string[]) {
    return generateAndUploadOgImage({
      title: form.title.trim() || "Untitled post",
      slug,
      tags,
      date: form.publishDate
        ? formatDate(new Date(`${form.publishDate}T12:00:00`))
        : undefined,
    });
  }

  async function handleGeneratePreviewImage() {
    const slug = slugify(form.slug || form.title);
    if (!slug) {
      setMessage("Add a title before generating a preview image.");
      return;
    }

    setIsGeneratingImage(true);
    setMessage("Generating preview image...");

    try {
      const imageUrl = await createPreviewImage(slug, getFormTags());
      setForm((current) => ({
        ...current,
        slug,
        ogImageUrl: imageUrl,
      }));
      setMessage("Preview image generated.");
    } catch {
      setMessage("Preview image failed. Check Firebase Storage rules.");
    } finally {
      setIsGeneratingImage(false);
    }
  }

  async function handleSave() {
    setIsSaving(true);
    setMessage("");

    const slug = slugify(form.slug || form.title);
    const tags = getFormTags();
    let ogImageUrl = form.ogImageUrl.trim();

    try {
      if (!ogImageUrl && slug) {
        setMessage("Generating preview image...");
        ogImageUrl = await createPreviewImage(slug, tags);
        setForm((current) => ({
          ...current,
          slug,
          ogImageUrl,
        }));
      }

      const payload: BlogPostInput = {
      title: form.title.trim(),
      slug,
      excerpt: form.excerpt.trim(),
      content: form.content,
      status: form.status,
      publishedAt: form.publishDate ? new Date(`${form.publishDate}T12:00:00`) : null,
      tags,
      seoTitle: form.seoTitle.trim() || undefined,
      seoDescription: form.seoDescription.trim() || undefined,
      ogImageUrl: ogImageUrl || undefined,
    };

      const id = await savePost(payload, editingId);
      setEditingId(id);
      setMessage("Saved.");
      loadPosts();
    } catch {
      setMessage("Save failed. Check Firebase Auth and Firestore rules.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this post?")) return;
    await deletePost(id);
    if (editingId === id) {
      setEditingId(undefined);
      setForm(emptyForm);
    }
    loadPosts();
  }

  async function copyPrompt() {
    await navigator.clipboard.writeText(aiWritingPrompt);
    setMessage("Prompt copied.");
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-16">
        <p className="font-mono text-sm text-zinc-500">Checking auth...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16">
        <Seo
          title="Admin"
          description="Private blog editor for Dewan Shakil Akhtar."
          canonicalPath="/admin"
        />
        <SectionHeading eyebrow="Admin" title="Sign in to write." />
        <button
          className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-100 px-4 text-sm font-medium text-zinc-950 hover:bg-white"
          onClick={() => signInWithPopup(auth, googleProvider)}
        >
          <LogIn className="h-4 w-4" />
          Sign in with Google
        </button>
      </main>
    );
  }

  if (!allowed) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16">
        <SectionHeading eyebrow="Admin" title="Access not configured." />
        <p className="leading-7 text-zinc-400">
          Signed in as {user.email}. This admin is restricted to
          <code className="mx-2 rounded bg-white/10 px-2 py-1 font-mono text-sm">
            mydsaproduction@gmail.com
          </code>
          .
        </p>
        <button
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-md border border-white/10 px-4 text-sm text-zinc-200 hover:bg-white/[0.05]"
          onClick={() => signOut(auth)}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <Seo
        title="Admin"
        description="Private blog editor for Dewan Shakil Akhtar."
        canonicalPath="/admin"
      />
      <div className="mb-8 flex flex-col justify-between gap-5 border-b border-white/10 pb-6 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-400">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50">
            Write and publish.
          </h1>
          <p className="mt-3 max-w-2xl text-zinc-400">
            Draft in Markdown, keep SEO fields close, and preview the post like
            it will actually read on the site.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-100 px-4 text-sm font-medium text-zinc-950 hover:bg-white"
            onClick={() => {
              setEditingId(undefined);
              setForm(emptyForm);
            }}
          >
            <FileText className="h-4 w-4" />
            New post
          </button>
          <button
            className="inline-flex h-10 items-center gap-2 rounded-md border border-white/10 px-4 text-sm text-zinc-200 hover:bg-white/[0.05]"
            onClick={() => signOut(auth)}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
        <aside className="space-y-4">
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-medium text-zinc-100">Posts</h2>
              <span className="font-mono text-xs text-zinc-500">
                {posts.length}
              </span>
            </div>
            <div className="space-y-3">
              {posts.length === 0 ? (
                <p className="text-sm leading-6 text-zinc-500">
                  No posts yet. Start with a new draft.
                </p>
              ) : null}
              {posts.map((post) => (
                <div
                  key={post.id}
                  className={`rounded-xl border p-3 ${
                    editingId === post.id
                      ? "border-emerald-400/50 bg-emerald-400/5"
                      : "border-white/10 bg-black/10"
                  }`}
                >
                  <p className="line-clamp-2 font-medium text-zinc-100">
                    {post.title}
                  </p>
                  <p className="mt-1 line-clamp-1 font-mono text-xs text-zinc-500">
                    {post.status} · {post.slug}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      className="inline-flex h-8 items-center gap-2 rounded-md border border-white/10 px-3 text-xs text-zinc-300 hover:bg-white/[0.05]"
                      onClick={() => editPost(post)}
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    {post.id ? (
                      <button
                        className="inline-flex h-8 items-center gap-2 rounded-md border border-red-400/20 px-3 text-xs text-red-300 hover:bg-red-400/10"
                        onClick={() => handleDelete(post.id!)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-medium text-zinc-100">
                  AI draft prompt
                </h2>
                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Copy this, add your topic, paste the result back into fields.
                </p>
              </div>
              <button
                className="inline-flex h-8 items-center gap-2 rounded-md border border-white/10 px-3 text-xs text-zinc-300 hover:bg-white/[0.05]"
                onClick={copyPrompt}
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </button>
            </div>
            <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-black/20 p-3 font-mono text-[11px] leading-5 text-zinc-500">
              {aiWritingPrompt}
            </pre>
          </section>
        </aside>

        <section className="grid gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-50">
                  Post details
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  These fields power the card, URL, SEO, and article header.
                </p>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 font-mono text-xs text-zinc-500">
                {form.status}
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="font-mono text-xs text-zinc-500">Title</span>
                <input
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  className="rounded-md border border-white/10 bg-[#0f1216] px-3 py-2 text-zinc-100 outline-none focus:border-emerald-400/60"
                  placeholder="A clear, human title"
                />
              </label>
              <label className="grid gap-2">
                <span className="font-mono text-xs text-zinc-500">Slug</span>
                <input
                  value={form.slug}
                  onChange={(event) => updateField("slug", event.target.value)}
                  className="rounded-md border border-white/10 bg-[#0f1216] px-3 py-2 font-mono text-zinc-100 outline-none focus:border-emerald-400/60"
                  placeholder="post-url-slug"
                />
              </label>
            </div>

            <label className="mt-4 grid gap-2">
              <span className="font-mono text-xs text-zinc-500">Excerpt</span>
              <textarea
                value={form.excerpt}
                onChange={(event) => updateField("excerpt", event.target.value)}
                rows={3}
                className="rounded-md border border-white/10 bg-[#0f1216] px-3 py-2 text-zinc-100 outline-none focus:border-emerald-400/60"
                placeholder="Short description used in cards and article intro"
              />
            </label>

            <div className="mt-4 grid gap-4 md:grid-cols-4">
              <label className="grid gap-2">
                <span className="font-mono text-xs text-zinc-500">Status</span>
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      status: event.target.value as BlogStatus,
                    }))
                  }
                  className="rounded-md border border-white/10 bg-[#0f1216] px-3 py-2 text-zinc-100 outline-none focus:border-emerald-400/60"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>
              <label className="grid gap-2">
                <span className="font-mono text-xs text-zinc-500">
                  Publish date
                </span>
                <input
                  type="date"
                  value={form.publishDate}
                  onChange={(event) =>
                    updateField("publishDate", event.target.value)
                  }
                  className="rounded-md border border-white/10 bg-[#0f1216] px-3 py-2 text-zinc-100 outline-none focus:border-emerald-400/60"
                />
              </label>
              <label className="grid gap-2 md:col-span-2">
                <span className="font-mono text-xs text-zinc-500">
                  Tags, comma separated
                </span>
                <input
                  value={form.tagsText}
                  onChange={(event) =>
                    updateField("tagsText", event.target.value)
                  }
                  className="rounded-md border border-white/10 bg-[#0f1216] px-3 py-2 text-zinc-100 outline-none focus:border-emerald-400/60"
                  placeholder="React Native, AI, Firebase"
                />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-lg font-semibold text-zinc-50">SEO</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Optional overrides. If blank, the post title and excerpt are used.
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="font-mono text-xs text-zinc-500">SEO title</span>
                <input
                  value={form.seoTitle}
                  onChange={(event) =>
                    updateField("seoTitle", event.target.value)
                  }
                  className="rounded-md border border-white/10 bg-[#0f1216] px-3 py-2 text-zinc-100 outline-none focus:border-emerald-400/60"
                />
              </label>
              <label className="grid gap-2">
                <span className="font-mono text-xs text-zinc-500">
                  SEO description
                </span>
                <input
                  value={form.seoDescription}
                  onChange={(event) =>
                    updateField("seoDescription", event.target.value)
                  }
                  className="rounded-md border border-white/10 bg-[#0f1216] px-3 py-2 text-zinc-100 outline-none focus:border-emerald-400/60"
                />
              </label>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
              <label className="grid gap-2">
                <span className="font-mono text-xs text-zinc-500">
                  Social preview image
                </span>
                <input
                  value={form.ogImageUrl}
                  onChange={(event) =>
                    updateField("ogImageUrl", event.target.value)
                  }
                  className="rounded-md border border-white/10 bg-[#0f1216] px-3 py-2 font-mono text-xs text-zinc-100 outline-none focus:border-emerald-400/60"
                  placeholder="Generated automatically when you save"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    className="inline-flex h-9 items-center gap-2 rounded-md border border-white/10 px-3 text-xs text-zinc-300 hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={handleGeneratePreviewImage}
                    disabled={isGeneratingImage || !form.title.trim()}
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    {isGeneratingImage ? "Generating..." : "Generate image"}
                  </button>
                  {form.ogImageUrl ? (
                    <button
                      className="inline-flex h-9 items-center gap-2 rounded-md border border-white/10 px-3 text-xs text-zinc-300 hover:bg-white/[0.05]"
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          ogImageUrl: "",
                        }))
                      }
                    >
                      Clear
                    </button>
                  ) : null}
                </div>
              </label>
              <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0b0d10]">
                {form.ogImageUrl ? (
                  <img
                    src={form.ogImageUrl}
                    alt=""
                    className="aspect-[1200/630] w-full object-cover"
                  />
                ) : (
                  <div className="grid aspect-[1200/630] place-items-center px-6 text-center font-mono text-xs text-zinc-600">
                    Saved posts get a GitHub-style preview card here.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-6 2xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <label className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Markdown
                </span>
                <p className="mt-2 text-sm text-zinc-500">
                  Paste the AI output&apos;s Markdown section here. README-style
                  Markdown is supported.
                </p>
              </div>
              <textarea
                value={form.content}
                onChange={(event) => updateField("content", event.target.value)}
                rows={28}
                className="min-h-[620px] rounded-xl border border-white/10 bg-[#0f1216] px-4 py-3 font-mono text-sm leading-7 text-zinc-100 outline-none focus:border-emerald-400/60"
              />
            </label>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <div className="mb-3 flex items-center justify-between px-2 py-1">
                <div className="inline-flex items-center gap-2 font-mono text-xs text-zinc-500">
                  <Eye className="h-4 w-4" />
                  Public preview
                </div>
                {form.slug ? (
                  <button
                    className="inline-flex h-8 items-center gap-2 rounded-md border border-white/10 px-3 text-xs text-zinc-300 hover:bg-white/[0.05]"
                    onClick={() => navigate(`/blog/${form.slug}`)}
                  >
                    Open route
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </div>
              <article className="rounded-xl border border-white/10 bg-[#0b0d10] px-5 py-8 sm:px-8">
                <header className="mb-8">
                  <p className="font-mono text-sm text-emerald-400">
                    Back to blog
                  </p>
                  <h1 className="mt-8 text-3xl font-semibold tracking-tight text-zinc-50">
                    {form.title || "Untitled post"}
                  </h1>
                  <p className="mt-3 font-mono text-xs text-zinc-500">
                    {form.publishDate || "Today"} · Preview · {form.status}
                    {form.tagsText ? ` · ${form.tagsText}` : ""}
                  </p>
                  {form.excerpt ? (
                    <p className="mt-5 text-lg leading-8 text-zinc-400">
                      {form.excerpt}
                    </p>
                  ) : null}
                </header>
                <MarkdownContent
                  content={withoutDuplicateTitle(
                    form.content,
                    form.title || "Untitled post",
                  )}
                />
              </article>
            </div>
          </div>

          <div className="sticky bottom-4 z-10 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-[#111418]/95 p-3 shadow-2xl shadow-black/40 backdrop-blur">
            <button
              className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-100 px-4 text-sm font-medium text-zinc-950 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleSave}
              disabled={isSaving || !form.title.trim()}
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save post"}
            </button>
            <button
              className="inline-flex h-10 items-center gap-2 rounded-md border border-white/10 px-4 text-sm text-zinc-200 hover:bg-white/[0.05]"
              onClick={copyPrompt}
            >
              <Copy className="h-4 w-4" />
              Copy AI prompt
            </button>
            {message ? (
              <p className="font-mono text-sm text-zinc-500">{message}</p>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}

function AppShell() {
  return (
    <div className="min-h-screen bg-[#0b0d10] text-zinc-100">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogIndexPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route
          path="*"
          element={
            <main className="mx-auto max-w-3xl px-5 py-16">
              <Seo
                title="Not found"
                description="This page could not be found."
                canonicalPath="/404"
              />
              <SectionHeading eyebrow="404" title="Page not found." />
              <Link to="/" className="font-mono text-sm text-emerald-400">
                Go home
              </Link>
            </main>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default AppShell;
