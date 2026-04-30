## 1. UI Logic (popup.js)

- [x] 1.1 Add `isProcessingRequest` state variable.
- [x] 1.2 Implement logic in `optionsDiv` listener to block requests if `isProcessingRequest` is true or if background status is not `idle`.
- [x] 1.3 Add non-debug console log for blocked concurrent requests.
- [x] 1.4 Implement logic to disable all buttons in `optionsDiv` immediately after a valid click.
- [x] 1.5 Ensure `updateUI` correctly resets `isProcessingRequest` and re-enables buttons when transitioning out of `idle`.

## 2. Verification

- [ ] 2.1 Verify that double-clicking a time range button only starts one extraction.
- [ ] 2.2 Verify that "[CONCURRENCY] ..." log appears in the console on double-click.
- [ ] 2.3 Verify that buttons are disabled during the injection/start phase.
