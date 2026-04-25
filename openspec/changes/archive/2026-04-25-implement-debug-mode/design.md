## Context

The extension currently has hardcoded attribute filtering and console logging. Developers need a way to enable verbose logging and keep internal metadata (`debug-` attributes) for troubleshooting without rebuilding the extension.

## Goals / Non-Goals

**Goals:**
- Provide a persistent toggle in the UI to enable/disable Debug Mode.
- Enable verbose logging across all extension components when Debug Mode is active.
- Preserve `debug-` attributes in the final HTML export when Debug Mode is active.
- Ensure zero performance impact when Debug Mode is inactive.

**Non-Goals:**
- Creating a remote logging service.
- Debugging third-party library internals (e.g., JSZip).

## Decisions

### 1. State Persistence via `chrome.storage.session`
We will use `chrome.storage.session` to store a boolean `debugMode`.
- **Rationale**: It's simple, persistent, and accessible from popup, background, and (via messaging) payload scripts.
- **Alternatives**: `chrome.storage.sync` (too much overhead for a local flag), or ephemeral state in `background.js` (would lose setting on extension restart).

### 2. Global `log` Utility
We will implement a simple logging wrapper in `background.js` and `payload.js`.
- **Implementation**: 
  ```javascript
  function debugLog(...args) {
    if (currentDebugMode) console.log('[DEBUG]', ...args);
  }
  ```
- **Rationale**: Centralizes the check and makes the code cleaner.

### 3. Propagating State to `payload.js`
When `payload.js` is injected, the initial `extract` message will include the current `debugMode` state.
- **Rationale**: Avoids extra asynchronous calls inside the high-performance extraction loop.

### 4. UI Implementation
Add a toggle switch in `popup.html` inside a new "Settings" section at the bottom.
- **Rationale**: Keeps the primary actions (Time range) prominent while making settings accessible.

## Risks / Trade-offs

- **[Risk]** Debug logs might leak sensitive information if left on.
- **[Mitigation]** Ensure the toggle is visually distinct when ON and defaults to OFF. Explicitly warn in the UI if necessary.
- **[Risk]** `debug-` attributes might break some HTML viewers.
- **[Mitigation]** Standard HTML parsers ignore unknown attributes. Since this is an opt-in developer feature, the risk is acceptable.
