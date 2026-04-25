## Context

The extension's logging and progress reporting mechanisms were improved to provide better diagnostic information and a clearer UI. These improvements include a standard `debugLog` function to prevent console noise when debug mode is off, a persistent backend log for monitoring long extractions, and more precise date formatting in the popup.

## Goals / Non-Goals

**Goals:**
- Formally document the unified logging approach.
- Formally document the persistent backend progress log.
- Formally document the enhanced UI date display.

**Non-Goals:**
- Introducing new logging libraries.
- Changing the existing implementation (which already meets these requirements).

## Decisions

- **Consistent Helper**: Use a `debugLog` function in all three main JS files.
- **Specific Backend Format**: Use `YYYYmmDD.HHMMSS` for the persistent log to ensure it's easily sortable and readable.
- **Locale-Aware UI**: Use `toLocaleString` with `year: 'numeric'` for the UI display.

## Risks / Trade-offs

- [Risk] → Hardcoded date formats in logs might not match local preferences.
- [Mitigation] → Keep the backend log format technical and sortable; keep the UI display human-readable via `toLocaleString`.
