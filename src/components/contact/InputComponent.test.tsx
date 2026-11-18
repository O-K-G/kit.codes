import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NextIntlClientProvider } from "next-intl";
import InputComponent from "@components/contact/InputComponent";
import { default as messages } from "@i18nEn/inputComponentText.json";

function renderField(isError = false) {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <InputComponent
        id="email"
        label="Email"
        placeholder="you@example.com"
        maxLength={100}
        autoComplete="email"
        type="email"
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

  it("is required, and its error isn't a live region (the form moves the focus to it instead)", () => {
    const field = renderField(true);

    expect(field).toBeRequired();
    expect(screen.getByText("Error - email is invalid")).not.toHaveAttribute("aria-live");
  });

  it("takes an email address as one: its type, without autocorrect, capitals or spellcheck", () => {
    const field = renderField();

    expect(field).toHaveAttribute("type", "email");
    expect(field).toHaveAttribute("autocorrect", "off");
    expect(field).toHaveAttribute("autocapitalize", "none");
    expect(field).toHaveAttribute("spellcheck", "false");
  });
});
