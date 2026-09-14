import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
      { source: "/onboarding", destination: "/", permanent: false },
      { source: "/notifications", destination: "/app/notifications", permanent: false },
    ];
  },
};

export default nextConfig;
