import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // Add this line to allow images from Cloudinary
  },
};

export default nextConfig;
