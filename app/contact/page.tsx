import { PublicChrome } from "@/components/PublicChrome";
import { getMember } from "@/lib/members";
import { contactAction } from "./actions";

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const member = await getMember();
  const q = await searchParams;
  return (
    <PublicChrome member={member}>
      <main className="wrap">
        <h1>Contact</h1>
        {q.ok ? <p className="card">Message enregistré.</p> : null}
        <form action={contactAction} className="card">
          <label>Nom<input name="name" required /></label>
          <label>Email<input name="email" type="email" required /></label>
          <label>Sujet<input name="subject" required /></label>
          <label>Message<textarea name="body" required /></label>
          <button className="btn" type="submit">Envoyer</button>
        </form>
      </main>
    </PublicChrome>
  );
}
