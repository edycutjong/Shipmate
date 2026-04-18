import { render, screen } from "@testing-library/react";
import { RepoSummary } from "../RepoSummary";

describe("RepoSummary", () => {
  const baseData = {
    name: "test-repo",
    description: "A test repository",
    techStack: ["React", "Next.js", "TypeScript"],
    features: ["Feature 1"],
    recentWork: ["Initial commit", "Update README"],
    readmeExcerpt: "This is a test readme",
    routeTree: ["src/app/page.tsx", "src/app/layout.tsx"]
  };

  it("renders correctly with all data", () => {
    render(<RepoSummary data={baseData} />);
    expect(screen.getByText("test-repo")).toBeInTheDocument();
    expect(screen.getByText("A test repository")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText(/src\/app\/page\.tsx/)).toBeInTheDocument();
    expect(screen.getByText("Initial commit")).toBeInTheDocument();
  });

  it("handles missing description", () => {
    render(<RepoSummary data={{ ...baseData, description: "" }} />);
    expect(screen.getByText("No description provided")).toBeInTheDocument();
  });

  it("handles empty arrays", () => {
    render(<RepoSummary data={{ ...baseData, techStack: [], routeTree: [], recentWork: [] }} />);
    expect(screen.getByText("No dependencies found")).toBeInTheDocument();
    expect(screen.getByText("No routes inferred")).toBeInTheDocument();
    expect(screen.getByText("No recent commits")).toBeInTheDocument();
  });

  it("truncates lists properly and shows +more", () => {
    const manyTech = Array.from({length: 15}, (_, i) => `tech${i}`);
    const manyRoutes = Array.from({length: 10}, (_, i) => `route${i}.ts`);
    const manyCommits = Array.from({length: 5}, (_, i) => `commit${i}`);

    render(
      <RepoSummary data={{
        ...baseData,
        techStack: manyTech,
        routeTree: manyRoutes,
        recentWork: manyCommits
      }} />
    );

    expect(screen.getByText("tech0")).toBeInTheDocument();
    expect(screen.queryByText("tech11")).not.toBeInTheDocument();
    expect(screen.getByText("+5 more")).toBeInTheDocument();

    expect(screen.getByText(/route0\.ts/)).toBeInTheDocument();
    expect(screen.queryByText(/route5\.ts/)).not.toBeInTheDocument();
    expect(screen.getByText(/\.\.\.5 more files/)).toBeInTheDocument();

    expect(screen.getByText("commit0")).toBeInTheDocument();
    expect(screen.queryByText("commit4")).not.toBeInTheDocument();
  });
});
