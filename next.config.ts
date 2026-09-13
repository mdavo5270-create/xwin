import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// CSP calibrée sur ce qui est réellement utilisé dans l'app :
// - pas de script inline, pas de script tiers -> script-src 'self' strict
// - style={{...}} (React) et le CSS des next/font nécessitent 'unsafe-inline'
//   en style-src (les attributs style="" sont couverts par style-src, pas
//   seulement les balises <style>)
// - aucune image/police chargée depuis un domaine externe -> 'self' partout
const csp = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // HSTS uniquement en prod : en dev, ça forcerait https sur localhost.
          ...(isProd
            ? [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=63072000; includeSubDomains; preload",
                },
              ]
            : []),
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/login", destination: "/connexion", permanent: false },
      { source: "/register", destination: "/inscription", permanent: false },
      { source: "/pronos", destination: "/pronostics", permanent: false },
      { source: "/pronos/:id", destination: "/pronostics/:id", permanent: false },
      { source: "/pronos/:id/suivi", destination: "/pronostics/:id", permanent: false },
      { source: "/compte", destination: "/app/profil", permanent: false },
      { source: "/abonnements", destination: "/premium", permanent: false },
      { source: "/aide", destination: "/faq", permanent: false },
      { source: "/legal", destination: "/mentions-legales", permanent: false },
      { source: "/splash", destination: "/", permanent: false },
      { source: "/onboarding", destination: "/inscription", permanent: false },
      { source: "/notifications", destination: "/app/notifications", permanent: false },
    ];
  },
};

export default nextConfig;
