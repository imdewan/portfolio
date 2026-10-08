import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Bricolage_Grotesque, Caveat, Instrument_Serif } from "next/font/google";
import {
  Apple,
  Camera,
  Clapperboard,
  FolderTree,
  Gauge,
  KeyRound,
  Languages,
  PictureInPicture2,
  Puzzle,
  RotateCcw,
  SquareStack,
} from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { GithubIcon } from "@/components/icons";
import { siteUrl } from "@/lib/site";
import { Arrow, Sparkle, Squiggle, Stamp, Tick, Wave } from "./art";
import { LoopVideo } from "./LoopVideo";
import { latestRelease, releasesUrl, repoUrl } from "./release";
import styles from "./zepper.module.css";

// The download button follows the latest release: the page is rebuilt at most hourly.
export const revalidate = 3600;

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", axes: ["opsz", "wdth"] });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif" });
const hand = Caveat({ subsets: ["latin"], variable: "--font-hand" });

const BLUE = "#2747d6";
const NAVY = "#141b4d";
const CREAM = "#fbf4e4";

const title = "Zepper · A private browser for your Mac";
const description =
  "Zepper is a free, open-source browser for macOS: Spaces, a sidebar built for tabs, split view and privacy protections that are on from the first page. Built on Chromium, made to be changed.";

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
    images: [{ url: "/zepper/og.png", width: 1200, height: 630, alt: "Zepper: tabs in their place, trackers out of it" }],
  },
  twitter: { card: "summary_large_image", creator: "@mrdsa04", title, description, images: ["/zepper/og.png"] },
};

const strip = [
  "Spaces",
  "Split view",
  "Essentials",
  "Ad blocking",
  "Passkeys",
  "Picture in picture",
  "Command bar",
  "Bangs",
  "Memory Saver",
  "Chrome extensions",
  "Netflix & Spotify",
  "Secure DNS",
];

const protections = [
  ["Ads and trackers", "uBlock Origin's lists, YouTube ads included"],
  ["Cookie banners", "Hidden before they get in the way"],
  ["Fingerprinting", "A little noise on canvas, WebGL and audio, per site"],
  ["Cross-site cookies", "Embedded third parties can't follow you"],
  ["HTTPS upgrades", "Plain-HTTP pages load securely when they can"],
  ["Clean links", "fbclid, gclid and AMP wrappers, gone"],
  ["Secure DNS", "DNS over HTTPS through Cloudflare, Quad9 or Google"],
  ["Global Privacy Control", "Asks every site not to sell your data"],
];

const more = [
  { icon: SquareStack, color: "#ffd166", title: "Essentials", text: "Your most-used sites a click away, signed in with each space's accounts." },
  { icon: FolderTree, color: "#b9d8ff", title: "Pinned tabs and folders", text: "Tabs that stay, sorted into folders you can nest." },
  { icon: KeyRound, color: "#ffb4a2", title: "Passwords and passkeys", text: "Built in, encrypted on your Mac, unlocked with Touch ID." },
  { icon: PictureInPicture2, color: "#c7f0d8", title: "Picture in picture", text: "Leave a playing video and it follows you." },
  { icon: Clapperboard, color: "#e3d4ff", title: "Netflix and Spotify", text: "Widevine for streaming, whenever you want it." },
  { icon: Gauge, color: "#ffd166", title: "Memory Saver", text: "Tabs you haven't looked at in hours give their memory back." },
  { icon: Puzzle, color: "#b9d8ff", title: "Chrome extensions", text: "Straight from the Chrome Web Store." },
  { icon: Camera, color: "#ffb4a2", title: "Captures", text: "⇧⌘2: an element, a region or the whole page, copied." },
  { icon: Languages, color: "#c7f0d8", title: "Translate and summarise", text: "On Macs with Apple Intelligence, without leaving your computer." },
  { icon: RotateCcw, color: "#e3d4ff", title: "Right where you left it", text: "Every window, space and tab comes back when you reopen Zepper." },
];

