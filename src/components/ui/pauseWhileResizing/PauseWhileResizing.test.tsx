import { act, render } from "@testing-library/react";
import PauseWhileResizing, {
  RESIZING_ATTRIBUTE,
} from "@ui/pauseWhileResizing/PauseWhileResizing";

/** jsdom has no matchMedia: a mock answering whether the screen is a touch screen */
const mockTouch = (touch: boolean) => {
  window.matchMedia = jest.fn(
    (query: string) =>
      ({ matches: touch && query.includes("coarse") }) as MediaQueryList,
  );
};

const resizeTo = (width: number, height: number) =>
  act(() => {
    Object.assign(window, { innerWidth: width, innerHeight: height });
    window.dispatchEvent(new Event("resize"));
  });

const isPaused = () =>
  document.documentElement.hasAttribute(RESIZING_ATTRIBUTE);

beforeEach(() => {
  jest.useFakeTimers();
  Object.assign(window, { innerWidth: 1440, innerHeight: 900 });
});

afterEach(() => jest.useRealTimers());

describe("PauseWhileResizing", () => {
  it("pauses the animations while resizing, and resumes them once the size settles", () => {
    mockTouch(false);
    render(<PauseWhileResizing />);
    expect(isPaused()).toBe(false);

    resizeTo(1200, 900);
    expect(isPaused()).toBe(true);

    act(() => jest.advanceTimersByTime(200));
    resizeTo(1000, 800);
    act(() => jest.advanceTimersByTime(200));
    expect(isPaused()).toBe(true);

    act(() => jest.advanceTimersByTime(50));
    expect(isPaused()).toBe(false);
  });

  it("counts height changes with a mouse", () => {
    mockTouch(false);
    render(<PauseWhileResizing />);

    resizeTo(1440, 700);
    expect(isPaused()).toBe(true);
  });

  it("ignores height-only changes on touch screens (the address bar sliding while scrolling)", () => {
    mockTouch(true);
    render(<PauseWhileResizing />);

    resizeTo(1440, 800);
    expect(isPaused()).toBe(false);

    resizeTo(900, 1440);
    expect(isPaused()).toBe(true);
  });

  it("resumes the animations when removed mid-resize", () => {
    mockTouch(false);
    const { unmount } = render(<PauseWhileResizing />);

    resizeTo(1000, 900);
    unmount();
    expect(isPaused()).toBe(false);
  });
});
