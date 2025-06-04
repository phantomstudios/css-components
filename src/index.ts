import { createElement, forwardRef } from "react";

import {
  CSSComponentConfig,
  CSS,
  PolymorphicComponent,
  variantsType,
} from "./type";
import { findMatchingCompoundVariants, flattenCss } from "./utils";

export { CSSComponentConfig, CSS, VariantProps } from "./type";

export const styled = <
  V extends variantsType | object,
  E extends React.ElementType,
>(
  element: E,
  config?: CSSComponentConfig<V>,
) => {
  const styledComponent = forwardRef<E, { [key: string]: string }>(
    (props, ref) => {
      const mergedProps = { ...config?.defaultVariants, ...props } as {
        [key: string]: string;
      };

      // Initialize variables to store the new props and styles
      const componentProps: { [key: string]: unknown } = {};
      const componentStyles: string[] = [];

      // Pass through an existing className if it exists
      if (mergedProps.className) componentStyles.push(mergedProps.className);

      // Add the base style(s)
      if (config?.css) componentStyles.push(flattenCss(config.css));

      // Pass through the ref
      if (ref) componentProps.ref = ref;

      Object.keys(mergedProps).forEach((key) => {
        // Apply any variant styles
        if (
          config?.variants &&
          Object.prototype.hasOwnProperty.call(config.variants, key)
        ) {
          const variant = config.variants[key as keyof typeof config.variants];
          if (
            variant &&
            Object.prototype.hasOwnProperty.call(variant, mergedProps[key])
          ) {
            const selector = variant[
              mergedProps[key] as keyof typeof variant
            ] as CSS;
            componentStyles.push(flattenCss(selector));
          }
        }

        const isVariant =
          config?.variants &&
          Object.prototype.hasOwnProperty.call(config.variants, key);

        // Only pass through the prop if it's not a variant or been told to pass through
        if (isVariant && !config?.passthrough?.includes(key as keyof V)) return;

        componentProps[key] = mergedProps[key];
      });

      // Apply any compound variant styles
      if (config?.compoundVariants) {
        const matches = findMatchingCompoundVariants(
          config.compoundVariants,
          mergedProps,
        );

        matches.forEach((match) => {
          componentStyles.push(flattenCss(match.css as CSS));
        });
      }

      componentProps.className = componentStyles.join(" ");
      styledComponent.displayName = element.toString();
      return createElement(element, componentProps);
    },
  );

  return styledComponent as PolymorphicComponent<E, V>;
};
