## Context

The "Currently loaded messages" and "Last 24 hours" options are being removed from the `Time range` selection in the extension popup to simplify the UI.

## Goals / Non-Goals

**Goals:**
- Remove the "Currently loaded messages" and "Last 24 hours" buttons from `popup.html`.
- Ensure the extension remains stable after removing these options.

**Non-Goals:**
- Changing any internal extraction logic that might support shorter time frames if triggered by other means (though this is not currently planned).

## Decisions

### 1. UI Modification (`popup.html`)
The buttons with `data-days="-1"` (Currently loaded messages) and `data-days="1"` (Last 24 hours) will be deleted from the `#options` panel.

### 2. Implementation Cleanup
The logic in `popup.js` and `background.js` is already designed to handle a generic `days` parameter. Since the UI no longer allows selecting `-1` or `1`, no further logic changes are strictly necessary, but a quick scan will be performed to ensure no special handling of these values exists.

## Risks / Trade-offs

- **[Trade-off]** Users who strictly wanted only 24 hours of data will now have to extract the last 7 days and manually filter or ignore the extra messages. Given the goal of simplifying the UI, this is an acceptable trade-off.
