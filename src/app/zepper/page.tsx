import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Ban,
  Check,
  CalendarDays,
  Columns2,
  Command,
  Cookie,
  Download,
  EyeOff,
  Fingerprint,
  Gauge,
  Globe,
  KeyRound,
  Layers,
  Link2,
  Lock,
  Mail,
  MessageCircle,
  Music,
  Network,
  PanelLeft,
  PenTool,
  PictureInPicture2,
  Play,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { GithubIcon } from "@/components/icons";
import { siteUrl } from "@/lib/site";
import { latestRelease, releasesUrl, repoUrl } from "./release";

// The download button follows the latest release: the page is rebuilt at most hourly.
export const revalidate = 3600;

const title = "Zepper · A private browser for your Mac";
const description =
  "Zepper is a free, open-source browser for macOS: Spaces, a vertical sidebar, split view and privacy protections that are on from the start. Built on Chromium, made to be changed.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/zepper" },
  icons: { icon: "/zepper/favicon.png", apple: "/zepper/apple-touch-icon.png" },
  openGraph: {
    type: "website",
    siteName: "Zepper",
    title,
    description,
    url: "/zepper",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", creator: "@mrdsa04", title, description },
};

const pillars = [
  {
    icon: Layers,
    title: "Built around tabs",
    text: "Spaces for each part of your life, a vertical sidebar with Essentials, pinned tabs and folders, and split view for up to four pages.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    text: "Ads, trackers and cookie banners blocked, fingerprinting noise, HTTPS upgrades and clean links. All on before you open a page.",
  },
  {
    icon: Wrench,
    title: "Yours to change",
    text: "The whole interface is TypeScript, React and CSS. Fork it, restyle it, add to it; changes show the moment you save.",
  },
];

const protections = [
  { icon: Ban, title: "Ads and trackers", text: "uBlock Origin's filter lists, YouTube ads included" },
  { icon: Cookie, title: "Cookie banners", text: "Hidden with uBlock Origin's annoyance lists" },
  { icon: Fingerprint, title: "Fingerprinting", text: "Per-site noise on canvas, WebGL and audio; no local IP leaks" },
  { icon: EyeOff, title: "Cross-site cookies", text: "Embedded third parties can't set or read them" },
  { icon: Lock, title: "HTTPS upgrades", text: "Plain-HTTP pages load securely when the site supports it" },
  { icon: Link2, title: "Clean links", text: "Click identifiers like fbclid and gclid, and AMP wrappers, removed" },
  { icon: Network, title: "Secure DNS", text: "DNS over HTTPS, automatic or through Cloudflare, Quad9 or Google" },
  { icon: Globe, title: "Global Privacy Control", text: "Asks every site not to sell or share your data" },
];

const spaces = [
  { name: "Personal", emoji: "🌸", from: "#f6a4c8", to: "#b18cf6" },
  { name: "Work", emoji: "💼", from: "#7b6cf6", to: "#5f86f5" },
  { name: "Reading", emoji: "📚", from: "#e07a2d", to: "#f2b134" },
];

const essentials = [
  { icon: Mail, color: "#ea4335" },
  { icon: Play, color: "#ff3b30" },
  { icon: PenTool, color: "#a259ff" },
  { icon: CalendarDays, color: "#4285f4" },
  { icon: Music, color: "#1db954" },
  { icon: MessageCircle, color: "#7984f6" },
];

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex min-w-[1.6rem] items-center justify-center rounded-md border border-white/15 bg-white/[0.06] px-1.5 py-0.5 font-sans text-[0.8em] font-medium text-zinc-200 shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]">
      {children}
    </kbd>
  );
}

function IconChip({ icon: Icon }: { icon: typeof Layers }) {
  return (
    <span className="grid h-9 w-9 place-items-center rounded-xl border border-[#5f86f5]/25 bg-[#5f86f5]/10 text-[#9db4ff]">
      <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
    </span>
  );
}

