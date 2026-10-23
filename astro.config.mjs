import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://rivaldidev.work",
  output: "static",
  trailingSlash: "never",
  build: { format: "file", inlineStylesheets: "auto" },
  compressHTML: true,
});
