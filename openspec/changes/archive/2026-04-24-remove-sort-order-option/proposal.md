## Why

The "Sort order" option in the popup adds unnecessary complexity to the user interface. By default, Microsoft Teams and most chat applications display messages in chronological order (oldest to newest). Standardizing the export to always use chronological order (where the most recent message is at the end) simplifies the user experience and ensures consistency across all exported transcripts.

## What Changes

- **UI Simplified**: The "Sort order" radio button group will be removed from the extension popup.
- **Fixed Sorting**: The extraction process will always produce messages in chronological order (Oldest First), ensuring the most recent message is at the bottom of the export.
- **Code Cleanup**: Logic in `popup.js` and `background.js` that handled the "newest first" sorting will be removed or set to a permanent default.

## Capabilities

### Modified Capabilities
- `multi-format-rendering`: Standardize all output formats (HTML, Markdown, CSV) to use chronological sorting exclusively.
- `background-coordinator`: Remove conditional reversing logic in the `FINISH_EXTRACTION` handler.

## Impact

- `popup.html`: Remove the sort order radio buttons.
- `popup.js`: Stop reading the sort preference from the DOM and always send 'oldest' to the content script.
- `background.js`: Remove the logic that reverses the message array based on a 'newest' sort parameter.
- `payload.js`: (Check if the sort parameter is used there, though it seems background handles the final sorting).
