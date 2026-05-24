## Why

The current "auto-download" behavior triggers a ZIP generation and download immediately when an extraction completes. While efficient, this can be unexpected for users, especially in a persistent Side Panel context where the panel might be opened while a previous extraction is already "Ready". Additionally, allowing multiple clicks on the download button can trigger redundant, resource-intensive ZIP generations.

## What Changes

- **Manual Trigger**: Remove the automatic `downloadZip()` call when state transitions to `ready`.
- **Button Locking**: Permanently disable the "Download Archive" button after a successful click within the same session.
- **Visual Feedback**: Update the button text to "Downloaded!" once the process is initiated.
- **Session Reset**: Ensure the button is re-enabled only when the user explicitly starts a new extraction.

## Capabilities

### New Capabilities
- `manual-download-control`: Logic to handle explicit user-triggered downloads and button state locking.

### Modified Capabilities
- `automated-download`: **REMOVED** - Replaced by manual triggers.
- `extraction-lifecycle-management`: Updated to handle UI reset for the download button when returning to idle.

## Impact

- **`sidepanel.js`**: Removal of auto-trigger logic in `updateUI`, update to `downloadZip` callback, and addition of reset logic in the "Start New" handler.
- **User Experience**: Users gain more control over when the download starts and receive clearer feedback on completion.
