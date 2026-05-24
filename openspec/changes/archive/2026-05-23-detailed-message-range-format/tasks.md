## 1. Helper Logic

- [x] 1.1 Update `formatDate` in `sidepanel.js` (or add a new `formatDateTimeShort`) to output `YYYY-MM-DD HH:mm`.

## 2. UI Rendering

- [x] 2.1 Update the `refreshHistoryList` function in `sidepanel.js` to use the updated formatting logic for both the `oldestMessageTimestamp` and `newestMessageTimestamp`.

## 3. Verification

- [x] 3.1 Verify that the dashboard's "Message Range" column displays timestamps in the format `[YYYY-MM-DD HH:mm - YYYY-MM-DD HH:mm]`.
- [x] 3.2 Ensure the column remains readable and does not overflow on a standard sidebar width.
