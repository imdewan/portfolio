import { NextResponse } from "next/server";
import { latestRelease } from "../release";

// Looked up when you click, so the button always gets the newest .dmg (GitHub is asked at most once a minute).
export const dynamic = "force-dynamic";

export async function GET() {
  const release = await latestRelease(60);
  return NextResponse.redirect(release.downloadUrl, 302);
}
