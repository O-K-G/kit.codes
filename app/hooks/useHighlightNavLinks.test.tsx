import { renderHook, cleanup } from "@testing-library/react";
import { useHighlightNavLinks } from "./useHighlightNavLinks";

type ObserveCall = { target: Element };

type MockObserverInstance = {
  options: IntersectionObserverInit | undefined;
  observed: ObserveCall[];
  disconnected: boolean;
  observe: (target: Element) => void;
  unobserve: () => void;
  disconnect: () => void;
  trigger: (entries: Partial<IntersectionObserverEntry>[]) => void;
};

let mockObserverInstances: MockObserverInstance[] = [];

function MockIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit,
): MockObserverInstance {
  const observed: ObserveCall[] = [];

  const instance: MockObserverInstance = {
    options,
    observed,
    disconnected: false,
    observe: (target) => observed.push({ target }),
    unobserve: () => {},
    disconnect: () => {
      instance.disconnected = true;
    },
    trigger: (entries) =>
      callback(entries as IntersectionObserverEntry[], instance as never),
  };

  mockObserverInstances.push(instance);
  return instance;
}

function makeEntry(
  target: Element,
  isIntersecting: boolean,
  intersectionRatio: number,
): Partial<IntersectionObserverEntry> {
  return { target, isIntersecting, intersectionRatio };
}

type Fixture = {
  main: HTMLElement;
  sections: HTMLElement[];
  navEls: HTMLElement[];
};

function buildFixture(sectionIds: string[]): Fixture {
  const main = document.createElement("main");
  const sections = sectionIds.map((id) => {
    const section = document.createElement("section");
    section.id = id;
    main.appendChild(section);
    return section;
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
  beforeEach(() => {
    mockObserverInstances = [];
    (
      global as unknown as { IntersectionObserver: unknown }
    ).IntersectionObserver = MockIntersectionObserver;
    document.body.innerHTML = "";
  });

  afterEach(() => {
    cleanup();
    document.body.innerHTML = "";
  });

  it("observes every section", () => {
    const { sections } = buildFixture(["a", "b", "c"]);

    renderHook(() => useHighlightNavLinks());
    const instance = mockObserverInstances[0];

    expect(instance.observed).toHaveLength(3);
    expect(instance.observed.map((o) => o.target)).toEqual(sections);
  });

  it("constructs the observer with root scoped to <main>", () => {
    const { main } = buildFixture(["a", "b", "c"]);

    renderHook(() => useHighlightNavLinks());
    const instance = mockObserverInstances[0];

    expect(instance.options?.root).toBe(main);
  });

  it("marks the section with the highest intersection ratio as active", () => {
    const { sections, navEls } = buildFixture(["a", "b", "c"]);

    renderHook(() => useHighlightNavLinks());
    const instance = mockObserverInstances[0];

    instance.trigger([
      makeEntry(sections[0], true, 0.2),
      makeEntry(sections[1], true, 0.9),
      makeEntry(sections[2], false, 0),
    ]);

    const activeEl = navEls.find((el) => el.dataset.isInView === "true");
    expect(activeEl?.dataset.selectionId).toBe("b");
  });

  it("treats a fully-visible short section as more active than a partly-visible tall one", () => {
    const { sections, navEls } = buildFixture(["a", "b"]);

    renderHook(() => useHighlightNavLinks());
    const instance = mockObserverInstances[0];

    instance.trigger([
      makeEntry(sections[0], true, 0.6),
      makeEntry(sections[1], true, 1),
    ]);

    const activeEl = navEls.find((el) => el.dataset.isInView === "true");
    expect(activeEl?.dataset.selectionId).toBe("b");
  });

  it("treats non-intersecting entries as a zero ratio even if intersectionRatio is nonzero", () => {
    const { sections, navEls } = buildFixture(["a", "b"]);

    renderHook(() => useHighlightNavLinks());
    const instance = mockObserverInstances[0];

    instance.trigger([
      makeEntry(sections[0], false, 0.5),
      makeEntry(sections[1], true, 0.3),
    ]);

    const activeEl = navEls.find((el) => el.dataset.isInView === "true");
    expect(activeEl?.dataset.selectionId).toBe("b");
  });

  it("retains ratios from earlier batches for sections not included in the latest one", () => {
    const { sections, navEls } = buildFixture(["a", "b"]);

    renderHook(() => useHighlightNavLinks());
    const instance = mockObserverInstances[0];

    instance.trigger([
      makeEntry(sections[0], true, 1),
      makeEntry(sections[1], true, 0),
    ]);
    instance.trigger([makeEntry(sections[1], true, 0.4)]);

    const activeEl = navEls.find((el) => el.dataset.isInView === "true");
    expect(activeEl?.dataset.selectionId).toBe("a");
  });

  it("does not change the active section when the latest batch has no positive ratios", () => {
    const { sections, navEls } = buildFixture(["a", "b"]);

    renderHook(() => useHighlightNavLinks());
    const instance = mockObserverInstances[0];

    instance.trigger([
      makeEntry(sections[0], true, 1),
      makeEntry(sections[1], false, 0),
    ]);
    instance.trigger([makeEntry(sections[0], false, 0)]);

    const activeEl = navEls.find((el) => el.dataset.isInView === "true");
    expect(activeEl?.dataset.selectionId).toBe("a");
  });

  it("sets aria-current='true' only on the active link's anchor", () => {
    const { sections, navEls } = buildFixture(["a", "b", "c"]);

    renderHook(() => useHighlightNavLinks());
    const instance = mockObserverInstances[0];
    instance.trigger([makeEntry(sections[1], true, 1)]);

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
    const { sections, navEls } = buildFixture(["a", "b", "c"]);

    renderHook(() => useHighlightNavLinks());
    const instance = mockObserverInstances[0];
    instance.trigger([makeEntry(sections[0], true, 1)]);

    const inactive = navEls.filter((el) => el.dataset.isInView !== "true");
    inactive.forEach((el) => {
      expect(el.dataset.isInView).toBe("false");
    });
  });

  it("does nothing and does not throw when there is no <main> element", () => {
    expect(() => renderHook(() => useHighlightNavLinks())).not.toThrow();
    expect(mockObserverInstances).toHaveLength(0);
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
    expect(mockObserverInstances).toHaveLength(0);
  });

  it("does nothing when there are no nav elements", () => {
    buildFixture(["a", "b"]);
    document
      .querySelectorAll("[data-selection-id]")
      .forEach((el) => el.remove());

    expect(() => renderHook(() => useHighlightNavLinks())).not.toThrow();
    expect(mockObserverInstances).toHaveLength(0);
  });

  it("disconnects the observer on unmount", () => {
    buildFixture(["a", "b", "c"]);

    const { unmount } = renderHook(() => useHighlightNavLinks());
    const instance = mockObserverInstances[0];
    unmount();

    expect(instance.disconnected).toBe(true);
  });
});
