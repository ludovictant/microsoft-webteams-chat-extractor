## 1. Core Implementation (payload.js)

- [x] 1.1 Update `serializeMessage` to identify and remove all `canvas` elements.
- [x] 1.2 Implement the parent cleanup logic to remove a `div` if its only meaningful content was the removed `canvas`.

## 2. Verification

- [x] 2.1 Perform an extraction of a chat session containing various message types (text, images).
- [x] 2.2 Verify that the exported `index.html` is free of `canvas` tags.
- [x] 2.3 Ensure that no actual message content (text or body images) was accidentally removed by the new cleaning logic.
