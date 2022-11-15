const fs = require("fs");

const yargs = require("yargs/yargs");

const argv = yargs(process.argv.slice(2))
  .usage("Usage: $0 --css [file] --output [file]")
  .describe("css", "path to css file")
  .describe("output", "file path to save")
  .demandOption(["css"]).argv;

const cssFile = argv.css;
const outputFile = argv.output;

const extractStyles = (path) => {
  const buffer = fs.readFileSync(path);
  const fileContent = buffer.toString();
  return fileContent.match(
    /([a-zA-Z_]*)(?:[.]{1})([a-zA-Z_]+[\w\-_]*)(?:[\s\.\,\{\>#\:]{0})/gim
  );
};

const stylesToConfig = (styles) => {
  const config = {};
  styles.forEach((item) => {
    const parts = item.split(".");
    const element = parts[0];
    const className = parts[1];
    const chunks = className.split("_");

    if (chunks.length === 2) return;

    if (chunks.length >= 1) {
      const component = chunks[0];

      if (!config[component]) {
        config[component] = {
          variants: {},
          compoundVariants: [],
          css: component,
          element,
        };
      }

      if (chunks.length === 3 || chunks.length === 4) {
        const variant = chunks[1];
        const option = chunks[2];
        if (!config[component].variants[variant]) {
          config[component].variants[variant] = {};
        }
        config[component].variants[variant][option] = className;
      } else if (chunks.length > 4) {
        const variants = chunks.slice(1, chunks.length);

        const vars = variants.reduce((acc, cur, i, arr) => {
          if (i % 2 !== 0 || i + 1 >= arr.length) return acc;
          acc[cur] = arr[i + 1];
          return acc;
        }, {});
        config[component].compoundVariants.push({
          ...vars,
          css: className,
        });
      }
    }
  });
  return config;
};

const styles = extractStyles(
  cssFile
  // "/Users/john.chipps-harding/Projects/css-components/styles.module.css"
  // "./styles.module.css"
);
const config = stylesToConfig(styles);

let s = "";
s += `import { styled } from "@phntms/css-components;\n\n`;
s += `import css from "./styles.module.css";\n\n`;

Object.keys(config).forEach((key) => {
  const hasVariants = Object.keys(config[key].variants).length > 0;
  const hasCompoundVariants = config[key].compoundVariants.length > 0;
  const componentName = key.charAt(0).toUpperCase() + key.slice(1);
  s += `export const ${componentName} = styled("${config[key].element}", {\n`;

  s += `  css: css.${key},\n`;
  if (hasVariants) {
    s += `  variants: {\n`;
    Object.keys(config[key].variants).forEach((variant) => {
      s += `    ${variant}: {\n`;
      Object.keys(config[key].variants[variant]).forEach((option) => {
        s += `      ${option}: css.${config[key].variants[variant][option]},\n`;
      });
      s += `    },\n`;
    });
    s += `  },\n`;
  }

  if (hasCompoundVariants) {
    s += `  compoundVariants: [\n`;
    config[key].compoundVariants.forEach((variant) => {
      s += `    {\n`;
      Object.keys(variant).forEach((key) => {
        s += `      ${key}: css.${variant[key]},\n`;
      });
      s += `    },\n`;
    });
    s += `  ],\n`;
  }

  if (hasVariants) {
    s += `  defaultVariants: {\n`;
    Object.keys(config[key].variants).forEach((variant) => {
      Object.keys(config[key].variants[variant]).forEach((option) => {
        // console.log("----->", config[key].variants[variant][option]);
        if (config[key].variants[variant][option].endsWith("default"))
          s += `    ${variant}: "${option}",\n`;
      });
    });
    s += `  },\n`;
  }

  s += `});\n`;
  s += `\n`;
});

fs.writeFileSync(outputFile, s);

// console.log("config", config.footer);
// console.log();
console.log(s);
