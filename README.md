# @phntms/css-components

[![NPM version][npm-image]][npm-url]
[![Actions Status][ci-image]][ci-url]
[![PR Welcome][npm-downloads-image]][npm-downloads-url]

A simple, lightweight, and customizable CSS components library that lets you wrap your css styles in a component-like structure. Inspired by css-in-js libraries like [styled-components](https://styled-components.com/) and [stitches](https://stitches.dev/).

## Introduction

At its core, css-components is a simple wrapper around standard CSS. It allows you to write your CSS how you wish then compose them into a component ready to be used in React.

Here is a minimal example of a button component with an optional variant:

```ts
import { styled } from "@phntms/css-components";
import css from "./styles.module.css";

export const Button = styled("button", {
  css: css.root,
  variants: {
    primary: {
      true: css.primary,
    },
  },
});
```

This outputs a nice clean component that can be used in React:

```tsx
import { Button } from "./Button";

export const App = () => (
  <div>
    <Button>Default</Button>
    <Button primary>Primary</Button>
  </div>
);
```

## Installation

Install this package with `npm`.

```bash
npm i @phntms/css-components
```

## Usage

Here is a full example of a button component with an optional variant called `primary`:

components/Button/styles.module.css

```css
.root {
  background-color: grey;
  border-radius: 4px;
}

.primary {
  background-color: black;
}
```

components/Button/styles.ts

```ts
import { styled } from "@phntms/css-components";
import css from "./styles.module.css";

export const StyledButton = styled("button", {
  css: css.root,
  variants: {
    primary: {
      true: css.primary,
    },
  },
});
```

components/Button/index.tsx

```tsx
import { StyledButton } from "./styles.ts";

interface Props {
  title: string;
  onClick: () => void;
  primary?: boolean;
}

export const Button = ({ title, onClick, primary }: Props) => (
  <StyledButton onClick={onClick} primary={primary}>
    {title}
  </StyledButton>
);
```

## The variants config object

The variants config object is a simple object that allows you to define the variants that your component supports. Each variant is a key in the object and the value is an object that defines the possible values(css classes) for that variant.

```tsx
const StyledButton = styled("button", {
  css: css.root,
  variants: {
    big: {
      // Boolean values are supported
      true: css.big,
    },
    color: {
      // String values are supported
      primary: css.primary,
      secondary: css.secondary,
    },
    size: {
      // Number values are supported
      1: css.size1,
      2: css.size2,
    },
  },
});
```

## Default Variants

You can use the `defaultVariants` feature to set a variant by default:

```tsx
const StyledButton = styled("button", {
  css: css.root,
  variants: {
    big: {
      // Boolean values are supported
      true: css.big,
    },
  },
  defaultVariants: {
    big: true,
  },
});
```

## Compound Variants

For more complex variant setups you can use the compound variants argument to define what styles should be applied when multiple variants are used.

```tsx
const StyledButton = styled("button", {
  css: css.root,
  variants: {
    border: {
      true: css.bordered,
    },
    color: {
      primary: css.primary,
      secondary: css.secondary,
    },
  },
  compoundVariants: [
    {
      border: true,
      color: "primary",
      css: css.blueBorder,
    },
    {
      border: true,
      color: "secondary",
      css: css.greyBorder,
    },
  ],
});
```

## Other

### Array of Classes

Wherever you specify a css selector, you can also pass in an array of classes to help composing and reusing styles.

```tsx
import { styled } from "@phntms/css-components";
import shared from "../sharedstyles.module.css";
import css from "./styles.module.css";

const Link = styled("a", {
  css: [shared.link, shared.fontNormal, css.root],
  variants: {
    big: {
      true: [css.big, shared.fontBold],
    },
  },
});
```

### Other Components

You can also style other components from other ecosystems. As long as the component has a `className` prop, styling should propagate.

Example extending the standard Next.js `Link` component:

```tsx
import { styled } from "@phntms/css-components";
import NextLink from "next/link";
import css from "./styles.module.css";

const Link = styled(NextLink, {
  css: css.link,
  variants: {
    big: {
      true: css.big,
    },
  },
});
```

### DOM Shielding

By default variant values do not end up propagating to the final DOM element. This is to stop React specific runtime errors from occurring. If you do indeed want to pass a variant value to the DOM element, you can use the `domPassthrough` option.

In the following example, `readOnly` is an intrinsic HTML attribute that we both want to style, but also continue to pass through to the DOM element.

```tsx
import { CSSComponentPropType } from "@phntms/css-components";
import css from "./styles.module.css";

const Input = styled("input", {
  css: css.root,
  variants: {
    readOnly: {
      true: css.disabledStyle,
    },
  },
  domPassthrough: ["readOnly"],
});
```

### Type Helper

We have included a helper that allows you to access the types of the variants you have defined.

```tsx
import { CSSComponentPropType } from "@phntms/css-components";
import css from "./styles.module.css";

const Button = styled("button", {
  css: css.baseButton,
  variants: {
    primary: { true: css.primary },
  },
});

type ButtonTypes = CSSComponentPropType<typeof Button, "primary">;
```

## CLI Tool (Experimental)

We have included a CLI tool that allows you to generate components from CSS files which confirm to a specific naming convention. This is highly experimental and is subject to change.

Consider this CSS file:

```css
nav.topBar {
  background-color: #aaa;
  padding: 32px;
}

nav.topBar_fixed_true {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
```

You can generate a component from this file with the following command:

```bash
npx @phntms/css-components --css styles.module.css

# or if you have the package installed
npx css-components --css styles.module.css
```

This will output a file called `styles.ts` that looks like this:

```ts
import { styled } from "@phntms/css-components";

import css from "./test.css";

export const TopBar = styled("nav", {
  css: css.topBar,
  variants: {
    fixed: {
      true: css.topBar_fixed_true,
    },
  },
});
```

### Possible CSS definitions:

- `a.link` Allowing you to define a base style for the component. This means it will be an anchor tag with the css class `link`.
- `a.link_big_true` Lets you set the styling for a variant called `big` with the value `true`.
- `a.link_theme_light_default` Same as above but also sets the variant as the default value.
- `a.link_big_true_theme_light` Gives you the ability to define compound variants styles.

### CLI Options

- `--css` The path to the CSS file you want to generate a component from. This can also be a recursive glob pattern allowing you to scan your entire components directory.
- `--output` The filename for the output file. Defaults to `styles.ts` which will be saved in the same directory as the CSS file.
- `--overwrite` If the output file already exists, this will overwrite it. Defaults to `false`.

Example to generate components from all CSS files in the components directory:

```bash
npx @phntms/css-components --css ./src/components/**/*.css --output styles.ts
```

[npm-image]: https://img.shields.io/npm/v/@phntms/css-components.svg?style=flat-square&logo=react
[npm-url]: https://npmjs.org/package/@phntms/css-components
[npm-downloads-image]: https://img.shields.io/npm/dm/@phntms/css-components.svg
[npm-downloads-url]: https://npmcharts.com/compare/@phntms/css-components?minimal=true
[ci-image]: https://github.com/phantomstudios/css-components/workflows/test/badge.svg
[ci-url]: https://github.com/phantomstudios/css-components/actions
