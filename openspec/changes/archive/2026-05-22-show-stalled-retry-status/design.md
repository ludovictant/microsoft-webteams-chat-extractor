## Context

The extension currently transitions to a "Stalled" state only after 15 consecutive attempts with no new content detected. During these 15 attempts (which can take over a minute), the user sees no change in the UI, which can lead to confusion. This design introduces real-time feedback for each retry attempt.

## Goals / Non-Goals

**Goals:**
- Propagate retry count and wait time from the content script to the side panel.
- Update the side panel UI to show specific "waiting" feedback.
- Maintain existing "Stalled" state behavior once the limit (15) is reached.

**Non-Goals:**
- Changing the actual retry logic or threshold in `payload.js`.
- Modifying the scraping algorithm.

## Decisions

- **Decision: Payload Extension for `PROGRESS` message**
  - **Rationale**: The `PROGRESS` message is already used for periodic updates. Adding `noChangeCount` and `waitTime` here is the most efficient way to sync this data without adding new message types.
  - **Implementation**: `payload.js` will include these fields in the `sendToBackground('PROGRESS', ...)` call.

- **Decision: Persistent State in `background.js`**
  - **Rationale**: `extractionData` in the background script acts as the source of truth for the UI. We will add `noChangeCount` and `waitTime` to this object so the side panel can retrieve them on initialization or via broadcasts.

- **Decision: UI feedback via `statusNudge`**
  - **Rationale**: The `statusNudge` element is already designed for temporary or situational alerts. Using it for retry status keeps the main progress metrics (message count, date depth) clean.
  - **UI String**: "It seems we are at the oldest message. Retrying in [X]ms ([Y]/15 attempt)..."

## Risks / Trade-offs

- **[Risk] Visual Noise** → Mitigation: Only show the message when `noChangeCount > 0`. When it resets to 0, the message will be cleared (or replaced by the "Success" message if it was previously stuck).
- **[Risk] Frequency of UI updates** → Mitigation: Updates follow the existing `PROGRESS` cadence (once per scroll/poll cycle), which is already optimized.
