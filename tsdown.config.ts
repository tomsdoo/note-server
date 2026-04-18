import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  clean: true,
  dts: false,
  minify: true,
  format: "esm",
  outDir: "dist",
  target: false,
  outputOptions: {
    codeSplitting: false,
  },
});
