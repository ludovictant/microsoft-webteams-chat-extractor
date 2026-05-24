## Context

The conversation history list in the side panel currently expands its container height to fit all rows without bound. This causes the entire side panel to become taller than the browser window, requiring the user to scroll the entire extension view to see elements at the top or bottom.

## Goals / Non-Goals

**Goals:**
- Constrain the height of the conversation history list.
- Add a vertical scrollbar for the history list.
- Ensure the side panel remains within the vertical bounds of the browser window.

**Non-Goals:**
- Redesigning the entire side panel layout.
- Implementing horizontal scrolling.

## Decisions

- **Decision: Use CSS `max-height` and `overflow-y: auto` for `#localStorageContent`**
  - **Rationale**: This is the standard way to implement a scrollable area within a container.
  - **Implementation**: Set `max-height: 400px` (or a dynamic value) on `#localStorageContent` and `overflow-y: auto`.

- **Decision: Remove Dynamic `scrollHeight` assignment in `sidepanel.js`**
  - **Rationale**: The previous implementation dynamically set `max-height` to `scrollHeight` to support animations, but this bypasses any CSS-defined limits.
  - **Implementation**: Update `updateLocalStorageVisibility` and `refreshHistoryList` to stop overriding `max-height` with large pixel values.

- **Decision: Themed Scrollbar**
  - **Rationale**: To match the "Teams Dark" aesthetic of the extension.
  - **Implementation**: Use `scrollbar-width: thin` and `scrollbar-color` properties.

## Risks / Trade-offs

- **[Risk] Fixed height too small on large monitors** → Mitigation: Use a reasonable default (like `400px`) which is common for sidebars, or use `vh` units. Given the side panel nature, `400px` ensures compatibility with small laptop screens.
- **[Risk] Layout jump on scrollbar appearance** → Mitigation: Use `overflow-y: overlay` (where supported) or ensure sufficient padding.
