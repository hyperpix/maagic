# Specification: Reimagine Agent Page (Admin)

## 1. Overview
This track aims to completely redesign the Agent configuration page in the Admin dashboard (`/admin`). The goal is to move from a simple tabbed interface to a robust, 2-column layout featuring a vertical settings sidebar and an always-visible "Live Preview" of the chat widget. Additionally, we will introduce a comprehensive "Appearance" section to customize the agent's branding, visual style, and legal settings, ensuring all these configurations are persisted in the Convex backend.

## 2. Functional Requirements

### 2.1 Layout & Navigation
- **Structure:** Implement a 2-column layout.
    - **Left Column (Settings):** A scrollable area containing the configuration sections.
    - **Right Column (Live Preview):** A fixed, always-visible simulation of the Chat Widget that updates in real-time as settings are changed.
- **Sidebar Navigation:** Replace top horizontal tabs with a **vertical sidebar** navigation menu on the left (or within the settings column) to navigate between:
    1.  **Behavior** (Instructions, LLM, Tools)
    2.  **Knowledge** (Knowledge Base settings)
    3.  **Appearance** (New section)

### 2.2 Appearance Configuration (New)
Create a new configuration section allowing users to customize:
- **Agent Identity:**
    -   Title (e.g., "Support Bot")
    -   Description (e.g., "Your virtual assistant")
- **Branding:**
    -   Logo upload/URL
    -   Header image
    -   Background image
- **Styling:**
    -   Font selection
    -   Theme & Colors (Primary color, background color, etc.)
- **Tabs Configuration:**
    -   Enable/Disable tabs in the widget
- **Privacy & Legal:**
    -   Privacy Disclaimer text
    -   Legal compliance links
- **Widget Code:**
    -   Display the generated embed code for the widget based on current settings.

### 2.3 Live Preview
- The right-hand column must render a functional instance of the chat widget.
- **Real-time Updates:** Changes made in the "Appearance" forms (e.g., changing the primary color or title) must be immediately reflected in this preview without saving.
- **Functionality:** The preview should be interactive (send/receive messages) to test "Behavior" settings (Instructions/LLM).

### 2.4 Data Persistence (Backend)
- **Schema Update:** Update the Convex schema to store the new appearance and configuration fields.
    -   Likely create or update a singleton `agent_config` table/document or similar to store these settings globally for the project.
- **Save Functionality:** Ensure all settings (Behavior, Knowledge, Appearance) are fetched from and saved to the backend.

## 3. UX/UI Design
- **Style:** Use `shadcn/ui` components (Input, Select, Switch, Slider) for a clean, consistent look.
- **Context:** Use the `AdminSidebar` and existing layout wrapper.
- **Responsiveness:** Ensure the layout adapts, potentially hiding the Live Preview on smaller screens (mobile).

## 4. Technical Considerations
- **Component Reuse:** Reuse the existing `ChatWidget` or `AssistantModal` components for the preview if possible, passing custom styles/props to them.
- **State Management:** Manage local form state efficiently to allow "previewing" changes before they are committed to the database (or save on blur/debounced).

## 5. Out of Scope
- Advanced multi-agent management (assuming single agent config for this MVP).
- Analytics dashboard changes.
