import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Bricolage_Grotesque, Instrument_Serif } from "next/font/google";
import {
  ArrowRight,
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
import { AppleLogo, Check, Sparkle, Wave } from "./art";
import { LoopVideo } from "./LoopVideo";
import { MacDownload } from "./MacDownload";
import { latestRelease, releasesUrl, repoUrl } from "./release";
import styles from "./zepper.module.css";

// The version shown follows the latest release (checked every few minutes); the buttons go through
// /zepper/download, which finds the newest .dmg when you click (the Intel one on an Intel Mac).
export const revalidate = 300;
const DOWNLOAD = "/zepper/download";
const DOWNLOAD_INTEL = "/zepper/download?mac=intel";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", axes: ["opsz", "wdth"] });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif" });

const NAVY = "#18245f";
const DEEP = "#0e1538";
/** A macOS window's corners (12pt on a 1280×800 window), so a bare window keeps its shape at any size. */
const WINDOW_CORNERS = "0.95% / 1.52%";

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
    images: [{ url: "/zepper/og-navy.png", width: 1200, height: 630, alt: "Zepper: tabs in their place, trackers out of it" }],
  },
  twitter: { card: "summary_large_image", creator: "@mrdsa04", title, description, images: ["/zepper/og-navy.png"] },
};

const strip = [
  "Spaces",
  "Split view",
  "Essentials",
  "Ad and tracker blocking",
  "Passkeys",
  "Picture in picture",
  "Command bar",
  "Bangs",
  "Memory Saver",
  "Chrome extensions",
  "Widevine support",
  "Secure DNS",
];

/** `intel`: the latest release has a build for Intel Macs too. */
const facts = (intel: boolean) => [
  ["Free and open source", "GPL-3.0, no account needed"],
  ["Built on Chromium", "Sites work as they do in Chrome"],
  intel ? ["Apple silicon and Intel", "Native on both, macOS 14 or later"] : ["Native on Apple silicon", "macOS 14 or later"],
  ["Updates itself", "Quietly, in the background"],
];

const protections = [
  ["Ads and trackers", "uBlock Origin's filter lists, YouTube ads included"],
  ["Cookie banners", "Hidden before they get in the way"],
  ["Fingerprinting", "Per-site noise on canvas, WebGL and audio"],
  ["Cross-site cookies", "Embedded third parties can't follow you"],
  ["HTTPS upgrades", "Plain-HTTP pages load securely when they can"],
  ["Clean links", "fbclid, gclid and AMP wrappers removed"],
  ["Secure DNS", "DNS over HTTPS via Cloudflare, Quad9 or Google"],
  ["Global Privacy Control", "Asks every site not to sell your data"],
];

const more = [
  { icon: SquareStack, title: "Essentials", text: "Your most-used sites a click away, signed in with each space's accounts." },
  { icon: FolderTree, title: "Pinned tabs and folders", text: "Tabs that stay, sorted into folders you can nest." },
  { icon: KeyRound, title: "Passwords and passkeys", text: "Built in, encrypted on your Mac, unlocked with Touch ID." },
  { icon: PictureInPicture2, title: "Picture in picture", text: "Leave a playing video and it comes with you." },
  { icon: Clapperboard, title: "Widevine support", text: "Protected video and music from streaming sites, whenever you turn it on." },
  { icon: Gauge, title: "Memory Saver", text: "Tabs you haven't looked at in hours give their memory back." },
  { icon: Puzzle, title: "Chrome extensions", text: "Install them straight from the Chrome Web Store." },
  { icon: Camera, title: "Captures", text: "⇧⌘2 copies an element, a region or the whole page." },
  { icon: Languages, title: "Translate and summarise", text: "On Macs with Apple Intelligence, without leaving your computer." },
  { icon: RotateCcw, title: "Right where you left it", text: "Every window, space and tab comes back when you reopen Zepper." },
];

