import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NextIntlClientProvider } from "next-intl";
import InputComponent from "@components/contact/InputComponent";
import { default as messages } from "@i18nEn/inputComponentText.json";

/** Sanitizing isn't tested here (and its library needs TextDecoder, which jsdom lacks) */
jest.mock("isomorphic-dompurify", () => ({
  __esModule: true,
  default: { sanitize: (value: string) => value },
}));

function renderField(isError = false) {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <InputComponent
        id="email"
        label="Email"
        placeholder="you@example.com"
        maxLength={100}
        autoComplete="email"
        onChange={jest.fn()}
        isError={isError}
      />
    </NextIntlClientProvider>
  );
  return screen.getByRole("textbox");
}

describe("InputComponent", () => {
  it("is named by its visible label, and described by the characters left", () => {
    const field = renderField();

    expect(field).toHaveAccessibleName("Email:");
    expect(field).toHaveAccessibleDescription(/characters remain/);
    expect(field).toHaveAttribute("aria-invalid", "false");
    expect(field).toHaveAttribute("autocomplete", "email");
  });

  it("shows its error in text, and is described by it", () => {
    const field = renderField(true);

    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Error - email is invalid")).toBeVisible();
    expect(field).toHaveAccessibleDescription(/^Error - email is invalid/);
  });
});
