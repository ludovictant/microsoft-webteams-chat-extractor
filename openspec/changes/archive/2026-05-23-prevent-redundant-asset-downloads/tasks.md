## 1. Database Enhancements

- [x] 1.1 Add `getAsset(url)` method to `TeamsExtractorDB` in `background.js`.
- [x] 1.2 Add `isAssetStored(url)` method to `TeamsExtractorDB` in `background.js`.

## 2. Background Messaging Logic

- [x] 2.1 Implement `CHECK_ASSET` message handler in `background.js`.
- [x] 2.2 In `CHECK_ASSET` handler, if asset exists, load it into `extractionData.urlToBlob` and increment `processedAssets`.
- [x] 2.3 Update `CHUNK_READY` to only increment `totalAssets` for assets NOT already in `urlToBlob` (to avoid double counting if `CHECK_ASSET` was already called).

## 3. Content Script Optimization

- [x] 3.1 Refactor `fetchAndSendAsset` in `payload.js` to first send a `CHECK_ASSET` message to background.
- [x] 3.2 Update `fetchAndSendAsset` to skip `fetch` and `ASSET_READY` if background confirms the asset is already stored.

## 4. Verification

- [x] 4.1 Verify that the network tab shows fewer requests for previously extracted assets.
- [x] 4.2 Confirm that "Processing images..." phase starts with non-zero progress if assets were found in storage.
- [x] 4.3 Verify that the final ZIP archive still contains all assets (avatars and images).
