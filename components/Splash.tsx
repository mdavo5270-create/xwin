"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/public/logo-full.png";
import "@/app/gate.css";

export function Splash() {
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(() => router.replace("/connexion"), 2400);
    return () => clearTimeout(t);
  }, [router]);
  return (
    <main className="gate">
      <Image className="gate-logo" src={logo} alt="XWIN" priority />
      <p className="gate-tag">« Xwin - Votre Partenaire de Confiance »</p>
    </main>
  );
}
