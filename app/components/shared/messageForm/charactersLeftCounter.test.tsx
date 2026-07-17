import { render, screen } from "@testing-library/react";
import CharactersLeftCounter from "./charactersLeftCounter";

describe("CharactersLeftCounter", () => {
  it("shows the full maxLength when counter is empty", () => {
    render(
      <CharactersLeftCounter counter={{}} maxLength={100} label="From:" dir="ltr" />,
    );
    expect(screen.getByText("100 characters left")).toBeInTheDocument();
  });

  it("subtracts the current field's character count", () => {
    render(
      <CharactersLeftCounter
        counter={{ from: "hello" }}
        maxLength={100}
        label="From:"
        dir="ltr"
      />,
    );
    expect(screen.getByText("95 characters left")).toBeInTheDocument();
  });

  it("parses the label to find the matching counter key", () => {
    render(
      <CharactersLeftCounter
        counter={{ subject: "hi there" }}
        maxLength={50}
        label="Subject:"
        dir="ltr"
      />,
    );
    expect(screen.getByText("42 characters left")).toBeInTheDocument();
  });

  it("shows zero characters left when the field is at maxLength", () => {
    render(
      <CharactersLeftCounter
        counter={{ from: "12345" }}
        maxLength={5}
        label="From:"
        dir="ltr"
      />,
    );
    expect(screen.getByText("0 characters left")).toBeInTheDocument();
  });

  it("shows a negative count if the field exceeds maxLength", () => {
    render(
      <CharactersLeftCounter
        counter={{ from: "123456" }}
        maxLength={5}
        label="From:"
        dir="ltr"
      />,
    );
    expect(screen.getByText("-1 characters left")).toBeInTheDocument();
  });

  it("ignores unrelated keys in the counter object", () => {
    render(
      <CharactersLeftCounter
        counter={{ subject: "xxxxx" }}
        maxLength={20}
        label="From:"
        dir="ltr"
      />,
    );
    expect(screen.getByText("20 characters left")).toBeInTheDocument();
  });

  it("applies the id prop", () => {
    render(
      <CharactersLeftCounter
        id="from-counter"
        counter={{}}
        maxLength={20}
        label="From:"
        dir="ltr"
      />,
    );
    expect(document.getElementById("from-counter")).toBeInTheDocument();
  });

  it("applies the dir attribute", () => {
    render(
      <CharactersLeftCounter counter={{}} maxLength={20} label="From:" dir="rtl" />,
    );
    expect(screen.getByText("20 characters left")).toHaveAttribute(
      "dir",
      "rtl",
    );
  });

  it("marks the element as an aria-live polite region", () => {
    render(
      <CharactersLeftCounter counter={{}} maxLength={20} label="From:" dir="ltr" />,
    );
    expect(screen.getByText("20 characters left")).toHaveAttribute(
      "aria-live",
      "polite",
    );
  });

  it("treats a value with falsy length as zero characters used", () => {
    render(
      <CharactersLeftCounter
        counter={{ from: "" }}
        maxLength={10}
        label="From:"
        dir="ltr"
      />,
    );
    expect(screen.getByText("10 characters left")).toBeInTheDocument();
  });
});
