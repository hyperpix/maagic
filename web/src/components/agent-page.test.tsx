import { render, screen, fireEvent } from "@testing-library/react"
import { AgentPage } from "./agent-page"
import { expect, test, vi } from "vitest"
import { SidebarProvider } from "@/components/ui/sidebar"

// Mock Convex
vi.mock("convex/react", () => ({
  useQuery: vi.fn(() => ({})),
  useMutation: vi.fn(() => vi.fn()),
}))

vi.mock("../../convex/_generated/api", () => ({
  api: {
    agentConfig: {
      getAgentConfig: "getAgentConfig",
      updateAgentConfig: "updateAgentConfig",
    },
  },
}))

// Mock our custom runtime hook
vi.mock("@/lib/use-chat-runtime", () => ({
  useConvexRuntime: vi.fn(() => ({
    runtime: {},
    clearChat: vi.fn(),
  })),
}))

// Mock Assistant UI components that might be too complex for simple unit tests
vi.mock("@assistant-ui/react", () => ({
  AssistantRuntimeProvider: ({ children }: any) => <div>{children}</div>,
}))

vi.mock("@/components/assistant-ui/thread", () => ({
  Thread: ({ config }: any) => (
    <div data-testid="preview-thread">
      <span data-testid="preview-title">{config?.title}</span>
      <span data-testid="preview-color">{config?.primaryColor}</span>
    </div>
  ),
}))

const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <SidebarProvider>
      {ui}
    </SidebarProvider>
  )
}

test("navigation switches between sections", async () => {
  renderWithProvider(<AgentPage />)
  
  // Should start on Instructions
  expect(screen.getByText("Behavior & Instructions")).toBeDefined()
  
  // Click on Model Configuration
  const llmButton = screen.getByText("Model Configuration")
  fireEvent.click(llmButton)
  
  // Should show Model Configuration section
  expect(screen.getByText("Configure the AI model powering your agent")).toBeDefined()
  
  // Click on Knowledge Base
  const kbButton = screen.getByText("Knowledge Base")
  fireEvent.click(kbButton)
  
  // Should show Knowledge Base section
  expect(screen.getByText("Configure how your agent retrieves domain knowledge")).toBeDefined()
})

test("appearance section inputs update local state", async () => {
  renderWithProvider(<AgentPage />)
  
  // Navigate to Appearance
  const appearanceButton = screen.getByText("Appearance")
  fireEvent.click(appearanceButton)
  
  // Change Title
  const titleInput = screen.getByLabelText("Title")
  fireEvent.change(titleInput, { target: { value: "New Agent Title" } })
  expect((titleInput as HTMLInputElement).value).toBe("New Agent Title")
  
  // Change Primary Color
  const colorInput = screen.getByLabelText("Primary Color")
  fireEvent.change(colorInput, { target: { value: "#ff0000" } })
  expect((colorInput as HTMLInputElement).value).toBe("#ff0000")
})

test("live preview synchronizes with form state", async () => {
  renderWithProvider(<AgentPage />)
  
  // Navigate to Appearance
  const appearanceButton = screen.getByText("Appearance")
  fireEvent.click(appearanceButton)
  
  // Change Title
  const titleInput = screen.getByLabelText("Title")
  fireEvent.change(titleInput, { target: { value: "Live Preview Agent" } })
  
  // Verify preview updated
  expect(screen.getByTestId("preview-title").textContent).toBe("Live Preview Agent")
  
  // Change Color
  const colorInput = screen.getByLabelText("Primary Color")
  fireEvent.change(colorInput, { target: { value: "#00ff00" } })
  
  // Verify preview updated
  expect(screen.getByTestId("preview-color").textContent).toBe("#00ff00")
})