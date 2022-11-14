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

export const Button = styled("button", css.root, {
  primary: {
    true: css.primary,
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

export const StyledButton = styled("button", css.root, {
  primary: {
    true: css.primary,
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
const StyledButton = styled("button", css.root, {
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
});
```

## Compound Variants

For more complex variant setups you can use the compound variants argument to define what styles should be applied when multiple variants are used.

```tsx
const StyledButton = styled(
  "button",
  css.root,
  {
    border: {
      true: css.bordered,
    },
    color: {
      primary: css.primary,
      secondary: css.secondary,
    },
  },
  [
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
  ]
);
```

## Other

### Array of Classes

Wherever you specify a css selector, you can also pass in an array of classes to help composing and reusing styles.

```tsx
import { styled } from "@phntms/css-components";
import shared from "../sharedstyles.module.css";
import css from "./styles.module.css";

const Link = styled("a", [shared.link, shared.fontNormal, css.root], {
  big: {
    true: [css.big, shared.fontBold],
  },
});
```

### Type Helper

We have included a helper that allows you to access the types of the variants you have defined.

```tsx
import { CSSComponentPropType } from "@phntms/css-components";
import css from "./styles.module.css";

const Button = styled("button", css.baseButton, { primary: { true: css.primary } });

type ButtonTypes = CSSComponentPropType<typeof Button, "primary">;
```

[npm-image]: https://img.shields.io/npm/v/@phntms/css-components.svg?style=flat-square&logo=react
[npm-url]: https://npmjs.org/package/@phntms/css-components
[npm-downloads-image]: https://img.shields.io/npm/dm/@phntms/css-components.svg
[npm-downloads-url]: https://npmcharts.com/compare/@phntms/css-components?minimal=true
[ci-image]: https://github.com/phantomstudios/css-components/workflows/test/badge.svg
[ci-url]: https://github.com/phantomstudios/css-components/actions
