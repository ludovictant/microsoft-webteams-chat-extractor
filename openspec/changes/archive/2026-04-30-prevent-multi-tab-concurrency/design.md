## Context

The current architecture uses a single global `extractionData` object in `background.js`. This makes it naturally prone to issues if multiple tabs try to start an extraction. While the popup now blocks clicks if the status is not `idle`, it doesn't gracefully handle the case where the user opens the popup in a second tab and doesn't know *why* it's blocked or that they are seeing the status of another tab.

## Goals / Non-Goals

**Goals:**
- Explicitly prevent `START_EXTRACTION` in background if already busy.
- Inform the user in the popup if an extraction is running in a different tab.
- Clearly differentiate between "This tab is extracting" and "Another tab is extracting".

## Decisions

- **Background Guard**: In `background.js`, the `START_EXTRACTION` handler will check `extractionData.status`. If it's not `idle`, it will return `{ status: 'error', error: 'ALREADY_RUNNING' }`.
- **Tab Comparison**: In `popup.js`, during `pollStatus`, we will compare the current tab's ID with `data.activeTabId` from the background.
- **UI Nudge**: If `currentTabId !== data.activeTabId` and `status !== 'idle'`, show a specific notice in `statusNudge`: "(!) Notice: An extraction is already active in another tab. You can monitor its progress here, but you cannot start a new one until it finishes."
- **Disable Options**: If another tab is busy, the "Download" buttons in the current tab's popup should be disabled even if the status is technically `idle` (though it shouldn't be if it's shared).

## Risks / Trade-offs

- **Tab ID availability**: `chrome.tabs.query` is needed to get the current tab ID in the popup. This is already used in the click listener.
