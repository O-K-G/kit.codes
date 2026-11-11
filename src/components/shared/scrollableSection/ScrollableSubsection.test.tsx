import React from "react";
import { SCROLLABLE_ITEM_TEST_ID } from "@components/shared/scrollableSection/ScrollableSubsectionItem";
import itemStyles from "@components/shared/scrollableSection/ScrollableSubsectionItem.module.css";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NextIntlClientProvider } from "next-intl";
import { i18nFilenames } from "@constants/i18nFilenames";
import ScrollableSubsection, {
  LEFT_BUTTON_TEST_ID,
  RIGHT_BUTTON_TEST_ID,
} from "@components/shared/scrollableSection/ScrollableSubsection";

const DEFAULT_LOCALE = "en";

const jsonFiles = async () =>
  await Promise.all(
    i18nFilenames.map(
      async (str) =>
        (
          await import(`../../../../messages/${DEFAULT_LOCALE}/${str}.json`)
        ).default
    )
  );

beforeAll(() => {
  const observe = jest.fn();
  const unobserve = jest.fn();
  const disconnect = jest.fn();
  window.IntersectionObserver = jest.fn(() => ({
    observe,
    unobserve,
    disconnect,
  })) as never;
});

beforeEach(() => {
  global.HTMLDivElement.prototype.scrollTo = jest.fn();
});

describe("ScrollableSubsection", () => {
  test("renders children properly", async () => {
    const messages = await jsonFiles();
    const messagesObject = Object.assign({}, ...messages);

    render(
      <NextIntlClientProvider locale={DEFAULT_LOCALE} messages={messagesObject}>
        <ScrollableSubsection>
          <ScrollableSubsection.Item>
            <div>Item 1</div>
          </ScrollableSubsection.Item>
          <ScrollableSubsection.Item>
            <div>Item 2</div>
          </ScrollableSubsection.Item>
          <ScrollableSubsection.Item>
            <div>Item 3</div>
          </ScrollableSubsection.Item>
        </ScrollableSubsection>
      </NextIntlClientProvider>
    );

    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();
  });

  test("Initially the left button is disabled and the right button is enabled", async () => {
    const messages = await jsonFiles();
    const messagesObject = Object.assign({}, ...messages);

    render(
      <NextIntlClientProvider locale={DEFAULT_LOCALE} messages={messagesObject}>
        <ScrollableSubsection>
          <ScrollableSubsection.Item>
            <div>Item 1</div>
          </ScrollableSubsection.Item>
          <ScrollableSubsection.Item>
            <div>Item 2</div>
          </ScrollableSubsection.Item>
          <ScrollableSubsection.Item>
            <div>Item 3</div>
          </ScrollableSubsection.Item>
        </ScrollableSubsection>
      </NextIntlClientProvider>
    );

    const leftButton = screen.getByTestId(LEFT_BUTTON_TEST_ID);
    const rightButton = screen.getByTestId(RIGHT_BUTTON_TEST_ID);

    expect(leftButton).toBeDisabled();
    expect(rightButton).not.toBeDisabled();
  });

  test("updates selected subsection when clicking the right button and the left button is enabled", async () => {
    const messages = await jsonFiles();
    const messagesObject = Object.assign({}, ...messages);

    render(
      <NextIntlClientProvider locale={DEFAULT_LOCALE} messages={messagesObject}>
        <ScrollableSubsection>
          <ScrollableSubsection.Item>
            <div>Item 1</div>
          </ScrollableSubsection.Item>
          <ScrollableSubsection.Item>
            <div>Item 2</div>
          </ScrollableSubsection.Item>
          <ScrollableSubsection.Item>
            <div>Item 3</div>
          </ScrollableSubsection.Item>
        </ScrollableSubsection>
      </NextIntlClientProvider>
    );

    const rightButton = screen.getByTestId(RIGHT_BUTTON_TEST_ID);
    fireEvent.click(rightButton);

    expect(screen.getByTestId(LEFT_BUTTON_TEST_ID)).not.toBeDisabled();
  });

  test("right button is enabled when clicking the left button and it updates the selected subsection", async () => {
    const messages = await jsonFiles();
    const messagesObject = Object.assign({}, ...messages);

    render(
      <NextIntlClientProvider locale={DEFAULT_LOCALE} messages={messagesObject}>
        <ScrollableSubsection>
          <ScrollableSubsection.Item>
            <div>Item 1</div>
          </ScrollableSubsection.Item>
          <ScrollableSubsection.Item>
            <div>Item 2</div>
          </ScrollableSubsection.Item>
          <ScrollableSubsection.Item>
            <div>Item 3</div>
          </ScrollableSubsection.Item>
        </ScrollableSubsection>
      </NextIntlClientProvider>
    );

    const rightButton = screen.getByTestId(RIGHT_BUTTON_TEST_ID);
    fireEvent.click(rightButton);

    const leftButton = screen.getByTestId(LEFT_BUTTON_TEST_ID);
    fireEvent.click(leftButton);

    expect(leftButton).toBeDisabled();
  });

  test("ScrollableSubsectionItem renders properly", async () => {
    const messages = await jsonFiles();
    const messagesObject = Object.assign({}, ...messages);

    render(
      <NextIntlClientProvider locale={DEFAULT_LOCALE} messages={messagesObject}>
        <ScrollableSubsection>
          <ScrollableSubsection.Item>Item 1</ScrollableSubsection.Item>
        </ScrollableSubsection>
      </NextIntlClientProvider>
    );

    expect(screen.getByText("Item 1")).toBeInTheDocument();
    const item = screen.getByTestId(SCROLLABLE_ITEM_TEST_ID);
    expect(item).toHaveClass(itemStyles.item);
  });
});
