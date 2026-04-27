import { vi, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChatWidget } from "./ChatWidget";

vi.mock("@/lib/use-chat-runtime", () => ({
  useConvexRuntime: vi.fn().mockReturnValue({ runtime: {}, clearChat: vi.fn() }),
}));

vi.mock("@assistant-ui/react", () => ({
  AssistantRuntimeProvider: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@/components/assistant-ui/assistant-modal", () => ({
  AssistantModal: () => <div data-testid="assistant-modal">Assistant Modal</div>,
}));

describe("ChatWidget", () => {
  it("renders the assistant modal", () => {
    render(<ChatWidget widgetKey="test-widget-key" />);
    expect(screen.getByTestId("assistant-modal")).toBeInTheDocument();
  });
});
