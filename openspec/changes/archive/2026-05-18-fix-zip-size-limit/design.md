## Context

The extension currently generates a ZIP file in the Service Worker (`background.js`) but passes the entire binary (as a Base64 string) back to the `popup.js` via `chrome.runtime.sendMessage`. Chrome's messaging system has a 64MB limit. When an extraction results in a ZIP larger than 64MB, the message is dropped, and the download fails.

## Goals / Non-Goals

**Goals:**
- Enable downloading of ZIP archives larger than 64 MiB.
- Maintain the "Downloaded!" toast notification in the popup UI.
- Ensure the background script correctly calculates the filename and initiates the download.

**Non-Goals:**
- Changing the library used for ZIP generation (JSZip).
- Implementing a multi-part messaging system (unnecessary complexity).

## Decisions

### 1. Execute `chrome.downloads.download` in the Background
- **Decision**: Move the actual download initiation into the `background.js` message handler.
- **Rationale**: The background Service Worker has access to the `chrome.downloads` API and already holds the ZIP blob/base64 in its local scope. By triggering the download here, the data never needs to cross the 64MB messaging boundary.
- **Alternatives**: Using `chrome.storage.local` to pass the data (too slow and has its own limits).

### 2. Status Polling/Notification
- **Decision**: The popup will continue to trigger the "DOWNLOAD_ZIP" action but will receive a simple success/failure response instead of the file data.
- **Rationale**: Keeps the popup informed so it can show the "Downloaded!" toast and re-enable the UI buttons.

## Risks / Trade-offs

- **[Risk]** Base64 conversion in background worker might still hit memory limits for extremely large ZIPs (e.g., 500MB+). → **Mitigation**: Data URIs in `chrome.downloads.download` are generally more robust than messaging, but we should eventually consider `chrome.fileSystem` if users hit even higher limits. For now, 64MB is the primary pain point.
- **[Risk]** Service Worker might terminate during long ZIP generation. → **Mitigation**: The Service Worker is kept alive by the active message port from the popup during the generation phase.
