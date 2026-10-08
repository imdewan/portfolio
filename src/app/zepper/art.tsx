import styles from "./zepper.module.css";

/** A round stamp whose words turn slowly around the Zepper icon. */
export function Stamp({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <circle cx="60" cy="60" r="58" fill="#ffd166" />
      <circle cx="60" cy="60" r="52" fill="none" stroke="#14183a" strokeWidth="1.2" strokeDasharray="2 3" />
      <defs>
        <path id="stamp-ring" d="M60 60 m-41 0 a41 41 0 1 1 82 0 a41 41 0 1 1 -82 0" />
        <clipPath id="stamp-icon">
          <rect x="41" y="41" width="38" height="38" rx="10" />
        </clipPath>
      </defs>
      <g className={styles.spin}>
        {/* Exactly once around the ring, so the words meet without overlapping. */}
        <text fontSize="9.6" fontWeight="800" fill="#14183a" fontFamily="var(--font-display)" textLength="254" lengthAdjust="spacing">
          <textPath href="#stamp-ring">FREE ✦ OPEN SOURCE ✦ MADE FOR MAC ✦</textPath>
        </text>
      </g>
      <image href="/zepper/icon.png" x="38" y="38" width="44" height="44" clipPath="url(#stamp-icon)" />
    </svg>
  );
}

/** A quick hand-drawn underline. */
export function Squiggle({ className = "", color = "#ffd166" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 300 26" preserveAspectRatio="none" className={`${styles.draw} ${className}`} aria-hidden>
      <path
        pathLength={1}
        d="M4 17 C 46 6, 84 22, 124 13 S 196 5, 232 14 S 280 18, 296 9"
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** A loose arrow, for the handwritten notes. */
export function Arrow({ className = "", color = "#ffd166", flip = false }: { className?: string; color?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 120 90" className={`${styles.draw} ${className}`} style={flip ? { transform: "scaleX(-1)" } : undefined} aria-hidden>
      <path pathLength={1} d="M8 10 C 40 4, 78 18, 92 52 S 100 74, 98 80" fill="none" stroke={color} strokeWidth="3.4" strokeLinecap="round" />
      <path pathLength={1} d="M84 66 L 98 82 L 110 62" fill="none" stroke={color} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A hand-drawn tick. */
export function Tick({ className = "", color = "#ffd166" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M3.5 13.2 C 6 14.6, 7.8 16.6, 9.4 19.4 C 12.4 12.6, 16.2 8, 21 4.4" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A four-pointed sparkle, for the strip of features. */
export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 1.5 C 12.9 7.6, 16.4 11.1, 22.5 12 C 16.4 12.9, 12.9 16.4, 12 22.5 C 11.1 16.4, 7.6 12.9, 1.5 12 C 7.6 11.1, 11.1 7.6, 12 1.5 Z" fill="currentColor" />
    </svg>
  );
}

/** A wavy edge between two sections: `color` is the section it belongs to, drawn up into the one above. */
export function Wave({ color, flip = false, className = "" }: { color: string; flip?: boolean; className?: string }) {
  const periods = 30;
  const w = 1440 / periods;
  let d = "M0 14";
  for (let i = 0; i < periods; i++) {
    const x = i * w;
    d += ` Q ${x + w / 4} 4 ${x + w / 2} 14 T ${x + w} 14`;
  }
  d += " V 28 H 0 Z";
  return (
    <svg
      viewBox="0 0 1440 28"
      preserveAspectRatio="none"
      className={`block h-5 w-full md:h-7 ${className}`}
      style={flip ? { transform: "scaleY(-1)" } : undefined}
      aria-hidden
    >
      <path d={d} fill={color} />
    </svg>
  );
}
