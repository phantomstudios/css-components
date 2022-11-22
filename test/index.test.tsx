/**
 * @jest-environment jsdom
 */

import React from "react";

import { render } from "@testing-library/react";
import { expectTypeOf } from "expect-type";

import { VariantProps, styled } from "../src";

describe("Basic functionality", () => {
  it("should return the correct type of DOM node", async () => {
    const Button = styled("button");
    const { container } = render(<Button />);
    expect(container.firstChild?.nodeName).toEqual("BUTTON");
  });

  it("should apply the base class", async () => {
    const Button = styled("button", { css: "root" });
    const { container } = render(<Button />);
    expect(container.firstChild).toHaveClass("root");
  });

  it("should pass through children", async () => {
    const Paragraph = styled("p");
    const { container } = render(<Paragraph>Hello</Paragraph>);
    expect(container.firstChild).toHaveTextContent("Hello");
  });

  it("should pass through classNames", async () => {
    const Paragraph = styled("p", { css: "paragraph" });
    const { container } = render(
      <Paragraph className="summary">Hello</Paragraph>
    );
    expect(container.firstChild).toHaveClass("paragraph");
    expect(container.firstChild).toHaveClass("summary");
  });

  it("should pass through multiple children", async () => {
    const Article = styled("article");
    const { container } = render(
      <Article>
        <h1>Title</h1>
        <p>Description</p>
      </Article>
    );
    expect(container.firstChild).toHaveTextContent("Title");
    expect(container.firstChild).toHaveTextContent("Description");
  });

  it("should provide typescript support for built in types", async () => {
    const Input = styled("input");
    const onChange = jest.fn();
    const { container } = render(<Input value="test" onChange={onChange} />);
    expect(container.firstChild).toHaveAttribute("value", "test");
  });

  it("should provide support for data attributes", async () => {
    const Input = styled("input");
    const onChange = jest.fn();
    const { container } = render(
      <Input value={"test"} onChange={onChange} data-section="Login Form" />
    );
    expect(container.firstChild).toHaveAttribute("data-section", "Login Form");
  });
});

describe("supports variants and compound variants", () => {
  it("should work with a single boolean variant but not set", async () => {
    const Button = styled("button", {
      css: "root",
      variants: {
        primary: { true: "primary" },
      },
    });

    const { container } = render(<Button />);

    expect(container.firstChild).toHaveClass("root");
    expect(container.firstChild).not.toHaveClass("primary");
  });

  it("should work with a single boolean variant", async () => {
    const Button = styled("button", {
      css: "root",
      variants: {
        primary: { true: "primary" },
      },
    });

    const { container } = render(<Button primary />);

    expect(container.firstChild).toHaveClass("root");
    expect(container.firstChild).toHaveClass("primary");
  });

  it("should work with a multiple variants", async () => {
    const PageTitle = styled("h2", {
      css: "root",
      variants: {
        highlighted: { true: "highlighted" },
        size: { 0: "size0", 1: "size1" },
        align: { left: "left", center: "center", right: "right" },
      },
    });

    const { container } = render(
      <PageTitle highlighted size={0} align="left" />
    );

    expect(container.firstChild).toHaveClass("root");
    expect(container.firstChild).toHaveClass("highlighted");
    expect(container.firstChild).toHaveClass("size0");
    expect(container.firstChild).toHaveClass("left");
    expect(container.firstChild).not.toHaveClass("center");
    expect(container.firstChild).not.toHaveClass("right");
    expect(container.firstChild).not.toHaveClass("size1");
  });

  it("should work with compound variants", async () => {
    const Button = styled("button", {
      css: "root",
      variants: {
        border: {
          true: "borderTrue",
        },
        color: {
          primary: "colorPrimary",
          secondary: "colorSecondary",
        },
      },
      compoundVariants: [
        {
          border: true,
          color: "primary",
          css: "borderPrimary",
        },
        {
          border: true,
          color: "secondary",
          css: "borderSecondary",
        },
      ],
    });

    const { container } = render(<Button border color={"primary"} />);

    expect(container.firstChild).toHaveClass("root");
    expect(container.firstChild).toHaveClass("borderTrue");
    expect(container.firstChild).toHaveClass("colorPrimary");
    expect(container.firstChild).toHaveClass("borderPrimary");
    expect(container.firstChild).not.toHaveClass("borderSecondary");
    expect(container.firstChild).not.toHaveClass("colorSecondary");
  });

  it("should work with compound variants and defaults", async () => {
    const Button = styled("button", {
      css: "root",
      variants: {
        border: {
          true: "borderTrue",
        },
        color: {
          primary: "colorPrimary",
          secondary: "colorSecondary",
        },
      },
      compoundVariants: [
        {
          border: true,
          color: "primary",
          css: "borderPrimary",
        },
        {
          border: true,
          color: "secondary",
          css: "borderSecondary",
        },
      ],
      defaultVariants: {
        border: true,
        color: "primary",
      },
    });

    const { container } = render(<Button />);

    expect(container.firstChild).toHaveClass("root");
    expect(container.firstChild).toHaveClass("borderTrue");
    expect(container.firstChild).toHaveClass("colorPrimary");
    expect(container.firstChild).toHaveClass("borderPrimary");
    expect(container.firstChild).not.toHaveClass("borderSecondary");
    expect(container.firstChild).not.toHaveClass("colorSecondary");
  });

  it("Should support default variants", async () => {
    const Button = styled("button", {
      css: "test",
      variants: { primary: { true: "primary", false: "secondary" } },
      defaultVariants: { primary: true },
    });

    const { container } = render(<Button />);

    expect(container.firstChild).toHaveClass("primary");
  });
});

