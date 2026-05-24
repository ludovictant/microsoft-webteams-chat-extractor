## Why

Currently, the extension downloads all assets (avatars and images) encountered during an extraction session, even if those assets are already stored in the persistent IndexedDB `assets` store. This results in redundant network traffic, increased resource usage, and slower extractions, especially for users with large local histories.

## What Changes

- **Incremental Asset Check**: Implement a pre-download check against the IndexedDB `assets` store when `Local Storage` is enabled.
- **Background-to-Payload Sync**: Add a mechanism for the background script to inform the content script that an asset is already available, preventing redundant fetches.
- **Session Asset Loading**: Automatically load already-stored assets from IndexedDB into the current session's memory (`urlToBlob`) if they are encountered during a crawl.
- **Progress Optimization**: Ensure that found-in-storage assets correctly increment the "processed" count immediately, providing faster progress feedback.

## Capabilities

### New Capabilities
- `incremental-asset-sync`: Coordination between background and content scripts to avoid redundant network requests for already-stored assets.

### Modified Capabilities
- `local-storage-management`: Update the asset persistence logic to include retrieval and status reporting during the extraction loop.

## Impact

- `payload.js`: Update `fetchAndSendAsset` to check with the background before initiating a network request.
- `background.js`: Add a message handler to check asset existence in IndexedDB and update session state accordingly.
