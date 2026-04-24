## Context

The current extension provides a "Sort order" selection in the popup, allowing users to choose between "Oldest first" and "Newest first". Most users prefer chronological order, and removing this choice simplifies the UI and the extraction logic.

## Goals / Non-Goals

**Goals:**
- Remove the "Sort order" radio buttons from `popup.html`.
- Standardize the extraction pipeline to always use chronological (Oldest First) sorting.
- Clean up obsolete sorting logic in `popup.js` and `background.js`.

**Non-Goals:**
- Supporting both sort orders in a hidden setting.
- Changing the primary extraction mechanism.

## Decisions

### 1. UI Modification (`popup.html`)
The entire `.sort-group` div and its label "Sort order" will be deleted.

### 2. Logic Update (`popup.js`)
When an extraction is triggered, the `sort` parameter will be hardcoded to `'oldest'` instead of being queried from the DOM.

### 3. Backend Refactor (`background.js`)
The `FINISH_EXTRACTION` handler will be updated to:
- Always sort messages by timestamp: `extractionData.messages.sort((a, b) => a.timestamp - b.timestamp);`.
- Remove the `if (message.sort === 'newest') extractionData.messages.reverse();` block.

## Risks / Trade-offs

- **[Trade-off]** Users who preferred "Newest first" (reverse chronological) will no longer have that option. However, most modern tools provide data in a way that can be easily sorted by the user in the final destination (Excel/Markdown editor).
- **[Mitigation]** The CSV export remains available, allowing users to perform their own sorting if necessary.