describe("supports array styles", () => {
  it("should should apply the base classes", async () => {
    const Button = styled("button", { css: ["baseButton", "button"] });
    const { container } = render(<Button />);
    expect(container.firstChild).toHaveClass("baseButton");
    expect(container.firstChild).toHaveClass("button");
  });

  it("should should apply the base classes", async () => {
    const Button = styled("button", {
      css: ["baseButton", "button"],
      variants: {
        primary: { true: ["primary", "bold"] },
        big: { true: ["big"] },
      },
      compoundVariants: [
        {
          primary: true,
          big: true,
          css: ["primaryBig", "primaryBigBold"],
        },
      ],
    });
    const { container } = render(<Button primary big />);
    expect(container.firstChild).toHaveClass("baseButton");
    expect(container.firstChild).toHaveClass("button");
    expect(container.firstChild).toHaveClass("primary");
    expect(container.firstChild).toHaveClass("bold");
    expect(container.firstChild).toHaveClass("big");
    expect(container.firstChild).toHaveClass("primaryBig");
    expect(container.firstChild).toHaveClass("primaryBigBold");
  });
});

describe("supports more exotic setups", () => {
  it("should be able to style nested react components", async () => {
    const BaseButton = styled("button", {
      css: "baseButton",
      variants: {
        size: { big: "big", small: "small" },
      },
    });
    const Button = styled(BaseButton, {
      css: "button",
      variants: {
        color: { primary: "colorPrimary", secondary: "colorSecondary" },
      },
    });
    const { container } = render(<Button size="big" color="primary" />);

    expect(container.firstChild?.nodeName).toEqual("BUTTON");
    expect(container.firstChild).toHaveClass("baseButton");
    expect(container.firstChild).toHaveClass("button");
    expect(container.firstChild).toHaveClass("big");
    expect(container.firstChild).toHaveClass("colorPrimary");
  });

  it("should pass down refs", async () => {
    const Button = styled("button");
    const ref = jest.fn();
    const { container } = render(<Button ref={ref} />);
    expect(container.firstChild?.nodeName).toEqual("BUTTON");
    expect(ref).toBeCalled();
  });

  it("should be able to inspect the variants", async () => {
    const Button = styled("button", {
      css: "test",
      variants: { primary: { true: "primary" } },
    });

    type primaryType = VariantProps<typeof Button>["primary"];

    expectTypeOf<primaryType>().toMatchTypeOf<boolean | undefined>();
  });

  it("should be able to use existing props as variants", async () => {
    const Option = styled("option", {
      css: "test",
      variants: { selected: { true: "primary" } },
    });
    const { container } = render(<Option selected>Option 1</Option>);

    expect(container.firstChild).toHaveClass("primary");
  });
});

