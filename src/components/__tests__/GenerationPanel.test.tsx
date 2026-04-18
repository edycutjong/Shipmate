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
        content="Generating..."
        isGenerating={true}
        variant="landing"
      />
    );
    const genIndicators = screen.getAllByText("Generating...");
    expect(genIndicators.length).toBeGreaterThan(0);
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
});
