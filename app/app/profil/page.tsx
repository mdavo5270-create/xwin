import { getMember } from "@/lib/members";
import { redirect } from "next/navigation";
export default async function Page() {
  const m = await getMember();
  if (!m) redirect("/connexion");
  return (<><h1>Profil</h1><section className="card"><p>{m.name}</p><p className="muted">{m.email}</p></section></>);
}
