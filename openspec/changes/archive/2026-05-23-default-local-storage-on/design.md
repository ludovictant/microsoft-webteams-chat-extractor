## Context

The "Local storage" feature uses `chrome.storage.local` to persist the user's preference. Currently, the code defaults to `false` if no value is found in storage.

## Goals / Non-Goals

**Goals:**
- Change the default value of the local storage toggle to `true`.
- Ensure existing users who have already explicitly set their preference (to `true` or `false`) are not affected.

**Non-Goals:**
- Forcing local storage on for all users regardless of their current settings.

## Decisions

- **Decision: Use `chrome.storage.local.get` with default**
  - **Rationale**: When fetching the preference, providing a default value in the `get` call is the standard way to handle first-time users.
  - **Implementation**: `chrome.storage.local.get({ localStorageEnabled: true }, ...)`

- **Decision: Align `background.js` initialization**
  - **Rationale**: The background script's `extractionData` should also reflect this default to ensure consistency if an extraction starts before the side panel preference is synced.

## Risks / Trade-offs

- **[Risk] Storage consumption** → Mitigation: IndexedDB has high limits, and users can still turn it off if they encounter issues.
- **[Risk] Unexpected data saving** → Mitigation: This is the intended behavior of the change; the "i" info icon clearly explains what Local Storage does.
