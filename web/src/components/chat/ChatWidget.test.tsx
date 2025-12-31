import { vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ChatWidget } from "./ChatWidget";
import { useMutation, useQuery } from "convex/react";

vi.mock("convex/react", () => ({
  useMutation: vi.fn(),
  useQuery: vi.fn().mockReturnValue([]),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: any) => {
      store[key] = (value || "").toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("ChatWidget", () => {
  let mockSendMessage: any;
  let mockCreateConversation: any;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    mockSendMessage = vi.fn().mockResolvedValue("msg123");
    mockCreateConversation = vi.fn().mockResolvedValue("conv123");
    
    (useMutation as any).mockImplementation((apiRef: any) => {
      if ((useMutation as any).mock.calls.length % 2 === 1) return mockCreateConversation;
      return mockSendMessage;
    });
    
    (useQuery as any).mockReturnValue([]);
  });

  it("renders the floating action button", () => {
    render(<ChatWidget />);
    const fab = screen.getByRole("button");
    expect(fab).toBeInTheDocument();
  });

  it("opens the chat modal when clicked", () => {
    render(<ChatWidget />);
    const fab = screen.getByRole("button");
    fireEvent.click(fab);
    
    expect(screen.getByText(/Chat with us/i)).toBeInTheDocument();
  });

  it("renders an input field and send button when open", () => {
    render(<ChatWidget />);
    fireEvent.click(screen.getByRole("button"));
    
    expect(screen.getByPlaceholderText(/Type a message/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send/i })).toBeInTheDocument();
  });

  it("updates message state when typing", () => {
    render(<ChatWidget />);
    fireEvent.click(screen.getByRole("button"));
    
    const input = screen.getByPlaceholderText(/Type a message/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Hello world" } });
    expect(input.value).toBe("Hello world");
  });

  it("calls sendMessage when send button is clicked", async () => {
    render(<ChatWidget />);
    await waitFor(() => expect(localStorageMock.getItem("chat_visitor_id")).toBeTruthy());
    fireEvent.click(screen.getByRole("button"));
    const input = screen.getByPlaceholderText(/Type a message/i);
    fireEvent.change(input, { target: { value: "Hello world" } });
    fireEvent.click(screen.getByRole("button", { name: /Send/i }));
    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalled();
    });
  });

  it("renders messages from subscription", () => {
    const mockMessages = [
      { _id: "m1", content: "Hello subscriber", sender: "visitor" },
      { _id: "m2", content: "Hi there back!", sender: "agent" },
    ];
    
    (useQuery as any).mockReturnValue(mockMessages);

    render(<ChatWidget />);
    fireEvent.click(screen.getByRole("button"));
    
    expect(screen.getByText("Hello subscriber")).toBeInTheDocument();
    expect(screen.getByText("Hi there back!")).toBeInTheDocument();
  });
});
