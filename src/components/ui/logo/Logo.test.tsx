import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Logo, { LOGO_TEXT } from "@ui/logo/Logo";
import { URLs } from "@constants/urls";

describe("Logo", () => {
  it("is a link to the site, named by its visible text", () => {
    render(<Logo />);
    const link = screen.getByRole("link", { name: LOGO_TEXT });

    expect(link).toHaveTextContent("kit.codes");
    expect(link).toHaveAttribute("href", URLs.siteURL);
    expect(link).toHaveAttribute("lang", "en");
  });
});
