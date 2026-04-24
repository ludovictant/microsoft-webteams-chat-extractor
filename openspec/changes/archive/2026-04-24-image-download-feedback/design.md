## Context

The extension currently has two main phases:
1. **Collection**: Auto-scrolling and accumulation of message DOM nodes. (Handled in `scrollAndExtract`)
2. **Finalization**: Cleaning nodes, fetching avatars, and converting body images to Base64. (Handled in `buildTranscript`)

The second phase is entirely opaque to the user. If a chat has 500 messages with many images, the "Finalization" phase can take 30-60 seconds during which the popup looks like it's doing nothing or just "loading".

## Goals / Non-Goals

**Goals:**
- Provide a clear transition from "Collecting" to "Processing images".
- Show a progress counter for images (e.g., "Image 10 of 50").
- Reuse the progress bar to show percentage completion of the processing phase.

**Non-Goals:**
- Parallelizing image downloads (already limited by browser/network, adding complexity might lead to rate-limiting).
- Showing individual image previews in the popup.

## Decisions

### 1. New Message Type: `processing`
We will introduce a new message type from `payload.js` to `popup.js`:
```javascript
{
  type: 'processing',
  current: number,
  total: number,
  phase: 'avatars' | 'images'
}
```

### 2. Pre-calculation of Workload
In `buildTranscript`, before starting the heavy `await` loop, we will:
1. Identify all unique authors that need avatars fetched.
2. Count all `<img>` tags in the cloned nodes that require Base64 conversion.
This allows us to set a `total` for the progress feedback.

### 3. Progressive UI Updates
- When `buildTranscript` starts, it sends an initial `processing` message to switch the popup UI mode.
- Inside the loop, every few images (or every image if count is low), it emits an update.
- The `rangeText` in the popup will change from the date range to "Processing chat data...".
- The `progressBar` will be set to 0% at the start of processing and fill as images are completed.

### 4. Handling Indeterminate Scroll vs. Deterministic Processing
- During scrolling, the bar might be indeterminate (if "All history").
- During processing, the bar will **always** be deterministic because we know the total number of images to process before we start the loop.

## Risks / Trade-offs

- **[Risk] Excessive Messaging**: Sending a message for every single small emoji might overwhelm the message channel.
  - **Mitigation**: We will throttle updates or only send them when a percentage threshold is crossed (e.g., every 5%).
- **[Risk] False Completion**: If the total count is miscalculated, the bar might hang at 99%.
  - **Mitigation**: We will ensure the final result message is only sent after the loop completely terminates.
