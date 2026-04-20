import { render, screen } from "@testing-library/react";
import { GenerationPanel } from "../GenerationPanel";

// Mock child components
jest.mock("../CopyButton", () => ({
  CopyButton: () => <button data-testid="copy-btn">Copy</button>
}));
jest.mock("../ExportButton", () => ({
  ExportButton: () => <button data-testid="export-btn">Export</button>
}));

describe("GenerationPanel", () => {
  it("renders awaiting input when there is no content", () => {
    render(
      <GenerationPanel
        title="Test Panel"
        icon={<span data-testid="icon" />}
        content=""
        isGenerating={false}
        variant="landing"
      />
    );
    expect(screen.getByText("Test Panel")).toBeInTheDocument();
    expect(screen.getByText("Awaiting input...")).toBeInTheDocument();
    expect(screen.queryByTestId("copy-btn")).not.toBeInTheDocument();
  });

  it("renders buttons when content is available and not generating", () => {
    render(
      <GenerationPanel
        title="Test Panel"
        icon={<span data-testid="icon" />}
        content="Test content"
        isGenerating={false}
        variant="landing"
      />
    );
    expect(screen.getByText("Test content")).toBeInTheDocument();
    expect(screen.getByTestId("copy-btn")).toBeInTheDocument();
    expect(screen.getByTestId("export-btn")).toBeInTheDocument();
  });

  it("renders generating indicator", () => {
    render(
      <GenerationPanel
        title="Test Panel"
        icon={<span data-testid="icon" />}
        content="Some streaming content"
        isGenerating={true}
        variant="landing"
      />
    );
    expect(screen.getByText("Streaming...")).toBeInTheDocument();
    expect(screen.queryByTestId("copy-btn")).not.toBeInTheDocument();
  });

  it("renders twitter variant splitting content into tweets", () => {
    const thread = "1. Tweet One\n\n2. Tweet Two";
    render(
      <GenerationPanel
        title="Twitter Thread"
        icon={<span data-testid="icon" />}
        content={thread}
        isGenerating={false}
        variant="twitter"
      />
    );
    
    // Maker badge shows for each tweet
    expect(screen.getAllByText("Maker")).toHaveLength(2);
    expect(screen.getAllByText("@shipmate")).toHaveLength(2);
    expect(screen.getByText(/1\. Tweet One/)).toBeInTheDocument();
    expect(screen.getByText(/2\. Tweet Two/)).toBeInTheDocument();
  });

  it("handles producthunt variant", () => {
    render(
      <GenerationPanel
        title="PH"
        icon={<span data-testid="icon" />}
        content="Product Hunt Launch"
        isGenerating={false}
        variant="producthunt"
      />
    );
    expect(screen.getByText("Product Hunt Launch")).toBeInTheDocument();
  });

  it("handles mouse move for spotlight effect", () => {
    const { container } = render(
      <GenerationPanel
        title="Test Panel"
        icon={<span data-testid="icon" />}
        content="Test content"
        isGenerating={false}
        variant="landing"
      />
    );
    const card = container.firstChild as HTMLElement;
    // Mock getBoundingClientRect
    card.getBoundingClientRect = jest.fn(() => ({
      left: 10,
      top: 20,
      right: 110,
      bottom: 120,
      width: 100,
      height: 100,
      x: 10,
      y: 20,
      toJSON: () => {}
    }));
    
    import("@testing-library/react").then(({ fireEvent }) => {
        fireEvent.mouseMove(card, { clientX: 50, clientY: 60 });
        expect(card.style.getPropertyValue("--mouse-x")).toBe("40px");
        expect(card.style.getPropertyValue("--mouse-y")).toBe("40px");
    });
  });

  it("toggles expand and collapse", async () => {
    const { render, screen, fireEvent } = await import("@testing-library/react");
    render(
      <GenerationPanel
        title="Test Panel"
        icon={<span data-testid="icon" />}
        content="Test content"
        isGenerating={false}
        variant="landing"
      />
    );
    const expandButton = screen.getByTitle("Expand");
    fireEvent.click(expandButton);
    
    const minimizeButton = screen.getByTitle("Minimize");
    expect(minimizeButton).toBeInTheDocument();
    
    fireEvent.click(minimizeButton);
    expect(screen.getByTitle("Expand")).toBeInTheDocument();
  });

  it("closes expanded view when clicking backdrop", async () => {
    const { render, screen, fireEvent } = await import("@testing-library/react");
    render(
      <GenerationPanel
        title="Test Panel"
        icon={<span data-testid="icon" />}
        content="Test content"
        isGenerating={false}
        variant="landing"
      />
    );
    fireEvent.click(screen.getByTitle("Expand"));
    
    // Find backdrop (it's the fixed inset-0 div)
    const backdrop = document.querySelector(".fixed.inset-0") as Element;
    expect(backdrop).toBeInTheDocument();
    fireEvent.click(backdrop);
    
    // Should be minimized again
    expect(screen.getByTitle("Expand")).toBeInTheDocument();
  });

  it("handles fallback elegantly when content.includes throws", () => {
    // Suppress React warning for rendering null locally vs other errors
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <GenerationPanel
        title="Test Panel"
        icon={<span data-testid="icon" />}
        content={(null as unknown) as string}
        isGenerating={false}
        variant="landing"
      />
    );
    expect(screen.getByText("Test Panel")).toBeInTheDocument();
    consoleError.mockRestore();
  });
});
