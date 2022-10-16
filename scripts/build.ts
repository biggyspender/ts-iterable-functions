import path from "path";
import { build as esbuild, BuildOptions } from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";
import { resolveToEsbuildTarget } from "esbuild-plugin-browserslist";
import browserslist from "browserslist";
// import * as fs from "fs";

const target = resolveToEsbuildTarget(browserslist("since 2019 and not dead"), {
  printUnknownTargets: false,
});

//console.log("target", target.join(", "));

const baseConfig: BuildOptions = {
  platform: "node",
  target,
  //target: "esnext",
  format: "cjs",
  nodePaths: [path.join(__dirname, "../src")],
  sourcemap: true,
  bundle: true,
  minify: true,
  mangleProps: /_$/,
  treeShaking: true,
  plugins: [nodeExternalsPlugin()],
};

async function main() {
  // const resultCJS =
  await esbuild({
    ...baseConfig,
    outdir: path.join(__dirname, "../build/cjs"),
    entryPoints: [path.join(__dirname, "../src/index.ts")],
    // metafile: true,
  });

  // const resultESM =
  await esbuild({
    ...baseConfig,
    format: "esm",
    outdir: path.join(__dirname, "../build/esm"),
    entryPoints: [path.join(__dirname, "../src/index.ts")],
    // metafile: true,
  });
  // fs.writeFileSync("metaCJS.json", JSON.stringify(resultCJS.metafile));
  // fs.writeFileSync("metaESM.json", JSON.stringify(resultESM.metafile));
}

if (require.main === module) {
  main();
}
