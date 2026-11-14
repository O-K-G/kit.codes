import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { URLs } from "@constants/urls";
import { default as messages } from "@i18nEn/sideLinks.json";
import { NextIntlClientProvider } from "next-intl";
import { i18nFilenames } from "@constants/i18nFilenames";
import SideLinks, {
  GH_TEST_ID,
  LI_TEST_ID,
} from "@ui/sideLinks/SideLinks";

const DEFAULT_LOCALE = "en";

/** The language switcher's list (in its closed dialog) uses the app router */
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => "/en",
  useParams: () => ({ locale: "en" }),
}));

describe("SideLinks Component", () => {
  it("renders GitHub and LinkedIn links", async () => {
    const jsonFiles = await Promise.all(
      i18nFilenames.map(
        async (str) =>
          (
            await import(`../../../../messages/${DEFAULT_LOCALE}/${str}.json`)
          ).default
      )
    );

    const messagesObject = Object.assign({}, ...jsonFiles);

    console.log(messagesObject);
    render(
      <NextIntlClientProvider locale={DEFAULT_LOCALE} messages={messagesObject}>
        <SideLinks />
      </NextIntlClientProvider>
    );

    const ghLink = screen.getByTestId(GH_TEST_ID);
    expect(ghLink).toBeInTheDocument();
    expect(ghLink).toHaveAttribute("href", URLs.gitHub);
    expect(ghLink).toHaveAttribute("rel", "noreferrer");
    expect(ghLink).toHaveAttribute(
      "aria-label",
      messages.sideLinks.ghLinkAriaLabel
    );

    const liLink = screen.getByTestId(LI_TEST_ID);
    expect(liLink).toBeInTheDocument();
    expect(liLink).toHaveAttribute("href", URLs.linkedIn);
    expect(liLink).toHaveAttribute("rel", "noreferrer");
    expect(liLink).toHaveAttribute(
      "aria-label",
      messages.sideLinks.liLinkAriaLabel
    );
  });

  it("holds only list items in its list", async () => {
    const jsonFiles = await Promise.all(
      i18nFilenames.map(
        async (str) =>
          (await import(`../../../../messages/${DEFAULT_LOCALE}/${str}.json`)).default
      )
    );

    render(
      <NextIntlClientProvider locale={DEFAULT_LOCALE} messages={Object.assign({}, ...jsonFiles)}>
        <SideLinks />
      </NextIntlClientProvider>
    );

    const list = screen.getByRole("list");
    Array.from(list.children).forEach((child) => expect(child.tagName).toBe("LI"));
  });
});
