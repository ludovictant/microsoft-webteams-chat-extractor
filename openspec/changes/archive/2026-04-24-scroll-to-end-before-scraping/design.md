## Context

The extractor relies on scrolling up to load historical messages. If the view is already partially scrolled up, the most recent messages (those at the bottom) might be missed by the initial DOM scan.

## Goals / Non-Goals

**Goals:**
- Guarantee that every extraction session starts from the absolute bottom of the chat.
- Ensure all recent messages are captured before the backward scrolling begins.

**Non-Goals:**
- Changing the scrolling speed or logic of the historical extraction.

## Decisions

### 1. Initial Scroll Routine
In `payload.js`, before the `while(true)` scroll-up loop in `scrollAndExtract`, we will add an explicit scroll-to-bottom operation.

```javascript
// Implementation snippet
scrollContainer.scrollTop = scrollContainer.scrollHeight;
await sleep(1000); // Allow time for recent messages to load/render
```

### 2. Synchronization
We will trigger a `collectAndSend` call immediately after this initial scroll to ensure the "Current State" at the bottom is captured as the starting point of the `processedIds` Set.

## Risks / Trade-offs

- **[Risk]** Large chats might take slightly longer to start extracting.
- **[Mitigation]** The 1000ms delay is a safe buffer that has minimal impact on total extraction time compared to the scroll-up phase.
