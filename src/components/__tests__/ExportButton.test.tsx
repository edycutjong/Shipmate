import { render, screen, fireEvent, act } from "@testing-library/react";
import { ExportButton } from "../ExportButton";

describe("ExportButton", () => {
  let createObjectURLMock: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    createObjectURLMock = jest.fn().mockReturnValue("blob:url");
    global.URL.createObjectURL = createObjectURLMock;
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("renders correctly", () => {
    render(<ExportButton content="test" filename="test.md" />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("downloads file when clicked and sets downloading state temporarily", async () => {
    const appendChildSpy = jest.spyOn(document.body, "appendChild");
    const removeChildSpy = jest.spyOn(document.body, "removeChild");
    
    // We need to mock the click method on HTMLAnchorElement
    const clickSpy = jest.spyOn(window.HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    render(<ExportButton content="hello" filename="testfile.md" />);
    const button = screen.getByRole("button");

    await act(async () => {
      fireEvent.click(button);
    });

    expect(createObjectURLMock).toHaveBeenCalled();
    expect(appendChildSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();

    // Fast-forward so downloading resets to false
    act(() => {
      jest.advanceTimersByTime(300);
    });
  });

  it("does nothing if content is empty", async () => {
    render(<ExportButton content="" filename="test.md" />);
    const button = screen.getByRole("button");

    await act(async () => {
      fireEvent.click(button);
    });

    expect(createObjectURLMock).not.toHaveBeenCalled();
  });
});
