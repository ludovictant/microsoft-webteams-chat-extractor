## 1. UI Implementation (popup.html)

- [x] 1.1 Add a `#disclaimerBox` element inside the `#status` div.
- [x] 1.2 Add CSS for the disclaimer (border, padding, background, font-size).

## 2. Logic Update (popup.js)

- [x] 2.1 Update `updateUI` to ensure the `#disclaimerBox` is shown during `extracting`, `stuck`, and `processing`.
- [x] 2.2 Ensure the disclaimer is hidden in the `idle` or `ready` states.

## 3. Verification

- [x] 3.1 Start an extraction and verify that the disclaimer text is clearly visible and correctly styled.
- [x] 3.2 Verify that the disclaimer disappears when the extraction is complete or reset.
