import { getMember } from "@/lib/members";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ComptePage() {
  const member = await getMember();
  if (!member) redirect("/login");
  return (
    <>
      <h1>Profil</h1>
      <section className="card">
        <strong>{member.name}</strong>
        <p className="muted">{member.email}</p>
      </section>
      <div className="grid two" style={{ marginTop: ".8rem" }}>
        <Link className="card" href="/abonnements" style={{ color: "inherit", textDecoration: "none" }}>Abonnements</Link>
        <Link className="card" href="/aide" style={{ color: "inherit", textDecoration: "none" }}>Aide</Link>
        <Link className="card" href="/legal" style={{ color: "inherit", textDecoration: "none" }}>Mentions</Link>
      </div>
    </>
  );
}