const faq = (intel: boolean) => [
  ["Is Zepper free?", "Yes. It's free and open source under the GPL-3.0. There's no account to make and nothing to pay for."],
  [
    "Which Macs does it run on?",
    intel
      ? "Any Mac on macOS 14 or later, with Apple silicon or Intel: the download button gets the right one for yours. Translate and summarise use Apple Intelligence, so they need a Mac with Apple silicon."
      : "Macs with Apple silicon, on macOS 14 or later.",
  ],
  [
    "Why does macOS stop it the first time?",
    "Zepper isn't notarized by Apple yet. The first time you open it, go to System Settings › Privacy & Security and click Open Anyway. After that it opens like any other app, and updates install themselves.",
  ],
  [
    "Can I bring my history and passwords?",
    "Yes. A short setup on first launch brings them over from Chrome, Brave, Edge, Arc, Firefox, Safari and others, or from 1Password and Bitwarden exports.",
  ],
  ["Do Chrome extensions work?", "Yes. Install them from the Chrome Web Store, as you would in Chrome."],
  ["Do streaming sites work?", "Yes. Zepper has Widevine support: turn it on in Settings › Media, or accept the prompt when a streaming site asks for it."],
];

const spaceShots = [
  { src: "/zepper/space-personal.webp", name: "Personal", left: "0%", top: "0%" },
  { src: "/zepper/space-work.webp", name: "Work", left: "11%", top: "13%" },
  { src: "/zepper/space-reading.webp", name: "Reading", left: "22%", top: "26%" },
];

/** A recording over the screenshot's soft backdrop, in a plain frame. */
function Clip({
  name,
  label,
  width = 1920,
  height = 1242,
  className = "",
}: {
  name: string;
  label: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <div className={`rounded-[22px] bg-white p-1.5 shadow-[0_30px_70px_-30px_rgba(17,22,51,0.45)] ring-1 ring-[#111633]/[0.06] md:p-2 ${className}`}>
      <LoopVideo
        src={`/zepper/video/${name}.mp4`}
        poster={`/zepper/video/${name}.jpg`}
        width={width}
        height={height}
        label={label}
        className="block h-auto w-full rounded-[16px] bg-[#e7e3ee]"
      />
    </div>
  );
}

/** A recording of just the window, its corners and shadow drawn by the page. */
function WindowClip({ name, label, width, height, corners = WINDOW_CORNERS }: { name: string; label: string; width: number; height: number; corners?: string }) {
  return (
    <LoopVideo
      src={`/zepper/video/${name}.mp4`}
      poster={`/zepper/video/${name}.jpg`}
      width={width}
      height={height}
      label={label}
      className="block h-auto w-full bg-[#d9d6e4] shadow-[0_50px_120px_-30px_rgba(5,8,30,0.75),0_0_0_1px_rgba(0,0,0,0.25)]"
      style={{ borderRadius: corners }}
    />
  );
}

function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p className={`flex flex-wrap items-center gap-2.5 text-[0.78rem] font-semibold uppercase tracking-[0.14em] ${dark ? "text-[#a9bcff]" : "text-[#3a5bd9]"}`}>
      {children}
    </p>
  );
}

function Kbd({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <kbd
      className={`inline-flex min-w-[1.7em] items-center justify-center rounded-md px-1.5 py-px font-sans text-[0.82em] font-semibold normal-case tracking-normal ${
        dark ? "bg-white/10 text-[#e6ebff] ring-1 ring-white/15" : "bg-white text-[#18245f] shadow-[0_1px_0_rgba(17,22,51,0.15)] ring-1 ring-[#111633]/15"
      }`}
    >
      {children}
    </kbd>
  );
}

function Heading({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`${styles.display} mt-4 text-[2.4rem] font-bold leading-[1.02] md:text-[3.2rem] ${className}`}>{children}</h2>;
}

