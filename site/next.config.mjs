/** @type {import("vinext").NextConfig} */
const nextConfig = {
  // Plain static files: Cloudflare Pages serves dist/client with no Worker.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
