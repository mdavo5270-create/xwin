import Link from "next/link";
import { logoutMember } from "@/lib/members";
import { redirect } from "next/navigation";
import type { Member } from "@/lib/types";

async function logoutAction() {
  "use server";
  await logoutMember();
  redirect("/login");
}

export function Shell({
  member,
  children,
}: {
  member: Member;
  children: React.ReactNode;
}) {
  return (
    <div className="app">
      <aside className="side">
        <Link className="logo" href="/">XWIN</Link>
        <nav>
          <Link href="/">Aujourd’hui</Link>
          <Link href="/pronos">Pronos</Link>
          <Link href="/montantes">Montantes</Link>
          <Link href="/abonnements">Abonnements</Link>
          <Link href="/compte">Profil</Link>
        </nav>
        <form action={logoutAction}>
          <button type="submit">Déconnexion</button>
        </form>
      </aside>
      <div className="main">
        <header className="head">
          <strong>{member.name}</strong>
          <span className="muted">{member.email}</span>
        </header>
        <div className="content">{children}</div>
        <nav className="mobile-nav">
          <Link href="/">Home</Link>
          <Link href="/pronos">Pronos</Link>
          <Link href="/montantes">Montantes</Link>
          <Link href="/compte">Profil</Link>
        </nav>
      </div>
    </div>
  );
}
