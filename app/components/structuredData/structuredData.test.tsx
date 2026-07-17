import { render } from "@testing-library/react";
import { PERSON_JSON_LD } from "@constants/appMeta";

const mockGet = jest.fn();

jest.mock("next/headers", () => ({
  headers: jest.fn(() =>
    Promise.resolve({
      get: mockGet,
    }),
  ),
}));

// Imported after the mock so the module picks it up.
import StructuredData from "./structuredData";

async function renderStructuredData() {
  const element = await StructuredData();
  return render(element);
}

describe("StructuredData", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it("renders a <script> tag", async () => {
    mockGet.mockReturnValue("nonce-value");
    const { container } = await renderStructuredData();
    expect(container.querySelector("script")).toBeInTheDocument();
  });

  it("sets the script type to application/ld+json", async () => {
    mockGet.mockReturnValue("nonce-value");
    const { container } = await renderStructuredData();
    expect(container.querySelector("script")).toHaveAttribute(
      "type",
      "application/ld+json",
    );
  });

  it("serializes PERSON_JSON_LD as the script's JSON content", async () => {
    mockGet.mockReturnValue("nonce-value");
    const { container } = await renderStructuredData();
    const script = container.querySelector("script");
    expect(JSON.parse(script?.innerHTML ?? "")).toEqual(PERSON_JSON_LD);
  });

  it("includes the '@context' schema.org key", async () => {
    mockGet.mockReturnValue("nonce-value");
    const { container } = await renderStructuredData();
    const script = container.querySelector("script");
    const parsed = JSON.parse(script?.innerHTML ?? "");
    expect(parsed["@context"]).toBe("https://schema.org");
  });

  it("includes the '@type' of Person", async () => {
    mockGet.mockReturnValue("nonce-value");
    const { container } = await renderStructuredData();
    const script = container.querySelector("script");
    const parsed = JSON.parse(script?.innerHTML ?? "");
    expect(parsed["@type"]).toBe("Person");
  });

  it("sets the nonce attribute from the x-nonce header", async () => {
    mockGet.mockReturnValue("abc-123");
    const { container } = await renderStructuredData();
    expect(container.querySelector("script")).toHaveAttribute(
      "nonce",
      "abc-123",
    );
  });

  it("queries headers for the 'x-nonce' key", async () => {
    mockGet.mockReturnValue("abc-123");
    await renderStructuredData();
    expect(mockGet).toHaveBeenCalledWith("x-nonce");
  });

  it("falls back to undefined nonce when the header is missing", async () => {
    mockGet.mockReturnValue(null);
    const { container } = await renderStructuredData();
    expect(container.querySelector("script")?.getAttribute("nonce")).toBe(
      null,
    );
  });

  it("escapes '<' characters in the serialized JSON", async () => {
    mockGet.mockReturnValue("nonce-value");
    const { container } = await renderStructuredData();
    const script = container.querySelector("script");
    expect(script?.innerHTML).not.toContain("<script");
  });

  it("resolves to a script element on every call", async () => {
    mockGet.mockReturnValue("nonce-value");
    const element = await StructuredData();
    expect(element.type).toBe("script");
  });
});
