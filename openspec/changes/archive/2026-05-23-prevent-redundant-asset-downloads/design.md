## Context

Currently, `payload.js` and `background.js` have no coordination regarding existing assets in IndexedDB. Every asset URL discovered in the DOM triggers a new `fetch` in the content script and a subsequent `ASSET_READY` message with a large Base64 payload.

## Goals / Non-Goals

**Goals:**
- Eliminate redundant network requests for assets already stored in IndexedDB.
- Reduce the amount of Base64 data sent from content script to background for existing assets.
- Accelerate the "Processing" phase by utilizing local copies of assets.

**Non-Goals:**
- Offline-only extraction (the DOM still needs to be crawled online).
- Synchronizing assets across different browsers.

## Decisions

- **Decision: Background-driven Asset Check**
  - **Rationale**: The background script is the owner of the IndexedDB connection. It is more efficient for the background to check existence and manage the session cache (`urlToBlob`).
  - **Implementation**: When `background.js` processes a `CHUNK_READY` message, it will immediately check if the extracted asset URLs (avatars, images) exist in the `assets` object store.

- **Decision: "Skip" Signaling to Payload**
  - **Rationale**: To prevent the payload from starting a redundant `fetch`, the background must quickly respond or the payload must wait.
  - **Alternative**: Payload sends a `CHECK_ASSET` message before each fetch. 
  - **Refined Strategy**: Since `serializeMessage` calls `fetchAndSendAsset` immediately, we will modify `fetchAndSendAsset` to be a two-step process: 
    1. Send a sync-like message to background: `CHECK_ASSET`.
    2. If background returns `stored: true`, skip fetch. Otherwise, proceed with fetch.

- **Decision: Session Cache Pre-population**
  - **Rationale**: If an asset is in DB, the background can load it into `extractionData.urlToBlob` without requiring the payload to send the data.
  - **Implementation**: The `CHECK_ASSET` handler in `background.js` will not only return the status but also trigger a `db.getAsset(url)` call to populate the session map.

## Risks / Trade-offs

- **[Risk] Message latency** → Mitigation: Checking a Primary Key in IndexedDB is extremely fast. The delay in serialization is negligible compared to a network `fetch`.
- **[Risk] Outdated assets** → Mitigation: Teams asset URLs (especially avatars) are usually stable or updated when the asset changes. We will rely on URL identity for now.
- **[Risk] Race condition** → Mitigation: The `extractionData.seenAssetUrls` Set and `urlToBlob` Map will be updated by the background script during the `CHECK_ASSET` call to ensure consistency.
