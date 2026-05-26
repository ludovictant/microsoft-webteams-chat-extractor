## 1. UI Updates (HTML)

- [x] 1.1 Remove "Download last 7 days" button and its tooltip wrapper in `sidepanel.html`.
- [x] 1.2 Remove "Download last 3 months" button and its tooltip wrapper in `sidepanel.html`.
- [x] 1.3 Change the text "Privacy" to "Stats sharing" in the footer section of `sidepanel.html`.
- [x] 1.4 Update the `localStorageToggle` checkbox to be `checked` by default in `sidepanel.html`.

## 2. Logic Updates (JavaScript)

- [x] 2.1 Update the default value for `localStorageEnabled` to `true` in `sidepanel.js` (initial load).
- [x] 2.2 Update the default state for `localStorageEnabled` in `background.js` (initialization and reset).
- [x] 2.3 Verify that the info icon tooltip for "Stats sharing" accurately reflects the new label.

## 3. Validation

- [x] 3.1 Verify that only "Download recent messages", "Download last 30 days", and "Download all messages" buttons are visible.
- [x] 3.2 Verify that the footer toggle is labeled "Stats sharing".
- [x] 3.3 Verify that "Local storage" is enabled by default on a clean install or after clearing storage.
- [x] 3.4 Ensure that the telemetry sync still works with the renamed toggle.
