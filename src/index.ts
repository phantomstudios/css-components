import { createElement, forwardRef } from "react";

type variantValue = string | number | boolean;

// An object of variants, and how they map to CSS styles
type variantsType = {
  [key: string]: { [key: string | number]: string | string[] };
};

type compoundVariantType = {
  [key: string]: variantValue;
} & {
  css: string | string[];
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

const styled = <V extends variantsType, E extends React.ElementType>(
  element: E,
  baseClassName: string | string[],
  variants?: V,
  compoundVariants?: compoundVariantType[]
) => {
  const styledComponent = forwardRef<E, { [key: string]: string }>(
    (props, ref) => {
      // Initialize variables to store the new props and styles
      const componentProps: { [key: string]: unknown } = {};
      const componentStyles: string[] = [];

      // Pass through an existing className if it exists
      if (props.className) componentStyles.push(props.className);

      // Pass through the ref
      if (ref) componentProps.ref = ref;

      // Add the base style(s)
      componentStyles.push(
        Array.isArray(baseClassName) ? baseClassName.join(" ") : baseClassName
      );

      // Apply any variant styles
      Object.keys(props).forEach((key) => {
        if (variants && variants.hasOwnProperty(key)) {
          if (variants[key].hasOwnProperty(props[key])) {
            const selector = variants[key][props[key]];
            componentStyles.push(
              Array.isArray(selector) ? selector.join(" ") : selector
            );
          }
        } else {
          componentProps[key] = props[key];
        }
      });

      // Apply any compound variant styles
      if (compoundVariants) {
        const matches = findMatchingCompoundVariants(compoundVariants, props);

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
      console.log(styledComponent.displayName);
      return createElement(element, componentProps);
    }
  );

  return styledComponent as React.FC<
    PropsOf<E> & {
      [Property in keyof V]?: BooleanIfStringBoolean<keyof V[Property]>;
    }
  >;
};

export default styled;
