import { render, screen } from "@testing-library/react";
import { ChatWidget } from "./ChatWidget";

describe("ChatWidget", () => {
  it("renders the floating action button", () => {
    render(<ChatWidget />);
    const fab = screen.getByRole("button");
    expect(fab).toBeInTheDocument();
  });
});
