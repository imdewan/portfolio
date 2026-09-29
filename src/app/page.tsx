import Image from "next/image";
import { ArrowUpRight, Mail, Terminal } from "lucide-react";
import { BlogList } from "@/components/BlogList";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeading } from "@/components/SectionHeading";
import { socialIcons } from "@/components/icons";
import { getAllPosts } from "@/lib/posts";
import {
  personJsonLd,
  projects,
  siteDescription,
  siteName,
  siteUrl,
  socials,
  stack,
} from "@/lib/site";

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <main className="mx-auto max-w-3xl px-5">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            personJsonLd,
            {
              "@type": "WebSite",
              "@id": `${siteUrl}/#website`,
              url: siteUrl,
              name: siteName,
              description: siteDescription,
              publisher: { "@id": `${siteUrl}/#person` },
            },
            {
              "@type": "ProfilePage",
              url: siteUrl,
              mainEntity: { "@id": `${siteUrl}/#person` },
            },
          ],
        }}
      />

      <section
        id="about"
        className="fade-up grid gap-8 py-16 sm:grid-cols-[132px_1fr] sm:py-20"
      >
        <Image
          src="/avatar.jpeg"
          alt="Dewan Shakil Akhtar"
          width={128}
          height={128}
          priority
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
            I&apos;m Dewan Shakil Akhtar, a Member of Technical Staff at Stellon
            Labs, a San Francisco-based YC S25 company, working on on-device AI
            and SDKs, and full-stack product engineering. I write about what
            I&apos;m building and the tradeoffs behind it.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            {socials.map((social) => {
              const Icon = socialIcons[social.icon];
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer me"
                  className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-100"
                >
                  <Icon className="h-4 w-4" />
                  {social.label}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section id="blog" className="border-t border-white/10 py-14">
        <SectionHeading
          eyebrow="Recent posts"
          title="Writing, notes, and build logs."
        />
        {posts.length > 0 ? (
          <BlogList posts={posts.slice(0, 3)} compact />
        ) : (
          <p className="leading-7 text-zinc-500">No published posts yet.</p>
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
                  <div className="mb-2 flex flex-wrap items-center gap-3">
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

        <ul className="flex flex-wrap gap-2">
          {stack.map((item) => (
            <li
              key={item.name}
              className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-sm text-zinc-300"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.icon}
                alt=""
                width={16}
                height={16}
                loading="lazy"
                className="h-4 w-4 rounded-sm"
              />
              {item.name}
            </li>
          ))}
        </ul>
      </section>

      <section id="contact" className="border-t border-white/10 py-14">
        <SectionHeading eyebrow="Contact" title="Need to reach me?" />

        <p className="max-w-2xl leading-8 text-zinc-400">
          If you want to say hi, ask about something I&apos;ve built, or need
          help with React Native, AI SDKs, or product engineering, you can reach
          me here.
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
  );
}
