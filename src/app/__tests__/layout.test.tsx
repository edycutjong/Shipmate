import { render } from "@testing-library/react";
import RootLayout from "../layout";

jest.mock("next/font/google", () => ({
  Geist: () => ({ variable: "geist-sans-mock" }),
  Geist_Mono: () => ({ variable: "geist-mono-mock" }),
}));

describe("RootLayout", () => {
  it("renders correctly", () => {
    const { getByText } = render(
      <RootLayout>
        <div>Test Child</div>
      </RootLayout>
    );
    expect(getByText("Test Child")).toBeInTheDocument();
  });
});
