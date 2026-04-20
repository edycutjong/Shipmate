import { render, screen } from "@testing-library/react";
import Home from "../page";

// Mock next/link
jest.mock("next/link", () => {
  const MockLink = ({ children, href, ...props }: { children: React.ReactNode; href: string;[key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  );
  MockLink.displayName = "MockLink";
  return { __esModule: true, default: MockLink };
});

describe("Home Page", () => {
  it("renders the landing page with hero content", () => {
    render(<Home />);
    expect(screen.getByText("Ship Your")).toBeInTheDocument();
    expect(screen.getByText("Launch Story")).toBeInTheDocument();
  });

  it("renders CTA linking to dashboard", () => {
    render(<Home />);
    const ctaLinks = screen.getAllByRole("link", { name: /launch|try shipmate/i });
    expect(ctaLinks.length).toBeGreaterThan(0);
    expect(ctaLinks[0]).toHaveAttribute("href", "/dashboard");
  });

  it("renders feature cards", () => {
    render(<Home />);
    expect(screen.getByText("Landing Page")).toBeInTheDocument();
    expect(screen.getByText("Product Hunt")).toBeInTheDocument();
    expect(screen.getByText("X/Twitter")).toBeInTheDocument();
  });
});
