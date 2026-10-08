"use client";

import { useEffect, useState } from "react";

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

/**
 * A download link that gets the Apple silicon build, or the Intel one on an Intel Mac (when the latest
 * release has one).
 */
export function MacDownload({
  href,
  intelHref,
  className,
  children,
}: {
  href: string;
  intelHref: string | null;
  className?: string;
  children: React.ReactNode;
}) {
  const [target, setTarget] = useState(href);
  useEffect(() => {
    if (!intelHref) return;
    let alive = true;
    void onIntelMac().then((intel) => alive && intel && setTarget(intelHref));
    return () => {
      alive = false;
    };
  }, [intelHref]);
  return (
    <a href={target} className={className}>
      {children}
    </a>
  );
}
