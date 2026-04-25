## 1. HTML Cleaning logic Update (payload.js)

- [x] 1.1 Update the attribute stripping loop in `serializeMessage` to include `aria-haspopup`, `aria-expanded`, and any other remaining interactive attributes.
- [x] 1.2 Implement logic to identify `div` elements that wrap mentions (e.g., those containing a child with `Mention` itemtype) and convert them to `span` elements.
- [x] 1.3 Review and refine the `div` to `span` conversion for block-level `@mention` containers already in the code to ensure it's comprehensive.

## 2. Verification

- [x] 2.1 Verify with the provided DOM sample that mentions like "GISSELERE, BORIS" are rendered on a single line in the HTML export.
- [x] 2.2 Confirm that the exported HTML is free of `aria-haspopup` and other interactive attributes on mention elements.
