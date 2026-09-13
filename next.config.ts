import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/login", destination: "/connexion", permanent: false },
      { source: "/register", destination: "/inscription", permanent: false },
      { source: "/pronos", destination: "/pronostics", permanent: false },
      { source: "/pronos/:id", destination: "/pronostics/:id", permanent: false },
      { source: "/compte", destination: "/app/profil", permanent: false },
      { source: "/abonnements", destination: "/premium", permanent: false },
    ];
  },
};

export default nextConfig;
