// Mostly lifted from here: https://www.benmvp.com/blog/forwarding-refs-polymorphic-react-component-typescript/

// Source: https://github.com/emotion-js/emotion/blob/master/packages/styled-base/types/helper.d.ts
// A more precise version of just React.ComponentPropsWithoutRef on its own
export type PropsOf<
  C extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>
> = JSX.LibraryManagedAttributes<C, React.ComponentPropsWithoutRef<C>>;

/**
 * Allows for extending a set of props (`ExtendedProps`) by an overriding set of props
 * (`OverrideProps`), ensuring that any duplicates are overridden by the overriding
 * set of props.
 */
export type ExtendableProps<
  ExtendedProps = Record<string, unknown>,
  OverrideProps = Record<string, unknown>
> = OverrideProps & Omit<ExtendedProps, keyof OverrideProps>;

/**
 * Allows for inheriting the props from the specified element type so that
 * props like children, className & style work, as well as element-specific
 * attributes like aria roles. The component (`C`) must be passed in.
 */
export type InheritableElementProps<
  C extends React.ElementType,
  Props = Record<string, unknown>
> = ExtendableProps<PropsOf<C>, Props>;

export type PolymorphicRef<C extends React.ElementType> =
  React.ComponentPropsWithRef<C>["ref"];

export type PolymorphicComponentProps<
  C extends React.ElementType,
  Props = Record<string, unknown>
> = InheritableElementProps<C, Props>;

export type PolymorphicComponentPropsWithRef<
  C extends React.ElementType,
  Props = Record<string, unknown>
> = PolymorphicComponentProps<C, Props> & { ref?: PolymorphicRef<C> };

export type PolymorphicComponent<
  E extends React.ElementType,
  V extends variantsType | object
> = React.FC<PolymorphicComponentPropsWithRef<E, VariantOptions<V>>>;

export type cssType = string | string[];

export type variantValue = string | number | boolean | string[];

// An object of variants, and how they map to CSS styles
export type variantsType = Partial<{
  [key: string]: { [key: string | number]: cssType };
}>;

/**
 * Returns a boolean type if a "true" or "false" string type is passed in.
 */
export type BooleanIfStringBoolean<T> = T extends "true" | "false"
  ? boolean
  : T;

/**
 * Returns a type object containing the variants and their possible values.
 */
export type VariantOptions<V> = {
  [Property in keyof V]?: BooleanIfStringBoolean<keyof V[Property]>;
};

/**
 * Returns a type object for compound variants.
 */
export type CompoundVariantType<V> = VariantOptions<V> & {
  css: cssType;
};
