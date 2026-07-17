import { render, screen, fireEvent } from "@testing-library/react";
import Dialog from "./dialog";

function renderWithChrome(props: Partial<React.ComponentProps<typeof Dialog>> = {}) {
  const onClose = jest.fn();
  document.body.innerHTML = "";
  const main = document.createElement("main");
  const nav = document.createElement("nav");
  document.body.appendChild(main);
  document.body.appendChild(nav);

  const utils = render(
    <Dialog aria-label="Test dialog" open={false} onClose={onClose} {...props}>
      <button>First</button>
      <button>Second</button>
    </Dialog>,
  );

  return { onClose, main, nav, ...utils };
}

function fireTransitionEnd(container: HTMLElement) {
  const backdrop = container.querySelector('[data-open]') as HTMLElement;
  fireEvent.transitionEnd(backdrop, { target: backdrop, currentTarget: backdrop });
}

describe("Dialog", () => {
  it("renders nothing when open=false and it has never been opened", () => {
    renderWithChrome({ open: false });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders the dialog content once open=true", () => {
    renderWithChrome({ open: true });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("First")).toBeInTheDocument();
  });

  it("sets the correct role, aria-label, and aria-modal", () => {
    renderWithChrome({ open: true });
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-label", "Test dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("sets inert on main and nav when opened", () => {
    const { main, nav } = renderWithChrome({ open: true });
    expect(main.hasAttribute("inert")).toBe(true);
    expect(nav.hasAttribute("inert")).toBe(true);
  });

  it("removes inert from main and nav when closed", () => {
    const { rerender, main, nav } = renderWithChrome({ open: true });
    expect(main.hasAttribute("inert")).toBe(true);

    rerender(
      <Dialog aria-label="Test dialog" open={false} onClose={jest.fn()}>
        <button>First</button>
        <button>Second</button>
      </Dialog>,
    );

    expect(main.hasAttribute("inert")).toBe(false);
    expect(nav.hasAttribute("inert")).toBe(false);
  });

  it("focuses the first focusable child on open", () => {
    renderWithChrome({ open: true });
    expect(screen.getByText("First")).toHaveFocus();
  });

  it("falls back to focusing the dialog container when there are no focusable children", () => {
    const onClose = jest.fn();
    document.body.innerHTML = "";
    const main = document.createElement("main");
    const nav = document.createElement("nav");
    document.body.appendChild(main);
    document.body.appendChild(nav);

    render(
      <Dialog aria-label="Empty dialog" open={true} onClose={onClose}>
        <span>No focusable elements here</span>
      </Dialog>,
    );

    expect(screen.getByRole("dialog")).toHaveFocus();
  });

  it("restores focus to the previously-focused element after close + transitionend", () => {
    const outsideButton = document.createElement("button");
    outsideButton.textContent = "Outside";
    document.body.appendChild(outsideButton);
    outsideButton.focus();

    const onClose = jest.fn();
    const main = document.createElement("main");
    const nav = document.createElement("nav");
    document.body.appendChild(main);
    document.body.appendChild(nav);

    const { rerender } = render(
      <Dialog aria-label="Test dialog" open={true} onClose={onClose}>
        <button>First</button>
      </Dialog>,
    );

    rerender(
      <Dialog aria-label="Test dialog" open={false} onClose={onClose}>
        <button>First</button>
      </Dialog>,
    );

    fireTransitionEnd(document.body as unknown as HTMLElement);
    expect(outsideButton).toHaveFocus();
  });

  it("calls onClose when the Escape key is pressed", () => {
    const { onClose } = renderWithChrome({ open: true });
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("wraps focus from the last element to the first on Tab (focus trap)", () => {
    renderWithChrome({ open: true });
    const second = screen.getByText("Second");
    second.focus();

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Tab" });
    expect(screen.getByText("First")).toHaveFocus();
  });

  it("wraps focus from the first element to the last on Shift+Tab (focus trap)", () => {
    renderWithChrome({ open: true });
    expect(screen.getByText("First")).toHaveFocus();

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Tab", shiftKey: true });
    expect(screen.getByText("Second")).toHaveFocus();
  });

  it("calls onClose when clicking directly on the backdrop", () => {
    const { onClose } = renderWithChrome({ open: true });
    const backdrop = document.body.querySelector('[data-open]') as HTMLElement;
    fireEvent.click(backdrop, { target: backdrop });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when clicking inside the dialog content", () => {
    const { onClose } = renderWithChrome({ open: true });
    fireEvent.click(screen.getByText("First"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("stays rendered through the close transition until transitionend fires on the backdrop", () => {
    const { rerender } = renderWithChrome({ open: true });

    rerender(
      <Dialog aria-label="Test dialog" open={false} onClose={jest.fn()}>
        <button>First</button>
        <button>Second</button>
      </Dialog>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const backdrop = document.body.querySelector('[data-open]') as HTMLElement;
    const child = backdrop.querySelector('[role="dialog"]') as HTMLElement;
    fireEvent.transitionEnd(child, { target: child, currentTarget: backdrop });
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.transitionEnd(backdrop, { target: backdrop, currentTarget: backdrop });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
