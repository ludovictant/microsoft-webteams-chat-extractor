## 1. UI Implementation (popup.html)

- [x] 1.1 Remove "Time range" and "Settings" section labels.
- [x] 1.2 Update labels to: "Download last 7 days", "Download last 30 days", "Download last 3 months", and "Download all messages".
- [x] 1.3 Apply green button styling (`#43a047`) to extraction trigger buttons in `.btn-group`.
- [x] 1.4 Move the "Important" disclaimer box to the top of the body (after the header).
- [x] 1.5 Update popup title to "MS Teams Chat Extractor".
- [x] 1.6 Move Debug Mode switch between the disclaimer and the extraction trigger buttons.
- [x] 1.7 Add warning about simultaneous usage in multiple tabs/windows to the disclaimer box.

## 2. Logic Verification (popup.js)

- [x] 2.1 Ensure the `isProcessingRequest` lock still works correctly with the newly styled buttons (since it selects all buttons in `optionsDiv`).

## 3. Verification

- [ ] 3.1 Verify the visual appearance matches the "Start New Extraction" button.
- [ ] 3.2 Verify that the section titles are gone and the layout remains balanced.
