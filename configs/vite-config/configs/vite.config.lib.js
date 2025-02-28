import { resolve } from "path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      tsconfigPath: resolve(process.cwd(), "tsconfig.app.json"),
    }),
    tailwindcss(),
  ],
  assetsInclude: ["/sb-preview/runtime.js"],
  build: {
    minify: true,
    sourcemap: true,
    lib: {
      entry: resolve(process.cwd(), "src/index.ts"),
      name: "index",
      formats: ["es"],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react-router-dom", "react-router"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
