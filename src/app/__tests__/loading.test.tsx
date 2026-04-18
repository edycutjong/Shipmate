import { render, screen } from "@testing-library/react";
import Loading from "../loading";

describe("Loading Component", () => {
  it("renders the loading indicator and text", () => {
    render(<Loading />);
    expect(screen.getByText("Loading AI engine...")).toBeInTheDocument();
  });
});
