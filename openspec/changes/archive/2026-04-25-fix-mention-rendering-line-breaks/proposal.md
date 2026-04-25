## Why

Currently, user mentions in the exported HTML are wrapped in `div` elements with irrelevant attributes like `aria-haspopup`. Since `div` elements are block-level by default, this causes unexpected line breaks in the middle of names or sentences, making the exported chat difficult to read.

## What Changes

- Update `payload.js` to convert mention `div` elements into inline elements (like `span`) or simplify their structure.
- Remove irrelevant interactive attributes (e.g., `aria-haspopup`, `tabindex`, `role`) from mention elements during the HTML cleaning phase.
- Ensure mentions are rendered inline with the surrounding text.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `cleaner-html-export`: Refine requirements to ensure mentions are rendered as inline elements and stripped of irrelevant interactive attributes.

## Impact

- `payload.js`: Modification to the HTML cleaning logic in `serializeMessage`.
- Exported HTML: Mentions will appear correctly inline without broken formatting.
