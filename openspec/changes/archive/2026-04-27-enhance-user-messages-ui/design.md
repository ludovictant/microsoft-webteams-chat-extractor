## Context

The "Stalled" state and the "Resumed" state provide critical feedback during long extractions. Current messaging uses a mix of text and HTML which can be refined for better professional presentation. The goal is to make the instructions clear and the success feedback visually rewarding.

## Goals / Non-Goals

**Goals:**
- Refine the wording of the Stalled state message.
- Standardize the CSS formatting of the status nudge container.
- Improve the visual reward of the success (Resumed) state.

**Non-Goals:**
- Changing the state machine logic or triggers.

## Decisions

- **Consistent Template**: All status alerts will use a consistent template with a bold prefix and a clear instruction.
- **Improved Success Message**: Use "Extraction resumed successfully!" for the resumed state.
- **Always Visible Instructions**: The `#disclaimerBox` will be moved outside of conditional display blocks to remain visible in all states (idle, extracting, etc.).
- **Expanded Instructions**:
    *   Include: "Do not change the conversation in web Teams."
    *   Include: "Do not minimize the Teams window (switching to another browser tab is allowed)."
- **Stalled Message wording**: Use the exact wording requested:
    *   "Stalled: The top of the chat may have been reached."
    *   "If you think that some history remains, manually scroll up in Teams then click 'Resume Manually'. Otherwise, click 'Stop and Export' to finish."

## Risks / Trade-offs

- [Risk] → Longer text might overflow the popup if it's already full.
- [Mitigation] → We will ensure the styling remains compact and use the existing `statusNudge` min-height to prevent UI jumping.
