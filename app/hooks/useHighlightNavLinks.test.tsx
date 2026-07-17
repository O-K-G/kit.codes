import { renderHook, cleanup } from "@testing-library/react";
import { useHighlightNavLinks } from "./useHighlightNavLinks";

type Fixture = {
  main: HTMLElement;
  sections: HTMLElement[];
  navEls: HTMLElement[];
};

function buildFixture(sectionIds: string[]): Fixture {
  const main = document.createElement("main");
  const sections = sectionIds.map((id, index) => {
    const section = document.createElement("section");
    section.id = id;
    Object.defineProperty(section, "offsetTop", {
      value: index * 100,
      configurable: true,
    });
    main.appendChild(section);
    return section;
  });

  Object.defineProperty(main, "scrollTop", {
    value: 0,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(main, "scrollHeight", {
    value: 1000,
    configurable: true,
  });
  Object.defineProperty(main, "clientHeight", {
    value: 300,
    configurable: true,
  });

  document.body.appendChild(main);

  const nav = document.createElement("nav");
  const navEls = sectionIds.map((id) => {
    const li = document.createElement("li");
    li.dataset.selectionId = id;
    const a = document.createElement("a");
    li.appendChild(a);
    nav.appendChild(li);
    return li;
  });
  document.body.appendChild(nav);

  return { main, sections, navEls };
}

describe("useHighlightNavLinks", () => {
  let rafSpy: jest.SpyInstance;

  beforeEach(() => {
    document.body.innerHTML = "";
    rafSpy = jest
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      });
  });

  afterEach(() => {
    cleanup();
    rafSpy.mockRestore();
    document.body.innerHTML = "";
  });

  it("runs once on mount without a scroll event and marks a section active", () => {
    const { navEls } = buildFixture(["a", "b", "c"]);

    renderHook(() => useHighlightNavLinks());

    const activeCount = navEls.filter(
      (el) => el.dataset.isInView === "true",
    ).length;
    expect(activeCount).toBe(1);
  });

  it("marks the section with the smallest positive offsetTop-scrollTop as active", () => {
    const { main, navEls } = buildFixture(["a", "b", "c"]);
    (main as unknown as { scrollTop: number }).scrollTop = 50;

    renderHook(() => useHighlightNavLinks());

    const activeEl = navEls.find((el) => el.dataset.isInView === "true");
    expect(activeEl?.dataset.selectionId).toBe("b");
  });

  it("marks the last section active when scrolled to the bottom", () => {
    const { main, navEls } = buildFixture(["a", "b", "c"]);
    Object.defineProperty(main, "scrollHeight", {
      value: 400,
      configurable: true,
    });
    Object.defineProperty(main, "clientHeight", {
      value: 100,
      configurable: true,
    });
    (main as unknown as { scrollTop: number }).scrollTop = 300;

    renderHook(() => useHighlightNavLinks());

    const activeEl = navEls.find((el) => el.dataset.isInView === "true");
    expect(activeEl?.dataset.selectionId).toBe("c");
  });

  it("marks the second-to-last section active when almost at the bottom", () => {
    const { main, navEls } = buildFixture(["a", "b", "c"]);
    Object.defineProperty(main, "scrollHeight", {
      value: 1000,
      configurable: true,
    });
    Object.defineProperty(main, "clientHeight", {
      value: 300,
      configurable: true,
    });
    (main as unknown as { scrollTop: number }).scrollTop = 600;

    renderHook(() => useHighlightNavLinks());

    const activeEl = navEls.find((el) => el.dataset.isInView === "true");
    expect(activeEl?.dataset.selectionId).toBe("b");
  });

  it("sets aria-current='true' only on the active link's anchor", () => {
    const { navEls } = buildFixture(["a", "b", "c"]);

    renderHook(() => useHighlightNavLinks());

    const activeLi = navEls.find((el) => el.dataset.isInView === "true")!;
    const inactiveLis = navEls.filter((el) => el !== activeLi);

    expect(activeLi.querySelector("a")?.getAttribute("aria-current")).toBe(
      "true",
    );
    inactiveLis.forEach((li) => {
      expect(li.querySelector("a")?.hasAttribute("aria-current")).toBe(
        false,
      );
    });
  });

  it("sets data-is-in-view='false' on all non-active nav elements", () => {
    const { navEls } = buildFixture(["a", "b", "c"]);

    renderHook(() => useHighlightNavLinks());

    const inactive = navEls.filter((el) => el.dataset.isInView !== "true");
    inactive.forEach((el) => {
      expect(el.dataset.isInView).toBe("false");
    });
  });

  it("does nothing and does not throw when there is no <main> element", () => {
    expect(() => renderHook(() => useHighlightNavLinks())).not.toThrow();
  });

  it("does nothing when there are no sections", () => {
    const main = document.createElement("main");
    document.body.appendChild(main);
    const nav = document.createElement("nav");
    const li = document.createElement("li");
    li.dataset.selectionId = "a";
    nav.appendChild(li);
    document.body.appendChild(nav);

    expect(() => renderHook(() => useHighlightNavLinks())).not.toThrow();
    expect(li.dataset.isInView).toBeUndefined();
  });

  it("does nothing when there are no nav elements", () => {
    buildFixture(["a", "b"]);
    document
      .querySelectorAll("[data-selection-id]")
      .forEach((el) => el.remove());

    expect(() => renderHook(() => useHighlightNavLinks())).not.toThrow();
  });

  it("removes the scroll listener on unmount", () => {
    const { main } = buildFixture(["a", "b", "c"]);
    const removeSpy = jest.spyOn(main, "removeEventListener");

    const { unmount } = renderHook(() => useHighlightNavLinks());
    unmount();

    expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
  });

  it("throttles rapid scroll events to a single requestAnimationFrame-driven update", () => {
    const { main } = buildFixture(["a", "b", "c"]);
    rafSpy.mockRestore();
    const callbacks: FrameRequestCallback[] = [];
    rafSpy = jest
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((cb: FrameRequestCallback) => {
        callbacks.push(cb);
        return callbacks.length;
      });

    renderHook(() => useHighlightNavLinks());
    rafSpy.mockClear();

    main.dispatchEvent(new Event("scroll"));
    main.dispatchEvent(new Event("scroll"));
    main.dispatchEvent(new Event("scroll"));

    expect(rafSpy).toHaveBeenCalledTimes(1);
  });
});
