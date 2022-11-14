import { cssType, variantValue } from "./type";

export const findMatchingCompoundVariants = (
  compoundVariants: {
    [key: string]: variantValue;
  }[],
  props: {
    [key: string]: variantValue;
  }
) =>
  compoundVariants.filter((compoundVariant) =>
    Object.keys(compoundVariant).every(
      (key) => key === "css" || compoundVariant[key] === props[key]
    )
  );

export const flattenCss = (css: cssType) =>
  Array.isArray(css) ? css.join(" ") : css;
