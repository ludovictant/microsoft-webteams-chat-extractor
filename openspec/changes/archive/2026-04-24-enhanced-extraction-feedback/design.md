## Context

The current feedback mechanism is a single text string `#progressText` in `popup.html`. The content script `payload.js` sends periodic `progress` messages containing only the total count of unique messages collected.

## Goals / Non-Goals

**Goals:**
- Provide real-time feedback on the oldest date reached during extraction.
- Show a progress bar for time-limited extraction requests.
- Maintain the lightweight nature of the extension (no heavy UI frameworks).

**Non-Goals:**
- Predicting total message count (impossible without reading all history first).
- Predicting total time remaining (Teams scrolling speed is variable).

## Decisions

### 1. Enhanced Message Payload
The `progress` message in `payload.js` will be expanded:
```javascript
{
  type: 'progress',
  count: number,
  oldestTS: number | null // Unix epoch in ms
}
```
`currentOldest` will be calculated in each loop iteration using the existing `getOldestTimestamp` helper.

### 2. Progress Calculation (Popup side)
The popup knows the requested `days` value.
- If `days > 0`:
  - `targetTS = now - (days * 24 * 60 * 60 * 1000)`
  - `progress = (now - currentOldest) / (now - targetTS)`
  - Clamp progress between 0 and 1.
- If `days === 0` (All history):
  - No percentage-based progress bar (indeterminate mode).

### 3. UI Components in `popup.html`
- **Date Depth Display**: A new `<p id="dateDepth">` will show "Reached: [Formatted Date]".
- **Progress Bar Container**: A `<div id="progressBarContainer">` with a `<div id="progressBar">` inside.
- **Indeterminate Animation**: For "All history", the progress bar will pulse or show a "scanning" animation.

### 4. Timestamp Formatting
Use `Intl.DateTimeFormat` or `toLocaleDateString()` in `popup.js` to ensure the date depth is localized.

## Risks / Trade-offs

- **[Risk] Virtualized Messages**: If Teams virtualizes messages such that the oldest one found is not actually the oldest currently loaded, the progress might "jump".
  - **Mitigation**: Our `allMessagesMap` already accumulates all unique messages, so `getOldestTimestamp(Array.from(allMessagesMap.values()))` always gives the absolute oldest message we have ever seen in this session.
- **[Risk] Clock Skew**: User's local time vs Teams server time.
  - **Mitigation**: Since we use `new Date()` as "now" and Teams timestamps are parsed into local `Date` objects, they share the same reference frame.
