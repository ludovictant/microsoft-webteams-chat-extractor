## Context

The extension now supports persistent IndexedDB storage and real-time aggregation. The core logic for incremental extraction (stopping when a known message is found) is partially implemented in the background script but lack a dedicated UI trigger. This change provides that trigger and links it to the state of the "Local storage" feature.

## Goals / Non-Goals

**Goals:**
- Add a "Download recent messages" button to the side panel.
- Implement a tooltip mechanism for disabled buttons.
- Link the button's enabled state to the `localStorageToggle`.
- Trigger an extraction with a special signal for incremental mode.

**Non-Goals:**
- Implementing a completely different extraction algorithm (we will reuse the existing loop with a new stop condition).

## Decisions

- **Decision: Use `data-days="-1"` for the new button**
  - **Rationale**: The existing system uses the `days` parameter to define the time range. Using a negative value is a clean way to signal "Incremental/Recent" mode without adding new message properties.
  - **Implementation**: The click handler will pass `-1` to the background/payload.

- **Decision: Pure CSS Tooltip**
  - **Rationale**: Keeps the implementation lightweight and performant.
  - **Implementation**: Wrap the button in a container with a `data-tooltip` attribute and use the `:hover` pseudo-class to show the message when the button is disabled.

- **Decision: Centralized Toggle Observer**
  - **Rationale**: The `sidepanel.js` already has an `updateLocalStorageVisibility` function. This is the perfect place to also update the disabled state of the new button.

## Risks / Trade-offs

- **[Risk] Button clutter** → Mitigation: Positioned below "Download all messages", it follows the logical progression of ranges and doesn't interfere with primary actions.
- **[Risk] User confusion on "Recent" definition** → Mitigation: The tooltip explicitly states it fetches messages "since the last crawl," which aligns with user expectations for incremental features.
