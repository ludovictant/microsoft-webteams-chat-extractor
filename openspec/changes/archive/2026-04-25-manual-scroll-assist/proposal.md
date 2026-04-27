## Why

When extracting very long chat histories (several years), Teams' programmatic scrolling can sometimes become "stuck" due to server-side throttling or slow content loading. Currently, the script eventually times out and aborts, leading to incomplete extractions. This change introduces a manual intervention mechanism to allow the user to "nudge" Teams by scrolling manually, with the script automatically resuming once new content appears.

## What Changes

- Update the extraction loop to enter a "stuck" state instead of aborting when no new messages are found.
- Update the background script to manage and propagate the new `stuck` status.
- Update the popup UI to display a clear instruction to the user when the extraction is stuck.
- Implement automatic resumption logic that detects when new messages have been loaded by the user.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `extraction-lifecycle-management`: Update requirements to handle the transition between automated scrolling and manual intervention.

## Impact

- `payload.js`: Core extraction logic will be more resilient and interactive.
- `background.js`: State management will include the `stuck` status.
- `popup.js`: UI will provide actionable feedback during stall events.
