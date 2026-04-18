import { NextResponse } from "next/server";

export const runtime = "edge";

interface AnalyzeRequest {
  repoUrl: string;
  pat?: string;
}

export async function POST(req: Request) {
  try {
    const body: AnalyzeRequest = await req.json();
    const { repoUrl, pat } = body;

    if (!repoUrl) {
      return NextResponse.json(
        { error: "repoUrl is required" },
        { status: 400 }
      );
    }

    // Try to extract owner and repo
    // Handles forms: https://github.com/owner/repo or owner/repo
    const urlPattern = /(?:https?:\/\/github\.com\/)?([^/]+)\/([^/]+)(?:\/.*)?/;
    const match = repoUrl.match(urlPattern);

    if (!match) {
      return NextResponse.json(
        { error: "Invalid GitHub URL format" },
        { status: 400 }
      );
    }

    const [, owner, repo] = match;
    const cleanRepo = repo.replace(/\.git$/, "");

    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Shipmate-Analyze-Edge-Function",
    };

    if (pat) {
      headers["Authorization"] = `Bearer ${pat}`;
    }

    // Fetch repository details to get default branch
    const repoRes = await fetch(
      `https://api.github.com/repos/${owner}/${cleanRepo}`,
      { headers }
    );

    if (!repoRes.ok) {
      return NextResponse.json(
        { error: `GitHub API error: ${repoRes.statusText}` },
        { status: repoRes.status }
      );
    }

    const repoData = await repoRes.json();
    const defaultBranch = repoData.default_branch;

    // Parallel fetch: README, package.json, route tree, and commits
    const [readmeRes, packageRes, treeRes, commitsRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/readme`, {
        headers: { ...headers, Accept: "application/vnd.github.v3.raw" },
      }),
      fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/contents/package.json`, {
        headers: { ...headers, Accept: "application/vnd.github.v3.raw" },
      }),
      fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/git/trees/${defaultBranch}?recursive=1`, {
        headers,
      }),
      fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/commits?per_page=10`, {
        headers,
      }),
    ]);

    let readmeExcerpt = "";
    if (readmeRes.ok) {
      const readme = await readmeRes.text();
      // Extract up to 1500 chars 
      readmeExcerpt = readme.slice(0, 1500) + (readme.length > 1500 ? "..." : "");
    }

    let defaultName = repoData.name;
    let description = repoData.description || "";
    let techStack: string[] = [];

    if (packageRes.ok) {
        try {
            const packageJsonContent = await packageRes.text();
            const packageJson = JSON.parse(packageJsonContent);
            if (packageJson.name) defaultName = packageJson.name;
            if (packageJson.description) description = packageJson.description;
            
            const deps = Object.keys(packageJson.dependencies || {});
            const devDeps = Object.keys(packageJson.devDependencies || {});
            techStack = [...deps, ...devDeps];
        } catch {
            // Ignore parse errors from package.json
        }
    }

    let routeTree: string[] = [];
    if (treeRes.ok) {
      const treeData = await treeRes.json();
      if (treeData && treeData.tree) {
        // Filter to files and top ~3 levels to infer routes
        routeTree = treeData.tree
          .filter((t: { type: string; path: string }) => t.type === "blob")
          .map((t: { path: string }) => t.path)
          .filter((p: string) => {
            const depth = p.split("/").length;
            // focus on app/ src/ pages/ to infer structure 
             if ((p.startsWith("app/") || p.startsWith("src/app/") || p.startsWith("pages/") || p.startsWith("src/pages/")) && depth <= 4) {
                 return true;
             }
            return depth <= 2; 
          })
          .slice(0, 50); // limit to avoid massive payloads
      }
    }

    let recentWork: string[] = [];
    if (commitsRes.ok) {
      const commits = await commitsRes.json();
      if (Array.isArray(commits)) {
        recentWork = commits.map((c: { commit?: { message?: string } }) => c.commit?.message?.split("\n")[0]).filter((msg): msg is string => Boolean(msg));
      }
    }

    return NextResponse.json({
      name: defaultName,
      description,
      techStack,
      features: [], // Placeholder, maybe populated dynamically later or let LLM infer
      recentWork,
      readmeExcerpt,
      routeTree,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to analyze repository" },
      { status: 500 }
    );
  }
}
