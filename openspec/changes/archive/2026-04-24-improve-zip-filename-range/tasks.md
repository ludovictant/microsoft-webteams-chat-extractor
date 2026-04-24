## 1. Implementation (background.js)

- [x] 1.1 Update `formatFileTS(ts)` to handle the Unix Epoch fallback (if `ts` is 0 or invalid).
- [x] 1.2 Modify the `DOWNLOAD_ZIP` case to calculate `startTS` and `endTS` from `extractionData.messages`.
- [x] 1.3 Construct the final filename using the sanitized title and the formatted date range.

## 2. Verification

- [x] 2.1 Perform an extraction and verify the downloaded ZIP filename includes the correct start and end datetimes.
- [x] 2.2 Verify the fallback behavior by forcing an unknown date scenario (if possible).
- [x] 2.3 Ensure the `YYYYmmDD.HHMMSS` format is exactly as specified.
