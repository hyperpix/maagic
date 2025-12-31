import { vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminPage from "./page";
import { useQuery, useMutation } from "convex/react";

vi.mock("convex/react", () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}));

describe("AdminPage", () => {
  let mockSendMessage: any;
  const mockConversations = [
    { _id: "c1", visitorId: "visitor_1", createdAt: 123 },
  ];
  const mockMessages = [
    { _id: "m1", content: "Hello from visitor", sender: "visitor" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockSendMessage = vi.fn().mockResolvedValue(null);
    (useMutation as any).mockReturnValue(mockSendMessage);
    
    (useQuery as any).mockImplementation((apiRef: any, args: any) => {
      // Differentiate between getConversations and getMessages by args
      if (!args || Object.keys(args).length === 0) return mockConversations;
      if (args && args.conversationId) return mockMessages;
      return [];
    });
  });

  it("renders the admin dashboard layout", () => {
    render(<AdminPage />);
    expect(screen.getByText(/Admin Inbox/i)).toBeInTheDocument();
  });

  it("renders a list of conversations", () => {
    render(<AdminPage />);
    expect(screen.getByText("visitor_1")).toBeInTheDocument();
  });

  it("renders messages when a conversation is selected", async () => {
    render(<AdminPage />);
    
    fireEvent.click(screen.getByText("visitor_1"));
    
    expect(screen.getByText("Hello from visitor")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Type a reply/i)).toBeInTheDocument();
  });

  it("calls sendMessage mutation on form submission", async () => {
    render(<AdminPage />);
    fireEvent.click(screen.getByText("visitor_1"));
    
    const input = screen.getByPlaceholderText(/Type a reply/i);
    fireEvent.change(input, { target: { value: "Hello from agent" } });
    fireEvent.click(screen.getByRole("button", { name: /Send/i }));
    
    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith(expect.objectContaining({
        content: "Hello from agent",
        sender: "agent",
      }));
    });
  });
});