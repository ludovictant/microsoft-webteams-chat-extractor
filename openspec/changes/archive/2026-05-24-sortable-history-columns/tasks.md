## 1. UI Preparation (HTML/CSS)

- [x] 1.1 Update `sidepanel.html` to add sort attributes and styling to the history table headers.
- [x] 1.2 Add CSS for sort indicators (arrows) and hover states for headers in `sidepanel.html`.

## 2. Sorting Logic (JavaScript)

- [x] 2.1 Initialize `currentSortColumn` and `currentSortDirection` variables in `sidepanel.js`.
- [x] 2.2 Refactor `refreshHistoryList` in `sidepanel.js` to use the sorting variables before rendering the table.
- [x] 2.3 Implement the `handleHeaderClick` function in `sidepanel.js` to toggle sort states and trigger re-renders.
- [x] 2.4 Attach event listeners to the table headers.

## 3. Validation

- [x] 3.1 Verify sorting by Conversation name (A-Z and Z-A).
- [x] 3.2 Verify sorting by Qty (numerical).
- [x] 3.3 Verify sorting by Last crawl (chronological).
- [x] 3.4 Ensure the sort indicator accurately reflects the active column and direction.
