import { render, screen, fireEvent } from "@testing-library/react";
import { ChatWidget } from "./ChatWidget";

describe("ChatWidget", () => {
  it("renders the floating action button", () => {
    render(<ChatWidget />);
    const fab = screen.getByRole("button");
    expect(fab).toBeInTheDocument();
  });

  it("opens the chat modal when clicked", () => {
    render(<ChatWidget />);
    const fab = screen.getByRole("button");
    fireEvent.click(fab);
    
    expect(screen.getByText(/Chat/i)).toBeInTheDocument();
  });
});
