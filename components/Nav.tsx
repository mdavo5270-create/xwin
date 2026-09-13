import Link from "next/link";

export function TopBar({ title, back }: { title?: string; back?: string }) {
  return (
    <header className="topbar">
      {back ? <Link href={back} className="back">‹</Link> : <span className="brand">XWIN</span>}
      {title ? <strong>{title}</strong> : <span />}
      <Link href="/notifications" className="bell" aria-label="Notifications">●</Link>
    </header>
  );
}

export function TabBar({ active }: { active: "home" | "pronos" | "montantes" | "compte" }) {
  return (
    <nav className="tabbar">
      <Link className={active === "home" ? "on" : ""} href="/">Accueil</Link>
      <Link className={active === "pronos" ? "on" : ""} href="/pronos">Pronos</Link>
      <Link className={active === "montantes" ? "on" : ""} href="/montantes">Montantes</Link>
      <Link className={active === "compte" ? "on" : ""} href="/compte">Compte</Link>
    </nav>
  );
}
