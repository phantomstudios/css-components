/**
 * @jest-environment jsdom
 */

import React from "react";

import { render } from "@testing-library/react";

import { styled } from "../src";

describe("Basic functionality", () => {
  it("should return the correct type of DOM node", async () => {
    const Button = styled("button");
    const { container } = render(<Button />);
    expect(container.firstChild?.nodeName).toEqual("BUTTON");
  });

  it("should apply the base class", async () => {
    const Button = styled("button", "root");
    const { container } = render(<Button />);
    expect(container.firstChild).toHaveClass("root");
  });

  it("should pass through children", async () => {
    const Paragraph = styled("p");
    const { container } = render(<Paragraph>Hello</Paragraph>);
    expect(container.firstChild).toHaveTextContent("Hello");
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
    const { container } = render(<Input value={"test"} onChange={onChange} />);
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
    const Button = styled("button", "root", {
      primary: { true: "primary" },
    });

    const { container } = render(<Button />);

    expect(container.firstChild).toHaveClass("root");
    expect(container.firstChild).not.toHaveClass("primary");
  });

  it("should work with a single boolean variant", async () => {
    const Button = styled("button", "root", {
      primary: { true: "primary" },
    });

    const { container } = render(<Button primary />);

    expect(container.firstChild).toHaveClass("root");
    expect(container.firstChild).toHaveClass("primary");
  });

  it("should work with a multiple variants", async () => {
    const PageTitle = styled("h2", "root", {
      highlighted: { true: "highlighted" },
      size: { 0: "size0", 1: "size1" },
      align: { left: "left", center: "center", right: "right" },
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
    const Button = styled(
      "button",
      "root",
      {
        border: {
          true: "borderTrue",
        },
        color: {
          primary: "colorPrimary",
          secondary: "colorSecondary",
        },
      },
      [
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
      ]
    );

    const { container } = render(<Button border color={"primary"} />);

    expect(container.firstChild).toHaveClass("root");
    expect(container.firstChild).toHaveClass("borderTrue");
    expect(container.firstChild).toHaveClass("colorPrimary");
    expect(container.firstChild).toHaveClass("borderPrimary");
    expect(container.firstChild).not.toHaveClass("borderSecondary");
    expect(container.firstChild).not.toHaveClass("colorSecondary");
  });
});

describe("supports array styles", () => {
  it("should should apply the base classes", async () => {
    const Button = styled("button", ["baseButton", "button"]);
    const { container } = render(<Button />);
    expect(container.firstChild).toHaveClass("baseButton");
    expect(container.firstChild).toHaveClass("button");
  });

  it("should should apply the base classes", async () => {
    const Button = styled(
      "button",
      ["baseButton", "button"],
      {
        primary: { true: ["primary", "bold"] },
        big: { true: ["big"] },
      },
      [
        {
          primary: true,
          big: true,
          css: ["primaryBig", "primaryBigBold"],
        },
      ]
    );
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
    const BaseButton = styled("button", "baseButton", {
      size: { big: "big", small: "small" },
    });
    const Button = styled(BaseButton, "button", {
      color: { primary: "colorPrimary", secondary: "colorSecondary" },
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
});
