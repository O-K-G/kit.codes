import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HeroButtons from "./heroButtons";
import { BUTTONS } from "./heroButtons.constants";

beforeAll(() => {
  class MockIntersectionObserver {
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
  }
  // @ts-expect-error jsdom has no native IntersectionObserver
  global.IntersectionObserver = MockIntersectionObserver;
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("HeroButtons", () => {
  it("renders the email button", () => {
    render(<HeroButtons />);
    expect(
      screen.getByRole("button", { name: BUTTONS.email.label }),
    ).toBeInTheDocument();
  });

  it("renders the resume button", () => {
    render(<HeroButtons />);
    expect(
      screen.getByRole("link", { name: BUTTONS.resume.label }),
    ).toBeInTheDocument();
  });

  it("renders the GitHub button", () => {
    render(<HeroButtons />);
    expect(
      screen.getByRole("link", { name: BUTTONS.gitHub.label }),
    ).toBeInTheDocument();
  });

  it("renders exactly one button and two links", () => {
    render(<HeroButtons />);
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });

  it("does not render the email dialog by default", () => {
    render(<HeroButtons />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens the email dialog when the email button is clicked", async () => {
    const user = userEvent.setup();
    render(<HeroButtons />);
    await user.click(screen.getByRole("button", { name: BUTTONS.email.label }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("configures the resume element with the correct URL, target, and security rel tags", () => {
    render(<HeroButtons />);
    const resumeLink = screen.getByRole("link", { name: BUTTONS.resume.label });
    expect(resumeLink).toHaveAttribute("href", BUTTONS.resume.href);
    expect(resumeLink).toHaveAttribute("target", "_self");
    expect(resumeLink).toHaveAttribute("rel", "noreferrer");
  });

  it("configures the GitHub element with the correct URL, target, and security rel tags", () => {
    render(<HeroButtons />);
    const githubLink = screen.getByRole("link", { name: BUTTONS.gitHub.label });
    expect(githubLink).toHaveAttribute("href", BUTTONS.gitHub.href);
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noreferrer");
  });

  it("closes the dialog after opening and clicking close", async () => {
    const user = userEvent.setup();
    render(<HeroButtons />);
    await user.click(screen.getByRole("button", { name: BUTTONS.email.label }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "false");
  });
});
