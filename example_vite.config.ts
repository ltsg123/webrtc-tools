import pkg from "./package.json";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  plugins: [],
  envDir: "dev/main.ts",
  build: {
    minify: "terser",
    lib: {
      name: pkg.name,
      fileName: (format) => {
        if (format === "umd") {
          return "index.js";
        }
      },
      entry: "dev/index.ts",
      formats: ["umd"],
    },
    outDir: "example",
    sourcemap: false,
  },
});
