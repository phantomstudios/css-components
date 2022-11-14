import { createElement, forwardRef, JSXElementConstructor } from "react";

export type CSSComponentPropType<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  C extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
  P extends keyof React.ComponentProps<C>
> = React.ComponentProps<C>[P];

type cssType = string | string[];

type variantValue = string | number | boolean | string[];

// An object of variants, and how they map to CSS styles
type variantsType = Partial<{
  [key: string]: { [key: string | number]: cssType };
}>;

type VariantOptions<V> = {
  [Property in keyof V]?: BooleanIfStringBoolean<keyof V[Property]>;
};

type CompoundVariantType<V> = VariantOptions<V> & {
  css: cssType;
};

// Does the type being passed in look like a boolean? If so, return the boolean.
type BooleanIfStringBoolean<T> = T extends "true" | "false" ? boolean : T;

const findMatchingCompoundVariants = (
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

// Source: https://github.com/emotion-js/emotion/blob/master/packages/styled-base/types/helper.d.ts
// A more precise version of just React.ComponentPropsWithoutRef on its own
export type PropsOf<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  C extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>
> = JSX.LibraryManagedAttributes<C, React.ComponentPropsWithoutRef<C>>;

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
      if (config?.css)
        componentStyles.push(
          Array.isArray(config.css) ? config.css.join(" ") : config.css
        );

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
            componentStyles.push(
              Array.isArray(selector) ? selector.join(" ") : selector
            );
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

  return styledComponent as React.FC<
    React.ComponentProps<E> & VariantOptions<V>
  >;
};
