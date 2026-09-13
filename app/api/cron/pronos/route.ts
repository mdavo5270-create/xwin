import { NextResponse } from "next/server";
import { runPronoAutomation } from "@/lib/automation";

function authorized(req: Request) {
  const secret = process.env.CRON_SECRET || process.env.ADMIN_SECRET || "";
  if (!secret) return false;
  const header = req.headers.get("authorization") || "";
  const bearer = header.startsWith("Bearer ") ? header.slice(7) : "";
  const url = new URL(req.url);
  const q = url.searchParams.get("secret") || "";
  return bearer === secret || q === secret;
}

export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const report = await runPronoAutomation();
  return NextResponse.json(report);
}

export async function POST(req: Request) {
  return GET(req);
}