describe("supports inheritance", () => {
  it("should handle component composition", async () => {
    const BaseButton = styled("button", {
      css: "baseButton",
      variants: {
        big: { true: "big" },
      },
    });

    const CheckoutButton = styled(BaseButton, {
      css: "checkoutButton",
    });

    const { container } = render(<CheckoutButton big />);

    expect(container.firstChild?.nodeName).toEqual("BUTTON");
    expect(container.firstChild).toHaveClass("baseButton");
    expect(container.firstChild).toHaveClass("checkoutButton");
    expect(container.firstChild).toHaveClass("big");
  });

  it("should handle component composition when overriding variants", async () => {
    const BaseButton = styled("button", {
      css: "baseButton",
      variants: {
        big: { true: "big" },
      },
    });

    const CheckoutButton = styled(BaseButton, {
      css: "checkoutButton",
      variants: {
        big: { true: "checkoutButtonBig" },
      },
    });

    const { container } = render(<CheckoutButton big />);

    expect(container.firstChild?.nodeName).toEqual("BUTTON");
    expect(container.firstChild).toHaveClass("baseButton");
    expect(container.firstChild).toHaveClass("checkoutButton");
    expect(container.firstChild).toHaveClass("big");
    expect(container.firstChild).toHaveClass("checkoutButtonBig");
  });

  it("should handle component composition with default variants", async () => {
    const BaseButton = styled("button", {
      css: "baseButton",
      variants: {
        big: { true: "baseButtonBig" },
        theme: {
          primary: "baseButtonPrimary",
          secondary: "baseButtonSecondary",
        },
        anotherBool: { true: "baseButtonAnotherBool" },
      },
      defaultVariants: {
        big: true,
        theme: "primary",
        anotherBool: true,
      },
    });

    const CheckoutButton = styled(BaseButton, {
      css: "checkoutButton",
      variants: {
        big: { true: "checkoutButtonBig" },
        theme: {
          primary: "checkoutButtonPrimary",
          secondary: "checkoutButtonSecondary",
        },
        anotherBool: { true: "checkoutButtonAnotherBool" },
      },
      defaultVariants: {
        big: true,
        anotherBool: true,
        theme: "primary",
      },
    });

    const { container } = render(<CheckoutButton />);

    expect(container.firstChild?.nodeName).toEqual("BUTTON");

    expect(container.firstChild).toHaveClass("baseButton");
    expect(container.firstChild).toHaveClass("baseButtonBig");
    expect(container.firstChild).toHaveClass("baseButtonPrimary");
    expect(container.firstChild).toHaveClass("baseButtonAnotherBool");

    expect(container.firstChild).toHaveClass("checkoutButton");
    expect(container.firstChild).toHaveClass("checkoutButtonBig");
    expect(container.firstChild).toHaveClass("checkoutButtonPrimary");
    expect(container.firstChild).toHaveClass("checkoutButtonAnotherBool");
  });

  it("variant props should not propagate to the DOM by default", async () => {
    const Input = styled("input", {
      css: "input",
      variants: {
        big: { true: "big" },
      },
    });

    const { container } = render(<Input big />);

    expect(container.firstChild).toHaveClass("big");
    expect(container.firstChild).not.toHaveAttribute("big");
  });

  it("css components should not block intrinsic props that are not styled", async () => {
    const Input = styled("input");
    const onChange = jest.fn();
    const { container } = render(<Input value="test" onChange={onChange} />);
    expect(container.firstChild).toHaveAttribute("value", "test");
  });

  it("variants should allow intrinsic props to pass through to the DOM", async () => {
    const Input = styled("input", {
      css: "input",
      variants: {
        type: { text: "textInput" },
      },
      domPassthrough: ["type"],
    });

    const { container } = render(<Input type="text" />);

    expect(container.firstChild?.nodeName).toEqual("INPUT");
    expect(container.firstChild).toHaveClass("textInput");
    expect(container.firstChild).toHaveAttribute("type", "text");
  });

  it("variants should allow intrinsic bool props to pass through to the DOM", async () => {
    const Input = styled("input", {
      css: "input",
      variants: {
        readOnly: { true: "readOnly" },
      },
      domPassthrough: ["readOnly"],
    });

    const { container } = render(<Input type="text" readOnly />);

    expect(container.firstChild?.nodeName).toEqual("INPUT");

    expect(container.firstChild).toHaveClass("readOnly");
    expect(container.firstChild).toHaveAttribute("readOnly");
  });
});
