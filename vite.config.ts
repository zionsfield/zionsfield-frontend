import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import type { ManifestOptions, VitePWAOptions } from "vite-plugin-pwa";
// import { VitePWA } from "vite-plugin-pwa";
import replace from "@rollup/plugin-replace";

const pwaOptions: Partial<VitePWAOptions> = {
  mode: "development",
  base: "/",
  includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
  manifest: {
    name: "Proudly Zionsfield",
    short_name: "Proudly Zionsfield",
    description: "Zionsfield website",
    theme_color: "#ffffff",
    icons: [
      {
        src: "pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  },
  devOptions: {
    enabled: process.env.SW_DEV === "true",
    /* when using generateSW the PWA plugin will switch to classic */
    type: "module",
    navigateFallback: "index.html",
  },
};

const replaceOptions = { __DATE__: new Date().toISOString() };
const claims = process.env.CLAIMS === "true";
const reload = process.env.RELOAD_SW === "true";
const selfDestroying = process.env.SW_DESTROY === "true";

if (process.env.SW === "true") {
  pwaOptions.srcDir = "src";
  pwaOptions.filename = claims ? "claims-sw.ts" : "prompt-sw.ts";
  pwaOptions.strategies = "injectManifest";
  (pwaOptions.manifest as Partial<ManifestOptions>).name =
    "PWA Inject Manifest";
  (pwaOptions.manifest as Partial<ManifestOptions>).short_name = "PWA Inject";
}

if (claims) pwaOptions.registerType = "autoUpdate";

if (reload) {
  // @ts-expect-error just ignore
  replaceOptions.__RELOAD_SW__ = "true";
}

if (selfDestroying) pwaOptions.selfDestroying = selfDestroying;

export default defineConfig({
  // base: process.env.BASE_URL || 'https://github.com/',
  build: {
    sourcemap: process.env.SOURCE_MAP === "true",
  },
  plugins: [reactRefresh(), VitePWA(pwaOptions), replace(replaceOptions)],
});

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [
//     VitePWA({
//       registerType: "autoUpdate",
//       injectRegister: "script",
//       devOptions: {
//         enabled: process.env.NODE_ENV === "development",
//       },
//       workbox: {
//         cleanupOutdatedCaches: true,
//         globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
//       },
//       includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
//       manifest: {
//         name: "Zionsfield",
//         short_name: "Zionsfield",
//         description: "Zionsfield website",
//         theme_color: "#ffffff",
//         icons: [
//           {
//             src: "pwa-192x192.png",
//             sizes: "192x192",
//             type: "image/png",
//           },
//           {
//             src: "pwa-512x512.png",
//             sizes: "512x512",
//             type: "image/png",
//           },
//           {
//             src: "pwa-512x512.png",
//             sizes: "512x512",
//             type: "image/png",
//             purpose: "any maskable",
//           },
//         ],
//       },
//     }),
//   ],
// });
