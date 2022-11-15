const fs = require("fs");

const extractStyles = (path) => {
  const buffer = fs.readFileSync(path);
  const fileContent = buffer.toString();
  return fileContent.match(
    /(?:[\.]{1})([a-zA-Z_]+[\w-_]*)(?:[\s\.\,\{\>#\:]{0})/gim
  );
};

const stylesToConfig = (styles) => {
  const config = {};
  styles.forEach((item) => {
    const withoutDot = item.replace(".", "");
    const chunks = withoutDot.split("-");
    if (chunks.length === 1) {
      const component = chunks[0];
      if (!config[component]) {
        config[component] = { variants: {}, compoundVariants: [] };
      }
    } else if (chunks.length === 3) {
      const component = chunks[0];
      const variant = chunks[1];
      const option = chunks[2];
      if (!config[component]) {
        config[component] = { variants: {}, compoundVariants: [] };
      }
      if (!config[component].variants[variant]) {
        config[component].variants[variant] = {};
      }
      config[component].variants[variant][option] = withoutDot;
    } else if (chunks.length > 3) {
      const component = chunks[0];
      const variants = chunks.slice(1, chunks.length);

      const vars = variants.reduce((acc, cur, i, arr) => {
        if (i % 2 !== 0 || i + 1 >= arr.length) return acc;
        acc[cur] = arr[i + 1];
        return acc;
      }, {});

      if (!config[component]) {
        config[component] = { variants: {}, compoundVariants: [] };
      }

      config[component].compoundVariants.push({ ...vars, css: withoutDot });
      // if (!config[component].variants[variant]) {
      //   config[component].variants[variant] = {};
      // }

      // console.log("vars", vars);
    }
  });
  return config;
};

const styles = extractStyles(
  "/Users/john.chipps-harding/Projects/css-components/styles.module.css"
);
const config = stylesToConfig(styles);

let s = "";

Object.keys(config).forEach((key) => {
  const hasVariants = Object.keys(config[key].variants).length > 0;
  const hasCompoundVariants = config[key].compoundVariants.length > 0;
  const componentName = key.charAt(0).toUpperCase() + key.slice(1);
  s += `export const ${componentName} = styled("footer", {\n`;

  s += `  css: css.${key}\n`;
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
    s += `  compoundVariants: {\n`;
    config[key].compoundVariants.forEach((variant) => {
      Object.keys(variant).forEach((key) => {
        s += `    ${key}: "${variant[key]}",\n`;
      });
    });
    s += `  },\n`;
  }

  s += `};\n`;
  s += `\n`;
});

// console.log("config", config.footer);
console.log();
console.log(s);
