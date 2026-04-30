## Context

The current user interface conflates "Stop" with "Export". While this is the intended workflow for finishing a successful extraction, it prevents users from easily cancelling a process they started by mistake. Furthermore, the UI lacks feedback indicating that a download has been triggered, which can lead to double-clicks.

## Goals / Non-Goals

**Goals:**
- Provide a clean way to abort an extraction without saving data.
- Improve the affordance and state tracking of the download action.
- Maintain visual consistency with existing buttons.

**Non-Goals:**
- Allowing "Abort" to save partial data (this is already handled by "Stop and Export").

## Decisions

- **Two-Button Control Scheme**: During active extraction, the UI will now show two buttons:
    *   **"Stop and Export"**: Terminates current crawling and transitions to the `ready` state (existing logic).
    *   **"Abort Extraction"**: Terminates crawling and transitions immediately to `idle`, clearing the current session.
- **Button Styling**: The "Abort" button will use a secondary style (likely a subtle border and transparent background) to differentiate it from the primary "Stop" action.
- **Download State Management**: In `popup.js`, the callback for `chrome.downloads.download` will be used to update the button's properties.

## Risks / Trade-offs

- [Risk] → Increased UI complexity with more buttons.
- [Mitigation] → We will stack them vertically or place them side-by-side with clear labels and distinct colors to avoid confusion.
