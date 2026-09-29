"use client";

import { useState } from "react";
import { Copy, Share2 } from "lucide-react";

export function ShareButtons({
  title,
  text,
  url,
}: {
  title: string;
  text: string;
  url: string;
}) {
  const [copyMessage, setCopyMessage] = useState("");

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopyMessage("Copied");
    window.setTimeout(() => setCopyMessage(""), 1600);
  }

  async function share() {
    if (navigator.share) {
      await navigator.share({ title, text, url }).catch(() => undefined);
      return;
    }
    await copyLink();
  }

  const buttonClass =
    "inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-xs text-zinc-500 transition-colors hover:bg-white/[0.04] hover:text-zinc-300";

  return (
    <div className="flex items-center gap-2">
      <button className={buttonClass} onClick={share}>
        <Share2 className="h-3.5 w-3.5" />
        Share
      </button>
      <button className={buttonClass} onClick={copyLink}>
        <Copy className="h-3.5 w-3.5" />
        Copy
      </button>
      {copyMessage ? (
        <span className="font-mono text-xs text-emerald-500">{copyMessage}</span>
      ) : null}
    </div>
  );
}
