import { POST, runtime } from "../route";
import { NextResponse } from "next/server";
import OpenAI from "openai";

type MockResponseExt = { status: number; body?: ReadableStream; _body?: ReadableStream };

// Make NextResponse.json work in jest
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      body,
      status: init?.status,
    })),
  },
}));

jest.mock("openai");

describe("Generate API Route", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeAll(() => {
    originalEnv = process.env;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.OPENAI_API_KEY = "test-sk-key";
  });

  it("exports edge runtime", () => {
    expect(runtime).toBe("edge");
  });

  it("returns 500 if OPENAI_API_KEY is not configured", async () => {
    delete process.env.OPENAI_API_KEY;

    const req = new Request("http://localhost/api/generate", {
      method: "POST",
      body: JSON.stringify({ repoContext: { name: "test" } }),
    });

    const res = await POST(req) as unknown as MockResponseExt;

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "OPENAI_API_KEY is not configured" },
      { status: 500 }
    );
    expect(res.status).toBe(500);
  });

  it("handles empty or invalid JSON body", async () => {
    const req = new Request("http://localhost/api/generate", {
      method: "POST",
      body: "invalid-json", 
    });

    const res = await POST(req) as unknown as MockResponseExt;

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: expect.any(String) },
      { status: 500 }
    );
    expect(res.status).toBe(500);
  });

  it("handles openai API error", async () => {
    // create a fake generator that throws an error
    const mockCreate = jest.fn().mockRejectedValue(new Error("OpenAI Rate limit"));
    
    (OpenAI as unknown as jest.Mock).mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    }));

    const req = new Request("http://localhost/api/generate", {
      method: "POST",
      body: JSON.stringify({ tone: "casual", repoContext: { name: "test-err" } }),
    });

    const res = await POST(req) as unknown as MockResponseExt;
    
    const stream = res.body || res._body;
    const reader = stream!.getReader();
    const chunks: string[] = [];
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(decoder.decode(value));
    }

    const fullResponse = chunks.join("");
    // we fire 3 streams, each will catch the error and output
    expect(fullResponse).toContain("OpenAI Rate limit");
    expect(fullResponse).toContain('"type": "done"');
  });

  it("handles successful stream generation", async () => {
    // Mock correct completion stream
    const mockCreate = jest.fn().mockImplementation(async function* () {
      yield { choices: [{ delta: { content: "hello" } }] };
      yield { choices: [{ delta: { content: "world" } }] };
      yield { choices: [{ delta: {} }] }; // missing content
      yield { choices: [] }; // empty choices
    });
    
    (OpenAI as unknown as jest.Mock).mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    }));

    const req = new Request("http://localhost/api/generate", {
      method: "POST",
      body: JSON.stringify({ repoContext: { name: "test-repo", recentWork: ["commit1"] } }),
    });

    const res = await POST(req) as unknown as MockResponseExt;

    const stream = res.body || res._body;
    const reader = stream!.getReader();
    const chunks: string[] = [];
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(decoder.decode(value));
    }

    const fullResponse = chunks.join("");
    // 3 streams in parallel
    expect(fullResponse).toContain("hello");
    expect(fullResponse).toContain("world");
    expect(fullResponse).toContain('"type": "done"');
  });

  it("handles catch block with non-Error thrown", async () => {
    const req = {
      json: jest.fn().mockRejectedValue("String error"),
    } as unknown as Request;

    await POST(req);
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Failed to initialize generation stream" },
      { status: 500 }
    );
  });
});
