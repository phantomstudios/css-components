import { styled } from "@phantomstudios/css-components";

import css from "./test.css";

export const AlmostEmpty = styled("div", {
  css: css.almostEmpty,
});
export const Footer = styled("footer", {
  css: css.footer,
  variants: {
    fixed: {
      true: css.footer_fixed_true,
    },
    theme: {
      light: css.footer_theme_light_default,
      dark: css.footer_theme_dark,
    },
  },
  compoundVariants: [
    {
      fixed: css.true,
      theme: css.light,
      css: css.footer_fixed_true_theme_light,
    },
    {
      fixed: css.false,
      theme: css.light,
      css: css.footer_fixed_false_theme_light,
    },
  ],
  defaultVariants: {
    theme: "light",
  },
});
export const Link = styled("a", {
  css: css.link,
  variants: {
    primary: {
      true: css.link_primary_true,
    },
  },
  defaultVariants: {
  },
});
