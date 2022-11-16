import fs from "fs";
import path from "path";

import yargs from "yargs/yargs";

import {
  extractStyles,
  findFiles,
  generateOutput,
  stylesToConfig,
} from "./utils";

const argv = yargs(process.argv.slice(2))
  .options({
    css: {
      type: "string",
      describe: "path to css file, or glob pattern",
      demandOption: true,
    },
    output: {
      type: "string",
      describe: "filename to save alongside the css file",
      default: "styles.ts",
    },
  })
  .parseSync();

const cssFile = argv.css;
const outputFileName = argv.output;

findFiles(cssFile).then((files) => {
  files.forEach((file) => {
    const styles = extractStyles(file);
    const config = stylesToConfig(styles || []);
    const output = generateOutput(config, path.basename(file));
    const folder = path.dirname(file);
    const outputPath = path.join(folder, outputFileName);

    fs.writeFileSync(outputPath, output);
    console.log(
      `${Object.keys(config).length} components written to: ${outputPath}`
    );
  });
});
