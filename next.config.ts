import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "qrbdthnwprtysodpsncu.supabase.co", // Permite obtener imagenes de seller app
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
