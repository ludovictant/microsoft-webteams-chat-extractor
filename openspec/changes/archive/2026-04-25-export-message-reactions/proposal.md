## Why

Microsoft Teams allows users to react to messages with emojis (👍, ❤️, 😂, etc.). Currently, these reactions are not included in the exported chat transcripts, which results in a loss of social context and engagement feedback that is often critical for understanding the flow and sentiment of a conversation. Including reactions makes the export more representative of the actual Teams experience.

## What Changes

- **Reaction Extraction**: Update the content script to detect and extract message reactions from the Teams DOM.
- **Data Model Update**: Include a `reactions` field in the Message Data Object (MDO) sent to the background script.
- **HTML Rendering**: Update the exported HTML template to display reactions below each message body, mimicking the Teams UI.
- **Markdown Export**: Include a summary of reactions in the Markdown version of the transcript.
- **CSV Export**: Add a column for reactions in the CSV export.

## Capabilities

### New Capabilities
- `message-reaction-extraction`: Extracting reaction types and counts from Teams messages.

### Modified Capabilities
- `multi-format-rendering`: Include reactions in HTML, Markdown, and CSV outputs.

## Impact

- `payload.js`: Modify `serializeMessage` to find and extract reaction summaries.
- `background.js`: Update `renderHTML`, `renderMarkdown`, and `renderCSV` to display the extracted reaction data.
