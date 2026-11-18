import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { SITE_URL } from "./site-config.mjs";

export default defineConfig({
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
  output: "static",
  site: SITE_URL
});
