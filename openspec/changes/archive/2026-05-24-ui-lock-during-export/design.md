## Context

The MS Teams Chat Extractor side panel has multiple entry points for data manipulation (starting extractions, clearing storage, triggering exports). During a historical ZIP export, which involves heavy database querying and compression, allowing other actions can lead to race conditions or a degraded user experience.

## Goals / Non-Goals

**Goals:**
- Centralize the UI locking logic to ensure consistency.
- Disable all primary and secondary actions during historical export.
- Provide clear visual cues that the UI is temporarily non-interactive.

**Non-Goals:**
- Locking the UI during *live* extraction (that state is already managed by the `extracting`/`processing` status loop).
- Implementing a progress bar for the ZIP generation (we will stick to the micro-spinner for now).

## Decisions

### 1. Centralized State: `isExportingArchive`
- **Decision**: Continue using the `isExportingArchive` boolean variable in `sidepanel.js` but expand its influence.
- **Rationale**: It's already tied to the export trigger; we just need to broadcast its effect.

### 2. Helper Function: `updateGlobalUILock()`
- **Decision**: Create a dedicated function in `sidepanel.js` to refresh the state of all sensitive elements.
- **Implementation**:
  - Select all trigger buttons, settings switches, footer links, and the clear storage button.
  - Apply the `disabled` property where applicable.
  - Add/remove a `ui-locked` CSS class to handle non-button elements (like links and table headers).

### 3. CSS for Locked Elements
- **Decision**: Add a few utility rules to `sidepanel.html`.
- **Target**: `.ui-locked`, `a.ui-locked`, `th.sortable.ui-locked`.
- **Styles**: `opacity: 0.5`, `pointer-events: none`, `cursor: not-allowed`.

## Risks / Trade-offs

- **[Risk] UI staying locked if sync fails** → **Mitigation**: The `DOWNLOAD_ZIP` callback in `sidepanel.js` already resets `isExportingArchive` to `false` in both success and error cases. We will ensure this reset is robust.
- **[Risk] Selector maintenance** → **Mitigation**: Use broad selectors (like `.btn-group button`) where possible to avoid individual ID mapping.
