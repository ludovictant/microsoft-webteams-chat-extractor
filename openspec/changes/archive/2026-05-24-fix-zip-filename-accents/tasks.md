## 1. Logic Implementation

- [x] 1.1 Update `sanitizeFileName` in `background.js` to use a Unicode-aware regex that preserves letters, numbers, spaces, dots, dashes, and underscores.
- [x] 1.2 Test the function manually in the console with strings like "Préparation & Facilitation" to ensure correct output.

## 2. Validation

- [x] 2.1 Extract a chat with an accentuated title (or simulate one in the console) and verify the downloaded ZIP filename.
- [x] 2.2 Verify that illegal characters (e.g., `?`, `*`, `/`) are still correctly replaced by underscores.
