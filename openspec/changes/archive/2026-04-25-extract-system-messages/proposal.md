## Why

Teams includes "system" or "control" messages in the chat stream (e.g., "User A added User B to the conversation"). Currently, these are either missed or rendered incorrectly as standard messages with no author or avatar, which breaks the visual flow of the export. Users want these messages to be distinct and properly styled in the output.

## What Changes

- Update `payload.js` to identify and extract `fui-ChatControlMessageItem` elements.
- Introduce a `type` property in the message data object (`message` vs `system`).
- Update `background.js` to render `system` messages using a specific icon and simplified, grey, left-aligned text.
- Clean up system message content to remove interactive attributes and structural noise.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `pipeline-extraction`: Add requirements for identifying and extracting control/system messages.
- `cleaner-html-export`: Add requirements for specific rendering of system messages in the HTML output.

## Impact

- `payload.js`: Update `serializeMessage` and the main extraction loop to handle control messages.
- `background.js`: Update `renderHTML` and CSS to handle the new message type.
- Export formats (HTML, MD, CSV): Ensure system messages are correctly represented.
