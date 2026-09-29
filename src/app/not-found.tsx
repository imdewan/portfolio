import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <SectionHeading as="h1" eyebrow="404" title="Page not found." />
      <Link href="/" className="font-mono text-sm text-emerald-400">
        Go home
      </Link>
    </main>
  );
}
