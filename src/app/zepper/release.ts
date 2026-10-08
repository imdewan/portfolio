export const repoUrl = "https://github.com/imdewan/zepper-browser";
export const releasesUrl = `${repoUrl}/releases/latest`;

export interface Release {
  version: string | null;
  /** The .dmg for Macs with Apple silicon, or the release page when it can't be found. */
  downloadUrl: string;
  /** The .dmg for Intel Macs, when the release has one. */
  intelUrl: string | null;
  publishedAt: string | null;
}

/** Zepper's latest release on GitHub, checked again after `maxAge` seconds, so the page always offers the current build. */
export async function latestRelease(maxAge = 300): Promise<Release> {
  try {
    const res = await fetch("https://api.github.com/repos/imdewan/zepper-browser/releases/latest", {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: maxAge },
    });
    if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
    const data = (await res.json()) as {
      tag_name?: string;
      published_at?: string;
      assets?: { name: string; browser_download_url: string }[];
    };
    const dmgs = (data.assets ?? []).filter((asset) => asset.name.endsWith(".dmg"));
    const intel = dmgs.find((asset) => asset.name.endsWith("-x64.dmg"));
    const silicon = dmgs.find((asset) => asset.name.endsWith("-arm64.dmg")) ?? dmgs.find((asset) => asset !== intel);
    return {
      version: data.tag_name?.replace(/^v/, "") ?? null,
      downloadUrl: silicon?.browser_download_url ?? releasesUrl,
      intelUrl: intel?.browser_download_url ?? null,
      publishedAt: data.published_at ?? null,
    };
  } catch {
    return { version: null, downloadUrl: releasesUrl, intelUrl: null, publishedAt: null };
  }
}
