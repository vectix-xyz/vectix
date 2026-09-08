import { defineConfig } from "bun";

// Оскільки у тебе багато точок входу (subpath exports), опишемо їх
const entrypoints = [
  "./src/index.ts",
  "./src/constants/index.ts",
  "./src/dto/requests/index.ts",
  "./src/dto/responses/index.ts",
  "./src/enums/index.ts",
  "./src/exceptions/index.ts",
  "./src/types/index.ts",
  "./src/validators/index.ts",
];

await Bun.build({
  entrypoints,
  outdir: "./dist",
  target: "node",
  format: "esm",
  sourcemap: "external",
  external: ["*"],
});
