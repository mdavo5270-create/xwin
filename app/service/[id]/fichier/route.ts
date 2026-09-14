import { NextResponse } from "next/server";
import { getMember } from "@/lib/members";
import { getActiveLicense } from "@/lib/licenses";
import { getOffer } from "@/lib/offers";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const member = await getMember();
  if (!member) return NextResponse.redirect(new URL("/connexion", process.env.NEXT_PUBLIC_SITE_URL || "https://xxwin.netlify.app"));
  const license = await getActiveLicense(member.id);
  if (!license) return NextResponse.redirect(new URL("/abonnement", process.env.NEXT_PUBLIC_SITE_URL || "https://xxwin.netlify.app"));
  const { id } = await params;
  const doc = await getOffer(id);
  if (!doc || doc.type !== "service") return new NextResponse("Introuvable", { status: 404 });
  const body = [
    doc.title,
    "",
    doc.description || "",
    "",
    `Document destiné uniquement au compte ${member.publicId} (${member.email}).`,
    "Ne pas partager.",
  ].join("\n");
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${doc.id}-${member.publicId}.txt"`,
    },
  });
}
