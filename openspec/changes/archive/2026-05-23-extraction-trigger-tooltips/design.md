## Context

The "Download recent messages" button already utilizes a CSS-based tooltip system (`btn-tooltip-wrapper` and `btn-tooltip-text`). This design extends that pattern to all extraction trigger buttons in the side panel to provide a consistent and informative user interface.

## Goals / Non-Goals

**Goals:**
- Apply tooltips to "Download last 7 days", "Download last 30 days", "Download last 3 months", and "Download all messages".
- Ensure the existing "Download recent messages" tooltip remains functional and correctly managed.
- Maintain a clean, non-cluttered layout.

**Non-Goals:**
- Adding tooltips to action buttons like "Stop", "Abort", or "Download ZIP" (only trigger buttons are targeted).

## Decisions

- **Decision: Reusable CSS Tooltip Class**
  - **Rationale**: Generalizing the existing CSS ensures consistency across the UI and reduces code duplication.
  - **Implementation**: The `.btn-tooltip-text` class will be applied to all tooltip elements, and visibility will be controlled by the `.btn-tooltip-wrapper:hover` pseudo-class.

- **Decision: Static HTML for Standard Tooltips**
  - **Rationale**: For buttons that are always enabled, simple static HTML/CSS tooltips are sufficient and performant.
  - **Implementation**: Wrap each button in the `.btn-tooltip-wrapper` and add a sibling `div` with `.btn-tooltip-text`.

- **Decision: Descriptive Tooltip Content**
  - **7 Days**: "Fetch messages from the last 7 days only."
  - **30 Days**: "Fetch messages from the last 30 days only."
  - **3 Months**: "Fetch messages from the last 90 days only."
  - **All**: "Fetch the entire visible chat history from Teams."
- **Recent messages**: 
  - *Enabled*: "Fetch only new messages added since the last crawl."
  - *Disabled*: "Extract only new messages since the last crawl. Enable 'Local storage' below to use this feature."

## Risks / Trade-offs

- **[Risk] Visual overlap** → Mitigation: Use `bottom: 110%` and `z-index: 100` to ensure tooltips appear above all other elements and don't overlap with adjacent buttons.
- **[Risk] Touch device usability** → Mitigation: CSS `:hover` doesn't apply well to touch, but these tooltips are primarily targeted at desktop users in a sidebar context.
