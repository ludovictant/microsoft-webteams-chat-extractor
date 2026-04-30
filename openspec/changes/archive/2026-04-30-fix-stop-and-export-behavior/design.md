## Context

A regression was introduced where clicking "Stop and Export" (via the `STOP_EXTRACTION` message) transitions the background state directly to `idle`. This effectively treats it as an "Abort", resetting all collected data and bypassing the download screen.

## Goals / Non-Goals

**Goals:**
- Differentiate between "Abort" (immediate reset, no download) and "Stop and Export" (terminate collection, proceed to download).
- Ensure "Stop and Export" triggers the `FINISH_EXTRACTION` or transitions to `ready`/`processing`.

## Decisions

- **Update `STOP_EXTRACTION` in `background.js`**: Instead of setting `extractionData.status = 'idle'`, it should set it to `ready` or `processing` (if there are assets) after signaling the tab to stop.
- **Payload Finalization**: Ensure that when the payload receives the `stop` signal, it still executes the final `CHUNK_READY` flush and `FINISH_EXTRACTION` signal if it was stopped gracefully by "Stop and Export". *Correction*: Actually, if the user wants to "Stop and Export" *now*, the background should probably just take what it has and move to `ready` to avoid waiting for the payload which might be stuck.

## Risks / Trade-offs

- **Partial Data**: Stopping mid-extraction means some messages might not be collected. This is acceptable as it's the intended behavior of a manual stop.
