## Why

As the number of stored conversations in the local storage history grows, it becomes increasingly difficult for users to find specific chats or identify which ones have the most data or were crawled most recently. Adding sorting capabilities to the history table columns improves the manageability and usability of the archived data.

## What Changes

- **Interactive Table Headers**: Update the history table headers in the side panel to be clickable and visually indicate the current sort direction.
- **Client-Side Sorting Logic**: Implement a sorting mechanism in `sidepanel.js` that re-renders the history list based on the selected column and direction (ascending/descending).
- **Persistent Sort Preference**: (Optional/Nice-to-have) Remember the user's last sort choice during the session.

## Capabilities

### New Capabilities
- `sortable-dashboard-list`: The system SHALL allow users to sort the conversation history table by name, message count, or last crawl date in both ascending and descending order.

### Modified Capabilities
- (None)

## Impact

- `sidepanel.js`: Main logic for sorting the array of conversation objects and updating the UI.
- `sidepanel.html`: Styling for the clickable headers and sort indicators (arrows).
