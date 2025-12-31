import { render, screen } from "@testing-library/react";
import AdminPage from "./page";
import { vi } from "vitest";

vi.mock("convex/react", () => ({
  useQuery: vi.fn().mockReturnValue([]),
  useMutation: vi.fn().mockReturnValue(vi.fn()),
}));

describe("AdminPage", () => {
  it("renders the admin dashboard layout", () => {
    render(<AdminPage />);
    expect(screen.getByText(/Admin Inbox/i)).toBeInTheDocument();
    // Check for two columns (conceptual check via roles or text)
    expect(screen.getByRole("complementary")).toBeInTheDocument(); // Sidebar
    expect(screen.getByRole("main")).toBeInTheDocument(); // Content
  });
});
