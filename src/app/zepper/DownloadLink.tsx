"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/** Whether this is an Intel Mac, as far as the browser lets a page tell (Apple silicon when it can't). */
async function onIntelMac(): Promise<boolean> {
  const hints = (navigator as Navigator & { userAgentData?: { getHighEntropyValues(keys: string[]): Promise<{ architecture?: string }> } })
    .userAgentData;
  if (hints) {
    const { architecture } = await hints.getHighEntropyValues(["architecture"]).catch(() => ({ architecture: undefined }));
    if (architecture) return architecture === "x86";
  }
  // Safari and Firefox don't say; the graphics chip does (Intel or AMD only on Intel Macs).
  try {
    const gl = document.createElement("canvas").getContext("webgl");
    const info = gl?.getExtension("WEBGL_debug_renderer_info");
    const renderer = info && gl ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    return /intel|amd|radeon/i.test(renderer) && !/apple/i.test(renderer);
  } catch {
    return false;
  }
}

/** A Linux desktop (Android says Linux too, and gets the Mac link: there's nothing for phones). */
const onLinux = (): boolean => /Linux|X11/.test(navigator.userAgent) && !/Android/.test(navigator.userAgent);
const never = () => () => {};

/**
 * A download link that gets the Apple silicon build, or the Intel one on an Intel Mac (when the latest
 * release has one). On Linux it goes to `linux` instead (the Linux packages), with its own label.
 */
export function DownloadLink({
  href,
  intelHref,
  linux,
  className,
  children,
}: {
  href: string;
  intelHref: string | null;
  linux?: { href: string; children: React.ReactNode } | null;
  className?: string;
  children: React.ReactNode;
}) {
  const [target, setTarget] = useState(href);
  // Known only in the browser: the page is first drawn with the Mac link.
  const isLinux = useSyncExternalStore(never, onLinux, () => false);
  useEffect(() => {
    if (!intelHref) return;
    let alive = true;
    void onIntelMac().then((intel) => alive && intel && setTarget(intelHref));
    return () => {
      alive = false;
    };
  }, [intelHref]);
  if (isLinux && linux) {
    return (
      <a href={linux.href} className={className}>
        {linux.children}
      </a>
    );
  }
  return (
    <a href={target} className={className}>
      {children}
    </a>
  );
}