function Card({
  className = "",
  icon,
  title,
  children,
  visual,
}: {
  className?: string;
  icon: typeof Layers;
  title: string;
  children: React.ReactNode;
  visual?: React.ReactNode;
}) {
  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.015] p-6 transition-colors hover:border-white/[0.14] ${className}`}
    >
      <IconChip icon={icon} />
      <h3 className="mt-5 text-lg font-semibold tracking-tight text-zinc-50">{title}</h3>
      <p className="mt-2 text-[0.95rem] leading-relaxed text-zinc-400">{children}</p>
      {visual ? <div className="mt-6 flex flex-1 items-end">{visual}</div> : null}
    </div>
  );
}

function SpacesVisual() {
  return (
    <div className="flex w-full flex-wrap gap-2.5">
      {spaces.map((space) => (
        <div
          key={space.name}
          className="flex items-center gap-2.5 rounded-2xl border border-white/10 px-3.5 py-2.5 text-sm text-white"
          style={{ background: `linear-gradient(135deg, ${space.from}40, ${space.to}26)` }}
        >
          <span
            className="grid h-7 w-7 place-items-center rounded-lg text-sm"
            style={{ background: `linear-gradient(135deg, ${space.from}, ${space.to})` }}
          >
            {space.emoji}
          </span>
          {space.name}
        </div>
      ))}
    </div>
  );
}

function EssentialsVisual() {
  return (
    <div className="grid w-full grid-cols-3 gap-2">
      {essentials.map(({ icon: Icon, color }) => (
        <div key={color} className="grid h-12 place-items-center rounded-xl bg-white/[0.07]" style={{ color }}>
          <Icon className="h-5 w-5" strokeWidth={2} fill={Icon === Play ? color : "none"} />
        </div>
      ))}
    </div>
  );
}

function SplitVisual() {
  return (
    <div className="grid h-28 w-full grid-cols-2 grid-rows-2 gap-1.5 rounded-2xl border border-white/10 bg-black/30 p-1.5">
      <div className="row-span-2 rounded-xl bg-gradient-to-br from-[#5f86f5]/35 to-[#5f86f5]/10" />
      <div className="rounded-xl bg-white/[0.08]" />
      <div className="rounded-xl bg-white/[0.05]" />
    </div>
  );
}

function CommandVisual() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40 text-sm">
      <div className="flex items-center gap-2 border-b border-white/[0.08] px-3.5 py-3 text-zinc-200">
        <Command className="h-4 w-4 text-zinc-500" />
        <span>
          !gh electron<span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 animate-pulse bg-[#9db4ff]" />
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 bg-[#5f86f5]/20 px-3.5 py-2.5 text-zinc-100">
        <span className="truncate">electron · GitHub search</span>
        <span className="shrink-0 text-xs text-zinc-400">github.com</span>
      </div>
      <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 text-zinc-400">
        <span className="truncate">electron/electron</span>
        <span className="shrink-0 rounded-md bg-white/[0.07] px-2 py-0.5 text-xs">Switch to Tab</span>
      </div>
    </div>
  );
}

export default async function ZepperPage() {
  const release = await latestRelease();
  const versionLabel = release.version ? `Version ${release.version}` : "Latest version";

  return (
    <div className="min-h-screen overflow-x-clip bg-[#06080d] text-zinc-100 selection:bg-[#5f86f5]/40">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Zepper",
          description,
          url: `${siteUrl}/zepper`,
          applicationCategory: "BrowserApplication",
          operatingSystem: "macOS 14 or later",
          ...(release.version ? { softwareVersion: release.version } : {}),
          downloadUrl: release.downloadUrl,
          license: "https://www.gnu.org/licenses/gpl-3.0.html",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          author: { "@type": "Person", name: "Dewan Shakil Akhtar", url: siteUrl },
        }}
      />

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#06080d]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/zepper" className="flex items-center gap-2.5 font-semibold tracking-tight">
            <Image src="/zepper/icon.png" alt="" width={30} height={30} className="rounded-[9px]" priority />
            Zepper
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-zinc-400 md:flex" aria-label="Zepper">
            <a href="#features" className="transition-colors hover:text-zinc-100">
              Features
            </a>
            <a href="#privacy" className="transition-colors hover:text-zinc-100">
              Privacy
            </a>
            <a href="#make-it-yours" className="transition-colors hover:text-zinc-100">
              Make it yours
            </a>
            <a href={repoUrl} className="flex items-center gap-1.5 transition-colors hover:text-zinc-100">
              <GithubIcon className="h-4 w-4" />
              GitHub
            </a>
          </nav>
          <a
            href={release.downloadUrl}
            className="inline-flex items-center gap-2 rounded-full bg-[#5f86f5] px-4 py-2 text-sm font-medium text-white shadow-[0_6px_20px_-6px_rgba(95,134,245,0.8)] transition hover:bg-[#6f93f7]"
          >
            <Download className="h-4 w-4" />
            Download
          </a>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-40 h-[720px] bg-[radial-gradient(50%_55%_at_50%_30%,rgba(95,134,245,0.32),transparent_70%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(60%_50%_at_50%_20%,black,transparent)]"
          />
          <div className="relative mx-auto max-w-6xl px-5 pb-10 pt-20 text-center md:pt-28">
            <div className="fade-up mx-auto mb-8 w-fit">
              <Image
                src="/zepper/icon@2x.png"
                alt="Zepper"
                width={112}
                height={112}
                priority
                className="mx-auto drop-shadow-[0_18px_40px_rgba(95,134,245,0.45)]"
              />
            </div>
            <a
              href={releasesUrl}
              className="fade-up inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-zinc-300 transition-colors hover:border-white/20"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#7ea0ff] shadow-[0_0_10px_#7ea0ff]" />
              {versionLabel} · Free and open source
              <ArrowRight className="h-3 w-3 text-zinc-500" />
            </a>
            <h1 className="fade-up mx-auto mt-7 max-w-4xl bg-gradient-to-b from-white via-white to-[#b9c8ff]/70 bg-clip-text text-5xl font-semibold leading-[1.02] tracking-[-0.045em] text-transparent sm:text-6xl md:text-7xl">
              Tabs in their place.
              <br />
              Trackers out of it.
            </h1>
            <p className="fade-up mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400 md:text-xl">
              Spaces, a vertical sidebar and privacy that&apos;s on from the start. Built on Chromium, made to be changed.
            </p>
            <div className="fade-up mt-9 flex flex-wrap items-center justify-center gap-3">
              <a
                href={release.downloadUrl}
                className="inline-flex items-center gap-2.5 rounded-full bg-[#5f86f5] px-6 py-3.5 text-[0.95rem] font-medium text-white shadow-[0_12px_40px_-10px_rgba(95,134,245,0.9)] transition hover:bg-[#6f93f7]"
              >
                <Download className="h-[18px] w-[18px]" />
                Download for Mac
              </a>
              <a
                href={repoUrl}
                className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3.5 text-[0.95rem] font-medium text-zinc-100 transition hover:border-white/25 hover:bg-white/[0.07]"
              >
                <GithubIcon className="h-[18px] w-[18px]" />
                View the source
              </a>
            </div>
            <p className="fade-up mt-5 text-sm text-zinc-500">Apple silicon · macOS 14 or later</p>
          </div>

          {/* Screenshot */}
          <div className="relative mx-auto max-w-6xl px-5 pb-8">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-10 top-16 h-2/3 rounded-full bg-[#5f86f5]/25 blur-[100px]"
            />
            <div className="relative rounded-[28px] border border-white/10 bg-white/[0.04] p-2 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.9)] md:p-3">
              <Image
                src="/zepper/screenshot.webp"
                alt="Zepper with its sidebar of Essentials, a space, pinned tabs in a folder, and a page open"
                width={1800}
                height={1165}
                priority
                sizes="(min-width: 1152px) 1100px, 100vw"
                className="h-auto w-full rounded-[20px]"
              />
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section className="mx-auto max-w-6xl px-5 py-20">
          <div className="grid gap-4 md:grid-cols-3">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-7">
                <IconChip icon={pillar.icon} />
                <h2 className="mt-5 text-xl font-semibold tracking-tight text-zinc-50">{pillar.title}</h2>
                <p className="mt-2.5 leading-relaxed text-zinc-400">{pillar.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[#9db4ff]">Features</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-zinc-50 md:text-5xl">
              Everything in its place.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-zinc-400">
              A browser shaped around how you actually use tabs, with the things you&apos;d expect already built in.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-6">
            <Card className="md:col-span-4" icon={Layers} title="Spaces" visual={<SpacesVisual />}>
              A space for each part of your life, each with its own colours and, if you like, its own sign-ins: cookies,
              logins and site data kept apart like separate profiles. Swipe between them on the trackpad.
            </Card>
            <Card className="md:col-span-2" icon={PanelLeft} title="Essentials" visual={<EssentialsVisual />}>
              Your most-used sites one click away, signed in with that space&apos;s accounts.
            </Card>
            <Card className="md:col-span-3" icon={Command} title="Command bar" visual={<CommandVisual />}>
              <Kbd>⌘</Kbd> <Kbd>T</Kbd> to search, open an address or jump to a tab you already have open. Bangs like{" "}
              <span className="font-mono text-[0.9em] text-zinc-300">!yt</span> and{" "}
              <span className="font-mono text-[0.9em] text-zinc-300">!gh</span> go straight to the site.
            </Card>
            <Card className="md:col-span-3" icon={Columns2} title="Split view and folders" visual={<SplitVisual />}>
              Up to four pages side by side, stacked or in a grid. Pinned tabs that survive restarts, in folders you can
              nest. Drag and drop for everything.
            </Card>
            <Card className="md:col-span-2" icon={KeyRound} title="Passwords and passkeys">
              A password manager built in, with passkeys and Touch ID, kept encrypted on your Mac. Bring your logins over
              from Chrome, Brave, Arc, 1Password and others.
            </Card>
            <Card className="md:col-span-2" icon={PictureInPicture2} title="Made for media">
              Picture in picture when you leave a playing video, a now-playing card for audio in other tabs, and
              Widevine for Netflix and Spotify.
            </Card>
            <Card className="md:col-span-2" icon={Gauge} title="Light on your Mac">
              Memory Saver unloads tabs you haven&apos;t looked at in hours, the way Chrome does. Every window comes back
              where you left it.
            </Card>
            <Card className="md:col-span-6" icon={Sparkles} title="On-device intelligence">
              On Macs with Apple Intelligence: summarise a page or ask it questions, translate it in place, search your
              history by what you remember, and tidy a messy space into folders. Nothing leaves your computer.
            </Card>
          </div>
        </section>

        {/* Privacy */}
        <section id="privacy" className="relative scroll-mt-20 py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_60%_at_15%_50%,rgba(95,134,245,0.14),transparent_70%)]"
          />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div>
              <p className="text-sm font-medium text-[#9db4ff]">Privacy</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-zinc-50 md:text-5xl">
                Private by default, not by settings.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-zinc-400">
                Every protection is on out of the box. If a site needs one off, switch it off for that site alone from
                the lock in the address bar. Private windows leave nothing behind when they close.
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {protections.map(({ icon: Icon, title: name, text }) => (
                <li key={name} className="flex gap-3.5 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#9db4ff]" strokeWidth={1.8} />
                  <div>
                    <div className="font-medium text-zinc-100">{name}</div>
                    <div className="mt-1 text-sm leading-relaxed text-zinc-500">{text}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Make it yours */}
        <section id="make-it-yours" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
          <div className="grid gap-10 rounded-[32px] border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-transparent p-8 md:grid-cols-2 md:items-center md:p-12">
            <div>
              <p className="text-sm font-medium text-[#9db4ff]">Make it yours</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-zinc-50 md:text-4xl">
                No Chromium to compile.
              </h2>
              <p className="mt-4 leading-relaxed text-zinc-400">
                Most browsers worth customising are Chromium forks: tens of gigabytes of source and hours of building
                before you change a pixel. Zepper&apos;s Chromium comes prebuilt, and everything you see, the sidebar,
                command bar, settings and themes, is TypeScript, React and CSS. A fresh fork runs in minutes.
              </p>
              <ul className="mt-6 space-y-2.5 text-zinc-300">
                {[
                  "Rebrand it with your own name, icon and colours",
                  "Change the defaults: search engine, themes, settings",
                  "Reshape the sidebar, or add panels and shortcuts",
                  "Bring your own filter lists",
                ].map((idea) => (
                  <li key={idea} className="flex items-start gap-2.5">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-[#9db4ff]" />
                    {idea}
                  </li>
                ))}
              </ul>
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0e15] shadow-2xl">
              <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                <span className="ml-2 text-xs text-zinc-500">Terminal</span>
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-[0.85rem] leading-7 text-zinc-300">
                <span className="text-zinc-500"># Fork on GitHub, then:</span>
                {"\n"}
                <span className="text-[#9db4ff]">git</span> clone github.com/you/zepper-browser
                {"\n"}
                <span className="text-[#9db4ff]">cd</span> zepper-browser
                {"\n"}
                <span className="text-[#9db4ff]">npm</span> install
                {"\n"}
                <span className="text-[#9db4ff]">npm</span> run dev
                {"\n"}
                <span className="text-emerald-400">✓</span> <span className="text-zinc-500">Zepper is running. Edit, save, see it.</span>
              </pre>
            </div>
          </div>
        </section>

        {/* Download */}
        <section id="download" className="relative scroll-mt-20 px-5 pb-28 pt-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[520px] bg-[radial-gradient(50%_60%_at_50%_100%,rgba(95,134,245,0.28),transparent_70%)]"
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <Image
              src="/zepper/icon@2x.png"
              alt=""
              width={88}
              height={88}
              className="mx-auto drop-shadow-[0_14px_32px_rgba(95,134,245,0.45)]"
            />
            <h2 className="mt-7 text-4xl font-semibold tracking-[-0.03em] text-zinc-50 md:text-5xl">Try Zepper.</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-400">
              Free, open source and updated automatically. A short setup brings over your history and passwords from
              the browser you use now.
            </p>
            <a
              href={release.downloadUrl}
              className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-[#5f86f5] px-7 py-4 font-medium text-white shadow-[0_12px_40px_-10px_rgba(95,134,245,0.9)] transition hover:bg-[#6f93f7]"
            >
              <Download className="h-5 w-5" />
              Download for Mac
            </a>
            <p className="mt-4 text-sm text-zinc-500">
              {versionLabel} · Apple silicon · macOS 14 or later
            </p>

            <ol className="mx-auto mt-12 grid max-w-3xl gap-3 text-left sm:grid-cols-3">
              {[
                ["Install", "Open the .dmg and drag Zepper into Applications."],
                [
                  "Open it once",
                  "Zepper isn't notarized yet: in System Settings › Privacy & Security, click Open Anyway. Only the first time.",
                ],
                ["Move in", "Bring over your history and passwords, pick a look, and you're set."],
              ].map(([step, text], i) => (
                <li key={step} className="rounded-2xl border border-white/[0.08] bg-[#06080d]/60 p-5 backdrop-blur">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[#5f86f5]/15 text-sm font-semibold text-[#9db4ff]">
                    {i + 1}
                  </span>
                  <div className="mt-3 font-medium text-zinc-100">{step}</div>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-500">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2.5">
            <Image src="/zepper/icon.png" alt="" width={22} height={22} className="rounded-md" />
            <span>
              Zepper is free software under the GPL-3.0. Made by{" "}
              <Link href="/" className="text-zinc-300 hover:text-white">
                Dewan Shakil Akhtar
              </Link>
              .
            </span>
          </div>
          <div className="flex gap-5">
            <a href={repoUrl} className="hover:text-zinc-200">
              GitHub
            </a>
            <a href={releasesUrl} className="hover:text-zinc-200">
              Releases
            </a>
            <a href={`${repoUrl}/blob/main/CHANGELOG.md`} className="hover:text-zinc-200">
              Changelog
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
