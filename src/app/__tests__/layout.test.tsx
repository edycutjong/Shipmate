import { render } from "@testing-library/react";
import RootLayout, { metadata } from "../layout";

jest.mock("next/font/google", () => ({
  Geist: () => ({ variable: "geist-sans-mock" }),
  Geist_Mono: () => ({ variable: "geist-mono-mock" }),
}));

describe("RootLayout", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation((...args) => {
      // Ignore React DOM nesting warnings which appear as console.error in tests
      if (typeof args[0] === "string" && args[0].includes("cannot be a child of")) {
        return;
      }
      // Log all other errors
      const originalError = jest.requireActual("console").error;
      originalError(...args);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders correctly", () => {
    const { getByText } = render(
      <RootLayout>
        <div>Test Child</div>
      </RootLayout>
    );
    expect(getByText("Test Child")).toBeInTheDocument();
  });

  it("exports metadata", () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toContain("Shipmate");
  });
});
