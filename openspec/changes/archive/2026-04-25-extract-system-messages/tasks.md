## 1. Extraction Logic Update (payload.js)

- [x] 1.1 Update the main collection loop in `scrollAndExtract` to include `fui-ChatControlMessageItem` elements.
- [x] 1.2 Update `serializeMessage` to detect if a node is a control message and set `type: 'system'`.
- [x] 1.3 Implement text extraction for system messages, ensuring it captures the descriptive text (e.g., "User added User").

## 2. Rendering Logic Update (background.js)

- [x] 2.1 Add CSS for `.system-message` in `renderHTML` (grey text, left-aligned, specific spacing).
- [x] 2.2 Update `renderHTML` to check `msg.type` and render the system message layout with the provided SVG icon.
- [x] 2.3 Ensure Markdown and CSV exports also include system messages in a readable format.

## 3. Verification

- [x] 3.1 Verify that "User added" notifications are correctly extracted and displayed with the icon and grey text.
- [x] 3.2 Confirm that standard messages are unaffected.
