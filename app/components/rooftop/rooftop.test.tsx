import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Rooftop from "./rooftop";
import {
  BUTTONS,
  BUZZER_LABEL,
  EMAIL_BUTTON_LABEL,
  EYEBROW,
  PARAGRAPH,
  TITLE,
} from "./rooftop.constants";

class MockIntersectionObserver {
  observe() {}
  disconnect() {}
  unobserve() {}
}

beforeAll(() => {
  // @ts-expect-error jsdom has no IntersectionObserver
  global.IntersectionObserver = MockIntersectionObserver;
  jest.spyOn(window, "open").mockImplementation(() => null);
});

jest.mock("../shared/messageForm/emailDialog", () => {
  return function MockEmailDialog({
    open,
  }: {
    open: boolean;
    onClose: () => void;
  }) {
    return open ? (
      <div data-testid="email-dialog">Email dialog open</div>
    ) : null;
  };
});

describe("Rooftop", () => {
  it("renders the eyebrow text", () => {
    render(<Rooftop />);
    expect(screen.getByText(EYEBROW)).toBeInTheDocument();
  });

  it("renders the title as an h2", () => {
    render(<Rooftop />);
    expect(
      screen.getByRole("heading", { level: 2, name: TITLE }),
    ).toBeInTheDocument();
  });

  it("renders the paragraph", () => {
    render(<Rooftop />);
    expect(screen.getByText(PARAGRAPH)).toBeInTheDocument();
  });

  it("renders the buzzer label", () => {
    render(<Rooftop />);
    expect(screen.getByText(BUZZER_LABEL)).toBeInTheDocument();
  });

  it("renders the Email button", () => {
    render(<Rooftop />);
    expect(
      screen.getByRole("button", { name: EMAIL_BUTTON_LABEL }),
    ).toBeInTheDocument();
  });

  it("renders a link for each BUTTONS entry", () => {
    render(<Rooftop />);
    BUTTONS.forEach(({ label }) => {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    });
  });

  it("does not show the email dialog by default", () => {
    render(<Rooftop />);
    expect(screen.queryByTestId("email-dialog")).not.toBeInTheDocument();
  });

  it("opens the email dialog when the Email button is clicked", async () => {
    const user = userEvent.setup();
    render(<Rooftop />);
    await user.click(screen.getByRole("button", { name: EMAIL_BUTTON_LABEL }));
    expect(screen.getByTestId("email-dialog")).toBeInTheDocument();
  });

  it("configures non-email buzzer navigation items as valid external anchor links", () => {
    render(<Rooftop />);
    const githubLink = screen.getByRole("link", { name: "GitHub" });
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noreferrer");
    expect(githubLink.getAttribute("href")).toContain("github.com");
  });

  it("renders all interactive elements with the buzzer variant attribute", () => {
    render(<Rooftop />);
    const allButtons = screen.getAllByRole("button");
    const allLinks = screen.getAllByRole("link");

    allButtons.forEach((btn) => {
      expect(btn).toHaveAttribute("data-variant", "buzzer");
    });

    allLinks.forEach((link) => {
      expect(link).toHaveAttribute("data-variant", "buzzer");
    });
  });
});
