## Context

Virtualized lists (like those in Teams) render only a small window of elements. A sudden change in scroll position from 100,000 to 0 will cause the list to unmount the bottom elements and mount the top elements, effectively skipping all "middle" elements. Our `MutationObserver` only catches elements that enter the DOM. To capture everyone, we must ensure every message enters the viewport "window" during the scroll.

## Goals / Non-Goals

**Goals:**
- Ensure high data integrity by preventing message skipping during long scrolls.
- Maintain a relatively fast extraction speed.

**Non-Goals:**
- Scrolling slowly for standard user observation (this is a machine crawl).

## Decisions

- **Step-Based Scrolling**: Implement a loop that subtracts a fixed pixel amount (1500px) from `scrollTop`.
- **Reactive Waiting**: Instead of a fixed pause, the loop will wait for a signal that the DOM has updated (via the `MutationObserver`).
- **Safety Timeout**: To prevent the script from getting stuck if Teams doesn't re-render a specific range, a maximum timeout of **2000ms** will be applied to each step.
- **Integration**: The crawl will happen inside the main `while(true)` loop. After each step, `collectAndSend()` will be called to capture newly rendered messages immediately.

## Risks / Trade-offs

- [Risk] → Scrolling too fast might still skip some nodes.
- [Mitigation] → 2000px is roughly 15-20 messages in Teams; the 50ms pause should be sufficient for the DOM to update. We can tune these values if needed.
