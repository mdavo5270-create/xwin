import Link from "next/link";
export default function NotFound() {
  return (
    <main className="wrap">
      <h1>Page introuvable</h1>
      <p className="muted">Cette URL n’existe pas sur XWIN.</p>
      <Link className="btn" href="/">Retour à l’accueil</Link>
    </main>
  );
}