function Feature({
  eyebrow,
  keys,
  title: heading,
  children,
  video,
  label,
  reverse = false,
}: {
  eyebrow: string;
  keys?: string[];
  title: string;
  children: React.ReactNode;
  video: string;
  label: string;
  reverse?: boolean;
}) {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:py-20">
      <div className={reverse ? "md:order-2" : ""}>
        <Eyebrow>
          {eyebrow}
          {keys?.map((k) => (
            <Kbd key={k}>{k}</Kbd>
          ))}
        </Eyebrow>
        <Heading className="text-[#18245f]">{heading}</Heading>
        <p className="mt-5 max-w-md text-[1.07rem] leading-relaxed text-[#111633]/70">{children}</p>
      </div>
      <Clip name={video} label={label} className={reverse ? "md:order-1" : ""} />
    </section>
  );
}

function DownloadButton({ intel }: { intel: boolean }) {
  return (
    <MacDownload
      href={DOWNLOAD}
      intelHref={intel ? DOWNLOAD_INTEL : null}
      className="inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3.5 text-[1rem] font-semibold text-[#18245f] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] transition hover:bg-[#eef1ff]"
    >
      <AppleLogo className="h-[18px] w-[18px] -translate-y-px" />
      Download for Mac
    </MacDownload>
  );
}

/** The other build, for when the button guessed wrong (or you're downloading for another Mac). */
function OtherMacs({ className }: { className: string }) {
  return (
    <span className={className}>
      Also for{" "}
      <a href={DOWNLOAD_INTEL} className="underline underline-offset-4 hover:text-white">
        Intel Macs
      </a>{" "}
      and{" "}
      <a href={DOWNLOAD} className="underline underline-offset-4 hover:text-white">
        Apple silicon
      </a>
    </span>
  );
}

