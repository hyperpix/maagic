# Specification: Reimagine Analytics Page

## 1. Overview
The goal of this track is to redesign the Analytics page to achieve a "soft" aesthetic and improved user experience. We will maintain all existing data points but transition from a dense, grid-based layout to a more breathable, minimalist design characterized by large rounded corners and diffused shadows.

## 2. Functional Requirements

### 2.1 Visual Redesign ("Soft" Look)
- **Rounded Corners:** Update all cards and containers to use `rounded-3xl` or `rounded-[2rem]`.
- **Shadows & Borders:** Replace hard borders (`border`) with very subtle, diffused shadows (`shadow-sm` or custom soft shadows) and optional light background tints.
- **Minimalist Spacing:** Increase whitespace between sections and elements to reduce cognitive load and create a "floating" feel.
- **Typography:** Refine font weights and sizes to emphasize data points while keeping labels soft and secondary.

### 2.2 Existing Data Points (To be maintained)
- **Overview Metrics:** Credits Used, Total Minutes, Website Traffic, Total Messages, Total Conversations, Avg Messages/Chat, Avg Seconds/Chat.
- **User Engagement Funnel:** Step-by-step progression (Views -> Clicks -> Starts -> Engaged).
- **Engagement Statistics:** Comparative breakdown of funnel metrics.
- **Conversation Metrics:** 
    - Total Conversations (7-day trend).
    - User Retention (Messages per chat distribution).
    - Time Retention (Interaction duration distribution).

### 2.3 Interactive Visualizations
- **Soft Charts:** Redesign the placeholder SVG charts to use smooth curves, soft gradients, and rounded bars.
- **Empty States:** Maintain supportive empty states ("Not enough data") but style them to match the new soft aesthetic.

## 3. UX/UI Design
- **Layout:** Move away from the strictly equal-width grid to a more varied, hierarchal layout that prioritizes key overview metrics.
- **Color Palette:** Use soft primary color accents (likely the yellow/gold from the logo) against neutral, airy backgrounds.

## 4. Technical Considerations
- **Component Styling:** Custom Tailwind utility classes will be used to achieve the specific "soft" shadow and radius requirements.
- **Responsive Design:** Ensure the large rounded corners and increased spacing translate well to mobile devices.

## 5. Out of Scope
- Adding new tracking events or data models.
- Implementing a full charting library (e.g., Recharts) unless deemed necessary for the "soft" curves.
