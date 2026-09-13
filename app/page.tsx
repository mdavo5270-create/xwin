export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}>
      <section style={{ maxWidth: "40rem" }}>
        <p style={{ letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", fontSize: "0.75rem" }}>
          Skill-based prize competitions
        </p>
        <h1 style={{ margin: "0.4rem 0 0.75rem", fontSize: "2.4rem" }}>X-Win</h1>
        <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>
          UK platform in foundations. Competitions, accounts and payments are not implemented yet.
          Odds stay published. Free postal entry is part of the product rules — not of this build.
        </p>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
          Source:{" "}
          <a href="https://github.com/mdavo5270-create/xwin">github.com/mdavo5270-create/xwin</a>
        </p>
      </section>
    </main>
  );
}
