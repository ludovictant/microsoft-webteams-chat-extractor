## 1. Database Schema Update

- [x] 1.1 Increment `TeamsExtractorDB` version to `2` in `background.js`.
- [x] 1.2 Update `onupgradeneeded` in `background.js` to create the compound index `conv_ts_index` on `['conversationId', 'timestamp']` for the `messages` store.
- [x] 1.3 Implement a `getConversationStats(teamsId)` method in `TeamsExtractorDB` that uses the compound index and `count()` to return aggregate data.

## 2. Background Logic Refactoring

- [x] 2.1 Modify `upsertConversation` in `background.js` to remove caching of `messageCount`, `oldestMessageTimestamp`, and `newestMessageTimestamp`.
- [x] 2.2 Update the `CHUNK_READY` listener to invoke the simplified `upsertConversation` (only updating name and `lastCrawlTimestamp`).

## 3. Side Panel UI Update

- [x] 3.1 Update the `GET_LOCAL_CONVERSATIONS` message handler in `background.js` to include (or allow fetching) real-time stats for each conversation.
- [x] 3.2 Refactor `refreshHistoryList` in `sidepanel.js` to populate the "Qty" and "Message Range" columns by querying the background script for real-time aggregation data.
- [x] 3.3 Ensure the history table remains sorted by `lastCrawlTimestamp` correctly.

## 4. Verification & Cleanup

- [x] 4.1 Verify that the database upgrade completes successfully and the new index is visible in DevTools.
- [x] 4.2 Confirm that crawling a new chat correctly updates the dashboard statistics without redundant field storage.
- [x] 4.3 Verify that the "Qty" and "Range" columns display accurate data directly from the `messages` store.
