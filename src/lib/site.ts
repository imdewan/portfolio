export const siteUrl = "https://mrdsa.dev";
export const siteName = "Dewan Shakil Akhtar";
export const siteTitle = "Dewan Shakil Akhtar | Builder, Engineer, Notes";
export const siteDescription =
  "Personal site and blog for Dewan Shakil Akhtar, a full-stack builder working on on-device AI, React Native SDKs, and product engineering.";
export const blogDescription =
  "Writing, notes, and build logs by Dewan Shakil Akhtar on on-device AI, React Native, SDKs, and shipping small software.";

export const socials = [
  { label: "GitHub", href: "https://github.com/imdewan", icon: "github" },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/mrdsa04",
    icon: "linkedin",
  },
  { label: "Twitter", href: "https://x.com/mrdsa04", icon: "x" },
] as const;

export const navItems = [
  { label: "About", href: "/#about" },
  { label: "Blog", href: "/blog" },
  { label: "Zepper", href: "/zepper" },
  { label: "Work", href: "/#work" },
  { label: "Stack", href: "/#stack" },
  { label: "Contact", href: "/#contact" },
];

export const projects = [
  {
    name: "Zepper",
    detail:
      "A free, open-source browser for macOS: Spaces, a sidebar built for tabs, split view and privacy on by default. Built on Chromium, with an interface in React you can make your own.",
    href: "/zepper",
    status: "Current | Maker",
  },
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

const devicon = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

export const stack = [
  { name: "TypeScript", icon: `${devicon}/typescript/typescript-original.svg` },
  { name: "React Native", icon: `${devicon}/react/react-original.svg` },
  { name: "React", icon: `${devicon}/react/react-original.svg` },
  { name: "Node.js", icon: `${devicon}/nodejs/nodejs-original.svg` },
  { name: "Python", icon: `${devicon}/python/python-original.svg` },
  { name: "C++", icon: `${devicon}/cplusplus/cplusplus-original.svg` },
  { name: "Go", icon: `${devicon}/go/go-original.svg` },
  { name: "Firebase", icon: `${devicon}/firebase/firebase-plain.svg` },
  { name: "Supabase", icon: `${devicon}/supabase/supabase-original.svg` },
  { name: "Docker", icon: `${devicon}/docker/docker-original.svg` },
  { name: "GCP", icon: `${devicon}/googlecloud/googlecloud-original.svg` },
  {
    name: "Convex",
    icon: "https://images.seeklogo.com/logo-png/65/2/convex-icon-logo-png_seeklogo-653467.png",
  },
];

export const personJsonLd = {
  "@type": "Person",
  "@id": `${siteUrl}/#person`,
  name: siteName,
  url: siteUrl,
  image: `${siteUrl}/avatar.jpeg`,
  email: "mailto:hi@mrdsa.dev",
  jobTitle: "Member of Technical Staff",
  worksFor: {
    "@type": "Organization",
    name: "Stellon Labs",
    url: "https://stellonlabs.com",
  },
  sameAs: socials.map((social) => social.href),
  knowsAbout: [
    "On-device AI",
    "React Native",
    "SDK engineering",
    "Full-stack product engineering",
  ],
};

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
