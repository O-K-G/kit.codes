import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HeroButtons from "./heroButtons";
import { BUTTONS } from "./heroButtons.constants";
import { handleOpenExternalWindow } from "@utils/handleOpenExternalWindow";

jest.mock("@utils/handleOpenExternalWindow", () => ({
  handleOpenExternalWindow: jest.fn(),
}));

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
      screen.getByRole("button", { name: BUTTONS.resume.label }),
    ).toBeInTheDocument();
  });

  it("renders the GitHub button", () => {
    render(<HeroButtons />);
    expect(
      screen.getByRole("button", { name: BUTTONS.gitHub.label }),
    ).toBeInTheDocument();
  });

  it("renders exactly three buttons", () => {
    render(<HeroButtons />);
    expect(screen.getAllByRole("button")).toHaveLength(3);
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

  it("calls handleOpenExternalWindow with the resume URL when clicked", async () => {
    const user = userEvent.setup();
    render(<HeroButtons />);
    await user.click(
      screen.getByRole("button", { name: BUTTONS.resume.label }),
    );
    expect(handleOpenExternalWindow).toHaveBeenCalledWith(BUTTONS.resume.url);
  });

  it("calls handleOpenExternalWindow with the GitHub URL when clicked", async () => {
    const user = userEvent.setup();
    render(<HeroButtons />);
    await user.click(
      screen.getByRole("button", { name: BUTTONS.gitHub.label }),
    );
    expect(handleOpenExternalWindow).toHaveBeenCalledWith(BUTTONS.gitHub.url);
  });

  it("does not call handleOpenExternalWindow for the email button", async () => {
    const user = userEvent.setup();
    render(<HeroButtons />);
    await user.click(screen.getByRole("button", { name: BUTTONS.email.label }));
    expect(handleOpenExternalWindow).not.toHaveBeenCalled();
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
