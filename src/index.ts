import { createElement, forwardRef, JSXElementConstructor } from "react";

import {
  BooleanIfStringBoolean,
  CompoundVariantType,
  cssType,
  PolymorphicComponent,
  variantsType,
} from "./type";

export type CSSComponentPropType<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  C extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
  P extends keyof React.ComponentProps<C>
> = React.ComponentProps<C>[P];

interface Config<V> {
  css?: cssType;
  variants?: V;
  compoundVariants?: CompoundVariantType<V>[];
  defaultVariants?: {
    [Property in keyof V]?: BooleanIfStringBoolean<keyof V[Property]>;
  };
}

export const styled = <
  V extends variantsType | object,
  E extends React.ElementType
>(
  element: E,
  config?: Config<V>
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
      if (props.className) componentStyles.push(props.className);

      // Add the base style(s)
      if (config?.css) componentStyles.push(flattenCss(config.css));

      // Pass through the ref
      if (ref) componentProps.ref = ref;

      // Apply any variant styles
      Object.keys(mergedProps).forEach((key) => {
        if (config?.variants && config.variants.hasOwnProperty(key)) {
          const variant = config.variants[key as keyof typeof config.variants];
          if (variant && variant.hasOwnProperty(mergedProps[key])) {
            const selector = variant[
              mergedProps[key] as keyof typeof variant
            ] as cssType;
            componentStyles.push(flattenCss(selector));
          }
        } else {
          componentProps[key] = props[key];
        }
      });

      // Apply any compound variant styles
      if (config?.compoundVariants) {
        const matches = findMatchingCompoundVariants(
          config.compoundVariants,
          props
        );

        matches.forEach((match) => {
          if (Array.isArray(match.css)) {
            componentStyles.push(match.css.join(" "));
          } else if (typeof match.css === "string") {
            componentStyles.push(match.css);
          }
        });
      }

      componentProps.className = componentStyles.join(" ");
      styledComponent.displayName = element.toString();
      return createElement(element, componentProps);
    }
  );

  return styledComponent as PolymorphicComponent<E, V>;
};
