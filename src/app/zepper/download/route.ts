import { NextResponse, type NextRequest } from "next/server";
import { latestRelease, releasesUrl, type LinuxArch, type LinuxPackage } from "../release";

// Looked up when you click, so the button always gets the newest build (GitHub is asked at most once a minute).
// ?mac=intel is the build for Intel Macs; ?linux=deb|rpm|appimage (with &arch=arm64 for Arm) a Linux package.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const release = await latestRelease(60);
  const params = request.nextUrl.searchParams;
  const linux = params.get("linux") as LinuxPackage | null;
  if (linux) {
    const arch: LinuxArch = params.get("arch") === "arm64" ? "arm64" : "x64";
    return NextResponse.redirect(release.linux[linux]?.[arch] ?? releasesUrl, 302);
  }
  const intel = params.get("mac") === "intel";
  return NextResponse.redirect(intel ? (release.intelUrl ?? releasesUrl) : release.downloadUrl, 302);
}
