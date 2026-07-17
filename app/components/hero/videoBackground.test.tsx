import { render } from "@testing-library/react";
import VideoBackground from "./videoBackground";
import { VIDEO } from "./hero.constants";

describe("VideoBackground", () => {
  let addEventListener: jest.Mock;
  let removeEventListener: jest.Mock;

  beforeEach(() => {
    addEventListener = jest.fn();
    removeEventListener = jest.fn();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        addEventListener,
        removeEventListener,
      })),
    });
  });

  it("renders a video element", () => {
    const { container } = render(<VideoBackground />);
    expect(container.querySelector("video")).toBeInTheDocument();
  });

  it("renders the video as loop, autoPlay and muted", () => {
    const { container } = render(<VideoBackground />);
    const video = container.querySelector("video");
    expect(video).toHaveAttribute("loop");
    expect(video).toHaveAttribute("autoplay");
    expect(video).toHaveProperty("muted", true);
  });

  it("marks the video as aria-hidden", () => {
    const { container } = render(<VideoBackground />);
    expect(container.querySelector("video")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("renders a source with the primary src from VIDEO constants", () => {
    const { container } = render(<VideoBackground />);
    const source = container.querySelector(
      `source[src="${VIDEO.primarySrc}"]`,
    );
    expect(source).toBeInTheDocument();
    expect(source).toHaveAttribute("type", VIDEO.primarySrcType);
  });

  it("renders a backup source from VIDEO constants", () => {
    const { container } = render(<VideoBackground />);
    const source = container.querySelector(
      `source[src="${VIDEO.backupSrc}"]`,
    );
    expect(source).toBeInTheDocument();
    expect(source).toHaveAttribute("type", VIDEO.backupSrcType);
  });

  it("renders an overlay sibling div", () => {
    const { container } = render(<VideoBackground />);
    expect(container.querySelectorAll("div")).toHaveLength(1);
  });

  it("registers a change listener on the reduced-motion media query", () => {
    render(<VideoBackground />);
    expect(addEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
  });

  it("queries matchMedia with the reduced-motion query", () => {
    const matchMediaSpy = jest.fn().mockReturnValue({
      matches: false,
      addEventListener,
      removeEventListener,
    });
    window.matchMedia = matchMediaSpy;
    render(<VideoBackground />);
    expect(matchMediaSpy).toHaveBeenCalledWith(
      "(prefers-reduced-motion: reduce)",
    );
  });

  it("removes the change listener on unmount", () => {
    const { unmount } = render(<VideoBackground />);
    unmount();
    expect(removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
  });

  it("prevents the context menu on right click", () => {
    const { container } = render(<VideoBackground />);
    const video = container.querySelector("video") as HTMLVideoElement;
    const event = new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
    });
    video.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });
});
