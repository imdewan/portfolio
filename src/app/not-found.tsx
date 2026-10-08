import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0b0d10] text-zinc-100">
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-16">
        <SectionHeading as="h1" eyebrow="404" title="Page not found." />
        <Link href="/" className="font-mono text-sm text-emerald-400">
          Go home
        </Link>
      </main>
      <Footer />
    </div>
  );
}
