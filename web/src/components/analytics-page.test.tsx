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
  it("renders with soft layout structure using shadcn components", () => {
    render(<AnalyticsPage />)
    
    // Check for main title
    expect(screen.getByText("Analytics")).toBeInTheDocument()
    
    // Check for Tab triggers
    expect(screen.getByText("Overview")).toBeInTheDocument()
    expect(screen.getByText("Engagement")).toBeInTheDocument()
    expect(screen.getByText("Conversations")).toBeInTheDocument()
    
    // Check for some metric labels
    expect(screen.getByText("Credits Used")).toBeInTheDocument()
    expect(screen.getAllByText("Total Messages").length).toBeGreaterThan(0)
  })
})
