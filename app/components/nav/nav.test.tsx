import { render, screen } from "@testing-library/react";
import Nav from "./nav";
import { LOGO, NAV_LINKS } from "./nav.constants";

jest.mock("@hooks/useHighlightNavLinks", () => ({
  useHighlightNavLinks: jest.fn(),
}));

describe("Nav", () => {
  it("renders a <nav> element", () => {
    render(<Nav />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders the logo link with its aria-label", () => {
    render(<Nav />);
    expect(
      screen.getByRole("link", { name: LOGO.ariaLabel }),
    ).toBeInTheDocument();
  });

  it("renders the logo link pointing to the homepage", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: LOGO.ariaLabel })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("renders the logo label text", () => {
    render(<Nav />);
    expect(screen.getByText(LOGO.label)).toBeInTheDocument();
  });

  it("renders one list item per NAV_LINKS entry", () => {
    render(<Nav />);
    expect(screen.getAllByRole("listitem")).toHaveLength(NAV_LINKS.length);
  });

  it("renders a link for every NAV_LINKS label", () => {
    render(<Nav />);
    NAV_LINKS.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it("sets data-selection-id on each list item to the section id", () => {
    render(<Nav />);
    NAV_LINKS.forEach(({ id }) => {
      expect(
        document.querySelector(`li[data-selection-id="${id}"]`),
      ).toBeInTheDocument();
    });
  });

  it("initializes every list item with data-is-in-view false", () => {
    render(<Nav />);
    const items = document.querySelectorAll("li[data-selection-id]");
    items.forEach((item) => {
      expect(item).toHaveAttribute("data-is-in-view", "false");
    });
  });

  it("links each nav item's href to its section id", () => {
    render(<Nav />);
    NAV_LINKS.forEach(({ id, label }) => {
      expect(screen.getByText(label).closest("a")).toHaveAttribute(
        "href",
        `#${id}`,
      );
    });
  });

  it("renders NAV_LINKS in the given order", () => {
    render(<Nav />);
    const links = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("data-variant") === "floor-btn");
    links.forEach((link, index) => {
      expect(link).toHaveAttribute("href", `#${NAV_LINKS[index].id}`);
    });
  });

  it("mounts the nav-tracking headless component", () => {
    const { container } = render(<Nav />);
    expect(container.querySelector("nav")).toBeInTheDocument();
  });
});
