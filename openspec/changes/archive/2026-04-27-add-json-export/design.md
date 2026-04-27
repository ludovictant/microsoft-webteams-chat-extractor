## Context

The extension collects high-quality message data objects (MDO) but currently flattens them for HTML, Markdown, and CSV exports. A JSON export preserves the original structure, making it the most accurate representation of the extracted data.

## Goals / Non-Goals

**Goals:**
- Provide a 1:1 structured representation of the extracted chat.
- Ensure all special characters are correctly escaped via standard `JSON.stringify`.
- Provide resolved image paths for immediate consumption.

**Non-Goals:**
- Including binary image data (base64) inside the JSON (kept in `images/` folder).

## Decisions

- **Metadata Header**: The JSON will have a root object containing `title`, `metadata` (version, date), and a `messages` array.
- **Image Path Resolution**: Similar to the `renderHTML` logic, `renderJSON` will iterate through the images array for each message and perform a `.split().join()` replacement on the content string to swap placeholders for real filenames.
- **Author Sanitization**: Standard `JSON.stringify` will be used to ensure quotes in author names or content are perfectly handled without manual regex.

## Risks / Trade-offs

- [Risk] → Large chat histories resulting in massive JSON files.
- [Mitigation] → JSON is generally more compact than the rich HTML version, so this is a minor risk compared to existing formats.