const spaceCards = [
  { name: "Personal", emoji: "🌸", from: "#c4bfdc", via: "#e2cdd3", to: "#f0dfd0", ink: "#3b3550", tilt: "-7deg", x: "0%", y: "6%", tabs: ["Hacker News", "The Verge", "Aurora · Wikipedia"] },
  { name: "Work", emoji: "💼", from: "#3fb6a8", via: "#4f7fe0", to: "#8a5cf0", ink: "#ffffff", tilt: "2deg", x: "26%", y: "0%", tabs: ["electron/electron", "Next.js", "Tailwind CSS"] },
  { name: "Reading", emoji: "📚", from: "#e07a2d", via: "#e9963a", to: "#f2b134", ink: "#3a1d05", tilt: "9deg", x: "52%", y: "10%", tabs: ["Mount Fuji", "National Geographic", "Northern Lights"] },
];

/** A recording in a print frame, a little crooked. */
function Print({
  name,
  label,
  tilt = "-1.2deg",
  width = 1920,
  height = 1242,
  className = "",
}: {
  name: string;
  label: string;
  tilt?: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <div
      className={`${styles.print} rounded-[26px] bg-[#fffaf0] p-2 shadow-[0_40px_80px_-30px_rgba(20,24,58,0.55),0_0_0_1px_rgba(20,24,58,0.06)] md:p-2.5 ${className}`}
      style={{ transform: `rotate(${tilt})` }}
    >
      <LoopVideo
        src={`/zepper/video/${name}.mp4`}
        poster={`/zepper/video/${name}.jpg`}
        width={width}
        height={height}
        label={label}
        className="block h-auto w-full rounded-[19px] bg-[#e9e3f0]"
      />
    </div>
  );
}

function Note({ children, className = "", color = "#ff7a59" }: { children: React.ReactNode; className?: string; color?: string }) {
  return (
    <p className={`${styles.hand} text-2xl leading-none md:text-[1.7rem] ${className}`} style={{ color }}>
      {children}
    </p>
  );
}

function Heading({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`${styles.display} mt-3 text-[2.6rem] font-extrabold leading-[0.95] md:text-[3.6rem] ${className}`}>{children}</h2>
  );
}

function Feature({
  note,
  title: heading,
  children,
  video,
  label,
  reverse = false,
  tilt,
}: {
  note: string;
  title: string;
  children: React.ReactNode;
  video: string;
  label: string;
  reverse?: boolean;
  tilt: string;
}) {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-[0.82fr_1.18fr] md:gap-16 md:py-24">
      <div className={reverse ? "md:order-2" : ""}>
        <Note className="-rotate-2">{note}</Note>
        <Heading className="text-[#2747d6]">{heading}</Heading>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-[#14183a]/75">{children}</p>
      </div>
      <Print name={video} label={label} tilt={tilt} className={reverse ? "md:order-1" : ""} />
    </section>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="mx-0.5 inline-flex min-w-[1.7em] items-center justify-center rounded-md border border-[#14183a]/20 bg-white px-1.5 py-px font-sans text-[0.85em] font-semibold text-[#14183a] shadow-[0_2px_0_rgba(20,24,58,0.18)]">
      {children}
    </kbd>
  );
}

function DownloadButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2.5 rounded-full border-2 border-[#14183a] bg-[#ffd166] px-7 py-3.5 text-[1.02rem] font-bold text-[#14183a] shadow-[4px_5px_0_#14183a] transition-all hover:-translate-y-0.5 hover:shadow-[5px_7px_0_#14183a] active:translate-y-0.5 active:shadow-[2px_2px_0_#14183a]"
    >
      <Apple className="h-5 w-5 -translate-y-px" fill="currentColor" strokeWidth={0} />
      Download for Mac
    </a>
  );
}

