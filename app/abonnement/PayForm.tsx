"use client";

import { useState } from "react";

export function PayForm() {
  const [days, setDays] = useState<7 | 30>(7);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setErr("");
    try {
      const res = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days, phone, network: "mtn_bj" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error || "Échec du paiement.");
        return;
      }
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      setMsg(
        data.message ||
          `Demande envoyée (${data.amount} XOF). Valide sur ton téléphone MTN, puis recharge cette page.`,
      );
    } catch {
      setErr("Réseau indisponible. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="pay-form">
      <label>
        Durée
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value) === 30 ? 30 : 7)}
        >
          <option value={7}>7 jours — 4 900 XOF</option>
          <option value={30}>30 jours — 14 900 XOF</option>
        </select>
      </label>
      <label>
        Numéro MTN Bénin
        <input
          type="tel"
          name="phone"
          placeholder="01 97 50 50 50"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          autoComplete="tel"
        />
      </label>
      <button className="btn" type="submit" disabled={loading}>
        {loading ? "Envoi…" : "Payer par MTN MoMo"}
      </button>
      {msg ? <p>{msg}</p> : null}
      {err ? <p className="muted">{err}</p> : null}
    </form>
  );
}
