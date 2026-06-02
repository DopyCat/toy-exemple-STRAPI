import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "", // Vazio para escutar a porta 80 do NGINX
        pathname: "/**", // O '**' libera QUALQUER subpasta dentro do localhost, evitando novos erros
      },
    ],
  },
};

export default nextConfig;