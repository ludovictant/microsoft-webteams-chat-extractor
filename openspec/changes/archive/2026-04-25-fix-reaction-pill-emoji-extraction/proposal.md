## Why

The current implementation of message reaction extraction fails to correctly capture the emoji in the exported HTML. Instead of showing the emoji (e.g., 😆) and the count, it often displays duplicate counts or empty fields. This occurs because the extraction logic in the content script or the rendering logic in the background script does not correctly process the complex DOM structure of Teams reaction pills, which can contain both an image and multiple text elements.

## What Changes

- Update `payload.js` extraction logic to more robustly identify the emoji `alt` text or Unicode character within reaction pills.
- Ensure the extraction process filters out auxiliary text like "3 réactions Rigole" from the actual reaction count.
- Update the HTML rendering logic (likely in `background.js`) to correctly display the emoji and count in the `.reaction-pill` element.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `message-reaction-extraction`: Refine the requirement for accurately identifying and exporting reaction emojis and counts from the Teams DOM.

## Impact

- `payload.js`: Modification to the `serializeMessage` function and reaction extraction loop.
- `background.js`: Possible modification to the `renderHtml` function if the issue lies in how the reaction object is transformed into HTML.
- Exported HTML/Markdown/CSV: Ensuring consistent and correct reaction data.