export default async function ZepperPage() {
  const release = await latestRelease();
  const meta = [release.version ? `Version ${release.version}` : null, "Apple silicon", "macOS 14 or later"].filter(Boolean).join(" · ");
  const grain = (amount: number) => ({ ["--grain" as string]: amount }) as React.CSSProperties;

  return (
    <div
      className={`${display.variable} ${serif.variable} ${hand.variable} min-h-screen overflow-x-clip bg-[#fbf4e4] font-sans text-[#14183a] selection:bg-[#ffd166] selection:text-[#14183a]`}
    >
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

      {/* Hero */}
      <section className={`${styles.grain} text-[#fbf4e4]`} style={{ background: BLUE, ...grain(0.7) }}>
        <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Link href="/zepper" className={`${styles.display} flex items-center gap-2.5 text-xl font-extrabold`}>
            <Image src="/zepper/icon.png" alt="" width={34} height={34} className={`${styles.wobble} rounded-[10px]`} priority />
            Zepper
          </Link>
          <nav className="hidden items-center gap-8 text-[0.95rem] font-medium text-[#fbf4e4]/80 md:flex" aria-label="Zepper">
            <a href="#spaces" className="hover:text-white">
              Features
            </a>
            <a href="#privacy" className="hover:text-white">
              Privacy
            </a>
            <a href="#make-it-yours" className="hover:text-white">
              Make it yours
            </a>
            <a href={repoUrl} className="flex items-center gap-1.5 hover:text-white">
              <GithubIcon className="h-4 w-4" />
              GitHub
            </a>
          </nav>
          <a
            href={release.downloadUrl}
            className="rounded-full bg-[#fbf4e4] px-4 py-2 text-sm font-bold text-[#2747d6] transition-transform hover:-translate-y-px"
          >
            Download
          </a>
        </header>

        <div className="relative mx-auto max-w-5xl px-5 pb-14 pt-14 text-center md:pt-20">
          <Stamp className="absolute right-2 top-0 hidden w-28 rotate-12 drop-shadow-[0_10px_18px_rgba(10,14,60,0.35)] md:block lg:-right-6 lg:w-32" />
          <a
            href={releasesUrl}
            className="inline-flex items-center gap-2 rounded-full bg-[#fbf4e4]/[0.12] px-3.5 py-1.5 text-sm font-medium text-[#fbf4e4]/90 ring-1 ring-[#fbf4e4]/20 transition-colors hover:bg-[#fbf4e4]/20"
          >
            <span className="rounded-full bg-[#ffd166] px-2 py-0.5 text-xs font-bold text-[#14183a]">New</span>
            {release.version ? `Zepper ${release.version} is out` : "The latest Zepper is out"}
          </a>
          <h1 className="mt-8">
            <span className={`${styles.display} block text-[3.4rem] font-extrabold leading-[0.9] sm:text-7xl md:text-[6.6rem]`}>
              Tabs in their place.
            </span>
            <span className={`${styles.serif} relative mt-1 inline-block text-[3.4rem] leading-[0.95] text-[#fff6dc] sm:text-[4.6rem] md:text-[7rem]`}>
              Trackers <br className="sm:hidden" />
              out of it.
              <Squiggle className="absolute -bottom-3 left-[46%] h-5 w-[52%] md:-bottom-4 md:h-7" />
            </span>
          </h1>
          <p className="mx-auto mt-9 max-w-xl text-lg leading-relaxed text-[#fbf4e4]/80 md:text-xl">
            A free, open-source browser for your Mac, with Spaces, a sidebar built for tabs, and privacy that&apos;s on
            from the very first page.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <DownloadButton href={release.downloadUrl} />
            <a href={repoUrl} className="flex items-center gap-2 font-semibold text-[#fbf4e4] underline-offset-4 hover:underline">
              <GithubIcon className="h-5 w-5" />
              or read the source
            </a>
          </div>
          <p className="mt-6 text-sm text-[#fbf4e4]/60">{meta}</p>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pb-20 md:px-5 md:pb-28">
          <div className="pointer-events-none absolute -left-32 top-10 z-10 hidden w-36 -rotate-6 xl:block">
            <Note color="#ffd166" className="text-center">
              three spaces,
              <br />
              one window
            </Note>
            <Arrow className="ml-16 mt-1 h-16 w-24" />
          </div>
          <Print name="spaces" label="Switching between three spaces in Zepper, each with its own colours and tabs" tilt="-1deg" />
        </div>
      </section>

      {/* Strip of features */}
      <div style={{ background: BLUE }}>
        <Wave color={CREAM} />
      </div>
      <div className={`${styles.marqueeTrack} overflow-hidden border-b-2 border-dashed border-[#14183a]/15 py-5`}>
        <div className={styles.marquee}>
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {strip.map((item) => (
                <span key={item} className={`${styles.display} flex items-center whitespace-nowrap text-2xl font-bold text-[#2747d6] md:text-3xl`}>
                  <span className="px-6">{item}</span>
                  <Sparkle className="h-5 w-5 text-[#ff7a59]" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <main>
        {/* Spaces */}
        <section id="spaces" className="mx-auto grid max-w-6xl scroll-mt-6 items-center gap-12 px-5 py-20 md:grid-cols-2 md:py-28">
          <div>
            <Note className="-rotate-2">for work, for you, for later</Note>
            <Heading className="text-[#2747d6]">A space for every side of you.</Heading>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-[#14183a]/75">
              Each space keeps its own colours, pinned tabs and Essentials, and if you like, its own sign-ins, kept apart
              like separate profiles. Swipe between them on the trackpad, or press <Kbd>⌃1</Kbd>
              <Kbd>⌃2</Kbd>
              <Kbd>⌃3</Kbd>.
            </p>
          </div>
          <div className="relative mx-auto h-[330px] w-full max-w-[520px] md:h-[380px]" aria-hidden>
            {spaceCards.map((card) => (
              <div
                key={card.name}
                className="absolute w-[46%] rounded-[28px] p-4 shadow-[0_24px_50px_-20px_rgba(20,24,58,0.55)] ring-1 ring-black/5 transition-transform duration-500 hover:z-10"
                style={{
                  left: card.x,
                  top: card.y,
                  transform: `rotate(${card.tilt})`,
                  background: `linear-gradient(150deg, ${card.from}, ${card.via} 55%, ${card.to})`,
                  color: card.ink,
                }}
              >
                <div className="flex items-center gap-2 text-sm font-bold">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/35 text-base">{card.emoji}</span>
                  {card.name}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-9 rounded-xl bg-white/30" />
                  ))}
                </div>
                <div className="mt-3 space-y-1.5">
                  {card.tabs.map((tab, i) => (
                    <div key={tab} className={`flex items-center gap-2 rounded-xl px-2.5 py-2 text-[0.78rem] font-medium ${i === 2 ? "bg-white/55" : ""}`}>
                      <span className="h-3.5 w-3.5 shrink-0 rounded-[5px] bg-current opacity-40" />
                      <span className="truncate">{tab}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <Feature
          note="press ⌘T"
          title="Find anything. Go anywhere."
          video="command"
          label="Typing a bang in Zepper's command bar and landing on the Wikipedia article"
          tilt="1.2deg"
        >
          One bar for the web, your history and the tabs you already have open. Bangs like <Kbd>!w</Kbd>,{" "}
          <Kbd>!yt</Kbd> and <Kbd>!gh</Kbd> skip the search page and go straight to the site.
        </Feature>

        <Feature
          note="⌥⌘V, ⌥⌘H, ⌥⌘G"
          title="Two pages, one window."
          video="split"
          label="Splitting two tabs side by side, then stacked, in Zepper"
          reverse
          tilt="-1.4deg"
        >
          Side by side, stacked, or a grid of four, with dividers you can drag. Read the docs while you write the code, then
          put it all back with <Kbd>⌥⌘U</Kbd>.
        </Feature>

        <Feature
          note="press ⌘S"
          title="Out of the way, until you reach for it."
          video="compact"
          label="Compact mode hiding Zepper's sidebar, which floats back in at the window's edge"
          tilt="1deg"
        >
          Compact mode gives the whole window to the page. Push the pointer to the edge and the sidebar floats back in, then
          tucks itself away again.
        </Feature>

        <section className="mx-auto grid max-w-6xl gap-12 px-5 pb-24 pt-8 md:grid-cols-2 md:gap-10">
          <div>
            <Print name="swipe" label="A two-finger swipe going back a page in Zepper" tilt="-1.6deg" />
            <h3 className={`${styles.display} mt-8 text-3xl font-extrabold text-[#2747d6]`}>Back with a swipe.</h3>
            <p className="mt-2 max-w-sm text-[#14183a]/75">
              Two fingers on the trackpad, and an arrow that fills up as you go, so you know when letting go will.
            </p>
          </div>
          <div className="md:mt-16">
            <Print name="links" label="Pointing at links in Zepper shows where they go, in the corner of the page" tilt="1.4deg" width={1600} height={1036} />
            <h3 className={`${styles.display} mt-8 text-3xl font-extrabold text-[#2747d6]`}>Know where a link goes.</h3>
            <p className="mt-2 max-w-sm text-[#14183a]/75">
              Point at one and its address shows in the corner, the site in bold, before you&apos;ve clicked anything.
            </p>
          </div>
        </section>

        {/* Privacy */}
        <Wave color={NAVY} />
        <section id="privacy" className={`${styles.grain} scroll-mt-4 text-[#fbf4e4]`} style={{ background: NAVY, ...grain(0.45) }}>
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-24 md:grid-cols-[1.05fr_0.95fr] md:py-32">
            <div>
              <Note color="#ffd166" className="-rotate-2">
                nothing to set up
              </Note>
              <Heading className="md:text-[3.8rem]">
                Private before you <span className={`${styles.serif} text-[1.08em] font-normal text-[#ffd166]`}>change a thing.</span>
              </Heading>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-[#fbf4e4]/75">
                Every protection is on from the start. If a site ever needs one off, the lock in the address bar switches it
                off for that site alone. Private windows leave nothing behind.
              </p>
              <ul className="mt-9 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {protections.map(([name, text]) => (
                  <li key={name} className="flex gap-3">
                    <Tick className="mt-0.5 h-6 w-6 shrink-0" />
                    <div>
                      <div className="font-semibold">{name}</div>
                      <div className="mt-0.5 text-sm leading-relaxed text-[#fbf4e4]/60">{text}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <Print
                name="privacy"
                label="Zepper's site panel: the certificate, protections with 11 trackers blocked, and permissions"
                tilt="1.6deg"
                width={1600}
                height={1088}
              />
              <div className="absolute -bottom-12 right-4 hidden rotate-[-4deg] md:block">
                <Note color="#ffd166">11 trackers, gone</Note>
              </div>
            </div>
          </div>
        </section>
        <Wave color={NAVY} flip />

        {/* Everything else */}
        <section className="mx-auto max-w-6xl px-5 py-24 md:py-28">
          <div className="max-w-2xl">
            <Note className="-rotate-2">and the rest of it</Note>
            <Heading className="text-[#2747d6]">
              Everything you&apos;d expect, <span className={`${styles.serif} font-normal`}>already there.</span>
            </Heading>
          </div>
          <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {more.map(({ icon: Icon, color, title: name, text }, i) => (
              <div key={name} className="flex gap-4">
                <span
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-2 border-[#14183a] shadow-[3px_3px_0_#14183a]"
                  style={{ background: color, transform: `rotate(${(i % 3) * 3 - 3}deg)` }}
                >
                  <Icon className="h-[22px] w-[22px] text-[#14183a]" strokeWidth={2} />
                </span>
                <div>
                  <h3 className="text-lg font-bold">{name}</h3>
                  <p className="mt-1 leading-relaxed text-[#14183a]/70">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Make it yours */}
        <section id="make-it-yours" className="mx-auto max-w-6xl scroll-mt-6 px-5 pb-28">
          <div className={`${styles.grain} overflow-hidden rounded-[36px] bg-[#14183a] text-[#fbf4e4]`} style={grain(0.35)}>
            <div className="grid items-center gap-12 p-8 md:grid-cols-2 md:p-14">
              <div>
                <Note color="#ffd166" className="-rotate-2">
                  for the tinkerers
                </Note>
                <Heading className="md:text-[3.2rem]">
                  No Chromium <span className={`${styles.serif} font-normal text-[#ffd166]`}>to compile.</span>
                </Heading>
                <p className="mt-5 leading-relaxed text-[#fbf4e4]/75">
                  Most browsers worth changing are Chromium forks: tens of gigabytes of source and hours of building before you
                  move a pixel. Zepper&apos;s Chromium comes prebuilt, and everything you see is TypeScript, React and CSS. A
                  fork runs in minutes, and your changes show the moment you save.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["Rebrand it", "Change the defaults", "Reshape the sidebar", "Bring your own filter lists"].map((idea) => (
                    <span key={idea} className="rounded-full border border-[#fbf4e4]/25 px-3.5 py-1.5 text-sm text-[#fbf4e4]/85">
                      {idea}
                    </span>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="rotate-[1.5deg] overflow-hidden rounded-2xl bg-[#0b0d1f] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
                  <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-3">
                    <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                    <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                    <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                  </div>
                  <pre className="overflow-x-auto p-5 font-mono text-[0.86rem] leading-7 text-[#fbf4e4]/85">
                    <span className="text-[#fbf4e4]/40"># fork it on GitHub, then</span>
                    {"\n"}
                    <span className="text-[#ffd166]">git</span> clone github.com/you/zepper-browser
                    {"\n"}
                    <span className="text-[#ffd166]">cd</span> zepper-browser
                    {"\n"}
                    <span className="text-[#ffd166]">npm</span> install
                    {"\n"}
                    <span className="text-[#ffd166]">npm</span> run dev
                    {"\n"}
                    <span className="text-[#7ee2a8]">✓</span> <span className="text-[#fbf4e4]/50">your Zepper is running</span>
                  </pre>
                </div>
                <div className="absolute -top-10 right-2 hidden rotate-6 md:block">
                  <Note color="#ffd166">it&apos;s just React</Note>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Download */}
      <div className="bg-[#fbf4e4]">
        <Wave color={BLUE} />
      </div>
      <section id="download" className={`${styles.grain} text-center text-[#fbf4e4]`} style={{ background: BLUE, ...grain(0.7) }}>
        <div className="mx-auto max-w-3xl px-5 py-24 md:py-32">
          <Image
            src="/zepper/icon@2x.png"
            alt=""
            width={104}
            height={104}
            className={`${styles.wobble} mx-auto drop-shadow-[0_16px_30px_rgba(10,14,60,0.45)]`}
          />
          <h2 className={`${styles.display} mt-8 text-[3rem] font-extrabold leading-[0.92] md:text-[5rem]`}>
            Give your tabs <span className={`${styles.serif} font-normal text-[#fff6dc]`}>a home.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-lg text-[#fbf4e4]/80">
            Free, open source and updated on its own. Bring your history and passwords over from the browser you use now, in
            about a minute.
          </p>
          <div className="mt-10 flex justify-center">
            <DownloadButton href={release.downloadUrl} />
          </div>
          <p className="mt-6 text-sm text-[#fbf4e4]/60">{meta}</p>
          <ol className="mx-auto mt-14 grid max-w-3xl gap-4 text-left sm:grid-cols-3">
            {[
              ["Drag it in", "Open the .dmg and drag Zepper into Applications."],
              ["Open it once", "It isn't notarized yet: in System Settings › Privacy & Security, click Open Anyway. Just the first time."],
              ["Move in", "Bring over your history and passwords, pick your colours, and you're home."],
            ].map(([step, text], i) => (
              <li
                key={step}
                className="rounded-3xl bg-[#fbf4e4] p-5 text-[#14183a] shadow-[0_20px_40px_-24px_rgba(10,14,60,0.8)]"
                style={{ transform: `rotate(${[-1.5, 1, -0.5][i]}deg)` }}
              >
                <span className={`${styles.hand} text-3xl text-[#ff7a59]`}>{i + 1}.</span>
                <div className="mt-1 font-bold">{step}</div>
                <p className="mt-1 text-sm leading-relaxed text-[#14183a]/70">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="text-[#fbf4e4]/60" style={{ background: NAVY }}>
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2.5">
            <Image src="/zepper/icon.png" alt="" width={24} height={24} className="rounded-md" />
            <span>
              Free software under the GPL-3.0, made by{" "}
              <Link href="/" className="font-semibold text-[#fbf4e4] hover:underline">
                Dewan Shakil Akhtar
              </Link>
              .
            </span>
          </div>
          <div className="flex flex-wrap gap-5">
            <a href={repoUrl} className="hover:text-[#fbf4e4]">
              GitHub
            </a>
            <a href={releasesUrl} className="hover:text-[#fbf4e4]">
              Releases
            </a>
            <a href={`${repoUrl}/blob/main/CHANGELOG.md`} className="hover:text-[#fbf4e4]">
              Changelog
            </a>
            <a href={`${repoUrl}/issues`} className="hover:text-[#fbf4e4]">
              Report a bug
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
