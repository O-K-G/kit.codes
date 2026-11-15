import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NextIntlClientProvider } from "next-intl";
import Timeline, { TIMELINE_BRANCH_TEST_ID } from "@ui/timeline/Timeline";
import timelineText from "../../../../messages/en/timelineText.json";

const ITEMS = [
  { year: "2020", title: "First", text: "First text" },
  { year: "2021", title: "Second", text: "Second text" },
  { year: "2022", title: "Third", text: "Third text" },
];

const renderTimeline = () =>
  render(
    <NextIntlClientProvider locale="en" messages={timelineText}>
      <Timeline items={ITEMS} aria-label="Projects" />
    </NextIntlClientProvider>
  );

describe("Timeline", () => {
  test("is a named list of branches, each with its year and title", () => {
    renderTimeline();

    expect(screen.getByRole("list", { name: "Projects" })).toBeInTheDocument();
    expect(screen.getAllByTestId(TIMELINE_BRANCH_TEST_ID)).toHaveLength(3);
    expect(screen.getByRole("heading", { name: "Second" })).toBeInTheDocument();
    expect(screen.getAllByText("2021")).toHaveLength(1);
  });

  test("each \"+\" circle is focusable, not a button, and described by its tooltip", () => {
    renderTimeline();

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    const info = screen.getByLabelText("More about First");
    expect(info).toHaveAttribute("tabindex", "0");
    expect(info).toHaveAccessibleDescription("First text");
  });

  test("Escape closes the tooltip until focus leaves", () => {
    renderTimeline();

    const info = screen.getByLabelText("More about First");
    info.focus();
    fireEvent.keyDown(info, { key: "Escape" });
    expect(info).toHaveAttribute("data-dismissed");
    fireEvent.blur(info);
    expect(info).not.toHaveAttribute("data-dismissed");
  });
});
