import { renderHook, cleanup } from "@testing-library/react";
import { useFadeIn } from "./useFadeIn";

type ObserveCall = { target: Element };

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  callback: IntersectionObserverCallback;
  options: IntersectionObserverInit | undefined;
  observed: ObserveCall[] = [];
  disconnected = false;

  constructor(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {
    this.callback = callback;
    this.options = options;
    MockIntersectionObserver.instances.push(this);
  }

  observe(target: Element) {
    this.observed.push({ target });
  }

  unobserve() {}

  disconnect() {
    this.disconnected = true;
  }

  trigger(entries: Partial<IntersectionObserverEntry>[]) {
    this.callback(entries as IntersectionObserverEntry[], this as never);
  }
}

function makeEntry(
  target: Element,
  isIntersecting: boolean,
): Partial<IntersectionObserverEntry> {
  return { target, isIntersecting };
}

describe("useFadeIn", () => {
  beforeEach(() => {
    MockIntersectionObserver.instances = [];
    (global as unknown as { IntersectionObserver: unknown }).IntersectionObserver =
      MockIntersectionObserver;
    document.body.innerHTML = "";
  });

  afterEach(() => {
    cleanup();
    document.body.innerHTML = "";
  });

  it("observes the element matching the given id", () => {
    const el = document.createElement("section");
    el.id = "target-section";
    el.dataset.visible = "false";
    document.body.appendChild(el);

    renderHook(() => useFadeIn({ id: "target-section" }));

    const instance = MockIntersectionObserver.instances[0];
    expect(instance.observed).toHaveLength(1);
    expect(instance.observed[0].target).toBe(el);
  });

  it("sets data-visible to true when the entry is intersecting", () => {
    const el = document.createElement("section");
    el.id = "target-section";
    el.dataset.visible = "false";
    document.body.appendChild(el);

    renderHook(() => useFadeIn({ id: "target-section" }));
    const instance = MockIntersectionObserver.instances[0];

    instance.trigger([makeEntry(el, true)]);

    expect(el.dataset.visible).toBe("true");
  });

  it("does not touch data-visible when it is not exactly 'false' (guard clause)", () => {
    const el = document.createElement("section");
    el.id = "target-section";
    el.dataset.visible = "pending";
    document.body.appendChild(el);

    renderHook(() => useFadeIn({ id: "target-section" }));
    const instance = MockIntersectionObserver.instances[0];

    instance.trigger([makeEntry(el, true)]);

    expect(el.dataset.visible).toBe("pending");
  });

  it("does nothing when the entry is not intersecting", () => {
    const el = document.createElement("section");
    el.id = "target-section";
    el.dataset.visible = "false";
    document.body.appendChild(el);

    renderHook(() => useFadeIn({ id: "target-section" }));
    const instance = MockIntersectionObserver.instances[0];

    instance.trigger([makeEntry(el, false)]);

    expect(el.dataset.visible).toBe("false");
  });

  it("disconnects the observer on unmount", () => {
    const el = document.createElement("section");
    el.id = "target-section";
    el.dataset.visible = "false";
    document.body.appendChild(el);

    const { unmount } = renderHook(() => useFadeIn({ id: "target-section" }));
    const instance = MockIntersectionObserver.instances[0];

    unmount();

    expect(instance.disconnected).toBe(true);
  });

  it("re-observes a new element when the id prop changes", () => {
    const first = document.createElement("section");
    first.id = "first-section";
    first.dataset.visible = "false";
    const second = document.createElement("section");
    second.id = "second-section";
    second.dataset.visible = "false";
    document.body.append(first, second);

    const { rerender } = renderHook(({ id }) => useFadeIn({ id }), {
      initialProps: { id: "first-section" },
    });

    expect(MockIntersectionObserver.instances[0].observed[0].target).toBe(
      first,
    );

    rerender({ id: "second-section" });

    expect(MockIntersectionObserver.instances).toHaveLength(2);
    expect(MockIntersectionObserver.instances[1].observed[0].target).toBe(
      second,
    );
    expect(MockIntersectionObserver.instances[0].disconnected).toBe(true);
  });

  it("does not throw and does not observe anything when the element is missing", () => {
    expect(() =>
      renderHook(() => useFadeIn({ id: "does-not-exist" })),
    ).not.toThrow();

    const instance = MockIntersectionObserver.instances[0];
    expect(instance.observed).toHaveLength(0);
  });

  it("passes root: null and threshold: 0.1 to the IntersectionObserver constructor", () => {
    const el = document.createElement("section");
    el.id = "target-section";
    el.dataset.visible = "false";
    document.body.appendChild(el);

    renderHook(() => useFadeIn({ id: "target-section" }));
    const instance = MockIntersectionObserver.instances[0];

    expect(instance.options).toEqual({ root: null, threshold: 0.1 });
  });

  it("does not call disconnect when the element was never found (no observer.observe call)", () => {
    const { unmount } = renderHook(() =>
      useFadeIn({ id: "missing-on-mount" }),
    );
    const instance = MockIntersectionObserver.instances[0];

    expect(() => unmount()).not.toThrow();
    expect(instance.disconnected).toBe(false);
  });

  it("flips data-visible for the correct entry when multiple entries fire in one callback", () => {
    const elA = document.createElement("section");
    elA.id = "section-a";
    elA.dataset.visible = "false";
    const elB = document.createElement("section");
    elB.id = "section-b";
    elB.dataset.visible = "false";
    document.body.append(elA, elB);

    renderHook(() => useFadeIn({ id: "section-a" }));
    const instance = MockIntersectionObserver.instances[0];

    instance.trigger([makeEntry(elA, true), makeEntry(elB, true)]);

    expect(elA.dataset.visible).toBe("true");
    expect(elB.dataset.visible).toBe("true");
  });
});
