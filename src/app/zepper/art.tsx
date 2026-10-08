/** Apple's logo, for the download buttons. */
export function AppleLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

/** A check mark for the list of protections. */
export function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden>
      <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.16" />
      <path d="M6 10.4l2.6 2.6L14 7.4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A four-pointed sparkle, between the features in the strip. */
export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 1.5 C 12.9 7.6, 16.4 11.1, 22.5 12 C 16.4 12.9, 12.9 16.4, 12 22.5 C 11.1 16.4, 7.6 12.9, 1.5 12 C 7.6 11.1, 11.1 7.6, 12 1.5 Z" fill="currentColor" />
    </svg>
  );
}

/** A wavy edge: `color` fills the lower part, drawn up into the section above (flipped, down into the one below). */
export function Wave({ color, flip = false, className = "" }: { color: string; flip?: boolean; className?: string }) {
  const periods = 32;
  const w = 1440 / periods;
  let d = "M0 14";
  for (let i = 0; i < periods; i++) {
    const x = i * w;
    d += ` Q ${x + w / 4} 5 ${x + w / 2} 14 T ${x + w} 14`;
  }
  d += " V 28 H 0 Z";
  return (
    <svg
      viewBox="0 0 1440 28"
      preserveAspectRatio="none"
      className={`block h-4 w-full md:h-6 ${className}`}
      style={flip ? { transform: "scaleY(-1)" } : undefined}
      aria-hidden
    >
      <path d={d} fill={color} />
    </svg>
  );
}
