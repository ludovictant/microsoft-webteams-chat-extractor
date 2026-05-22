## Context

The transition to a Side Panel necessitates a more intentional interaction model. The transient nature of the previous popup justified auto-downloads to ensure users didn't lose data if the popup closed. With the persistent Side Panel, we can afford—and prefer—a manual trigger that prevents accidental downloads and redundant processing.

## Goals / Non-Goals

**Goals:**
- Shift from automatic to user-initiated ZIP downloads.
- Prevent multiple concurrent or redundant ZIP generations via button locking.
- Clear visual confirmation ("Downloaded!") upon success.
- Clean UI reset when starting a new session.

**Non-Goals:**
- Changing the background ZIP generation logic.
- Modifying the `chrome.downloads` API integration.

## Decisions

- **Decision: Removal of `autoDownloadTriggered` Logic**
  - **Rationale**: The state variable was used to prevent auto-download loops. By moving to a manual trigger, the core logic moves from the `updateUI` observer to the button's `click` event listener.
  
- **Decision: Persistent "Disabled" State on Success**
  - **Rationale**: To enforce the "strictly permanently disabled" requirement, the button will not be re-enabled in the `downloadZip` callback unless an error occurs. 
  
- **Decision: UI-Only Lock**
  - **Rationale**: The lock will be managed in the `sidepanel.js` DOM state. If the panel is closed and reopened, the state will be fetched from the background; we will need to ensure the background state or the panel's initialization logic respects the "already downloaded" status if we want it to persist across panel toggles.

## Risks / Trade-offs

- **[Risk] User misses the download** → Mitigation: The UI clearly transitions to the "Ready" screen with a prominent download button.
- **[Risk] Accidental panel close during generation** → Mitigation: ZIP generation happens in the background service worker, so closing the UI doesn't stop the process.
