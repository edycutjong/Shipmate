import { POST } from "../route";

jest.mock("next/server", () => ({
  NextResponse: {
    json: (data: any, init?: any) => new Response(JSON.stringify(data), init),
  },
}));

describe("POST /api/analyze", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("returns 400 if repoUrl is missing", async () => {
    const req = new Request("http://localhost/api/analyze", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("repoUrl is required");
  });

  it("returns 400 if url format is invalid", async () => {
    const req = new Request("http://localhost/api/analyze", {
      method: "POST",
      body: JSON.stringify({ repoUrl: "not-a-url" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid GitHub URL format");
  });

  it("handles github api error", async () => {
    const req = new Request("http://localhost/api/analyze", {
      method: "POST",
      body: JSON.stringify({ repoUrl: "owner/repo" }),
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    const res = await POST(req);
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toBe("GitHub API error: Not Found");
  });

  it("processes valid repo successfully", async () => {
    const req = new Request("http://localhost/api/analyze", {
      method: "POST",
      body: JSON.stringify({ repoUrl: "https://github.com/owner/repo.git", pat: "token" }),
    });

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ default_branch: "main", name: "repo", description: "desc" }),
      })
      .mockResolvedValueOnce({ // readme
        ok: true,
        text: async () => "A".repeat(2000), // > 1500 limit test
      })
      .mockResolvedValueOnce({ // package.json
        ok: true,
        text: async () => JSON.stringify({ name: "pkg-name", description: "pkg-desc", dependencies: { react: "1" }, devDependencies: { jest: "1" } }),
      })
      .mockResolvedValueOnce({ // tree
        ok: true,
        json: async () => ({
          tree: [
            { type: "blob", path: "src/app/page.tsx" },
            { type: "blob", path: "src/app/foo/bar/baz/deep.tsx" }, // depth 5
            { type: "blob", path: "src/pages/index.tsx" },
            { type: "blob", path: "other.ts" }, // depth 1
            { type: "blob", path: "other/nested/file.ts" }, // depth 3 > 2 (ignored)
          ]
        }),
      })
      .mockResolvedValueOnce({ // commits
        ok: true,
        json: async () => [{ commit: { message: "init\nbody" } }],
      });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    
    expect(data.name).toBe("pkg-name"); // package.json overrides
    expect(data.description).toBe("pkg-desc");
    expect(data.readmeExcerpt.length).toBe(1503); // 1500 chars + "..."
    expect(data.techStack).toEqual(["react", "jest"]);
    expect(data.routeTree).toEqual(["src/app/page.tsx", "src/pages/index.tsx", "other.ts"]);
    expect(data.recentWork).toEqual(["init"]);
  });

  it("handles parse error in package.json", async () => {
    const req = new Request("http://localhost/api/analyze", {
      method: "POST",
      body: JSON.stringify({ repoUrl: "owner/repo" }),
    });

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ default_branch: "main", name: "repo" }) })
      .mockResolvedValueOnce({ ok: false })
      .mockResolvedValueOnce({ ok: true, text: async () => "invalid json" }) // package.json -> parse error
      .mockResolvedValueOnce({ ok: false })
      .mockResolvedValueOnce({ ok: false });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.name).toBe("repo"); // fallback to github name
    expect(data.techStack).toEqual([]);
  });

  it("handles exception during fetch", async () => {
    const req = new Request("http://localhost/api/analyze", {
      method: "POST",
      body: JSON.stringify({ repoUrl: "owner/repo" }),
    });

    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe("Network Error");
  });

  it("handles non-error exception", async () => {
    const req = new Request("http://localhost/api/analyze", {
      method: "POST",
      body: JSON.stringify({ repoUrl: "owner/repo" }),
    });

    (global.fetch as jest.Mock).mockRejectedValueOnce("Unknown Error");

    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe("Failed to analyze repository");
  });
});
