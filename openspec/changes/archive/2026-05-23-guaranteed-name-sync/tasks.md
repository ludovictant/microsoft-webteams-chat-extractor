## 1. Background Logic Refinement

- [x] 1.1 Locate the `START_EXTRACTION` handler in `background.js`.
- [x] 1.2 Add a call to `db.upsertConversation({ teamsId: extractionData.teamsId, name: extractionData.title })` inside the `START_EXTRACTION` handler.
- [x] 1.3 Ensure the upsert only happens if `extractionData.localStorageEnabled` is true.

## 2. Verification

- [x] 2.1 Manually rename a conversation to "Unknown" in IndexedDB (using the test script provided earlier).
- [x] 2.2 Trigger a "Download recent messages" extraction.
- [x] 2.3 Verify that the conversation name is updated in the dashboard immediately after clicking the button, even if 0 messages are found.
