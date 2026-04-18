import { render, screen, fireEvent, act } from "@testing-library/react";
import { RepoInput } from "../RepoInput";

describe("RepoInput", () => {
  const mockOnAnalyze = jest.fn();
  const mockSetIsLoading = jest.fn();
  const mockSetError = jest.fn();

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it("renders the input and submit button", () => {
    render(
      <RepoInput
        onAnalyze={mockOnAnalyze}
        isLoading={false}
        setIsLoading={mockSetIsLoading}
        setError={mockSetError}
      />
    );
    expect(screen.getByPlaceholderText("https://github.com/username/repository")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Analyze/i })).toBeInTheDocument();
  });

  it("disables inputs and shows loading state when isLoading is true", () => {
    render(
      <RepoInput
        onAnalyze={mockOnAnalyze}
        isLoading={true}
        setIsLoading={mockSetIsLoading}
        setError={mockSetError}
      />
    );
    const urlInput = screen.getByPlaceholderText("https://github.com/username/repository");
    const patInput = screen.getByPlaceholderText("Optional GitHub PAT");
    const button = screen.getByRole("button");

    expect(urlInput).toBeDisabled();
    expect(patInput).toBeDisabled();
    expect(button).toBeDisabled();
    expect(screen.getByText("Analyzing")).toBeInTheDocument();
  });

  it("does not submit if url is empty", async () => {
    render(
      <RepoInput
        onAnalyze={mockOnAnalyze}
        isLoading={false}
        setIsLoading={mockSetIsLoading}
        setError={mockSetError}
      />
    );

    const button = screen.getByRole("button", { name: /Analyze/i });
    expect(button).toBeDisabled();

    // Force form submit to hit the !url return branch
    const urlInput = screen.getByPlaceholderText("https://github.com/username/repository");
    const form = urlInput.closest("form");
    await act(async () => {
      fireEvent.submit(form!);
    });
    
    expect(mockSetIsLoading).not.toHaveBeenCalled();
  });

  it("submits the form successfully and calls onAnalyze", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ simulated: "data" }),
    });

    render(
      <RepoInput
        onAnalyze={mockOnAnalyze}
        isLoading={false}
        setIsLoading={mockSetIsLoading}
        setError={mockSetError}
      />
    );

    const urlInput = screen.getByPlaceholderText("https://github.com/username/repository");
    const patInput = screen.getByPlaceholderText("Optional GitHub PAT");

    fireEvent.change(urlInput, { target: { value: "https://github.com/test/repo" } });
    fireEvent.change(patInput, { target: { value: "secret" } });

    const form = urlInput.closest("form");
    
    await act(async () => {
      fireEvent.submit(form!);
    });

    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    expect(mockSetError).toHaveBeenCalledWith(null);
    expect(global.fetch).toHaveBeenCalledWith("/api/analyze", expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ repoUrl: "https://github.com/test/repo", pat: "secret" }),
    }));
    expect(mockOnAnalyze).toHaveBeenCalledWith({ simulated: "data" });
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
  });

  it("handles fetch error with response.ok = false and custom error message", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Repository not found" }),
    });

    render(
      <RepoInput
        onAnalyze={mockOnAnalyze}
        isLoading={false}
        setIsLoading={mockSetIsLoading}
        setError={mockSetError}
      />
    );

    const urlInput = screen.getByPlaceholderText("https://github.com/username/repository");
    fireEvent.change(urlInput, { target: { value: "https://github.com/test/repo" } });

    const form = urlInput.closest("form");
    
    await act(async () => {
      fireEvent.submit(form!);
    });

    expect(mockSetError).toHaveBeenCalledWith("Repository not found");
    expect(mockOnAnalyze).not.toHaveBeenCalled();
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
  });

  it("handles fetch error with response.ok = false and default error message", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ }),
    });

    render(
      <RepoInput
        onAnalyze={mockOnAnalyze}
        isLoading={false}
        setIsLoading={mockSetIsLoading}
        setError={mockSetError}
      />
    );

    const urlInput = screen.getByPlaceholderText("https://github.com/username/repository");
    fireEvent.change(urlInput, { target: { value: "https://github.com/test/repo" } });

    const form = urlInput.closest("form");
    
    await act(async () => {
      fireEvent.submit(form!);
    });

    expect(mockSetError).toHaveBeenCalledWith("Failed to analyze repository");
  });

  it("handles network error throwing exception", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    render(
      <RepoInput
        onAnalyze={mockOnAnalyze}
        isLoading={false}
        setIsLoading={mockSetIsLoading}
        setError={mockSetError}
      />
    );

    const urlInput = screen.getByPlaceholderText("https://github.com/username/repository");
    fireEvent.change(urlInput, { target: { value: "https://github.com/test/repo" } });

    const form = urlInput.closest("form");
    
    await act(async () => {
      fireEvent.submit(form!);
    });

    expect(mockSetError).toHaveBeenCalledWith("Network Error");
  });

  it("handles unexpected non-Error throws", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce("String error");

    render(
      <RepoInput
        onAnalyze={mockOnAnalyze}
        isLoading={false}
        setIsLoading={mockSetIsLoading}
        setError={mockSetError}
      />
    );

    const urlInput = screen.getByPlaceholderText("https://github.com/username/repository");
    fireEvent.change(urlInput, { target: { value: "https://github.com/test/repo" } });

    const form = urlInput.closest("form");
    
    await act(async () => {
      fireEvent.submit(form!);
    });

    expect(mockSetError).toHaveBeenCalledWith("An unexpected error occurred");
  });
});
