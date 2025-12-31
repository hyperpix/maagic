import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChatWidget } from "./ChatWidget";

// Mock the runtime hook
vi.mock("@/lib/use-chat-runtime", () => ({
  useConvexRuntime: vi.fn().mockReturnValue({}),
}));

// Mock assistant-ui components
vi.mock("@assistant-ui/react", () => ({
  AssistantRuntimeProvider: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@/components/assistant-ui/assistant-modal", () => ({
  AssistantModal: () => <div data-testid="assistant-modal">Assistant Modal</div>,
}));

describe("ChatWidget", () => {
  it("renders the assistant modal", () => {
    render(<ChatWidget />);
    expect(screen.getByTestId("assistant-modal")).toBeInTheDocument();
  });
});