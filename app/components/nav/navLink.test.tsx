import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import NavLink from "./navLink";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();

beforeEach(() => {
  mockPush.mockClear();
  (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
});

function renderLinks(count = 3) {
  return render(
    <ul>
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <NavLink id={`section-${i}`} label={`${i}`} currentLinkIndex={i} />
        </li>
      ))}
    </ul>,
  );
}

describe("NavLink", () => {
  it("renders the label text", () => {
    render(<NavLink id="hero" label="G" currentLinkIndex={0} />);
    expect(screen.getByText("G")).toBeInTheDocument();
  });

  it("renders as a link with an href pointing to the section id", () => {
    render(<NavLink id="hero" label="G" currentLinkIndex={0} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "#hero");
  });

  it("has the floor-btn data-variant", () => {
    render(<NavLink id="hero" label="G" currentLinkIndex={0} />);
    expect(screen.getByRole("link")).toHaveAttribute(
      "data-variant",
      "floor-btn",
    );
  });

  it("scrolls the target section into view on click", async () => {
    const user = userEvent.setup();
    const section = document.createElement("section");
    section.id = "hero";
    section.scrollIntoView = jest.fn();
    document.body.appendChild(section);

    render(<NavLink id="hero" label="G" currentLinkIndex={0} />);
    await user.click(screen.getByRole("link"));

    expect(section.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
    expect(mockPush).not.toHaveBeenCalled();
    document.body.removeChild(section);
  });

  it("falls back to router.push when the target section is not in the DOM", async () => {
    const user = userEvent.setup();
    render(<NavLink id="missing" label="G" currentLinkIndex={0} />);
    await user.click(screen.getByRole("link"));

    expect(mockPush).toHaveBeenCalledWith("/#missing");
  });

  it("prevents default navigation on click", async () => {
    render(<NavLink id="hero" label="G" currentLinkIndex={0} />);
    const link = screen.getByRole("link");
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    link.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it("moves focus to the next link on ArrowRight", async () => {
    const user = userEvent.setup();
    renderLinks(3);
    const links = screen.getAllByRole("link");
    links[0].focus();
    await user.keyboard("{ArrowRight}");
    expect(links[1]).toHaveFocus();
  });

  it("wraps focus to the first link on ArrowRight from the last link", async () => {
    const user = userEvent.setup();
    renderLinks(3);
    const links = screen.getAllByRole("link");
    links[2].focus();
    await user.keyboard("{ArrowRight}");
    expect(links[0]).toHaveFocus();
  });

  it("moves focus to the previous link on ArrowLeft", async () => {
    const user = userEvent.setup();
    renderLinks(3);
    const links = screen.getAllByRole("link");
    links[1].focus();
    await user.keyboard("{ArrowLeft}");
    expect(links[0]).toHaveFocus();
  });

  it("wraps focus to the last link on ArrowLeft from the first link", async () => {
    const user = userEvent.setup();
    renderLinks(3);
    const links = screen.getAllByRole("link");
    links[0].focus();
    await user.keyboard("{ArrowLeft}");
    expect(links[2]).toHaveFocus();
  });

  it("moves focus to the first link on Home", async () => {
    const user = userEvent.setup();
    renderLinks(3);
    const links = screen.getAllByRole("link");
    links[2].focus();
    await user.keyboard("{Home}");
    expect(links[0]).toHaveFocus();
  });

  it("moves focus to the last link on End", async () => {
    const user = userEvent.setup();
    renderLinks(3);
    const links = screen.getAllByRole("link");
    links[0].focus();
    await user.keyboard("{End}");
    expect(links[2]).toHaveFocus();
  });
});
