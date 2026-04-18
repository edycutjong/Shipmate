import { render, screen, fireEvent, act } from "@testing-library/react";
import { CopyButton } from "../CopyButton";

describe("CopyButton", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("renders correctly", () => {
    render(<CopyButton content="test content" />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("calls navigator.clipboard.writeText on click and shows checkmark temporarily", async () => {
    render(<CopyButton content="hello world" />);
    const button = screen.getByRole("button");
    
    await act(async () => {
      fireEvent.click(button);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("hello world");

    act(() => {
      jest.advanceTimersByTime(2000);
    });
  });

  it("does nothing if content is empty", async () => {
    render(<CopyButton content="" />);
    const button = screen.getByRole("button");
    
    await act(async () => {
      fireEvent.click(button);
    });

    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
  });

  it("logs error if clipboard write fails", async () => {
    const error = new Error("Clipboard error");
    (navigator.clipboard.writeText as jest.Mock).mockRejectedValueOnce(error);
    
    render(<CopyButton content="fail" />);
    const button = screen.getByRole("button");
    
    await act(async () => {
      fireEvent.click(button);
    });

    expect(console.error).toHaveBeenCalledWith("Failed to copy:", error);
  });
});
