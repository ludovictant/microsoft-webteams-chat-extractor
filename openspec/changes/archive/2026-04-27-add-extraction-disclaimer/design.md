## Context

Extracting long chat histories is a delicate programmatic process that relies on the Teams tab remaining focused on a single conversation. Switching conversations disrupts the DOM structure and the MDO data pipeline. Additionally, the "rebound" effect (scrolling forever at the top) is a known limitation of automated browser interaction with virtualized lists.

## Goals / Non-Goals

**Goals:**
- Provide prominent guidance to prevent user errors.
- Clearly explain the "manual override" path (Stop and Export).

**Non-Goals:**
- Preventing the "rebound" effect programmatically (this is handled by the user instruction).

## Decisions

- **UI Placement**: The disclaimer will be placed at the bottom of the `#status` panel, just above or below the control buttons.
- **Styling**: Use a subtle yet readable box with a notice icon to distinguish it from progress data.
- **Text Selection**:
    *   "⚠️ **Important**: Do not switch conversations in the Teams window while the extraction is running."
    *   "If the progress 'rebounds' at the oldest message, simply click **Stop and Export** to finish."

## Risks / Trade-offs

- [Risk] → UI clutter.
- [Mitigation] → Keep the font size small (11px-12px) and only show it when needed (active extraction).