export default async function ZepperPage() {
  const release = await latestRelease();
  const intel = release.intelUrl !== null;
  const macs = intel ? "Apple silicon and Intel" : "Apple silicon";
  const meta = [release.version ? `Version ${release.version}` : null, macs, "macOS 14 or later"].filter(Boolean).join(" · ");
  const grain = (amount: number) => ({ ["--grain" as string]: amount }) as React.CSSProperties;
  // How far the hero's window reaches up into the navy (the rest sits on the cream below).
  const overlap = "clamp(170px, 28vw, 400px)";

  return (
    <div
      className={`${display.variable} ${serif.variable} min-h-screen overflow-x-clip bg-[#f5f2ea] font-sans text-[#111633] selection:bg-[#c9d4ff] selection:text-[#111633]`}
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
      <section className={`${styles.grainDark} text-white`} style={{ background: NAVY, ...grain(0.18) }}>
        <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Link href="/zepper" className={`${styles.display} flex items-center gap-2.5 text-lg font-bold`}>
            <Image src="/zepper/icon-light.png" alt="" width={34} height={34} priority />
            Zepper
          </Link>
          <nav className="hidden items-center gap-8 text-[0.92rem] text-white/70 md:flex" aria-label="Zepper">
            <a href="#features" className="transition-colors hover:text-white">
              Features
            </a>
            <a href="#privacy" className="transition-colors hover:text-white">
              Privacy
            </a>
            <a href="#developers" className="transition-colors hover:text-white">
              Developers
            </a>
            <a href="#faq" className="transition-colors hover:text-white">
              FAQ
            </a>
            <a href={repoUrl} className="flex items-center gap-1.5 transition-colors hover:text-white">
              <GithubIcon className="h-4 w-4" />
              GitHub
            </a>
          </nav>
          <MacDownload
            href={DOWNLOAD}
            intelHref={intel ? DOWNLOAD_INTEL : null}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#18245f] transition hover:bg-[#eef1ff]"
          >
            <AppleLogo className="h-3.5 w-3.5 -translate-y-px" />
            Download
          </MacDownload>
        </header>

        <div className="mx-auto max-w-4xl px-5 pb-10 pt-6 text-center md:pt-8">
          <Image
            src="/zepper/logo.png"
            alt="Zepper"
            width={469}
            height={300}
            priority
            className="mx-auto h-auto w-[132px] drop-shadow-[0_12px_28px_rgba(0,0,0,0.35)] md:w-[150px]"
          />
          <h1 className="mt-6">
            <span className={`${styles.display} block text-[2.9rem] font-bold leading-[0.98] sm:text-[4rem] md:text-[4.9rem]`}>
              Tabs in their place.
            </span>
            <span className={`${styles.serif} block text-[3.1rem] leading-[1.04] text-[#b9c8ff] sm:text-[4.3rem] md:text-[5.3rem]`}>
              Trackers out of it.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/70 md:text-[1.15rem]">
            A free, open-source browser for your Mac, with Spaces, a sidebar built for tabs, and privacy that&apos;s on from
            the very first page.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <DownloadButton intel={intel} />
            <a
              href={repoUrl}
              className="inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/[0.06] hover:ring-white/40"
            >
              <GithubIcon className="h-[18px] w-[18px]" />
              View on GitHub
            </a>
          </div>
          <p className="mt-4 text-sm text-white/60">
            {release.version ? (
              <a href={releasesUrl} className="text-white/80 underline-offset-4 hover:text-white hover:underline">
                What&apos;s new in {release.version}
              </a>
            ) : null}
            {release.version ? " · " : ""}
            {macs} · macOS 14 or later
          </p>
        </div>
        <div style={{ height: overlap }} />
      </section>

      <div className={`${styles.grain} flow-root`} style={grain(0.22)}>
        <div className="flow-root">
          {/* The window, from the navy onto the cream (inside the cream, so the grain runs beside it). */}
          <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-5" style={{ marginTop: `calc(-1 * ${overlap})` }}>
            <WindowClip name="showcase" label="Zepper in one take: Tidy sorting a messy space, the command bar opening Mount Fuji with a bang, split view, compact mode and a swipe to another space" width={1920} height={1200} />
          </div>
          <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-8 px-5 pb-16 pt-14 md:grid-cols-4 md:pt-16">
            {facts(intel).map(([fact, detail]) => (
              <div key={fact} className="border-l-2 border-[#18245f]/15 pl-4">
                <dt className="font-semibold text-[#18245f]">{fact}</dt>
                <dd className="mt-1 text-sm text-[#111633]/60">{detail}</dd>
              </div>
            ))}
          </dl>

          {/* Strip of features, a navy band with wavy edges. */}
          <div className="mt-2">
            <Wave color={NAVY} />
            <div className={`${styles.marqueeTrack} ${styles.grainDark} overflow-hidden py-5`} style={{ background: NAVY, ...grain(0.16) }}>
              <div className={styles.marquee}>
                {[0, 1].map((copy) => (
                  <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
                    {strip.map((item) => (
                      <span key={item} className={`${styles.display} flex items-center whitespace-nowrap text-xl font-semibold text-white/90 md:text-2xl`}>
                        <span className="px-6">{item}</span>
                        <Sparkle className="h-3.5 w-3.5 text-[#9fb6ff]" />
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <Wave color={NAVY} flip />
          </div>

          <main>
            {/* Spaces */}
            <section id="features" className="mx-auto grid max-w-6xl scroll-mt-6 items-center gap-12 px-5 py-20 md:grid-cols-[0.75fr_1.25fr] md:py-28">
              <div>
                <Eyebrow>
                  Spaces <Kbd>⌃1</Kbd>
                  <Kbd>⌃2</Kbd>
                  <Kbd>⌃3</Kbd>
                </Eyebrow>
                <Heading className="text-[#18245f]">A space for every side of you.</Heading>
                <p className="mt-5 max-w-md text-[1.07rem] leading-relaxed text-[#111633]/70">
                  Each space keeps its own colours, pinned tabs and Essentials, and if you like, its own sign-ins, kept apart
                  like separate profiles. Swipe between them on the trackpad, or switch with a shortcut.
                </p>
                <ul className="mt-7 flex flex-wrap gap-2 text-sm">
                  {spaceShots.map((shot) => (
                    <li key={shot.name} className="rounded-full bg-white px-3.5 py-1.5 font-medium text-[#18245f] ring-1 ring-[#111633]/10">
                      {shot.name}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative aspect-[1.4] w-full">
                {spaceShots.map((shot) => (
                  <Image
                    key={shot.name}
                    src={shot.src}
                    alt={`Zepper's ${shot.name} space, with its own colours and tabs`}
                    width={2560}
                    height={1600}
                    sizes="(min-width: 1152px) 560px, 70vw"
                    className="absolute w-[78%] shadow-[0_30px_60px_-25px_rgba(17,22,51,0.55),0_0_0_1px_rgba(0,0,0,0.12)]"
                    style={{ left: shot.left, top: shot.top, borderRadius: WINDOW_CORNERS }}
                  />
                ))}
              </div>
            </section>

            <Feature
              eyebrow="Command bar"
              keys={["⌘T"]}
              title="Find anything. Go anywhere."
              video="command"
              label="Typing a bang in Zepper's command bar and landing on the Wikipedia article"
            >
              One bar for the web, your history and the tabs you already have open. Bangs like <Kbd>!w</Kbd> <Kbd>!yt</Kbd>{" "}
              <Kbd>!gh</Kbd> skip the search page and go straight to the site.
            </Feature>

            <Feature
              eyebrow="Split view"
              keys={["⌥⌘V"]}
              title="Two pages, one window."
              video="split"
              label="Splitting two tabs side by side, then stacked, in Zepper"
              reverse
            >
              Side by side, stacked, or a grid of four, with dividers you can drag. Read the docs while you write the code,
              then put it all back with <Kbd>⌥⌘U</Kbd>.
            </Feature>

            <Feature
              eyebrow="Compact mode"
              keys={["⌘S"]}
              title="Out of the way, until you reach for it."
              video="compact"
              label="Compact mode hiding Zepper's sidebar, which floats back in at the window's edge"
            >
              Compact mode gives the whole window to the page. Move the pointer to the edge and the sidebar floats back in,
              then tucks itself away again.
            </Feature>

            <section className="mx-auto max-w-6xl px-5 pb-24 pt-10">
              <div className="max-w-2xl">
                <Eyebrow>Only in Zepper</Eyebrow>
                <Heading className="text-[#18245f]">
                  Things your browser <span className={`${styles.serif} font-normal text-[#3a5bd9]`}>can&apos;t do.</span>
                </Heading>
              </div>
              <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-10">
                <div>
                  <Clip name="tidy" label="Tidy grouping a space's tabs into named folders with Apple Intelligence" />
                  <h3 className={`${styles.display} mt-7 flex items-center gap-2.5 text-2xl font-bold text-[#18245f]`}>Tidy, in one click.</h3>
                  <p className="mt-2 max-w-md leading-relaxed text-[#111633]/70">
                    Apple Intelligence sorts a messy space into folders with sensible names, right on your Mac. Not what you
                    wanted? Undo puts every tab back.
                  </p>
                </div>
                <div>
                  <Clip name="capture" label="Capturing one element of a page with ⇧⌘2, copied straight to the clipboard" />
                  <h3 className={`${styles.display} mt-7 flex items-center gap-2.5 text-2xl font-bold text-[#18245f]`}>
                    Capture just the part you need. <Kbd>⇧⌘2</Kbd>
                  </h3>
                  <p className="mt-2 max-w-md leading-relaxed text-[#111633]/70">
                    Click an element, drag a region, or take the whole page. It&apos;s on your clipboard at once, ready to paste,
                    with a thumbnail you can drag into other apps.
                  </p>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Privacy */}
      <section id="privacy" className={`${styles.grainDark} scroll-mt-4 text-white`} style={{ background: DEEP, ...grain(0.16) }}>
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-24 md:grid-cols-[1.05fr_0.95fr] md:py-28">
          <div>
            <Eyebrow dark>Privacy</Eyebrow>
            <Heading>
              Private before you <span className={`${styles.serif} font-normal text-[#b9c8ff]`}>change a thing.</span>
            </Heading>
            <p className="mt-5 max-w-lg text-[1.07rem] leading-relaxed text-white/65">
              Every protection is on from the start. If a site ever needs one off, the lock in the address bar turns it off
              for that site alone. Private windows leave nothing behind when they close.
            </p>
            <ul className="mt-10 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {protections.map(([name, text]) => (
                <li key={name} className="flex gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#9fb6ff]" />
                  <div>
                    <div className="font-semibold">{name}</div>
                    <div className="mt-0.5 text-sm leading-relaxed text-white/55">{text}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mx-auto w-full max-w-[460px]">
            <WindowClip
              name="privacy-panel"
              label="Zepper's site panel opening its protections: ads and trackers, cookie banners, fingerprinting and more, each with its own switch"
              width={1600}
              height={1612}
              corners="2% / 2%"
            />
          </div>
        </div>
      </section>

      <div className={styles.grain} style={grain(0.22)}>
        <div>
          {/* Everything else */}
          <section className="mx-auto max-w-6xl px-5 py-24 md:py-28">
            <div className="max-w-2xl">
              <Eyebrow>And the rest</Eyebrow>
              <Heading className="text-[#18245f]">
                Everything you&apos;d expect, <span className={`${styles.serif} font-normal text-[#3a5bd9]`}>already there.</span>
              </Heading>
            </div>
            <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {more.map(({ icon: Icon, title: name, text }) => (
                <div key={name} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#18245f]/[0.07] text-[#2c47c4] ring-1 ring-[#18245f]/10">
                    <Icon className="h-5 w-5" strokeWidth={1.9} />
                  </span>
                  <div>
                    <h3 className="font-semibold text-[#111633]">{name}</h3>
                    <p className="mt-1 text-[0.95rem] leading-relaxed text-[#111633]/65">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Developers */}
          <section id="developers" className="mx-auto max-w-6xl scroll-mt-6 px-5 pb-24">
            <div className={`${styles.grainDark} overflow-hidden rounded-[30px] text-white`} style={{ background: NAVY, ...grain(0.15) }}>
              <div className="grid items-center gap-12 p-8 md:grid-cols-2 md:p-14">
                <div>
                  <Eyebrow dark>For developers</Eyebrow>
                  <Heading className="md:text-[2.9rem]">
                    No Chromium <span className={`${styles.serif} font-normal text-[#b9c8ff]`}>to compile.</span>
                  </Heading>
                  <p className="mt-5 leading-relaxed text-white/65">
                    Most browsers worth changing are Chromium forks: tens of gigabytes of source and hours of building before
                    you move a pixel. Zepper&apos;s Chromium comes prebuilt, and everything you see is TypeScript, React and
                    CSS. A fork runs in minutes, and your changes show the moment you save.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {["Rebrand it", "Change the defaults", "Reshape the sidebar", "Bring your own filter lists"].map((idea) => (
                      <span key={idea} className="rounded-full bg-white/[0.07] px-3.5 py-1.5 text-sm text-white/80 ring-1 ring-white/10">
                        {idea}
                      </span>
                    ))}
                  </div>
                  <a href={repoUrl} className="mt-8 inline-flex items-center gap-2 font-semibold text-[#b9c8ff] hover:text-white">
                    Read the source on GitHub <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
                <div className="overflow-hidden rounded-2xl bg-[#0b1030] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
                  <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-3">
                    <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                    <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                    <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                    <span className="ml-2 text-xs text-white/40">Terminal</span>
                  </div>
                  <pre className="overflow-x-auto p-5 font-mono text-[0.86rem] leading-7 text-white/85">
                    <span className="text-white/40"># fork it on GitHub, then</span>
                    {"\n"}
                    <span className="text-[#9fb6ff]">git</span> clone github.com/you/zepper-browser
                    {"\n"}
                    <span className="text-[#9fb6ff]">cd</span> zepper-browser
                    {"\n"}
                    <span className="text-[#9fb6ff]">npm</span> install
                    {"\n"}
                    <span className="text-[#9fb6ff]">npm</span> run dev
                    {"\n"}
                    <span className="text-[#7ee2a8]">✓</span> <span className="text-white/50">your Zepper is running</span>
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="mx-auto max-w-6xl scroll-mt-6 px-5 pb-28">
            <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
              <div>
                <Eyebrow>Questions</Eyebrow>
                <Heading className="text-[#18245f]">Good to know.</Heading>
                <p className="mt-5 max-w-sm leading-relaxed text-[#111633]/65">
                  Something else?{" "}
                  <a href={`${repoUrl}/issues`} className="font-medium text-[#2c47c4] underline-offset-4 hover:underline">
                    Ask on GitHub
                  </a>
                  .
                </p>
              </div>
              <dl className="divide-y divide-[#111633]/10 border-y border-[#111633]/10">
                {faq(intel).map(([question, answer]) => (
                  <div key={question} className="py-6">
                    <dt className="font-semibold text-[#111633]">{question}</dt>
                    <dd className="mt-2 leading-relaxed text-[#111633]/65">{answer}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        </div>
      </div>

      {/* Download */}
      <section id="download" className={`${styles.grainDark} text-center text-white`} style={{ background: NAVY, ...grain(0.18) }}>
        <div className="mx-auto max-w-3xl px-5 py-24 md:py-28">
          <Image src="/zepper/icon@2x.png" alt="" width={96} height={96} className="mx-auto drop-shadow-[0_16px_30px_rgba(0,0,0,0.4)]" />
          <h2 className={`${styles.display} mt-8 text-[2.8rem] font-bold leading-[1] md:text-[4.2rem]`}>
            Give your tabs <span className={`${styles.serif} font-normal text-[#b9c8ff]`}>a home.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-lg text-white/70">
            Free, open source and updated on its own. Bring your history and passwords over from the browser you use now in
            about a minute.
          </p>
          <div className="mt-10 flex justify-center">
            <DownloadButton intel={intel} />
          </div>
          <p className="mt-5 text-sm text-white/50">{meta}</p>
          {intel ? <OtherMacs className="mt-1.5 block text-sm text-white/50" /> : null}
          <ol className="mx-auto mt-14 grid max-w-3xl gap-4 text-left sm:grid-cols-3">
            {[
              ["Install", "Open the .dmg and drag Zepper into Applications."],
              ["Open it once", "In System Settings › Privacy & Security, click Open Anyway. Only the first time."],
              ["Move in", "Bring over your history and passwords, choose your colours, and you're set."],
            ].map(([step, text], i) => (
              <li key={step} className="rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/10">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-sm font-semibold text-[#b9c8ff]">{i + 1}</span>
                <div className="mt-3 font-semibold">{step}</div>
                <p className="mt-1 text-sm leading-relaxed text-white/60">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="text-white/55" style={{ background: DEEP }}>
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2.5">
            <Image src="/zepper/icon.png" alt="" width={22} height={22} className="rounded-md" />
            <span>
              Free software under the GPL-3.0, made by{" "}
              <Link href="/" className="font-medium text-white/85 hover:text-white">
                Dewan Shakil Akhtar
              </Link>
              .
            </span>
          </div>
          <div className="flex flex-wrap gap-5">
            <a href={repoUrl} className="hover:text-white">
              GitHub
            </a>
            <a href={releasesUrl} className="hover:text-white">
              Releases
            </a>
            <a href={`${repoUrl}/blob/main/CHANGELOG.md`} className="hover:text-white">
              Changelog
            </a>
            <a href={`${repoUrl}/issues`} className="hover:text-white">
              Report a bug
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
