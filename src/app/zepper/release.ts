export const repoUrl = "https://github.com/imdewan/zepper-browser";
export const releasesUrl = `${repoUrl}/releases/latest`;

export type LinuxPackage = "deb" | "rpm" | "appimage";
export type LinuxArch = "x64" | "arm64";

/** How electron-builder names each Linux package's file ("Zepper-0.1.8-amd64.deb"). */
const LINUX_FILES: Record<LinuxPackage, Record<LinuxArch, string>> = {
  deb: { x64: "-amd64.deb", arm64: "-arm64.deb" },
  rpm: { x64: "-x86_64.rpm", arm64: "-aarch64.rpm" },
  appimage: { x64: "-x86_64.AppImage", arm64: "-arm64.AppImage" },
};

export interface Release {
  version: string | null;
  /** The .dmg for Macs with Apple silicon, or the release page when it can't be found. */
  downloadUrl: string;
  /** The .dmg for Intel Macs, when the release has one. */
  intelUrl: string | null;
  /** The Linux packages the release has, by kind and processor. */
  linux: Partial<Record<LinuxPackage, Partial<Record<LinuxArch, string>>>>;
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
    const assets = data.assets ?? [];
    const dmgs = assets.filter((asset) => asset.name.endsWith(".dmg"));
    const intel = dmgs.find((asset) => asset.name.endsWith("-x64.dmg"));
    const silicon = dmgs.find((asset) => asset.name.endsWith("-arm64.dmg")) ?? dmgs.find((asset) => asset !== intel);
    const linux: Release["linux"] = {};
    for (const [kind, arches] of Object.entries(LINUX_FILES) as [LinuxPackage, Record<LinuxArch, string>][]) {
      for (const [arch, suffix] of Object.entries(arches) as [LinuxArch, string][]) {
        const file = assets.find((asset) => asset.name.endsWith(suffix));
        if (file) linux[kind] = { ...linux[kind], [arch]: file.browser_download_url };
      }
    }
    return {
      version: data.tag_name?.replace(/^v/, "") ?? null,
      downloadUrl: silicon?.browser_download_url ?? releasesUrl,
      intelUrl: intel?.browser_download_url ?? null,
      linux,
      publishedAt: data.published_at ?? null,
    };
  } catch {
    return { version: null, downloadUrl: releasesUrl, intelUrl: null, linux: {}, publishedAt: null };
  }
}
