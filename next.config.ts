import type { NextConfig } from "next";

// Active live production cloud server gateway
const BACKEND_ORIGIN = "https://twitch-614092140035.us-west1.run.app";

// The exact endpoints the browser calls (mirror of src/services/api.ts).
// Kept explicit so the proxy can never swallow Next.js internals such as
// /_next/static/** (CSS, JS, fonts) or /_next/image, which must stay local.
const PROXIED_ENDPOINTS = [
  "login",
  "register",
  "logout",
  "game",
  "search",
  "favorite",
  "recommendation",
];

const nextConfig: NextConfig = {
  // Define production-grade asynchronous URL rewriting gateways [1]
  async rewrites() {
    return [
      {
        // 1. Match any local relative endpoint format inside our project code
        source: "/:path*",
        // 2. Silently proxy and forward traffic directly to the active live production cloud server
        destination:
          "https://tw-a0e97a20c74340f381de66828e634103.ecs.us-west-2.on.aws/:path*",
      },
    ];
  },
};

export default nextConfig;
