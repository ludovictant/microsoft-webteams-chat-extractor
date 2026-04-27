## Why

While the extension currently exports to HTML, Markdown, and CSV, these formats are either for display or simple data manipulation. Developers and power users need a structured, machine-readable JSON format to facilitate deeper analysis, integration with other tools, or custom rendering of chat history.

## What Changes

- Add a `renderJSON()` function to `background.js` to generate a structured JSON file.
- Update `generateZip()` in `background.js` to include `transcript.json` in the final archive.
- Ensure the JSON output includes comprehensive metadata (title, count, version).
- Ensure images are referenced by their local filenames within the `content` field for "Ready-to-Use" consumption.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `multi-format-rendering`: Add requirements for JSON export support.

## Impact

- `background.js`: New rendering logic and update to ZIP generation.
- Exported ZIP: Will now contain 4 data files instead of 3.
