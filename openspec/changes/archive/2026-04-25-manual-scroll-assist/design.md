## Context

The Teams web application employs a sophisticated virtualized list and server-side paging system for chat messages. Programmatic interactions like `scrollTop = 0` and `Home` key events occasionally fail to trigger the loading of the next page of historical data, particularly during long-running extractions. This causes the extraction script to loop without finding new data, eventually reaching its retry limit and stopping.

## Goals / Non-Goals

**Goals:**
- Eliminate premature extraction abortion due to slow Teams loading.
- Provide a clear UI state for "stuck" extractions.
- Enable manual user intervention to resume stalled processes.

**Non-Goals:**
- Fully automating the resolution of Teams loading stalls (handled by user intervention).
- Changing how Teams loads data.

## Decisions

- **State Propagation**: Introduce a `STATUS_UPDATE` message type sent from `payload.js` to `background.js` to dynamically update the extraction status.
- **Dynamic Status**: Add `stuck` as a valid status in the background script's `extractionData` object.
- **Adaptive Polling**: When stuck, `payload.js` will increase its check interval to 5000ms to be less resource-intensive while waiting indefinitely for the user.
- **Automatic Recovery**: The script will remain in its main loop. As soon as `currentOldest` changes (which happens automatically if the user scrolls and Teams renders new messages), the script resets its retry counters and sends a status update to return to `extracting`.

## Risks / Trade-offs

- [Risk] → User forgets about the extraction while it is stuck.
- [Mitigation] → The popup UI message will be styled prominently (using standard Teams error/warning colors) to catch the user's attention when they check progress.
- [Trade-off] → Indefinite waiting might consume minor background resources. This is acceptable as the user can always stop the process via the popup.
