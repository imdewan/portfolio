import Link from "next/link";
import { socials } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 border-t border-white/10 px-5 py-8 text-sm text-zinc-500">
      <span>© Dewan Shakil Akhtar</span>
      <div className="flex gap-4">
        <Link href="/rss.xml" className="hover:text-zinc-200">
          RSS
        </Link>
        {socials.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noreferrer me"
            className="hover:text-zinc-200"
          >
            {social.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
