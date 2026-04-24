## 1. Content Script Instrumentation (payload.js)

- [x] 1.1 Implement a pre-scan in `buildTranscript` to count unique authors with avatars and all body images needing conversion.
- [x] 1.2 Modify `replaceImagesWithBase64` to accept a callback or emit progress updates as each image is processed.
- [x] 1.3 Update the avatar fetching loop to emit progress updates.
- [x] 1.4 Ensure the `processing` message payload includes `current`, `total`, and a descriptive `phase` string.

## 2. Popup UI Logic (popup.js)

- [x] 2.1 Update the message listener to handle the `processing` message type.
- [x] 2.2 Implement UI transition: change `rangeText` to "Processing chat data..." and clear the indeterminate state of the progress bar if active.
- [x] 2.3 Update `#progressText` and `#progressBar` width based on the image count in the `processing` message.
- [x] 2.4 Add a small delay or throttle to updates to prevent UI flicker for very fast processing.

## 3. Aesthetic Improvements (popup.html)

- [x] 3.1 Ensure smooth CSS transitions for the progress bar width during the processing phase.

## 4. Verification

- [x] 4.1 Extract a chat with many images and verify the popup shows "Processing 1/X images...".
- [x] 4.2 Verify the progress bar fills correctly during the image download phase.
- [x] 4.3 Verify the transition from "Scanning" to "Processing" is clear and visually stable.
