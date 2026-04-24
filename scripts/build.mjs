import * as esbuild from "esbuild";
import { chmodSync, mkdirSync } from "node:fs";

mkdirSync("dist", { recursive: true });

await esbuild.build({
  entryPoints: ["src/cli/index.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  outfile: "dist/cli.js",
  external: ["typescript", "@faker-js/faker", "commander"],
  banner: {
    js: "#!/usr/bin/env node",
  },
});

chmodSync("dist/cli.js", 0o755);
console.log("✓  dist/cli.js");
