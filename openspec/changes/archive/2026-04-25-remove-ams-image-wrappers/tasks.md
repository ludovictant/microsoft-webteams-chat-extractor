## 1. Implementation (payload.js)

- [x] 1.1 Implement unwrapping logic for `span[itemtype*="AMSImage"]` in `serializeMessage`.
- [x] 1.2 Update the attribute removal loop to strip `itemtype`, `itemprop`, and `itemscope`.

## 2. Verification

- [x] 2.1 Verify that the `AMSImage` spans are removed from the HTML export.
- [x] 2.2 Confirm that `itemtype`, `itemprop`, and `itemscope` attributes are stripped from all elements.
- [x] 2.3 Confirm that the images inside those spans are preserved and still display correctly.
