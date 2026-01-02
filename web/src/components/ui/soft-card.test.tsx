import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { SoftCard } from "./soft-card"

describe("SoftCard", () => {
  it("renders correctly with soft styling", () => {
    const { getByTestId } = render(
      <SoftCard data-testid="soft-card">
        <div>Content</div>
      </SoftCard>
    )
    const card = getByTestId("soft-card")
    
    // Check for soft rounding
    expect(card.className).toContain("rounded-[2rem]")
    
    // Check for absence of hard border
    expect(card.className).not.toContain("border")
    
    // Check for soft shadow
    expect(card.className).toContain("shadow-soft")
  })
})
