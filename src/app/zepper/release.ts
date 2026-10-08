export const repoUrl = "https://github.com/imdewan/zepper-browser";
export const releasesUrl = `${repoUrl}/releases/latest`;

export interface Release {
  version: string | null;
  /** The .dmg itself, or the release page when it can't be found. */
  downloadUrl: string;
  publishedAt: string | null;
}

/** Zepper's latest release on GitHub (checked at most hourly), so the page always offers the current build. */
export async function latestRelease(): Promise<Release> {
  try {
    const res = await fetch("https://api.github.com/repos/imdewan/zepper-browser/releases/latest", {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
    const data = (await res.json()) as {
      tag_name?: string;
      published_at?: string;
      assets?: { name: string; browser_download_url: string }[];
    };
    const dmg = data.assets?.find((asset) => asset.name.endsWith(".dmg"));
    return {
      version: data.tag_name?.replace(/^v/, "") ?? null,
      downloadUrl: dmg?.browser_download_url ?? releasesUrl,
      publishedAt: data.published_at ?? null,
    };
  } catch {
    return { version: null, downloadUrl: releasesUrl, publishedAt: null };
  }
}
