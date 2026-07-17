import { render } from "@testing-library/react";
import TrackAndHighlightNavLinks from "./trackAndHighlightNavLinks";
import { useHighlightNavLinks } from "@hooks/useHighlightNavLinks";

jest.mock("@hooks/useHighlightNavLinks", () => ({
  useHighlightNavLinks: jest.fn(),
}));

describe("TrackAndHighlightNavLinks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  it("renders null / no DOM output", () => {
    const { container } = render(<TrackAndHighlightNavLinks />);
    expect(container).toBeEmptyDOMElement();
  });

  it("calls useHighlightNavLinks on mount", () => {
    render(<TrackAndHighlightNavLinks />);
    expect(useHighlightNavLinks).toHaveBeenCalled();
  });

  it("calls useHighlightNavLinks exactly once per render", () => {
    render(<TrackAndHighlightNavLinks />);
    expect(useHighlightNavLinks).toHaveBeenCalledTimes(1);
  });

  it("calls useHighlightNavLinks with no arguments", () => {
    render(<TrackAndHighlightNavLinks />);
    expect(useHighlightNavLinks).toHaveBeenCalledWith();
  });

  it("does not throw when mounted", () => {
    expect(() => render(<TrackAndHighlightNavLinks />)).not.toThrow();
  });

  it("does not throw when unmounted", () => {
    const { unmount } = render(<TrackAndHighlightNavLinks />);
    expect(() => unmount()).not.toThrow();
  });

  it("re-invokes the hook on re-render", () => {
    const { rerender } = render(<TrackAndHighlightNavLinks />);
    rerender(<TrackAndHighlightNavLinks />);
    expect(useHighlightNavLinks).toHaveBeenCalledTimes(2);
  });

  it("mounts multiple independent instances without error", () => {
    expect(() => {
      render(<TrackAndHighlightNavLinks />);
      render(<TrackAndHighlightNavLinks />);
    }).not.toThrow();
  });

  it("produces no text content", () => {
    const { container } = render(<TrackAndHighlightNavLinks />);
    expect(container.textContent).toBe("");
  });

  it("has no child elements", () => {
    const { container } = render(<TrackAndHighlightNavLinks />);
    expect(container.children).toHaveLength(0);
  });
});
