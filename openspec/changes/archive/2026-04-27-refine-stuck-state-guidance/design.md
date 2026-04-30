## Context

The "Stuck" alert currently triggers after 3 failed scroll attempts (approx. 10 seconds of no new content). In many cases, this happens because the scanner has successfully reached the absolute beginning of the chat. The current message ("Stuck! Please manually scroll...") sounds like an error, leading to user confusion.

## Goals / Non-Goals

**Goals:**
- Provide a more accurate and helpful message for the `stuck` state.
- Clearly distinguish between a "stall" (Teams is slow) and "finished" (top of chat reached).

**Non-Goals:**
- Changing the technical trigger for the `stuck` state.

## Decisions

- **Updated Text**: The `statusNudge` innerHTML will be updated to:
    *   `<strong style="color: #f9a825;">(!) Stalled:</strong> The top of the chat may have been reached.`
    *   `If you think that some history remains, manually scroll up in Teams then click <strong>Resume Manually</strong>.`
    *   `Otherwise, click <strong>Stop and Export</strong> to finish.`
- **Color Consistency**: Maintain the orange/amber color (`#f9a825`) to indicate a status notice rather than a critical error.

## Risks / Trade-offs

- [Risk] → Longer message might make the popup scrollable or cluttered.
- [Mitigation] → Use concise sentences and standard font sizes. The `#disclaimerBox` already consumes space, so we will ensure the overall height is manageable.
