## 1. Infrastructure and Library Setup

- [x] 1.1 Download and include `jszip.min.js` in the project directory.
- [x] 1.2 Update `manifest.json` to include the `background.js` service worker.
- [x] 1.3 Add `jszip.min.js` to the `web_accessible_resources` if necessary for worker access.

## 2. Content Script Refactor (payload.js)

- [x] 2.1 Refactor `getMessageId` and `getTimestamp` to be standalone helpers for JSON extraction.
- [x] 2.2 Implement a `serializeMessage` function that converts a DOM node to the new JSON-based MDO format.
- [x] 2.3 Modify `scrollAndExtract` to use a batch buffer (10 messages) and send `CHUNK_READY` messages to the Service Worker.
- [x] 2.4 Implement a \"Heartbeat\" mechanism to keep the Service Worker alive during extraction.

## 3. Background Service Worker (background.js)

- [x] 3.1 Implement a message listener for `CHUNK_READY` to accumulate message data.
- [x] 3.2 Implement a `FetchQueue` to download images and avatars in parallel (binary format).
- [x] 3.3 Implement the `AssetNaming` logic to generate sanitized filenames for the ZIP archive.
- [x] 3.4 Integrate `JSZip` to bundle assets and generated files.

## 4. Multi-Format Rendering (background.js)

- [x] 4.1 Implement `renderHTML` to generate the `index.html` file using relative asset paths.
- [x] 4.2 Implement `renderMarkdown` to convert MDO data to `transcript.md`.
- [x] 4.3 Implement `renderCSV` to convert MDO data to `transcript.csv`.
- [x] 4.4 Create a `generateZip` function that combines all outputs.

## 5. Popup Update (popup.js)

- [x] 5.1 Refactor `popup.js` to communicate with the Service Worker for status updates.
- [x] 5.2 Implement the \"Download ZIP\" trigger logic.
- [x] 5.3 Update the progress bar to reflect combined scrolling and processing states from the background script.

## 6. Verification

- [ ] 6.1 Verify extraction of a small chat (10 messages) and inspect ZIP contents.
- [ ] 6.2 Verify extraction of a medium chat (100 messages) with many images.
- [ ] 6.3 Stress-test with a chat of 5,000+ messages and monitor memory usage.
