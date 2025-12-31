# Product Guidelines

## Prose Style & Tone
- **Friendly & Casual:** Use a warm and approachable tone for all microcopy. For example, instead of "Message Sent," use "Sent! Your message is on its way." 
- **Clear & Concise:** While being friendly, maintain clarity. Avoid unnecessary jargon or overly complex sentences.
- **Supportive:** Ensure empty states and error messages provide helpful context or next steps (e.g., "It's quiet here... why not start a conversation?").

## Visual Identity (UI/UX)
- **Modern Minimalist:** Prioritize a clean, "Stripe-like" aesthetic. This means:
    - **Subtle Depth:** Use soft shadows and delicate borders to create hierarchy without clutter.
    - **Generous Whitespace:** Ensure elements have enough room to breathe, making the interface feel calm and organized.
    - **Soft Palette:** Use a neutral background with intentional, soft pops of color for primary actions.
- **Component Consistency:** Strictly use `shadcn/ui` components to ensure a unified and professional look across the visitor widget and admin dashboard.
- **Intuitive Interactions:** Focus on making actions obvious. Buttons should look like buttons, and scrollable areas should have subtle indicators.

## Error Handling & Feedback
- **Non-Interruptive Feedback:** Use temporary toast notifications for routine confirmations or minor errors to avoid breaking the user's flow.
- **Contextual Guidance:** When possible, display error messages inline near the affected field or action to provide immediate clarity.
- **Graceful Failures:** Ensure the UI remains functional and informative even when backend services are temporarily unavailable.
