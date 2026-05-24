## Why

The current implementation caches conversation statistics (message count, oldest timestamp, newest timestamp) in the `conversations` store. This creates a risk of data desynchronization and requires manual management of cached values during extraction. Calculating these values in real-time from the `messages` store ensures perfect data integrity and simplifies the extraction logic.

## What Changes

- **IndexedDB Schema**: Add a compound index `[conversationId, timestamp]` to the `messages` store to enable efficient aggregation.
- **Data Persistence**: Remove redundant `messageCount`, `oldestMessageTimestamp`, and `newestMessageTimestamp` from the `upsertConversation` logic in `background.js`.
- **Dashboard Logic**: Refactor the side panel dashboard to fetch conversation statistics dynamically using the new compound index.
- **Cleanup**: Remove legacy cached fields from existing IndexedDB entries.

## Capabilities

### New Capabilities
- `message-aggregation`: Real-time calculation of conversation statistics (count, min/max timestamps) using high-performance database indices.

### Modified Capabilities
- `local-storage-management`: Update the database schema to include compound indices and simplify the conversation persistence model.
- `ui-simplification`: Adjust the dashboard data fetching mechanism to use real-time aggregation.

## Impact

- `background.js`: Update `TeamsExtractorDB` class (schema and `upsertConversation` method).
- `sidepanel.js`: Update `refreshHistoryList` to perform aggregate queries for each conversation.
- `IndexedDB`: `TeamsExtractorDB` version increment and upgrade logic.
