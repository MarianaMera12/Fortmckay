/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // @react-pdf/renderer reads its font files from disk at runtime; if
  // webpack bundles it into the serverless function it can't find them
  // and the /api/consents/[id]/pdf route 500s in production (works in
  // `next dev` because nothing gets bundled there).
  experimental: {
    serverComponentsExternalPackages: ["@react-pdf/renderer"],
  },
};
export default nextConfig;
