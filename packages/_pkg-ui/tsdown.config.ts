import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: false,
  treeshake: true,
  minify: false,
  external: ["react", "zustand", "zod", "react/jsx-runtime"],
});
