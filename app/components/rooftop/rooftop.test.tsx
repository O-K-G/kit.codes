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
    return open ? <div data-testid="email-dialog">Email dialog open</div> : null;
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

  it("renders a button for each BUTTONS entry", () => {
    render(<Rooftop />);
    BUTTONS.forEach(({ label }) => {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
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

  it("calls the onClick handler for a non-email buzzer button", async () => {
    const user = userEvent.setup();
    render(<Rooftop />);
    const githubButton = screen.getByRole("button", { name: "GitHub" });
    await expect(user.click(githubButton)).resolves.not.toThrow();
  });

  it("renders all buttons with the buzzer variant", () => {
    render(<Rooftop />);
    const allButtons = screen.getAllByRole("button");
    allButtons.forEach((btn) => {
      expect(btn).toHaveAttribute("data-variant", "buzzer");
    });
  });
});
