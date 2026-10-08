import { NextResponse, type NextRequest } from "next/server";
import { latestRelease, releasesUrl } from "../release";

// Looked up when you click, so the button always gets the newest .dmg (GitHub is asked at most once a minute).
// ?mac=intel is the build for Intel Macs.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const release = await latestRelease(60);
  const intel = request.nextUrl.searchParams.get("mac") === "intel";
  return NextResponse.redirect(intel ? (release.intelUrl ?? releasesUrl) : release.downloadUrl, 302);
}
