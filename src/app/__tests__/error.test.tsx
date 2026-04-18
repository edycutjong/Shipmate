import { render, screen, fireEvent } from "@testing-library/react";
import GlobalError from "../error";

describe("GlobalError Component", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders the error message and calls reset on button click", () => {
    const mockError = new Error("Test error");
    const mockReset = jest.fn();

    render(<GlobalError error={mockError} reset={mockReset} />);

    expect(screen.getByText("Something went wrong!")).toBeInTheDocument();
    expect(screen.getByText(/The Shipmate engine encountered an unexpected error/)).toBeInTheDocument();
    
    // Check if console.error was called with the error
    expect(console.error).toHaveBeenCalledWith("Global boundary caught:", mockError);

    // Click the try again button
    const retryButton = screen.getByRole("button", { name: "Try again" });
    fireEvent.click(retryButton);

    expect(mockReset).toHaveBeenCalledTimes(1);
  });
});
