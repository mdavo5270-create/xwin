import { NextResponse } from "next/server";
import { getMember } from "@/lib/members";
import { initiateLicensePayment } from "@/lib/payments";

export async function POST(req: Request) {
  const member = await getMember();
  if (!member) {
    return NextResponse.json({ error: "Connecte-toi pour payer." }, { status: 401 });
  }

  let body: { days?: number; phone?: string; network?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  const days = Number(body.days) === 30 ? 30 : Number(body.days) === 7 ? 7 : 0;
  if (!days) {
    return NextResponse.json({ error: "Choisis 7 ou 30 jours." }, { status: 400 });
  }

  const phone = String(body.phone || "").trim();
  if (!phone) {
    return NextResponse.json({ error: "Numéro MTN requis." }, { status: 400 });
  }

  const network = String(body.network || "mtn_bj");
  const res = await initiateLicensePayment({ member, days, phone, network });
  if (!res.ok) {
    return NextResponse.json({ error: res.error }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    paymentId: res.paymentId,
    saspayId: res.saspayId,
    status: res.status,
    checkoutUrl: res.checkoutUrl,
    amount: res.amount,
    days: res.days,
    message: res.checkoutUrl
      ? "Redirige le client vers checkoutUrl."
      : "Valide le paiement sur ton téléphone MTN (USSD / notification).",
  });
}
