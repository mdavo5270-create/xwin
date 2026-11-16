import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/saspay";
import { completePaymentBySaspayId } from "@/lib/payments";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-webhook-signature") || "";
  const timestamp = req.headers.get("x-webhook-timestamp") || "";
  const secret = process.env.SASPAY_WEBHOOK_SECRET || "";

  // Si un secret est configuré, on exige une signature valide.
  if (secret) {
    const valid = verifyWebhookSignature(rawBody, signature, timestamp, secret);
    if (!valid) {
      return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
    }
  }

  let payload: { event?: string; data?: { id?: string; status?: string; reference?: string } };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const event = String(payload.event || "");
  const data = payload.data || {};
  const saspayId = String(data.id || "");
  const status = String(data.status || "");

  if (!saspayId) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  if (event === "transaction.success" || /success/i.test(status)) {
    const result = await completePaymentBySaspayId(saspayId, status || "SUCCESS");
    return NextResponse.json({ ok: true, result });
  }

  if (event === "transaction.failed" || event === "transaction.cancelled") {
    await completePaymentBySaspayId(saspayId, status || event);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true, ignored: event });
}
