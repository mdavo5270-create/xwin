const PATHS: Record<string, React.ReactNode> = {
  football: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.2 15.6 9.9 14.3 14.1H9.7L8.4 9.9Z" />
      <path d="M12 3v4.2M4.6 8l3.8 1.9M4.6 16l3.8-1.9M19.4 8l-3.8 1.9M19.4 16l-3.8-1.9M12 21v-4.2" />
    </>
  ),
  basketball: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.4 4 5.6 4 9s-1.4 6.6-4 9c-2.6-2.4-4-5.6-4-9s1.4-6.6 4-9Z" />
    </>
  ),
  tennis: (
    <>
      <circle cx="9.5" cy="9.5" r="6" />
      <path d="M6.2 5.4c2.4 1.4 3.6 4 3.3 6.6M12.8 13.6c-2.4-1.4-3.6-4-3.3-6.6" />
      <path d="M13.6 13.6 20 20M17.2 17.2l2.1 2.1" />
    </>
  ),
  rugby: (
    <>
      <path d="M4.5 12c0-4.5 3.4-7.5 7.5-7.5s7.5 3 7.5 7.5-3.4 7.5-7.5 7.5-7.5-3-7.5-7.5Z" />
      <path d="M7.5 9v6M16.5 9v6M9.5 7.2 14.5 16.8" strokeDasharray="0" />
    </>
  ),
  hockey: (
    <>
      <path d="M5 19 15 5c.6-.8 1.9-.5 2.1.5l.4 2" />
      <path d="M5 19h5" />
      <circle cx="18.5" cy="18" r="2" />
    </>
  ),
  "formula-1": (
    <>
      <path d="M4 15c1.6-3.4 4.6-5.5 8-5.5s6.4 2.1 8 5.5" />
      <path d="M4 15h16v2.4c0 .9-.7 1.6-1.6 1.6H5.6c-.9 0-1.6-.7-1.6-1.6Z" />
      <path d="M7 9.5V6M12 9.5V5M17 9.5V6" />
    </>
  ),
  mma: (
    <>
      <path d="M6 10.5v-2a2.5 2.5 0 0 1 5 0v3.6" />
      <path d="M11 12.1V8.8a2.3 2.3 0 0 1 4.6 0v4.2" />
      <path d="M15.6 13V9.9a2.1 2.1 0 0 1 4.2 0v6.6c0 3.1-2.3 5.5-6 5.5-3.1 0-5.1-1.3-6.6-3.5L4.6 15c-.6-.9.6-2 1.5-1.3l1.9 1.5" />
    </>
  ),
  volleyball: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3c3 2 4.4 5.6 3.2 9.4M12 3c-2.6 3-3 7-1 10.2M5 8.5c3.6.4 6.6 2.6 7.8 6M4.2 14c3.6.2 7 2.4 8.7 5.6" />
    </>
  ),
  handball: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M6 7.5 18 16.5M18 7.5 6 16.5" />
    </>
  ),
  esport: (
    <>
      <rect x="3.5" y="8.5" width="17" height="9" rx="4.5" />
      <path d="M8 11v4M6 13h4" />
      <circle cx="15.5" cy="12" r="1" />
      <circle cx="17.5" cy="14.5" r="1" />
    </>
  ),
};

function keyFor(slug: string) {
  return slug.startsWith("esport") ? "esport" : slug;
}

export function SportIcon({ slug, className }: { slug: string; className?: string }) {
  const path = PATHS[keyFor(slug)];
  if (!path) {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {path}
    </svg>
  );
}
