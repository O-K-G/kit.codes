import { render } from "@testing-library/react";
import SectionObserver from "./SectionObserver";
import { useFadeIn } from "@hooks/useFadeIn";

jest.mock("@hooks/useFadeIn", () => ({
  useFadeIn: jest.fn(),
}));

const mockedUseFadeIn = useFadeIn as jest.Mock;

describe("SectionObserver", () => {
  beforeEach(() => {
    mockedUseFadeIn.mockClear();
  });

  it("renders null (no DOM output)", () => {
    const { container } = render(<SectionObserver id="about" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("calls useFadeIn once on mount", () => {
    render(<SectionObserver id="about" />);
    expect(mockedUseFadeIn).toHaveBeenCalledTimes(1);
  });

  it("passes the id prop through to useFadeIn", () => {
    render(<SectionObserver id="hero" />);
    expect(mockedUseFadeIn).toHaveBeenCalledWith({ id: "hero" });
  });

  it("passes a different id through correctly", () => {
    render(<SectionObserver id="experience" />);
    expect(mockedUseFadeIn).toHaveBeenCalledWith({ id: "experience" });
  });

  it("re-invokes useFadeIn with the new id when the id prop changes", () => {
    const { rerender } = render(<SectionObserver id="about" />);
    expect(mockedUseFadeIn).toHaveBeenLastCalledWith({ id: "about" });

    rerender(<SectionObserver id="skills" />);
    expect(mockedUseFadeIn).toHaveBeenLastCalledWith({ id: "skills" });
  });

  it("does not throw when id is an empty string", () => {
    expect(() => render(<SectionObserver id="" />)).not.toThrow();
  });

  it("calls useFadeIn exactly once per render, not per re-render batch", () => {
    const { rerender } = render(<SectionObserver id="about" />);
    rerender(<SectionObserver id="about" />);
    expect(mockedUseFadeIn.mock.calls.length).toBeGreaterThanOrEqual(1);
  });

  it("unmounts cleanly without throwing", () => {
    const { unmount } = render(<SectionObserver id="about" />);
    expect(() => unmount()).not.toThrow();
  });

  it("does not render any visible text", () => {
    const { container } = render(<SectionObserver id="about" />);
    expect(container.textContent).toBe("");
  });

  it("returns null even across multiple distinct ids", () => {
    const { container: c1 } = render(<SectionObserver id="a" />);
    const { container: c2 } = render(<SectionObserver id="b" />);
    expect(c1).toBeEmptyDOMElement();
    expect(c2).toBeEmptyDOMElement();
  });
});
