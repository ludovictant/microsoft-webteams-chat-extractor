## 1. UI Initialization

- [x] 1.1 Update `sidepanel.js` to set the default value of `localStorageEnabled` to `true` when fetching from `chrome.storage.local`.
- [x] 1.2 Ensure the toggle checkbox in `sidepanel.html` is correctly updated during initialization.

## 2. Background Synchronization

- [x] 2.1 Update `background.js` to initialize the `localStorageEnabled` property in `extractionData` to `true`.
- [x] 2.2 Verify that the `START_EXTRACTION` message handler correctly respects the preference passed from the side panel.

## 3. Verification

- [x] 3.1 Verify that for a fresh install (or cleared storage), the "Local storage" toggle is ON.
- [x] 3.2 Verify that manually turning the toggle OFF and restarting the side panel keeps it OFF.
- [x] 3.3 Verify that an extraction correctly saves data to IndexedDB when the default ON state is active.
