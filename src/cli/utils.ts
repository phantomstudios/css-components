import fs from "fs";
import { extname } from "path";

import globTool from "glob-promise";
import sass from "sass";

type KeyValuePair = { [key: string]: string };

interface Config {
  [key: string]: {
    element: string;
    css: string;
    variants: {
      [key: string]: KeyValuePair;
    };
    compoundVariants: KeyValuePair[];
  };
}

export const extractStyles = (path: string) => {
  const fileContent =
    extname(path) === ".scss"
      ? sass.compile(path).css
      : fs.readFileSync(path).toString();

  return fileContent.match(
    /(h[1-6]|[a-zA-Z_]*)(?:[.]{1})([a-zA-Z_]+[\w\-_]*)(?:[\s\.\,\{\>#\:]{0})/gim
  );
};

export const stylesToConfig = (styles: string[]) => {
  const config: Config = {};
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
        }, {} as KeyValuePair);

        config[component].compoundVariants.push({
          ...vars,
          css: className,
        });
      }
    }
  });
  return config;
};

export const generateOutput = (config: Config, cssFilename: string) => {
  let s = "";
  s += `import { styled } from "@phantomstudios/css-components";\n\n`;
  s += `import css from "./${cssFilename}";\n\n`;

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
          if (config[key].variants[variant][option].endsWith("default"))
            s += `    ${variant}: "${option}",\n`;
        });
      });
      s += `  },\n`;
    }

    s += `});\n`;
  });

  return s;
};

export const findFiles = (glob: string) => globTool(glob);
