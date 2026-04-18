import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import DashboardPage from "../page";

// Mock the components so we don't have to deal with their internal complexities
jest.mock("@/components/RepoInput", () => ({
  RepoInput: ({ onAnalyze, setError }: { onAnalyze: (data: unknown) => void; setError: (msg: string) => void }) => (
    <div data-testid="repo-input">
      <button
        data-testid="trigger-analyze"
        onClick={() =>
          onAnalyze({
            name: "test-repo",
            description: "A test repo",
            techStack: ["React"],
            features: ["feature 1"],
            recentWork: ["commit 1"],
            readmeExcerpt: "readme",
            routeTree: ["src/app"],
          })
        }
      >
        Analyze
      </button>
      <button data-testid="trigger-error" onClick={() => setError("Input Error")}>
        Error
      </button>
    </div>
  ),
}));

jest.mock("@/components/RepoSummary", () => ({
  RepoSummary: ({ data }: { data: { name: string } }) => <div data-testid="repo-summary">{data.name}</div>,
}));

jest.mock("@/components/GenerationPanel", () => ({
  GenerationPanel: ({ content, variant }: { content: string; variant: string }) => (
    <div data-testid={`panel-${variant}`}>{content}</div>
  ),
}));

describe("DashboardPage", () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders the dashboard shell initially", () => {
    render(<DashboardPage />);
    expect(screen.getByText("Automated Marketing Engine")).toBeInTheDocument();
    expect(screen.queryByTestId("repo-summary")).not.toBeInTheDocument();
  });

  it("displays error from RepoInput", () => {
    render(<DashboardPage />);
    fireEvent.click(screen.getByTestId("trigger-error"));
    expect(screen.getByText("Input Error")).toBeInTheDocument();
  });

  it("handles successful analysis and stream generation", async () => {
    // create a fake stream reader
    const createStreamReader = (chunks: string[]) => {
      let currentIndex = 0;
      return {
        read: jest.fn().mockImplementation(() => {
          if (currentIndex < chunks.length) {
            return Promise.resolve({
              done: false,
              value: new TextEncoder().encode(chunks[currentIndex++]),
            });
          }
          return Promise.resolve({ done: true, value: undefined });
        }),
      };
    };

    mockFetch.mockResolvedValueOnce({
      body: {
        getReader: () =>
          createStreamReader([
            'data: {"type":"landing","content":"A"}\n',
            'data: {"type":"producthunt","content":"B"}\n',
            'data: {"type":"twitter","content":"C"}\ndata: ', // incomplete string
            '{"type":"invalid_json\n', // will cause parse error
            'data:   \n', // empty data string
            'not-data: ignore-this\n', // hits the line.startsWith("data: ") false branch
            'data: {"type":"unknown"}\n', // hits the else branch of type
            'data: {"type":"done"}\n',
          ]),
      },
    });

    render(<DashboardPage />);

    // trigger handleAnalyze
    await act(async () => {
      fireEvent.click(screen.getByTestId("trigger-analyze"));
    });

    await waitFor(() => {
      expect(screen.getByTestId("repo-summary")).toBeInTheDocument();
      expect(screen.getByTestId("panel-landing")).toHaveTextContent("A");
      expect(screen.getByTestId("panel-producthunt")).toHaveTextContent("B");
      expect(screen.getByTestId("panel-twitter")).toHaveTextContent("C");
    });
  });

  it("handles fetch error within handleAnalyze (no body)", async () => {
    mockFetch.mockResolvedValueOnce({
      body: null,
    });

    render(<DashboardPage />);

    await act(async () => {
      fireEvent.click(screen.getByTestId("trigger-analyze"));
    });

    await waitFor(() => {
      expect(screen.getByText("Failed to generate content.")).toBeInTheDocument();
    });
  });

  it("handles fetch exception within handleAnalyze", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network disconnect"));

    render(<DashboardPage />);

    await act(async () => {
      fireEvent.click(screen.getByTestId("trigger-analyze"));
    });

    await waitFor(() => {
      expect(screen.getByText("Failed to generate content.")).toBeInTheDocument();
    });
  });
});
