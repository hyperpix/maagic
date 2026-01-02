import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { AnalyticsPage } from "./analytics-page"

// Mock Convex
vi.mock("convex/react", () => ({
  useQuery: vi.fn((name) => {
    if (name === "getConversations") return []
    if (name === "getAllMessages") return []
    return undefined
  }),
}))

vi.mock("../../convex/_generated/api", () => ({
  api: {
    conversations: { getConversations: "getConversations" },
    messages: { getAllMessages: "getAllMessages" },
  },
}))

describe("AnalyticsPage Redesign", () => {
  it("renders with soft layout structure", () => {
    const { getAllByText, getByTestId } = render(<AnalyticsPage />)
    
    // Check for overview section header
    expect(screen.getByText("Overview Metrics")).toBeInTheDocument()
    
    // Check for key data points (using AllBy because they might appear in labels and chart titles)
    expect(getAllByText("Credits Used").length).toBeGreaterThan(0)
    expect(getAllByText("Total Conversations").length).toBeGreaterThan(0)
    
    // Check for SoftCard usage (we'll add data-testid to the component during implementation)
    // For now, we'll just check that it renders without crashing
  })
})
