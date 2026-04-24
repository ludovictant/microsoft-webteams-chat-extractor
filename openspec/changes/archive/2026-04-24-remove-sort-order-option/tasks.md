## 1. UI Simplification (popup.html)

- [x] 1.1 Remove the "Sort order" section and `.sort-group` radio buttons from `popup.html`.

## 2. Logic Cleanup (popup.js)

- [x] 2.1 Refactor the event listener in `popup.js` to hardcode the sort order to `'oldest'`.

## 3. Backend Standardization (background.js)

- [x] 3.1 Update the `FINISH_EXTRACTION` message handler to always sort chronologically and remove the reverse logic.

## 4. Verification

- [x] 4.1 Perform an extraction and verify that the UI looks cleaner without the sort toggle.
- [x] 4.2 Inspect the final ZIP archive to confirm messages are consistently ordered from oldest to newest (most recent last).
