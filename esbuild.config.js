const { build } = require("esbuild");

build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  outfile: "dist/wedding.js",
  packages: "external",
  minify: true,
  logLevel: "debug",
  sourcemap: "linked",
}).catch(() => process.exit(1));
