import { render, screen } from "@testing-library/react";
import NotFound from "../not-found";

// Mock next/link since it is used in the component
jest.mock("next/link", () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
  MockLink.displayName = "MockLink";
  return MockLink;
});

describe("NotFound Component", () => {
  it("renders the 404 text and link to home", () => {
    render(<NotFound />);
    
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
    expect(screen.getByText(/The migration you are looking for has either been pruned/)).toBeInTheDocument();
    
    const link = screen.getByRole("link", { name: /Back to Base/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });
});
