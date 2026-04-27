## Why

Teams uses a virtualized list for chat messages, meaning only a small portion of the chat is rendered in the DOM at any given time. Jumping instantly from the bottom of the list to the top (`scrollTop = 0`) can cause the virtualizer to skip the rendering of "middle" messages, leading to incomplete data extraction. A safe, incremental scroll ("crawling") is required to ensure every message passes through the visible window and is captured by the extraction logic.

## What Changes

- Update `payload.js` to implement an incremental upward scroll instead of a single jump.
- Introduce a "crawl" loop that moves the scroll position in small steps (e.g., 2000px) with short pauses to allow for rendering.
- Ensure the `MutationObserver` and collection logic have sufficient time to process newly rendered nodes during the crawl.
- Maintain the final `Home` key trigger at `scrollTop = 0` to prompt Teams to fetch the next batch from the server.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `pre-extraction-synchronization`: Update requirements to specify incremental scrolling for data integrity in virtualized lists.

## Impact

- `payload.js`: Modification to the main extraction loop in `scrollAndExtract`.
- Performance: Slight increase in traversal time (mitigated by fast crawl steps), but significant increase in data reliability.
