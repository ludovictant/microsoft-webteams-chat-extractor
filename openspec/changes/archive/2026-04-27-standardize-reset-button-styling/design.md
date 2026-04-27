## Context

The current styling of the `#resetBtn` ("Start New Extraction") is defined directly in its `style` attribute in `popup.html`, and it lacks the unified appearance of the rest of the extension's UI. It looks disconnected and less like a clickable button than the other elements.

## Goals / Non-Goals

**Goals:**
- Unify the visual style of the `#resetBtn` with the primary button theme.
- Improve the affordance of the reset action.
- Centralize styling if possible to avoid inline CSS drift.

**Non-Goals:**
- Changing the functionality of the reset action.

## Decisions

- **Apply Global Button Styles**: We will move the styling of `#resetBtn` from inline CSS to a shared CSS rule or a specific rule in the `<style>` block of `popup.html`.
- **Match Theme**: The button will use the purple/blue theme color (e.g., `#6264a7`), with appropriate padding and border-radius (8px).
- **Hover/Active States**: Implement consistent transition and scaling effects matching the "Download Archive" button.

## Risks / Trade-offs

- [Risk] → Button becomes too prominent compared to the download action.
- [Mitigation] → We will ensure the visual weight is balanced, potentially keeping the "Download" button slightly larger or more primary if necessary, but ensuring "Reset" still looks like a button.
