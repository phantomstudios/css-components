/**
 * @jest-environment jsdom
 */

import React from "react";

import { render } from "@testing-library/react";

import { styled } from "../src";

describe("creates basic components", () => {
  it("should should output the correct DOM node", async () => {
    const Button = styled("button");
    const { container } = render(<Button />);
    expect(container.firstChild?.nodeName).toEqual("BUTTON");
  });

  it("should should apply the base class", async () => {
    const Button = styled("button", "basicButton");
    const { container } = render(<Button />);
    expect(container.firstChild).toHaveClass("basicButton");
  });

  it("should pass through children", async () => {
    const Paragraph = styled("p");
    const { container } = render(<Paragraph>Hello</Paragraph>);
    expect(container.firstChild).toHaveTextContent("Hello");
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
